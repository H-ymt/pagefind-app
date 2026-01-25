import { sql, and, gte } from 'drizzle-orm';
import { getDb } from '@/db';
import { keywordCounts, keywordSearchLogs } from '@/db/schema';
import { checkContentLocal, checkContent } from './moderation';

// 設定
const MIN_COUNT_THRESHOLD = 5; // 最低検索回数
const DAYS_THRESHOLD = 7; // 直近N日以内

export async function logKeyword(
  d1: D1Database,
  keyword: string,
  sessionId: string,
  openaiApiKey?: string
) {
  const db = getDb(d1);
  const normalized = keyword.trim().toLowerCase();

  if (!normalized || normalized.length > 100) {
    return { success: false, error: 'Invalid keyword' };
  }

  if (!sessionId) {
    return { success: false, error: 'Session ID required' };
  }

  // モデレーションチェック（多層防御）
  const localResult = checkContentLocal(normalized);
  if (!localResult.allowed) {
    console.log(`[Keywords] Blocked by leo-profanity: "${normalized}"`);
    return { success: false, error: 'Content not allowed' };
  }

  if (openaiApiKey) {
    const moderationResult = await checkContent(normalized, openaiApiKey);
    if (!moderationResult.allowed) {
      console.log(
        `[Keywords] Blocked by OpenAI: "${normalized}" - ${moderationResult.categories?.join(', ')}`
      );
      return { success: false, error: 'Content not allowed' };
    }
  }

  // セッション単位で重複チェック（同一セッションからの連続検索は1回としてカウント）
  try {
    await db
      .insert(keywordSearchLogs)
      .values({
        keyword: normalized,
        sessionId,
        searchedAt: new Date(),
      })
      .onConflictDoNothing();

    // 挿入成功 = 新規検索 → カウントアップ
    await db
      .insert(keywordCounts)
      .values({
        keyword: normalized,
        count: 1,
        lastSearchedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: keywordCounts.keyword,
        set: {
          count: sql`${keywordCounts.count} + 1`,
          lastSearchedAt: new Date(),
        },
      });
  } catch {
    // 重複（同一セッションで既に検索済み）→ カウントアップしない
    // lastSearchedAtのみ更新
    await db
      .insert(keywordCounts)
      .values({
        keyword: normalized,
        count: 0,
        lastSearchedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: keywordCounts.keyword,
        set: {
          lastSearchedAt: new Date(),
        },
      });
  }

  return { success: true };
}

export async function getPopularKeywords(d1: D1Database, limit: number = 10) {
  const db = getDb(d1);
  const safeLimit = Math.min(Math.max(1, limit), 50);

  // N日前のタイムスタンプ
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - DAYS_THRESHOLD);

  const results = await db
    .select({
      keyword: keywordCounts.keyword,
      count: keywordCounts.count,
      lastSearchedAt: keywordCounts.lastSearchedAt,
    })
    .from(keywordCounts)
    .where(
      and(
        gte(keywordCounts.count, MIN_COUNT_THRESHOLD),
        gte(keywordCounts.lastSearchedAt, thresholdDate)
      )
    )
    .orderBy(sql`${keywordCounts.count} DESC`)
    .limit(safeLimit);

  return results.map((r) => ({
    keyword: r.keyword,
    count: r.count,
  }));
}

/**
 * 古い検索ログをクリーンアップ（定期実行用）
 */
export async function cleanupOldLogs(d1: D1Database, daysToKeep: number = 30) {
  const db = getDb(d1);
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysToKeep);

  await db.delete(keywordSearchLogs).where(
    sql`${keywordSearchLogs.searchedAt} < ${thresholdDate.getTime()}`
  );
}

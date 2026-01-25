import { sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { rateLimits } from '@/db/schema';

// レート制限設定
const RATE_LIMITS = {
  ip: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1分
  },
  session: {
    maxRequests: 100,
    windowMs: 24 * 60 * 60 * 1000, // 1日
  },
  global: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1分
  },
} as const;

type RateLimitType = keyof typeof RATE_LIMITS;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limitType?: RateLimitType;
}

/**
 * 単一のレート制限をチェック・更新
 */
async function checkSingleLimit(
  db: ReturnType<typeof getDb>,
  key: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[type];
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  // 現在のカウントを取得
  const existing = await db
    .select()
    .from(rateLimits)
    .where(sql`${rateLimits.key} = ${key}`)
    .limit(1);

  const record = existing[0];

  // ウィンドウが古い場合はリセット
  if (!record || record.windowStart < windowStart) {
    await db
      .insert(rateLimits)
      .values({
        key,
        count: 1,
        windowStart: now,
      })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          count: 1,
          windowStart: now,
        },
      });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(now.getTime() + config.windowMs),
    };
  }

  // 制限超過チェック
  if (record.count >= config.maxRequests) {
    const resetAt = new Date(record.windowStart.getTime() + config.windowMs);
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      limitType: type,
    };
  }

  // カウントアップ
  await db
    .update(rateLimits)
    .set({ count: sql`${rateLimits.count} + 1` })
    .where(sql`${rateLimits.key} = ${key}`);

  return {
    allowed: true,
    remaining: config.maxRequests - record.count - 1,
    resetAt: new Date(record.windowStart.getTime() + config.windowMs),
  };
}

/**
 * 複合レート制限チェック（IP + セッション + グローバル）
 */
export async function checkRateLimit(
  d1: D1Database,
  ip: string,
  sessionId: string
): Promise<RateLimitResult> {
  const db = getDb(d1);

  // グローバル制限
  const globalResult = await checkSingleLimit(db, 'global', 'global');
  if (!globalResult.allowed) {
    return { ...globalResult, limitType: 'global' };
  }

  // IP制限
  const ipResult = await checkSingleLimit(db, `ip:${ip}`, 'ip');
  if (!ipResult.allowed) {
    return { ...ipResult, limitType: 'ip' };
  }

  // セッション制限
  const sessionResult = await checkSingleLimit(
    db,
    `session:${sessionId}`,
    'session'
  );
  if (!sessionResult.allowed) {
    return { ...sessionResult, limitType: 'session' };
  }

  // 最も厳しい残り回数を返す
  const minRemaining = Math.min(
    globalResult.remaining,
    ipResult.remaining,
    sessionResult.remaining
  );

  return {
    allowed: true,
    remaining: minRemaining,
    resetAt: ipResult.resetAt, // IP制限のリセット時刻を返す
  };
}

/**
 * 古いレート制限レコードをクリーンアップ
 */
export async function cleanupRateLimits(d1: D1Database) {
  const db = getDb(d1);
  const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1日前

  await db
    .delete(rateLimits)
    .where(sql`${rateLimits.windowStart} < ${threshold.getTime()}`);
}

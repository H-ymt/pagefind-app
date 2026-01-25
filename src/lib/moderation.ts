/**
 * 多層防御によるコンテンツフィルタリング
 * 1. leo-profanity（ローカル・高速）
 * 2. OpenAI Moderation API（文脈理解）
 */

import leoProfanity from "leo-profanity";
import naughtyWords from "naughty-words";

// naughty-wordsから全言語の辞書を取得
const allBadWords: string[] = Object.values(naughtyWords).flat();

// leo-profanityの初期化
leoProfanity.add(allBadWords);

// カスタム禁止ワード（必要に応じて追加）
const customBadWords: string[] = [];
if (customBadWords.length > 0) {
  leoProfanity.add(customBadWords);
  allBadWords.push(...customBadWords);
}

/**
 * 部分一致で禁止ワードをチェック
 */
function containsBadWord(text: string): boolean {
  const lowerText = text.toLowerCase();
  return allBadWords.some((word) => lowerText.includes(word.toLowerCase()));
}

export interface ModerationCategories {
  sexual: boolean;
  "sexual/minors": boolean;
  harassment: boolean;
  "harassment/threatening": boolean;
  hate: boolean;
  "hate/threatening": boolean;
  illicit: boolean;
  "illicit/violent": boolean;
  "self-harm": boolean;
  "self-harm/intent": boolean;
  "self-harm/instructions": boolean;
  violence: boolean;
  "violence/graphic": boolean;
}

export interface ModerationCategoryScores {
  sexual: number;
  "sexual/minors": number;
  harassment: number;
  "harassment/threatening": number;
  hate: number;
  "hate/threatening": number;
  illicit: number;
  "illicit/violent": number;
  "self-harm": number;
  "self-harm/intent": number;
  "self-harm/instructions": number;
  violence: number;
  "violence/graphic": number;
}

export interface ModerationResult {
  flagged: boolean;
  categories: ModerationCategories;
  category_scores: ModerationCategoryScores;
}

export interface ModerationResponse {
  id: string;
  model: string;
  results: ModerationResult[];
}

export interface ContentModerationResult {
  allowed: boolean;
  flagged: boolean;
  categories?: string[];
  scores?: Partial<ModerationCategoryScores>;
  error?: string;
  /** どの層でブロックされたか */
  blockedBy?: "profanity" | "openai" | "error";
}

/**
 * ローカルチェック（高速）
 * leo-profanity + 部分一致で禁止ワードを検出
 */
export function checkProfanity(text: string): {
  hasProfanity: boolean;
  cleanedText: string;
} {
  // leo-profanityの単語単位チェック
  const leoProfanityCheck = leoProfanity.check(text);
  // 部分一致チェック（「reactまんこ」等を検出）
  const partialMatch = containsBadWord(text);

  const hasProfanity = leoProfanityCheck || partialMatch;
  const cleanedText = leoProfanity.clean(text);
  return { hasProfanity, cleanedText };
}

/**
 * カスタム禁止ワードを追加
 */
export function addCustomBadWords(words: string[]): void {
  leoProfanity.add(words);
}

/**
 * カスタム禁止ワードを削除（誤検知対策）
 */
export function removeWords(words: string[]): void {
  leoProfanity.remove(words);
}

/**
 * OpenAI Moderation API を呼び出してテキストをチェック
 */
export async function moderateText(text: string, apiKey: string): Promise<ModerationResult> {
  const response = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "omni-moderation-latest",
      input: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Moderation API error: ${response.status} - ${errorText}`);
  }

  const data: ModerationResponse = await response.json();
  return data.results[0];
}

/**
 * コンテンツが許可されるかどうかをチェック（多層防御）
 * 1. leo-profanity（ローカル・高速）で明らかなNGを弾く
 * 2. OpenAI Moderation API（文脈理解）で詳細チェック
 */
export async function checkContent(text: string, apiKey: string): Promise<ContentModerationResult> {
  // 空文字やスペースのみの場合は許可
  if (!text || !text.trim()) {
    return { allowed: true, flagged: false };
  }

  // 1. leo-profanityによるローカルチェック（高速）
  const profanityResult = checkProfanity(text);
  if (profanityResult.hasProfanity) {
    console.log(`[Moderation] Blocked by leo-profanity: "${text}"`);
    return {
      allowed: false,
      flagged: true,
      categories: ["profanity"],
      blockedBy: "profanity",
    };
  }

  // 2. OpenAI Moderation APIによるチェック（文脈理解）
  try {
    const result = await moderateText(text, apiKey);

    if (result.flagged) {
      // 違反したカテゴリを取得
      const violatedCategories = Object.entries(result.categories)
        .filter(([, flagged]) => flagged)
        .map(([category]) => category);

      // 違反したカテゴリのスコアを取得
      const violatedScores: Partial<ModerationCategoryScores> = {};
      for (const category of violatedCategories) {
        violatedScores[category as keyof ModerationCategoryScores] = result.category_scores[category as keyof ModerationCategoryScores];
      }

      console.log(`[Moderation] Blocked by OpenAI: "${text}" - categories: ${violatedCategories.join(", ")}`);
      return {
        allowed: false,
        flagged: true,
        categories: violatedCategories,
        scores: violatedScores,
        blockedBy: "openai",
      };
    }

    return { allowed: true, flagged: false };
  } catch (error) {
    console.error("Moderation API error:", error);
    // エラー時は許可する（leo-profanityで最低限のチェックは済んでいる）
    return { allowed: true, flagged: false };
  }
}

/**
 * leo-profanityのみでチェック（APIを呼ばない軽量版）
 * レート制限対策や、明らかなNGの事前フィルタとして使用
 */
export function checkContentLocal(text: string): ContentModerationResult {
  if (!text || !text.trim()) {
    return { allowed: true, flagged: false };
  }

  const profanityResult = checkProfanity(text);
  if (profanityResult.hasProfanity) {
    return {
      allowed: false,
      flagged: true,
      categories: ["profanity"],
      blockedBy: "profanity",
    };
  }

  return { allowed: true, flagged: false };
}

/**
 * 複数のテキストを一括でチェックし、許可されたもののみを返す
 */
export async function filterAllowedTexts(texts: string[], apiKey: string): Promise<string[]> {
  const results = await Promise.all(
    texts.map(async (text) => {
      const result = await checkContent(text, apiKey);
      return { text, allowed: result.allowed };
    }),
  );

  return results.filter((r) => r.allowed).map((r) => r.text);
}

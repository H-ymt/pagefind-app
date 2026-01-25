import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// レート制限テーブル
export const rateLimits = sqliteTable('rate_limits', {
  key: text('key').primaryKey(), // "ip:{ip}", "session:{sessionId}", "global"
  count: integer('count').notNull().default(0),
  windowStart: integer('window_start', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// キーワード集計テーブル
export const keywordCounts = sqliteTable('keyword_counts', {
  keyword: text('keyword').primaryKey(),
  count: integer('count').notNull().default(1),
  lastSearchedAt: integer('last_searched_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// セッション別検索ログ（重複排除用）
export const keywordSearchLogs = sqliteTable(
  'keyword_search_logs',
  {
    keyword: text('keyword').notNull(),
    sessionId: text('session_id').notNull(),
    searchedAt: integer('searched_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.keyword, table.sessionId] })]
);

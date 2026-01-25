# Pagefind App

OpenNext、Cloudflare、Pagefind、Drizzle ORM を使用した Next.js アプリケーションです。  
静的検索エンジンの Pagefind を Cloudflare 環境で動作させるための構成が含まれています。

## 技術スタック

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/) (via [OpenNext](https://opennext.js.org/cloudflare))
- **Search**: [Pagefind](https://pagefind.app/) (Static Search)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 開発の始め方

依存関係をインストールします:

```bash
pnpm install
```

### 開発サーバーの起動

通常の Next.js 開発サーバーを起動します:

```bash
pnpm dev
```

### 検索機能を含む開発

Pagefind は静的ファイルを解析してインデックスを作成するため、検索機能をローカルでテストするには一度ビルドする必要があります。  
以下のコマンドは、ビルド → インデックス作成 → 開発サーバー起動 を一連の流れで行います:

```bash
pnpm run dev:search
```

## デプロイ

Cloudflare Pages へのデプロイに関連するコマンドです。

### プレビュー

Cloudflare の `workerd` 環境でローカルプレビューを実行します:

```bash
pnpm run cf:preview
```

### 本番デプロイ

アプリケーションをビルドし、Cloudflare Pages にデプロイします:

```bash
pnpm run cf:deploy
```

## ディレクトリ構造

- `src/app`: Next.js App Router ソースコード
- `src/db`: Drizzle ORM スキーマ定義
- `public/pagefind`: ローカル開発用に生成された Pagefind のインデックス（`pnpm pagefind:local` 実行後）
- `.open-next`: OpenNext ビルド成果物

## 検索システムの仕組み

### 検索エンジン（Pagefind）

Pagefind は静的検索エンジンで、ビルド時に HTML ページを解析してインデックスを作成します。

```text
ビルド → HTML解析 → インデックス生成 → クライアントサイド検索
```

- **クライアントサイド**: 検索はブラウザ上で実行され、サーバーへのリクエストは発生しません
- **軽量**: インデックスは分割されており、必要な部分のみがロードされます

### 検索ログの保存

ユーザーが検索したキーワードは Cloudflare D1 データベースに保存され、人気キーワードの集計に使用されます。

```text
[ユーザー] → [/api/search-log] → [モデレーション] → [D1 Database]
                                       ↓
                              NG: 保存しない
                              OK: キーワードを保存
```

#### データベーステーブル

| テーブル              | 用途                                 |
| --------------------- | ------------------------------------ |
| `keyword_counts`      | キーワードごとの検索回数を集計       |
| `keyword_search_logs` | セッション別の検索ログ（重複排除用） |
| `rate_limits`         | レート制限の管理                     |

#### 重複排除

同一セッションからの連続した同じキーワード検索は 1 回としてカウントされます。これにより、検索回数の水増しを防ぎます。

### モデレーション（多層防御）

不適切なキーワードの保存を防ぐため、2 層のフィルタリングを実装しています。

```text
検索キーワード
    ↓
[1. leo-profanity（ローカル・高速）]
    ↓ NG → 即座にブロック
    ↓ OK
[2. OpenAI Moderation API（文脈理解）]
    ↓ NG → ブロック
    ↓ OK
データベースに保存
```

#### 第 1 層: leo-profanity

- **ローカル処理**: API 呼び出し不要で高速
- **多言語対応**: naughty-words ライブラリで複数言語の禁止ワードをカバー
- **部分一致**: 禁止ワードが含まれていれば検出

#### 第 2 層: OpenAI Moderation API

- **文脈理解**: 単語単位ではなく文脈を考慮した判定
- **カテゴリ別判定**: sexual, harassment, hate, violence など複数のカテゴリで評価
- **フォールバック**: API エラー時は第 1 層のみで判定

### レート制限

API の悪用を防ぐため、3 層のレート制限を実装しています。

| 制限タイプ | 上限   | ウィンドウ |
| ---------- | ------ | ---------- |
| IP         | 10 回  | 1 分       |
| セッション | 100 回 | 24 時間    |
| グローバル | 100 回 | 1 分       |

### 人気キーワードの取得

`/api/popular-keywords` から人気キーワードを取得できます。

- **最低検索回数**: 5 回以上検索されたキーワードのみ表示
- **期間**: 直近 7 日以内に検索されたもの
- **キャッシュ**: 60 秒間キャッシュされます

## ロードマップ

- [ ] **検索サジェスト** - 入力中に人気キーワードをサジェスト表示
- [ ] **定期クリーンアップ** - Cron Triggers で古いログを自動削除
- [ ] **検索分析ダッシュボード** - 管理者向けに検索トレンドを可視化

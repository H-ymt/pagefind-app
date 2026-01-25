# Pagefind App

OpenNext、Cloudflare、Pagefind、Drizzle ORM を使用した Next.js アプリケーションです。
静的検索エンジンの Pagefind を Cloudflare 環境で動作させるための構成が含まれています。

## 技術スタック

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) (via [OpenNext](https://opennext.js.org/cloudflare))
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

### 検索機能を含む開発（推奨）

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

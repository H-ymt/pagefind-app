export const metadata = {
  title: "Cloudflare Workersでエッジコンピューティング",
};

export default function CloudflareWorkers() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">Cloudflare Workersでエッジコンピューティング</h1>
      <p className="mb-4">
        Cloudflare Workersは、エッジで実行されるサーバーレスプラットフォームです。
        世界中のデータセンターでコードを実行し、低レイテンシーなレスポンスを実現します。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">基本的な使い方</h2>
      <p className="mb-4">
        Workersは、HTTPリクエストを受け取り、レスポンスを返すシンプルな関数です。 JavaScriptまたはTypeScriptで記述できます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">KVストレージ</h2>
      <p className="mb-4">Workers KVは、グローバルに分散されたキーバリューストアです。 設定データやキャッシュの保存に最適です。</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">D1データベース</h2>
      <p className="mb-4">D1は、Cloudflareのサーバーレスデータベースです。 SQLiteベースで、エッジから直接クエリを実行できます。</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Wrangler CLI</h2>
      <p className="mb-4">
        Wranglerは、Workersの開発とデプロイを管理するCLIツールです。 ローカル開発、テスト、本番デプロイがコマンド一つで行えます。
      </p>
    </article>
  );
}

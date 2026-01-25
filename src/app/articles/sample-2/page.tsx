export const metadata = {
  title: "Cloudflare Workersへのデプロイ",
};

export default function Article2() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">Cloudflare Workersへのデプロイ</h1>
      <p className="mb-4">
        Cloudflare Workersは、エッジコンピューティングプラットフォームです。 世界中のデータセンターでコードを実行できるため、
        ユーザーに近い場所でレスポンスを返すことができます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">D1データベース</h2>
      <p className="mb-4">
        Cloudflare D1は、SQLiteベースのサーバーレスデータベースです。 Workersと統合されており、エッジで高速なデータアクセスが可能です。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Wrangler CLI</h2>
      <p className="mb-4">
        Wranglerは、Cloudflare Workersの開発・デプロイツールです。 ローカル開発環境の構築からデプロイまで、一貫して管理できます。
      </p>
    </article>
  );
}

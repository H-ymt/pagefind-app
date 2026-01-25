export const metadata = {
  title: "Next.jsの基本的な使い方",
};

export default function Article1() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">Next.jsの基本的な使い方</h1>
      <p className="mb-4">
        Next.jsは、Reactベースのフルスタックフレームワークです。 サーバーサイドレンダリング（SSR）や静的サイト生成（SSG）を
        簡単に実装できます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">App Router</h2>
      <p className="mb-4">
        Next.js 13以降では、App Routerが推奨されています。 ファイルベースのルーティングにより、直感的にページを作成できます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Server Components</h2>
      <p className="mb-4">
        React Server Componentsを使用することで、 サーバーサイドでコンポーネントをレンダリングし、
        クライアントに送信するJavaScriptの量を削減できます。
      </p>
    </article>
  );
}

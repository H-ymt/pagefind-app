export const metadata = {
  title: "PageFindで全文検索を実装する",
};

export default function Article3() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">PageFindで全文検索を実装する</h1>
      <p className="mb-4">
        PageFindは、静的サイト向けの全文検索ライブラリです。 ビルド時にインデックスを生成し、クライアントサイドで 高速な検索を実現します。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">特徴</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>軽量なJavaScriptバンドル</li>
        <li>多言語対応（日本語を含む）</li>
        <li>カスタマイズ可能な検索UI</li>
        <li>フィルタリング機能</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-4">設定方法</h2>
      <p className="mb-4">
        data-pagefind-body属性を検索対象の要素に追加することで、 インデックスに含める範囲を指定できます。
        除外したい要素にはdata-pagefind-ignore属性を使用します。
      </p>
    </article>
  );
}

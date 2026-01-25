export const metadata = {
  title: "Webパフォーマンス最適化テクニック",
};

export default function PerformanceOptimization() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">Webパフォーマンス最適化テクニック</h1>
      <p className="mb-4">
        高速なWebサイトは、ユーザー体験とSEOの両方に重要です。 Core Web Vitalsを改善することで、サイトの品質を向上させます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">画像最適化</h2>
      <p className="mb-4">
        WebPやAVIF形式を使用し、適切なサイズで画像を配信します。 Next.jsのImageコンポーネントを使用すると、自動的に最適化されます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">コード分割</h2>
      <p className="mb-4">
        動的インポートを使用して、必要なコードだけを読み込みます。 初期バンドルサイズを削減し、ページの読み込み速度を向上させます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">キャッシュ戦略</h2>
      <p className="mb-4">
        適切なキャッシュヘッダーを設定し、静的アセットを効率的に配信します。 Service Workerを使用したオフラインキャッシュも効果的です。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">レンダリング最適化</h2>
      <p className="mb-4">
        仮想化、メモ化、遅延読み込みなどのテクニックを活用します。 React.memoやuseMemoを使用して、不要な再レンダリングを防ぎます。
      </p>
    </article>
  );
}

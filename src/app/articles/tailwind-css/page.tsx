export const metadata = {
  title: "Tailwind CSSでモダンなUIを構築",
};

export default function TailwindCSS() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">Tailwind CSSでモダンなUIを構築</h1>
      <p className="mb-4">
        Tailwind CSSは、ユーティリティファーストのCSSフレームワークです。
        あらかじめ定義されたクラスを組み合わせることで、カスタムデザインを素早く構築できます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">ユーティリティクラス</h2>
      <p className="mb-4">flex、pt-4、text-centerなどのユーティリティクラスを使用して、 HTMLを離れることなくスタイルを適用できます。</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">レスポンシブデザイン</h2>
      <p className="mb-4">sm:、md:、lg:などのプレフィックスを使用して、 ブレークポイントごとに異なるスタイルを簡単に適用できます。</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">ダークモード</h2>
      <p className="mb-4">
        dark:プレフィックスを使用することで、ダークモード用のスタイルを定義できます。
        システムの設定に応じて自動的に切り替えることも可能です。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">カスタマイズ</h2>
      <p className="mb-4">tailwind.config.jsファイルで、色、フォント、スペーシングなどを プロジェクトに合わせてカスタマイズできます。</p>
    </article>
  );
}

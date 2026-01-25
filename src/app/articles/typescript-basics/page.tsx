export const metadata = {
  title: "TypeScriptの型システム入門",
};

export default function TypeScriptBasics() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">TypeScriptの型システム入門</h1>
      <p className="mb-4">
        TypeScriptはJavaScriptに静的型付けを追加したプログラミング言語です。
        コンパイル時に型エラーを検出することで、バグを未然に防ぐことができます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">基本的な型</h2>
      <p className="mb-4">
        TypeScriptには、string、number、boolean、array、objectなどの基本型があります。 これらを使用して変数や関数の引数に型を指定できます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">インターフェースと型エイリアス</h2>
      <p className="mb-4">interfaceやtypeを使用して、オブジェクトの形状を定義できます。 これにより、コードの可読性と保守性が向上します。</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">ジェネリクス</h2>
      <p className="mb-4">
        ジェネリクスを使用すると、型を引数として受け取る再利用可能なコンポーネントを作成できます。
        配列やPromiseなど、多くの組み込み型がジェネリクスを使用しています。
      </p>
    </article>
  );
}

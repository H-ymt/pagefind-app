export const metadata = {
  title: "React Hooksの完全ガイド",
};

export default function ReactHooks() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">React Hooksの完全ガイド</h1>
      <p className="mb-4">
        React Hooksは、関数コンポーネントで状態やライフサイクルを扱うための機能です。
        クラスコンポーネントを書かずに、Reactの機能をフルに活用できます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">useState</h2>
      <p className="mb-4">
        useStateは最も基本的なフックで、コンポーネントに状態を追加します。 状態の値と、それを更新する関数のペアを返します。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">useEffect</h2>
      <p className="mb-4">useEffectは副作用を処理するためのフックです。 データフェッチ、購読の設定、DOMの手動変更などに使用します。</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">useContext</h2>
      <p className="mb-4">
        useContextを使用すると、コンポーネントツリー全体でデータを共有できます。
        プロップドリリングを回避し、グローバルな状態管理が可能になります。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">カスタムフック</h2>
      <p className="mb-4">
        カスタムフックを作成することで、ロジックを再利用可能な形で抽出できます。 useから始まる関数名で、他のフックを組み合わせて使用します。
      </p>
    </article>
  );
}

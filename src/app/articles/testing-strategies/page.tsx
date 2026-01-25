export const metadata = {
  title: "フロントエンドテスト戦略",
};

export default function TestingStrategies() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">フロントエンドテスト戦略</h1>
      <p className="mb-4">
        テストは、コードの品質を維持し、リファクタリングを安全に行うために不可欠です。
        適切なテスト戦略により、バグを早期に発見し、開発効率を向上させます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">ユニットテスト</h2>
      <p className="mb-4">
        個々の関数やコンポーネントを独立してテストします。 JestやVitestを使用して、高速なフィードバックループを実現します。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">インテグレーションテスト</h2>
      <p className="mb-4">
        複数のコンポーネントが正しく連携して動作するかをテストします。 React Testing Libraryを使用して、ユーザーの視点でテストを書きます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">E2Eテスト</h2>
      <p className="mb-4">
        アプリケーション全体の動作をブラウザでテストします。 PlaywrightやCypressを使用して、実際のユーザーフローを検証します。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">テストカバレッジ</h2>
      <p className="mb-4">
        カバレッジレポートを活用して、テストされていないコードを特定します。
        100%を目指すのではなく、重要なビジネスロジックを優先的にカバーします。
      </p>
    </article>
  );
}

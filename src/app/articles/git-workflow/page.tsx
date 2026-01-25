export const metadata = {
  title: "Gitワークフローのベストプラクティス",
};

export default function GitWorkflow() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">Gitワークフローのベストプラクティス</h1>
      <p className="mb-4">
        Gitは、最も広く使用されているバージョン管理システムです。 効率的なワークフローを確立することで、チーム開発がスムーズになります。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">ブランチ戦略</h2>
      <p className="mb-4">
        Git FlowやGitHub Flowなど、プロジェクトに適したブランチ戦略を選択します。
        main、develop、featureブランチを使い分けることで、コードの品質を維持できます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">コミットメッセージ</h2>
      <p className="mb-4">
        明確で一貫したコミットメッセージを書くことが重要です。 Conventional Commitsの形式を採用すると、変更履歴が分かりやすくなります。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">プルリクエスト</h2>
      <p className="mb-4">
        プルリクエストを通じてコードレビューを行い、品質を担保します。 小さな変更を頻繁にマージすることで、コンフリクトを減らせます。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">リベースとマージ</h2>
      <p className="mb-4">
        リベースを使用すると、履歴をきれいに保つことができます。 ただし、共有ブランチではマージを使用する方が安全です。
      </p>
    </article>
  );
}

export const metadata = {
  title: "RESTful API設計の原則",
};

export default function ApiDesign() {
  return (
    <article className="max-w-3xl mx-auto p-8 pb-20 sm:p-20" data-pagefind-body>
      <h1 className="text-3xl font-bold mb-6">RESTful API設計の原則</h1>
      <p className="mb-4">
        RESTful APIは、Webサービスを構築するための標準的なアーキテクチャスタイルです。
        適切に設計されたAPIは、開発者にとって使いやすく、保守性も高くなります。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">リソース指向</h2>
      <p className="mb-4">
        APIはリソースを中心に設計します。URLはリソースを表し、 HTTPメソッド（GET、POST、PUT、DELETE）で操作を表現します。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">ステータスコード</h2>
      <p className="mb-4">
        適切なHTTPステータスコードを返すことで、クライアントは結果を正しく解釈できます。
        200番台は成功、400番台はクライアントエラー、500番台はサーバーエラーを示します。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">バージョニング</h2>
      <p className="mb-4">
        APIのバージョン管理により、既存のクライアントを壊さずに新機能を追加できます。
        URLパス（/v1/users）やヘッダーでバージョンを指定する方法があります。
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">認証と認可</h2>
      <p className="mb-4">
        JWTトークンやOAuth 2.0を使用して、APIアクセスを適切に制御します。 センシティブなエンドポイントは必ず認証を要求するようにします。
      </p>
    </article>
  );
}

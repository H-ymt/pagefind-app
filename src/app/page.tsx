import { Suspense } from "react";
import Link from "next/link";
import Search from "@/components/Search";
import PopularKeywords from "@/components/PopularKeywords";

const articles = [
  {
    slug: "typescript-basics",
    title: "TypeScriptの型システム入門",
    description: "静的型付けでバグを未然に防ぐ方法を学びます",
  },
  {
    slug: "react-hooks",
    title: "React Hooksの完全ガイド",
    description: "useState、useEffect、カスタムフックの使い方",
  },
  {
    slug: "tailwind-css",
    title: "Tailwind CSSでモダンなUIを構築",
    description: "ユーティリティファーストのCSSフレームワーク",
  },
  {
    slug: "cloudflare-workers",
    title: "Cloudflare Workersでエッジコンピューティング",
    description: "サーバーレスで低レイテンシーなアプリを構築",
  },
  {
    slug: "git-workflow",
    title: "Gitワークフローのベストプラクティス",
    description: "チーム開発を効率化するブランチ戦略",
  },
  {
    slug: "api-design",
    title: "RESTful API設計の原則",
    description: "使いやすく保守性の高いAPIを設計する",
  },
  {
    slug: "testing-strategies",
    title: "フロントエンドテスト戦略",
    description: "ユニット、インテグレーション、E2Eテストの活用法",
  },
  {
    slug: "performance-optimization",
    title: "Webパフォーマンス最適化テクニック",
    description: "Core Web Vitalsを改善するための手法",
  },
];

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold text-gray-900">サイト内検索</h1>

        <Suspense fallback={<div className="w-full max-w-2xl h-12" />}>
          <Search />
        </Suspense>

        <Suspense
          fallback={
            <div className="w-full max-w-2xl mx-auto mt-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-3"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
                ))}
              </div>
            </div>
          }
        >
          <PopularKeywords />
        </Suspense>

        <section className="w-full max-w-2xl mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">記事一覧</h2>
          <div className="grid gap-4">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600">{article.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

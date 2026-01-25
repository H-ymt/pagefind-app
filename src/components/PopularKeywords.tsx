import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getPopularKeywords } from "@/lib/keywords";

export const dynamic = "force-dynamic";

export default async function PopularKeywords() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const keywords = await getPopularKeywords(env.DB, 10);

    if (keywords.length === 0) {
      return null;
    }

    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <h2 className="text-lg font-semibold text-gray-700  mb-3">人気の検索キーワード</h2>
        <div className="flex flex-wrap gap-2">
          {keywords.map(({ keyword, count }) => (
            <span
              key={keyword}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100  text-gray-700  hover:bg-gray-200  transition-colors cursor-pointer"
              title={`${count}回検索`}
            >
              {keyword}
              <span className="ml-1 text-xs text-gray-500 ">({count})</span>
            </span>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch popular keywords:", error);
    return null;
  }
}

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getPopularKeywords } from "@/lib/keywords";
import KeywordButtons from "./KeywordButtons";

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
        <KeywordButtons keywords={keywords} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch popular keywords:", error);
    return null;
  }
}

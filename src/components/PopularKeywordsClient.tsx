"use client";

import { useEffect, useState } from "react";

type Keyword = {
  keyword: string;
  count: number;
};

export default function PopularKeywordsClient() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const res = await fetch("/api/popular-keywords?limit=10");
        if (res.ok) {
          const data = (await res.json()) as Keyword[];
          setKeywords(data);
        }
      } catch (error) {
        console.error("Failed to fetch popular keywords:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200  rounded w-48 mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200  rounded-full w-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
}

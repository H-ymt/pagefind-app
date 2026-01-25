"use client";

import { useRouter } from "next/navigation";

type Keyword = {
  keyword: string;
  count: number;
};

type Props = {
  keywords: Keyword[];
};

export default function KeywordButtons({ keywords }: Props) {
  const router = useRouter();

  const handleKeywordClick = (keyword: string) => {
    router.push(`/?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map(({ keyword, count }) => (
        <button
          key={keyword}
          type="button"
          onClick={() => handleKeywordClick(keyword)}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          title={`${count}回検索`}
        >
          {keyword}
          <span className="ml-1 text-xs text-gray-500">({count})</span>
        </button>
      ))}
    </div>
  );
}

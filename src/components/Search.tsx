"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type PagefindResult = {
  id: string;
  url: string;
  meta: {
    title?: string;
  };
  excerpt: string;
};

type PagefindSearchResult = {
  results: Array<{
    id: string;
    data: () => Promise<PagefindResult>;
  }>;
};

type Pagefind = {
  search: (query: string) => Promise<PagefindSearchResult>;
  init: () => Promise<void>;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pagefindRef = useRef<Pagefind | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadPagefind = async () => {
      if (typeof window === "undefined") return;

      try {
        const pagefind = (await import(
          /* webpackIgnore: true */
          `${window.location.origin}/pagefind/pagefind.js`
        )) as Pagefind;
        await pagefind.init();
        pagefindRef.current = pagefind;
        setIsReady(true);
      } catch {
        // PageFind not available (dev mode or not yet built)
      }
    };

    loadPagefind();
  }, []);

  const logSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      await fetch("/api/search-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
    } catch (error) {
      console.error("Failed to log search:", error);
    }
  }, []);

  const normalizeUrl = (url: string): string => {
    // Remove .html extension for Next.js App Router compatibility
    return url.replace(/\.html$/, "");
  };

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    if (!pagefindRef.current) return;

    setIsLoading(true);

    try {
      const searchResult = await pagefindRef.current.search(searchQuery);
      const resultData = await Promise.all(searchResult.results.slice(0, 10).map((r) => r.data()));
      // Normalize URLs to remove .html extension
      const normalizedResults = resultData.map((result) => ({
        ...result,
        url: normalizeUrl(result.url),
      }));
      setResults(normalizedResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      logSearch(query);
    }
  };

  return (
    <div className="search-form w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="検索..."
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-4">
          {results.map((result) => (
            <a
              key={result.id}
              href={result.url}
              className="block p-4 bg-white  rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 "
            >
              <h3 className="text-lg font-semibold text-blue-600  mb-2">{result.meta.title || result.url}</h3>
              {/* PageFind excerpt is pre-sanitized HTML with <mark> tags for highlighting */}
              <p className="text-sm text-gray-600 " dangerouslySetInnerHTML={{ __html: result.excerpt }} />
            </a>
          ))}
        </div>
      )}

      {isReady && query && !isLoading && results.length === 0 && (
        <p className="mt-4 text-gray-500  text-center">「{query}」に一致する結果が見つかりませんでした</p>
      )}
    </div>
  );
}

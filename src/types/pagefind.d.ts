declare module '/pagefind/pagefind.js' {
  export type PagefindResult = {
    id: string;
    url: string;
    meta: {
      title?: string;
    };
    excerpt: string;
  };

  export type PagefindSearchResult = {
    results: Array<{
      id: string;
      data: () => Promise<PagefindResult>;
    }>;
  };

  export function search(query: string): Promise<PagefindSearchResult>;
  export function init(): Promise<void>;
}

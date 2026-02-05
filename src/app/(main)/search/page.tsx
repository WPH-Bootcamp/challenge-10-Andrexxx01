"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import ArticleCard from "@/components/home/articleCard";
import Button from "@/components/ui/button";
import type { Article, PaginatedResponse } from "@/types/blog";

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("query")?.trim() ?? "";

  const { data, isLoading, isError } = useQuery<PaginatedResponse<Article>>({
    queryKey: ["search", query],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/posts/search?query=${encodeURIComponent(query)}&page=1&limit=10`,
      );
      return res.data;
    },
    enabled: query.length > 0,
  });

  /* ================= QUERY EMPTY ================= */
  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <img src="/empty-search.svg" alt="Search" className="mb-6 h-40 w-40" />
        <p className="text-lg font-semibold">Search articles</p>
        <p className="text-sm text-neutral-500">
          Enter keywords to find articles
        </p>
      </div>
    );
  }

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-neutral-500">
        Searching articles...
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (isError) {
    return (
      <div className="py-20 text-center text-sm text-red-500">
        Failed to search articles
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <img
          src="/empty-search.svg"
          alt="No results"
          className="mb-6 h-40 w-40"
        />

        <p className="text-lg font-semibold">No results found</p>
        <p className="mb-6 text-sm text-neutral-500">
          Try using different keywords
        </p>

        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-s-4xl py-10">
      {/* TITLE */}
      <h1 className="mb-8 text-xl font-semibold">Result for “{query}”</h1>

      {/* RESULT LIST */}
      <div className="max-w-210">
        <div className="flex flex-col gap-s-6xl">
          {data.data.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              showDivider={index !== data.data.length - 1}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
}

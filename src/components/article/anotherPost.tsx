"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import ArticleCard from "@/components/home/articleCard";
import type { Article, PaginatedResponse } from "@/types/blog";
import { useMemo } from "react";

interface Props {
  currentPostId: number;
}

export default function AnotherPost({ currentPostId }: Props) {
  const { data, isLoading, isError } = useQuery<PaginatedResponse<Article>>({
    queryKey: ["recommended-posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/recommended?page=1&limit=5");
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const randomPost = useMemo(() => {
    if (!data) return null;
    const filtered = data.data.filter((post) => post.id !== currentPostId);
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  }, [data, currentPostId]);

  if (isLoading || isError || !randomPost) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-lg font-semibold">Another Post</h2>

      <div className="[&>div]:border-b-0">
        <ArticleCard article={randomPost} />
      </div>
    </section>
  );
}

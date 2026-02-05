"use client";

import { useState, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import ArticleCard from "./articleCard";
import Pagination from "./pagination";
import type { Article, PaginatedResponse } from "@/types/blog";

export default function RecommendedList() {
  const [page, setPage] = useState(1);
  const lastPageRef = useRef(1);

  const { data, isFetching } = useQuery<PaginatedResponse<Article>>({
    queryKey: ["recommended-posts", page],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/posts/recommended?page=${page}&limit=5`,
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  if (!data) return null;

  // SIMPAN lastPage PALING BESAR YANG PERNAH ADA
  lastPageRef.current = Math.max(lastPageRef.current, data.lastPage);

  return (
    <>
      <div className="flex flex-col gap-s-6xl">
        {data.data.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            showDivider={index !== data.data.length - 1}
          />
        ))}
      </div>

      {/* ❗ SELALU RENDER */}
      <Pagination
        page={page}
        lastPage={lastPageRef.current}
        onChange={setPage}
      />
    </>
  );
}

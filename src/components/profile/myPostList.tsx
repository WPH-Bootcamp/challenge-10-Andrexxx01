"use client";

import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import ArticleCard from "@/components/home/articleCard";
import Button from "@/components/ui/button";
import type { RootState } from "@/store";
import type { Article, PaginatedResponse } from "@/types/blog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatisticModal from "./statisticModal";
import DeletePostModal from "./deletePostModal";
import { useState } from "react";

export default function MyPostList() {
  const { token } = useSelector((s: RootState) => s.auth);
  const router = useRouter();
  const [statPostId, setStatPostId] = useState<number | null>(null);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const { data } = useQuery<PaginatedResponse<Article>>({
    queryKey: ["my-posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/my-posts?limit=10&page=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  if (!data) return null;

  const posts = data.data;

  /* EMPTY STATE */
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <img src="/empty-search.svg" className="mb-6 h-40 w-40" />
        <p className="font-semibold">Your writing journey starts here</p>
        <p className="mb-6 text-center text-sm text-neutral-500">
          No posts yet, but every great writer starts with the first one.
        </p>

        <Link href="/write-post">
          <Button className="flex w-full md:w-auto items-center justify-center gap-2 cursor-pointer">
            <img src="/Write Post Icon.svg" className="h-4 w-4" />
            Write Post
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="mb-4 mt-6 flex items-center justify-between">
        <p className="hidden md:block text-base font-semibold">
          {data.total} Post
        </p>

        <Link href="/write-post">
          <Button className="flex w-full md:w-auto items-center justify-center gap-2 cursor-pointer">
            <img src="/Write Post Icon-white.svg" className="h-4 w-4" />
            Write Post
           </Button>
        </Link>
      </div>

      {/* TOP DIVIDER */}
      <div className="mb-6 border-t border-neutral-200" />

      {/* LIST */}
      <div className="flex flex-col">
        {posts.map((article, index) => (
          <div key={article.id}>
            <ArticleCard
              article={article}
              showDivider={false}
              actions={
                <>
                  <button className="font-medium text-primary-300 underline hover:text-primary-200 cursor-pointer" onClick={() => setStatPostId(article.id)}>
                    Statistic
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button className="font-medium text-primary-300 underline hover:text-primary-200 cursor-pointer" onClick={() => router.push(`/write-post/${article.id}`)}>
                    Edit
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button className="font-medium text-red-500 underline hover:text-red-700 cursor-pointer" onClick={() => setDeletePostId(article.id)}>
                    Delete
                  </button>
                </>
              }
            />

            {/* ITEM DIVIDER */}
            {index !== posts.length - 1 && (
              <div className="my-s-6xl border-t border-neutral-200" />
            )}
          </div>
        ))}
      </div>
      {/* ===== MODALS ===== */}
      {statPostId && (
        <StatisticModal
          postId={statPostId}
          onClose={() => setStatPostId(null)}
        />
      )}

      {deletePostId && (
        <DeletePostModal
          postId={deletePostId}
          onClose={() => setDeletePostId(null)}
        /> )}
    </>
  );
}

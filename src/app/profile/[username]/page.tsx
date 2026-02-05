"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import ArticleCard from "@/components/home/articleCard";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/users/by-username/${encodeURIComponent(username)}?limit=10&page=1`,
      );
      return res.data;
    },
    enabled: !!username,
  });

  if (isLoading) return null;
  if (isError || !data) return null;

  const avatarSrc = normalizeImageUrl(data.avatarUrl);

  const posts = data.posts.data.slice(0, 5);
  const hasPosts = posts.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-s-4xl py-8">
      {/* ===== CENTERED CONTENT COLUMN (FIGMA MATCH) ===== */}
      <div className="mx-auto max-w-210">
        {/* ===== PROFILE HEADER ===== */}
        <div className="flex items-center gap-4 border-b border-neutral-200 pb-6">
          <img
            src={avatarSrc}
            alt="avatar"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{data.name}</p>
            {data.headline && (
              <p className="text-sm text-neutral-500">{data.headline}</p>
            )}
          </div>
        </div>

        {/* ===== POST COUNT (ONLY IF EXISTS) ===== */}
        {data.posts.total > 0 && (
          <p className="mt-6 mb-4 font-semibold">{data.posts.total} Post</p>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!hasPosts && (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="/empty-search.svg"
              alt="empty"
              className="mb-6 h-40 w-40"
            />
            <p className="font-semibold">No posts from this user yet</p>
            <p className="text-sm text-neutral-500">
              Stay tuned for future posts
            </p>
          </div>
        )}

        {/* ===== ARTICLE LIST (CLEAN DIVIDER) ===== */}
        {hasPosts && (
          <div className="mt-6 flex flex-col gap-s-6xl">
            {posts.map((article: any, index: number) => (
              <ArticleCard
                key={article.id}
                article={article}
                showDivider={index !== posts.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import type { ArticleDetail, UserProfile } from "@/types/blog";
import CommentsSection from "@/components/comments/commentsSection";
import AnotherPost from "@/components/article/anotherPost";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery<ArticleDetail>({
    queryKey: ["article-detail", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/${id}`);
      return res.data;
    },
  });

  const authorId = article?.author.id;

  const { data: author } = useQuery<UserProfile>({
    enabled: !!article?.author.id,
    queryKey: ["author", authorId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${article!.author.id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  if (isError || !article) {
    return (
      <p className="text-center py-20 text-red-500">
        Failed to load article
      </p>
    );
  }

  const avatarSrc = normalizeImageUrl(author?.avatarUrl);

  return (
    <>
      <main className="mx-auto max-w-3xl px-s-4xl py-s-6xl">
        {/* TITLE */}
        <h1 className="text-display-lg font-bold mb-4">{article.title}</h1>

        {/* TAGS */}
        <div className="mb-4 flex gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-md border px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* AUTHOR */}
        <div className="flex items-center gap-3 text-sm text-neutral-700 mb-4">
          <Link href={`/profile/${article.author.username}`}>
            <img
              src={avatarSrc}
              alt="author"
              className="h-8 w-8 rounded-full object-cover cursor-pointer"
            />
          </Link>
          <Link href={`/profile/${article.author.username}`}>
            <span className="font-medium cursor-pointer">
              {article.author.name}
            </span>
          </Link>
          <span className="text-neutral-500">
            •{" "}
            {new Date(article.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <hr className="mb-4 border-neutral-200" />

        {/* LIKE & COMMENT */}
        <div className="mb-6 flex items-center gap-6 text-sm text-neutral-600">
          <span className="flex items-center gap-1">
            <img src="/Like Icon.svg" className="h-4 w-4" />
            {article.likes}
          </span>
          <span className="flex items-center gap-1">
            <img src="/Comment Icon.svg" className="h-4 w-4" />
            {article.comments}
          </span>
        </div>

        <hr className="mb-4 border-neutral-200" />
        {/* IMAGE */}
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="mb-6 w-full rounded-xl"
          />
        )}

        {/* CONTENT */}
        <article className="prose prose-neutral max-w-none text-sm">
          {article.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
        <hr className="mt-6 border-neutral-200" />
        <CommentsSection postId={postId} />
        <hr className="mt-6 border-neutral-200" />
        <AnotherPost currentPostId={postId} />
      </main>
    </>
  );
}

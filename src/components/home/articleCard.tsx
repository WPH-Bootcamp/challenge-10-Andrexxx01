"use client";

import type { Article } from "@/types/blog";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

interface Props {
  article: Article;
  showDivider?: boolean;
  actions?: React.ReactNode;
}

export default function ArticleCard({ article, showDivider = true, actions }: Props) {
  const avatarSrc = normalizeImageUrl(article.author.avatarUrl);

  return (
    <div
      className={`
    pb-s-6xl
    ${showDivider ? "border-b border-neutral-200" : ""}
  `}
    >
      <div className="flex gap-s-4xl">
        {/* IMAGE (DESKTOP ONLY) */}
        {article.imageUrl && (
          <div className="relative hidden md:block w-60 shrink-0 self-stretch">
            <Link href={`/detail/${article.id}`}>
              <img
                src={article.imageUrl}
                alt={article.title}
                className="absolute inset-0 h-full w-full rounded-xl"
              />
            </Link>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1">
          <Link href={`/detail/${article.id}`}>
            <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
          </Link>

          <div className="mb-2 flex gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-md border px-2 py-0.5 text-xs">
                {tag}
              </span>
            ))}
          </div>

          <p className="mb-4 text-sm text-neutral-600 line-clamp-2">
            {article.content}
          </p>

          {/* META */}
          <div className="mt-4 text-sm">
            {/* ROW 1: AVATAR + NAME */}
            <div className="flex items-center gap-3">
              <Link href={`/profile/${article.author.username}`}>
                <img
                  src={avatarSrc}
                  //onError={(e) => {e.currentTarget.src = "/default-avatar.svg";}}
                  alt="author"
                  className="h-6 w-6 rounded-full object-cover cursor-pointer"
                />
              </Link>
              <div className="flex items-center gap-2 text-neutral-900">
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
            </div>

            {/* ROW 2: LIKE & COMMENT */}
            <div className="mt-2 flex items-center gap-6 text-neutral-600">
              <span className="flex items-center gap-1">
                <img src="/Like Icon.svg" alt="like" className="h-4 w-4" />
                {article.likes}
              </span>

              <span className="flex items-center gap-1">
                <img
                  src="/Comment Icon.svg"
                  alt="comment"
                  className="h-4 w-4"
                />
                {article.comments}
              </span>
            </div>
            {/* ===== ACTION SLOT (FIGMA) ===== */}
            {actions && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

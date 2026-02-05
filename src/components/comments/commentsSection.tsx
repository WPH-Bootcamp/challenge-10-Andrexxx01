"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Button from "@/components/ui/button";
import type { Comment } from "@/types/blog";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

interface Props {
  postId: number;
}

export default function CommentsSection({ postId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user } = useSelector((s: RootState) => s.auth);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/comments/${postId}`);
      return res.data;
    },
  });

  /* ================= POST ================= */
  const postMutation = useMutation({
    mutationFn: async () => {
      if (!content.trim()) {
        throw new Error("EMPTY");
      }

      if (!token) {
        throw new Error("UNAUTHORIZED");
      }

      const res = await axiosInstance.post(
        `/comments/${postId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return res.data;
    },
    onSuccess: () => {
      setContent("");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (err: any) => {
      if (err.message === "EMPTY") {
        setError("Comment can not empty");
        return;
      }

      if (err.message === "UNAUTHORIZED" || err?.response?.status === 401) {
        router.push("/sign-in");
      }
    },
  });

  /* ================= DELETE ================= */
  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      if (!token) {
        router.push("/sign-in");
        return;
      }
      await axiosInstance.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const renderComment = (comment: Comment) => {
    const isOwner = comment.author.id === user?.id;
    const profileUrl = `/profile/${comment.author.username}`;

    return (
      <div
        key={comment.id}
        className="relative border-t border-neutral-200 pt-6"
      >
        {isOwner && (
          <button
            onClick={() => deleteMutation.mutate(comment.id)}
            className="absolute right-2 top-6"
          >
            <Image src="/trash.svg" alt="delete" width={16} height={16} />
          </button>
        )}

        <div className="flex items-center gap-3">
          {/* AVATAR → PROFILE */}
          <Link href={profileUrl}>
            <img
              src={normalizeImageUrl(comment.author.avatarUrl)}
              className="h-8 w-8 rounded-full object-cover cursor-pointer"
              alt="avatar"
            />
          </Link>

          <div>
            {/* NAME → PROFILE */}
            <Link href={profileUrl}>
              <p className="text-sm font-medium hover:underline cursor-pointer">
                {comment.author.name}
              </p>
            </Link>

            <p className="text-xs text-neutral-500">
              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm text-neutral-700">{comment.content}</p>
      </div>
    );
  };

  const renderCommentForm = () => (
    <div className="mb-8">
      <p className="mb-2 text-sm font-medium">Give your Comments</p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your comment"
        className="h-28 w-full rounded-xl border border-neutral-300 p-4 text-sm outline-none"
      />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {/* DESKTOP: kanan | MOBILE: full */}
      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => postMutation.mutate()}
          className="w-full md:w-40"
        >
          Send
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* ================= MAIN SECTION ================= */}
      <section className="pt-8">
        <h2 className="mb-6 text-lg font-semibold">
          Comments({comments.length})
        </h2>
        {isLoading && (
          <p className="text-sm text-neutral-500">Loading comments...</p>
        )}

        {isError && (
          <p className="text-sm text-red-500">Failed to load comments</p>
        )}

        {/* FORM */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <img
              src={normalizeImageUrl(user?.avatarUrl)}
              className="h-8 w-8 rounded-full object-cover cursor-pointer"
              alt="avatar"
            />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>

          {renderCommentForm()}
        </div>

        {/* PREVIEW COMMENTS */}
        <div className="space-y-6">
          {comments.slice(0, 3).map(renderComment)}
        </div>

        {comments.length > 3 && (
          <button
            onClick={() => setIsOpen(true)}
            className="mt-6 text-sm font-semibold text-primary-300 underline cursor-pointer"
          >
            See All Comments
          </button>
        )}
      </section>

      {/* ================= MODAL ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-[90%] max-h-[90vh] bg-white rounded-t-2xl md:rounded-2xl md:w-160 p-6 flex flex-col">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Comments({comments.length})
              </h2>
              <button
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {renderCommentForm()}

            <div className="flex-1 overflow-y-auto space-y-6">
              {comments.map(renderComment)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import type { Article, PaginatedResponse } from "@/types/blog";
import Image from "next/image";

export default function MostLikedList() {
  const { data } = useQuery<PaginatedResponse<Article>>({
    queryKey: ["most-liked"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/most-liked?limit=3");
      return res.data;
    },
  });

  return (
    <div>
      <h2 className="mb-4 font-semibold">Most Liked</h2>

      <div className="flex flex-col gap-s-4xl">
        {data?.data.map((post) => (
          <div key={post.id} className="border-b pb-4">
            <h3 className="text-sm font-semibold">{post.title}</h3>
            <p className="text-sm text-neutral-600 line-clamp-2">
              {post.content}
            </p>

            <div className="mt-2 flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Image src="/Like Icon.svg" alt="like" width={14} height={14} />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <Image
                  src="/Comment Icon.svg"
                  alt="comment"
                  width={14}
                  height={14}
                />
                {post.comments}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import WritePostHeader from "@/components/write-post/writePostHeader";
import PostForm from "@/components/write-post/postForm";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { RootState } from "@/store";

export default function WritePostPage() {
  const router = useRouter();
  const { token } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (token === null) {
      router.replace("/sign-in");
    }
  }, [token, router]);

  if (token === undefined) return null;

  if (!token) return null;

  return (
    <>
      <WritePostHeader title="Write Post" />
      <PostForm mode="create" />
    </>
  );
}

"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/button";
import RichTextEditor from "@/components/write-post/richTextEditor";
import TagInput from "@/components/write-post/tagInput";
import type { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axiosInstance from "@/lib/axios";

type Mode = "create" | "edit";

export default function PostForm({
  mode,
  postId,
}: {
  mode: Mode;
  postId?: string;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [cover, setCover] = useState<File | null>(null);

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    cover?: string;
    tags?: string;
  }>({});
  const router = useRouter();
  const { token } = useSelector((s: RootState) => s.auth);

  const [loading, setLoading] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const submit = async () => {
    setErrors({});
    setLoading(true);

    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      setLoading(false);
      return;
    }

    const normalizedContent = content.replace(/<p><\/p>/g, "").trim();

    if (!normalizedContent) {
      setErrors({ content: "Content is required" });
      setLoading(false);
      return;
    }

    if (tags.length === 0) {
      setErrors({ tags: "At least one tag is required" });
      setLoading(false);
      return;
    }

    if (mode === "create" && !cover) {
      setErrors({ cover: "Cover image is required" });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", normalizedContent);
      formData.append("tags", tags.join(",")); // tanpa spasi

      if (cover) {
        formData.append("image", cover);
      }

      if (mode === "edit") {
        if (!cover && removeImage) {
          formData.append("removeImage", "true");
        }

        await axiosInstance.patch(`/posts/${postId}`, formData);
      } else {
        await axiosInstance.post("/posts", formData);
      }

      router.push("/profile/me");
    } catch (err: any) {
      console.error(err?.response?.data);

      const status = err?.response?.status;
      if (status === 400) alert("Invalid post data.");
      else if (status === 401) alert("Session expired.");
      else if (status === 403) alert("Forbidden.");
      else alert("Failed to submit post.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setCover(file);
          setErrors((p) => ({ ...p, cover: undefined }));
        }}
      />
      <main className="mx-auto w-full max-w-90 md:max-w-190 px-4 md:px-0 py-8 space-y-6">
        {/* ===== TITLE ===== */}
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none
          ${errors.title ? "border-red-400" : "border-neutral-300"}
          `}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        {/* ===== CONTENT ===== */}
        <div>
          <label className="mb-1 block text-sm font-medium">Content</label>

          <div
            className={`rounded-xl border ${
              errors.content ? "border-red-400" : "border-neutral-300"
            }`}
          >
            {/* TOOLBAR */}
            <RichTextEditor
              value={content}
              onChange={setContent}
              error={!!errors.content}
            />
          </div>

          {/* ERROR TEXT */}
          {errors.content && (
            <p className="mt-1 text-xs text-red-500">{errors.content}</p>
          )}
        </div>

        {/* ===== COVER IMAGE ===== */}
        <div>
          <label className="mb-2 block text-sm font-medium">Cover Image</label>

          {!cover ? (
            <div
              onClick={() => fileRef.current?.click()}
              className={`
                flex h-50 cursor-pointer flex-col items-center justify-center
                rounded-2xl border border-dashed
                ${errors.cover ? "border-red-400" : "border-neutral-300"}
              `}
            >
              <img src="/Featured icon.svg" className="mb-3 h-10 w-10" />

              <p className="text-sm">
                <span className="font-semibold text-primary-300">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                PNG or JPG (max. 5mb)
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-6 pt-6 pb-5">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={URL.createObjectURL(cover)}
                  alt="cover"
                  className="h-70 w-full object-cover"
                />
              </div>

              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium"
                >
                  <img src="/Phase Arrow.svg" className="h-4 w-4" />
                  Change Image
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCover(null);
                    setRemoveImage(true);}}
                  className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium text-red-500"
                >
                  <img src="/trash.svg" className="h-4 w-4" />
                  Delete Image
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-neutral-500">
                PNG or JPG (max. 5mb)
              </p>
            </div>
          )}

          {errors.cover && (
            <p className="mt-1 text-xs text-red-500">{errors.cover}</p>
          )}
        </div>

        {/* ===== TAGS ===== */}
        <TagInput
          value={tags}
          onChange={(v) => {
            setTags(v);
            setErrors((p) => ({ ...p, tags: undefined }));
          }}
          error={errors.tags}
        />

        {/* ===== SUBMIT ===== */}
        <div className="flex justify-end pt-4">
          <Button className="px-10" onClick={submit} disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Finish" : "Save"}
          </Button>
        </div>
      </main>
    </>
  );
}

"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/button";
import RichTextEditor from "@/components/write-post/richTextEditor";
import TagInput from "@/components/write-post/tagInput";

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

  const fileRef = useRef<HTMLInputElement | null>(null);

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
      <main className="mx-auto max-w-3xl px-s-4xl py-8 space-y-6">
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
            className={`rounded-xl border
      ${errors.content ? "border-red-400" : "border-neutral-300"}
    `}
          >
            {/* TOOLBAR PLACEHOLDER */}
            <div className="border-b border-neutral-200 px-3 py-2 text-xs text-neutral-500">
              Editor Toolbar
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Content</label>

              <RichTextEditor
                value={content}
                onChange={setContent}
                error={!!errors.content}
              />

              {errors.content && (
                <p className="mt-1 text-xs text-red-500">{errors.content}</p>
              )}
            </div>
          </div>

          {errors.content && (
            <p className="mt-1 text-xs text-red-500">{errors.content}</p>
          )}
        </div>

        {/* ===== COVER IMAGE ===== */}
        <div>
          <label className="mb-1 block text-sm font-medium">Cover Image</label>

          {!cover ? (
            <div
              onClick={() => fileRef.current?.click()}
              className={`
        flex h-40 cursor-pointer flex-col items-center justify-center
        rounded-xl border border-dashed
        ${errors.cover ? "border-red-400" : "border-neutral-300"}
      `}
            >
              <div className="mb-2 text-xl">⬆</div>
              <p className="text-sm">
                <span className="font-medium text-primary-300">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-neutral-500">PNG or JPG (max. 5mb)</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* PREVIEW */}
              <div className="relative overflow-hidden rounded-xl border border-neutral-200">
                <img
                  src={URL.createObjectURL(cover)}
                  alt="cover"
                  className="h-56 w-full object-cover"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="font-medium text-primary-300 underline"
                >
                  Change
                </button>

                <button
                  type="button"
                  onClick={() => setCover(null)}
                  className="font-medium text-red-500 underline"
                >
                  Remove
                </button>
              </div>
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
          <Button className="px-10">
            {mode === "create" ? "Finish" : "Save"}
          </Button>
        </div>
      </main>
    </>
  );
}

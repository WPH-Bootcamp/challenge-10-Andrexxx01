"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

import ImageExtension from "@tiptap/extension-image";

import Image from "next/image";

type Props = {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
};

export default function RichTextEditor({ value, onChange, error }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const Btn = ({
    onClick,
    icon,
    active,
  }: {
    onClick: () => void;
    icon: string;
    active?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 w-8 flex items-center justify-center rounded
        ${active ? "bg-neutral-200" : "hover:bg-neutral-100"}
      `}
    >
      <Image src={icon} alt="" width={16} height={16} />
    </button>
  );

  const Sep = () => <div className="h-5 w-px bg-neutral-300 mx-1" />;

  return (
    <div
      className={`rounded-xl border ${
        error ? "border-red-400" : "border-neutral-300"
      }`}
    >
      {/* ===== TOOLBAR ===== */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-neutral-200">
        {/* HEADING */}
        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
                ? "h2"
                : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === "h1")
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            if (v === "h2")
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            if (v === "p") editor.chain().focus().setParagraph().run();
          }}
          className="h-8 rounded-md border border-neutral-300 px-2 text-sm"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
        </select>

        <Sep />

        {/* TEXT STYLE */}
        <Btn
          icon="/btn.svg"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        />
        <Btn
          icon="/btn (1).svg"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        />
        <Btn
          icon="/italic.svg"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        />

        <Sep />

        {/* LIST */}
        <Btn
          icon="/btn (3).svg"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        />
        <Btn
          icon="/ordered.svg"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        />

        <Sep />

        {/* ALIGN */}
        <Btn
          icon="/align-left.svg"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <Btn
          icon="/align-center.svg"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <Btn
          icon="/align-right.svg"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />
        <Btn
          icon="/align-justify.svg"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        />

        <Sep />

        {/* LINK */}
        <Btn
          icon="/link.svg"
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        />
        <Btn
          icon="/btn (10).svg"
          onClick={() => editor.chain().focus().unsetLink().run()}
        />

        <Btn
          icon="/image.svg"
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        />

        {/* IMAGE */}

        <Sep />

        {/* FULLSCREEN (UI ONLY) */}
        <Btn icon="/enter.svg" onClick={() => {}} />
        <Btn icon="/locked.svg" onClick={() => {}} />
        <Sep />
        <Btn icon="/full-screen.svg" onClick={() => {}} />
      </div>

      {/* ===== CONTENT ===== */}
      <EditorContent
        editor={editor}
        className="min-h-40 px-4 py-3 text-sm focus:outline-none"
      />
    </div>
  );
}

"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function RichTextEditor({ value, onChange, error }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Enter your content",
      }),
    ],
    content: value,
    immediatelyRender: false, // ✅ FIX SSR NEXT.JS
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });


  if (!editor) return null;

  return (
    <div
      className={`overflow-hidden rounded-xl border
      ${error ? "border-red-400" : "border-neutral-300"}
    `}
    >
      {/* ===== TOOLBAR (FIGMA STYLE) ===== */}
      <div className="flex items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-4 py-2">
        <ToolbarButton
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          ••
        </ToolbarButton>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <EditorContent
        editor={editor}
        className="min-h-55 px-4 py-3 text-sm leading-relaxed outline-none"
      />
    </div>
  );

}

function ToolbarButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-8 items-center justify-center rounded-md px-2 text-sm
        ${
          active
            ? "bg-white border border-neutral-300 font-semibold"
            : "text-neutral-600 hover:bg-white"
        }
      `}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-neutral-300" />;
}

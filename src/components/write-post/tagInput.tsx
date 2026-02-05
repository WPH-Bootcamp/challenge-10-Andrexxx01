"use client";

import { useState } from "react";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}

export default function TagInput({ value, onChange, error }: Props) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) return;

    onChange([...value, tag]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Tags</label>

      <div
        className={`flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2
          ${error ? "border-red-400" : "border-neutral-300"}
        `}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-neutral-500 hover:text-neutral-800"
            >
              ×
            </button>
          </span>
        ))}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder="Add tag"
          className="flex-1 min-w-30 px-2 py-1 text-sm outline-none"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

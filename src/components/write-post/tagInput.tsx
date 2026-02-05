"use client";

import { useState } from "react";

export default function TagInput({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) return;
    onChange([...value, tag]);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">Tags</label>

      <div
        className={`
          flex flex-wrap items-center gap-2 rounded-xl border
          px-3 py-2
          ${error ? "border-red-400" : "border-neutral-300"}
        `}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="
              flex items-center gap-1 rounded-lg border
              px-2 py-1 text-sm
            "
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="text-neutral-500 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              addTag(input);
              setInput("");
            }
          }}
          placeholder="Enter your tags"
          className="flex-1 text-sm outline-none"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

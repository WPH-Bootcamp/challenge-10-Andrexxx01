"use client";

import Image from "next/image";

interface Props {
  page: number;
  lastPage: number;
  onChange: (p: number) => void;
}

export default function Pagination({ page, lastPage, onChange }: Props) {
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <div className="mt-s-6xl flex items-center justify-center gap-4">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`cursor-pointer ${page === 1 ? "opacity-30" : ""}`}
      >
        <Image src="/Previous Icon.svg" alt="prev" width={20} height={20} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-8 w-8 cursor-pointer rounded-full ${
            p === page ? "bg-primary-300 text-white" : ""
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page === lastPage}
        onClick={() => onChange(page + 1)}
        className={`cursor-pointer ${page === lastPage ? "opacity-30" : ""}`}
      >
        <Image src="/Next Icon.svg" alt="next" width={20} height={20} />
      </button>
    </div>
  );
}

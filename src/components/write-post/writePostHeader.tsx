"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

export default function WritePostHeader({ title }: { title: string }) {
  const router = useRouter();
  const { user } = useSelector((s: RootState) => s.auth);

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-s-4xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 cursor-pointer"
        >
          ←<span className="font-semibold">{title}</span>
        </button>
        <div className="flex gap-2">
          <img
          src={normalizeImageUrl(user?.avatarUrl)}
          className="h-8 w-8 rounded-full object-cover"
          />
          <span className="hidden md:block text-sm font-medium text-neutral-900">
            {user?.name}
          </span>  
        </div>
      </div>
    </header>
  );
}

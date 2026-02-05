"use client";

import Image from "next/image";

export default function StatisticModal({
  postId,
  onClose,
}: {
  postId: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-3">
          <p className="font-semibold">Statistic</p>
          <button onClick={onClose}>✕</button>
        </div>

        {/* TABS */}
        <div className="mt-4 flex gap-6 border-b">
          <button className="border-b-2 border-primary-300 pb-2 text-primary-300">
            <Image src="/Like Icon-blue.svg" alt="" width={16} height={16} />
            Like
          </button>
          <button className="pb-2 text-neutral-500">Comment</button>
        </div>

        {/* LIST */}
        <div className="mt-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-300" />
              <div>
                <p className="text-sm font-medium">User {i}</p>
                <p className="text-xs text-neutral-500">Frontend Developer</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

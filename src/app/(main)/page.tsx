/**
 * Home Page
 * 
 * TODO: Implement homepage sesuai dengan design Figma
 * - Tampilkan daftar artikel blog
 * - Implement search/filter jika diperlukan
 * - Handle loading dan error states
 */

import RecommendedList from "@/components/home/recommendedList";
import MostLikedList from "@/components/home/mostLikedList";

export default function HomePage() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-s-4xl py-s-6xl">
        {/* TITLE */}
        <h1 className="mb-s-6xl text-display-sm font-bold">
          Recommend For You
        </h1>

        {/* CONTENT */}
        <div className="flex gap-s-6xl">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            <RecommendedList />
          </div>

          {/* RIGHT SIDEBAR (DESKTOP ONLY) */}
          <div className="hidden md:block w-[320px] border-l border-neutral-200 pl-s-6xl">
            <MostLikedList />
          </div>
        </div>
      </main>
    </>
  );
}


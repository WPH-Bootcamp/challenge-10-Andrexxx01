"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../ui/button";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { logout } from "@/store/authSlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const hasKeyword = keyword.trim().length > 0;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function triggerAnimation() {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    if (isSearchOpen && !hasKeyword) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen, hasKeyword]);

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/search") return;

    const handler = setTimeout(() => {
      const value = keyword.trim();

      if (!value) {
        if (pathname === "/search") {
          router.replace("/");
        }
        return;
      }

      router.replace(`/search?query=${encodeURIComponent(value)}`);
    }, 400);

    return () => clearTimeout(handler);
  }, [keyword, router, pathname]);


  useEffect(() => {
    if (pathname !== "/search") {
      setKeyword("");
      return;
    }

    const q = searchParams.get("query") || "";
    setKeyword(q);
  }, [pathname, searchParams]);

  const avatarSrc = normalizeImageUrl(user?.avatarUrl);

  return (
    <header
      className={`
    w-full
    ${isSearchOpen ? "border-b-0" : "border-b border-neutral-300"}
    md:border-b
  `}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-s-4xl">
        <div className="flex items-center gap-s-md">
          <img src="/logo-symbol.svg" alt="Logo" className="h-7.5 w-7.5" />
          <span className="text-lg md:text-display-xs font-semibold">
            Your Logo
          </span>
        </div>

        <div className="hidden flex-1 px-s-8xl md:block">
          <div className="relative">
            <Image
              src="/Search Icon.svg"
              alt="Search"
              width={20}
              height={20}
              className="absolute left-[16px] top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search"
              className="
                  h-[48px]
                  w-full
                  rounded-xl
                  border
                  border-neutral-300
                  pl-[48px]
                  pr-[16px]
                  text-md
                  outline-none
                "
            />
          </div>
        </div>

        {!token ? (
          /* BEFORE LOGIN */
          <div className="hidden items-center gap-s-xs md:flex">
            <Link href="/sign-in">
              <Button variant="link">Login</Button>
            </Link>

            <span className="mx-s-3xl h-[24px] w-px bg-neutral-300" />

            <Link href="/sign-up">
              <Button variant="primary">Register</Button>
            </Link>
          </div>
        ) : (
          /* AFTER LOGIN */
          <div className="hidden md:flex items-center gap-s-xl relative">
            <Link
              href="/write-post"
              className="flex items-center gap-2 text-primary-300 font-semibold text-sm underline"
            >
              <Image
                src="/Write Post Icon.svg"
                alt="Write Post"
                width={24}
                height={24}
              />
              Write Post
            </Link>
            <span className="h-[24px] w-px bg-neutral-300" />

            <button
              onClick={() => setIsProfileOpen((p) => !p)}
              className="flex items-center gap-2"
            >
              <img
                src={avatarSrc}
                alt="Avatar"
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
              />
              <span className="font-medium text-neutral-900 text-sm cursor-pointer">
                {user?.name}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute left-26 top-12 w-45.5 rounded-xl border border-neutral-300 bg-white shadow-lg">
                <Link
                  href="/profile/me"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 cursor-pointer"
                >
                  <Image
                    src="/profile.svg"
                    alt="Profile"
                    width={20}
                    height={20}
                  />
                  Profile
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:text-red-600 text-sm hover:bg-neutral-50 cursor-pointer"
                >
                  <Image
                    src="/log-out.svg"
                    alt="Logout"
                    width={20}
                    height={20}
                  />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== MOBILE ===== */}
        <div className="flex items-center gap-s-3xl md:hidden">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsSearchOpen((p) => !p);
            }}
          >
            <Image
              src="/Search Icon.svg"
              alt="Search"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </button>

          {!token && (
            <button
              onClick={() => {
                triggerAnimation();
                setIsMenuOpen(true);
              }}
            >
              <Image
                src="/Menu Icon.svg"
                alt="Menu"
                width={24}
                height={24}
                className={`cursor-pointer ${
                  isAnimating ? "animate-wiggle" : ""
                }`}
              />
            </button>
          )}

          {token && (
            <button
              type="button"
              onClick={() => setIsProfileOpen((p) => !p)}
              className="flex items-center"
            >
              <img
                src={avatarSrc}
                alt="Avatar"
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
              />
            </button>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div className="relative z-50 border-t border-neutral-200 px-s-4xl py-s-3xl md:hidden">
          <div className="relative">
            <Image
              src="/Search Icon.svg"
              alt="Search"
              width={20}
              height={20}
              className="absolute left-[16px] top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search"
              className="
                h-[48px]
                w-full
                rounded-xl
                border
                border-neutral-300
                pl-[48px]
                pr-[16px]
                text-md
                outline-none
              "
            />
          </div>
        </div>
      )}

      {isSearchOpen && !hasKeyword && (
        <div
          className="
      fixed
      inset-0
      top-18
      bg-white
      z-40
      md:hidden
    "
        />
      )}

      {token && isProfileOpen && (
        <div
          className="
      fixed
      right-2
      top-17
      z-50
      w-45.5
      rounded-xl
      border
      border-neutral-300
      bg-white
      shadow-lg md:hidden
    "
        >
          <Link
            href="/profile/me"
            onClick={() => setIsProfileOpen(false)}
            className="
    flex w-full items-center gap-3 px-4 py-3 text-xs
    hover:bg-neutral-50 cursor-pointer
  "
          >
            <Image src="/profile.svg" alt="Profile" width={16} height={16} />
            Profile
          </Link>

          <button
            onClick={() => {
              dispatch(logout());
              setIsProfileOpen(false);
            }}
            className="
        flex
        w-full
        items-center
        gap-3
        px-4
        py-3
        text-xs
        hover:text-red-600
        hover:bg-neutral-50
        cursor-pointer
      "
          >
            <Image src="/log-out.svg" alt="Logout" width={16} height={16} />
            Logout
          </button>
        </div>
      )}

      {/* ================= MOBILE MENU ================= */}
      {!token && isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          {/* Header */}
          <div className="flex h-18 items-center justify-between px-s-4xl border-b border-neutral-200">
            <div className="flex items-center gap-s-md">
              <img src="/logo-symbol.svg" alt="Logo" className="h-7.5 w-7.5" />
              <span className="text-lg font-semibold">Your Logo</span>
            </div>

            <button
              onClick={() => {
                triggerAnimation();
                setIsMenuOpen(false);
              }}
            >
              <Image
                src="/close-btn.svg"
                alt="Close"
                width={24}
                height={24}
                className={`cursor-pointer ${isAnimating ? "animate-wiggle" : ""}`}
              />
            </button>
          </div>

          <div className="flex flex-col items-center gap-s-4xl pt-20">
            <Link href="/sign-in">
              <Button variant="link">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="primary">Register</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

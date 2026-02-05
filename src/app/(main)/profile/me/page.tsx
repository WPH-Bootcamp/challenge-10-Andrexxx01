"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";
import MyPostList from "@/components/profile/myPostList";
import ChangePasswordForm from "@/components/profile/changePasswordForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EditProfileModal from "@/components/profile/editProfileModal";

type Tab = "post" | "password";

export default function MyProfilePage() {
  const router = useRouter();
  const { user, token } = useSelector((s: RootState) => s.auth);
  const [tab, setTab] = useState<Tab>("post");
  const [openEditProfile, setOpenEditProfile] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/sign-in");
    }
  }, [token, router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-s-4xl py-8">
      <div className="mx-auto max-w-210">
        {/* PROFILE CARD */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-4">
            <img
              src={normalizeImageUrl(user.avatarUrl)}
              alt="avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              {user.headline && (
                <p className="text-sm text-neutral-500">{user.headline}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setOpenEditProfile(true)}
            className="text-sm font-semibold text-primary-300 cursor-pointer underline"
          >
            Edit Profile
          </button>
        </div>

        {/* TABS */}
        <div className="mt-6 flex border-b border-neutral-200 md:gap-6">
          <button
            onClick={() => setTab("post")}
            className={`flex-1 md:flex-none pb-3 text-center text-sm font-semibold cursor-pointer ${
              tab === "post"
                ? "border-b-2 border-primary-300 text-primary-300"
                : "text-neutral-500"
            }`}
          >
            Your Post
          </button>

          <button
            onClick={() => setTab("password")}
            className={`flex-1 md:flex-none pb-3 text-center text-sm font-semibold cursor-pointer ${
              tab === "password"
                ? "border-b-2 border-primary-300 text-primary-300"
                : "text-neutral-500"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-6">
          {tab === "post" && <MyPostList />}
          {tab === "password" && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
}

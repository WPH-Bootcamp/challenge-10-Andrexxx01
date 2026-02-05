"use client";

import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/axios";
import Button from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";

interface Props {
  onClose: () => void;
}

export default function EditProfileModal({ onClose }: Props) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    axiosInstance.get("/users/me").then((res) => {
      setName(res.data.name);
      setHeadline(res.data.headline ?? "");
      setAvatarUrl(res.data.avatarUrl ?? null);
    });
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("headline", headline);
      if (avatar) fd.append("avatar", avatar);

      const res = await axiosInstance.patch("/users/profile", fd);

      dispatch(setUser(res.data));
      onClose();
    } catch (e) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-90 rounded-xl bg-white p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-xl">
          ×
        </button>

        <h2 className="mb-4 text-lg font-semibold">Edit Profile</h2>

        {/* AVATAR */}
        <div className="mb-4 flex justify-center">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative h-20 w-20 cursor-pointer"
          >
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : (avatarUrl ?? "/default-avatar.svg")
              }
              className="h-20 w-20 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 rounded-full bg-primary-300 p-1 text-white text-xs">
              ✎
            </span>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
        />

        {/* NAME */}
        <label className="mb-1 block text-sm">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded-lg border px-3 py-2 text-sm"
        />

        {/* HEADLINE */}
        <label className="mb-1 block text-sm">Profile Headline</label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm"
        />

        <Button className="w-full" onClick={submit} disabled={loading}>
          {loading ? "Saving..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
}

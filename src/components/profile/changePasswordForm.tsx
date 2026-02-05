"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import Button from "@/components/ui/button";
import type { RootState } from "@/store";

export default function ChangePasswordForm() {
  const { token } = useSelector((s: RootState) => s.auth);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Session expired. Please sign in again.");
      return;
    }

    if (next !== confirm) {
      setError("Password do not match!");
      return;
    }

    try {
      await axiosInstance.patch(
        "/users/password",
        {
          currentPassword: current,
          newPassword: next,
          confirmPassword: confirm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX UTAMA
          },
        },
      );

      setSuccess("Password updated successfully");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err: any) {
      const code = err?.response?.status;

      if (code === 400) setError("New password and confirmation do not match.");
      else if (code === 401)
        setError("Current password is incorrect or session expired.");
      else if (code === 404) setError("User not found.");
      else setError("Failed to update password. Please try again.");
    }
  };

  const inputType = show ? "text" : "password";
  const eyeIcon = show ? "/eye-light.svg" : "/eye-off-light.svg";

  return (
    <div className="mt-6 space-y-4">
      {[
        ["Current Password", current, setCurrent],
        ["New Password", next, setNext],
        ["Confirm New Password", confirm, setConfirm],
      ].map(([label, value, setter]: any) => (
        <div key={label}>
          <p className="mb-1 text-sm font-medium">{label}</p>
          <div className="relative">
            <input
              type={inputType}
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShow((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Image src={eyeIcon} alt="eye" width={20} height={20} />
            </button>
          </div>
        </div>
      ))}

      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && <p className="text-xs text-green-600">{success}</p>}

      <Button className="mt-4 w-full" onClick={submit}>
        Update Password
      </Button>
    </div>
  );
}

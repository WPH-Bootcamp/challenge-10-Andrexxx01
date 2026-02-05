"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import axiosInstance from "@/lib/axios";
import Button from "@/components/ui/button";
import { setToken, setUser } from "@/store/authSlice";
import { signInSchema, SignInSchema } from "@/schemas/auth.schemas";
import type { LoginResponse } from "@/types/blog";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";


export default function SignInForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending } = useMutation<LoginResponse, AxiosError, SignInSchema>(
    {
      mutationFn: async (payload) => {
        const res = await axiosInstance.post<LoginResponse>(
          "/auth/login",
          payload,
        );
        return res.data;
      },
      onSuccess: async(data) => {
        dispatch(setToken(data.token));

        const me = await axiosInstance.get("/users/me", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      dispatch(setUser(me.data));
      router.push("/");
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        setApiError("Invalid Email/Password");
      }
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        setApiError(null);
        mutate(data);
      })}
      className="
        w-full
        max-w-95
        rounded-xl
        border
        border-neutral-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <h1 className="text-xl font-bold mb-6">Sign In</h1>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-neutral-950">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className={`
            mt-2
            h-11
            w-full
            rounded-lg
            border
            px-4
            text-sm
            outline-none placeholder:text-neutral-500 text-neutral-950
            ${errors.email ? "border-[#ee1d52]" : "border-neutral-300"}
          `}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-[#ee1d52]">{errors.email.message}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-neutral-950">
          Password
        </label>
        <div className="relative mt-2">
          <input
            {...register("password")}
            type={showPassword ? "password" : "text"}
            placeholder="Enter your password"
            className={`
              h-11
              w-full
              rounded-lg
              border
              px-4
              pr-10
              text-sm
              outline-none placeholder:text-neutral-500 text-neutral-950
              ${errors.password ? "border-[#ee1d52]" : "border-neutral-300"}
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Image
              src={showPassword ? "/eye-off-light.svg" : "/eye-light.svg"}
              alt="Toggle password visibility"
              width={20}
              height={20}
            />
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-[#ee1d52]">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* API ERROR */}
      {apiError && (
        <p className="mb-3 text-center text-xs text-[#ee1d52]">{apiError}</p>
      )}

      {/* SUBMIT */}
      <Button
        type="submit"
        className="w-full text-sm font-semibold text-neutral-25"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Login"}
      </Button>

      {/* FOOTER */}
      <p className="mt-4 text-center text-sm text-neutral-950">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-primary-300 text-sm font-semibold"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

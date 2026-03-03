"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import Button from "@/components/ui/button";
import { signUpSchema, SignUpSchema } from "@/schemas/auth.schemas";

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: SignUpSchema) => {
      const username = payload.name.toLowerCase().replace(/\s+/g, "");

      return axiosInstance.post("/auth/register", {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        username,
      });
    },
    onSuccess: () => {
      router.push("/sign-in");
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        setApiError("Name/Email has already used");
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
      <h1 className="text-xl font-bold mb-6 text-neutral-950">Sign Up</h1>

      {/* NAME */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-neutral-950">Name</label>
        <input
          {...register("name")}
          placeholder="Enter your name"
          className={`
            mt-2
            h-11
            w-full
            rounded-lg
            border
            px-4
            text-sm
            outline-none placeholder:text-neutral-500 text-neutral-950
            ${errors.name ? "border-[#ee1d52]" : "border-neutral-300"}
          `}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-[#ee1d52]">{errors.name.message}</p>
        )}
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-neutral-950">Email</label>
        <input
          {...register("email")}
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
      <div className="mb-4">
        <label className="text-sm font-semibold text-neutral-950">
          Password
        </label>
        <div className="relative mt-2">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
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
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Image
              src={showPassword ? "/eye-off-light.svg" : "/eye-light.svg"}
              alt="Toggle password"
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

      {/* CONFIRM PASSWORD */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-neutral-950">
          Confirm Password
        </label>
        <div className="relative mt-2">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter your confirm password"
            className={`
              h-11
              w-full
              rounded-lg
              border
              px-4
              pr-10
              text-sm
              outline-none placeholder:text-neutral-500 text-neutral-950
              ${errors.confirmPassword ? "border-[#ee1d52]" : "border-neutral-300"}
            `}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Image
              src={
                showConfirmPassword ? "/eye-off-light.svg" : "/eye-light.svg"
              }
              alt="Toggle confirm password"
              width={20}
              height={20}
            />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-[#ee1d52]">
            {errors.confirmPassword.message}
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
        {isPending ? "Registering..." : "Register"}
      </Button>

      {/* FOOTER */}
      <p className="mt-4 text-center text-sm text-neutral-950">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary-300 text-sm font-semibold"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

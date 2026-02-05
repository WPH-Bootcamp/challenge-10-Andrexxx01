"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "cursor-pointer font-semibold",
        variant === "link" && "text-sm text-primary-300 underline",
        variant === "primary" &&
          "h-11 rounded-full bg-primary-300 px-16 text-sm text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

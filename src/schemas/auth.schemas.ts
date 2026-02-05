import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((value) => value.includes("@") && /\.[a-zA-Z]{2,}$/.test(value), {
      message: "Email must contain '@' sign and domain name (e.g. '.com')",
    }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name must not be empty"),
    email: z
      .string()
      .min(1, "Email is required")
      .refine((value) => value.includes("@") && /\.[a-zA-Z]{2,}$/.test(value), {
        message: "Email must contain '@' sign and domain name (e.g. '.com')",
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "password and confirm password not matched!",
  });
export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
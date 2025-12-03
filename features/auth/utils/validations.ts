import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address").min(2, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export const signupSchema = z.object({
    username: z
        .string()
        .min(2, "Username is required")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
    email: z.string().email("Invalid email address").min(2, "Email is required"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

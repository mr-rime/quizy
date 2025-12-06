import { z } from "zod";

export const updateEmailSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
});

export const updateUsernameSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be at least 2 characters")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type UpdateEmailSchema = z.infer<typeof updateEmailSchema>;
export type UpdateUsernameSchema = z.infer<typeof updateUsernameSchema>;
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

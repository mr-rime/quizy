'use server'

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSessionCookie } from "../../auth/services/session";
import { updateEmailSchema, updateUsernameSchema, updatePasswordSchema } from "../utils/validations";
import { compare, hash } from "bcryptjs";
import { revalidateTag } from "next/cache";

export async function updateUserEmail(email: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const session = await getSessionCookie(token);

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validatedData = updateEmailSchema.parse({ email });

        const [existingUser] = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.email, validatedData.email),
                    ne(users.id, session.userId)
                )
            );

        if (existingUser) {
            return { success: false, error: "Email already in use" };
        }

        await db
            .update(users)
            .set({ email: validatedData.email })
            .where(eq(users.id, session.userId));

        revalidateTag("user", "max");
        revalidateTag("current-user", "max");

        return { success: true };
    } catch (error) {
        console.error("Update email error:", error);
        return { success: false, error: "Failed to update email" };
    }
}

export async function updateUsername(username: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const session = await getSessionCookie(token);

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validatedData = updateUsernameSchema.parse({ username });

        const [existingUser] = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.username, validatedData.username),
                    ne(users.id, session.userId)
                )
            );

        if (existingUser) {
            return { success: false, error: "Username already taken" };
        }

        await db
            .update(users)
            .set({ username: validatedData.username })
            .where(eq(users.id, session.userId));

        revalidateTag("user", "max");
        revalidateTag("current-user", "max");

        return { success: true };
    } catch (error) {
        console.error("Update username error:", error);
        return { success: false, error: "Failed to update username" };
    }
}

export async function updatePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const session = await getSessionCookie(token);

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validatedData = updatePasswordSchema.parse({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, session.userId));

        if (!user || !user.password) {
            return { success: false, error: "User not found" };
        }

        const isPasswordValid = await compare(validatedData.currentPassword, user.password);
        if (!isPasswordValid) {
            return { success: false, error: "Current password is incorrect" };
        }

        const hashedPassword = await hash(validatedData.newPassword, 10);

        await db
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, session.userId));

        return { success: true };
    } catch (error) {
        console.error("Update password error:", error);
        return { success: false, error: "Failed to update password" };
    }
}

"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserId } from "./user";
import { revalidateTag } from "next/cache";

export async function updateAudioPreference(playAudioOnProgress: boolean) {
    try {
        const userId = await getUserId();

        await db
            .update(users)
            .set({
                playAudioOnProgress,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId));

        revalidateTag("user", "max");
        revalidateTag("current-user", "max");

        return { success: true };
    } catch (error) {
        console.error("Failed to update audio preference:", error);
        return { success: false, error: "Failed to update preference" };
    }
}

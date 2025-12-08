"use server";

import { db } from "@/db/drizzle";
import { flashcardSets } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { eq, and } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function togglePublishSet(setId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const session = await getSessionCookie(token);

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const set = await db.query.flashcardSets.findFirst({
            where: and(
                eq(flashcardSets.id, setId),
                eq(flashcardSets.userId, session.userId)
            ),
        });

        if (!set) {
            return { success: false, error: "Set not found" };
        }

        const newPublishedState = !set.isPublished;

        const isPublic = newPublishedState ? true : set.isPublic;

        await db.update(flashcardSets)
            .set({
                isPublished: newPublishedState,
                isPublic: isPublic
            })
            .where(eq(flashcardSets.id, setId));

        revalidatePath(`/practice/${setId}`);
        revalidatePath("/latest");
        revalidatePath("/discover");
        revalidateTag("flashcard-sets", "max");
        revalidateTag("flashcard-set", "max");

        return {
            success: true,
            isPublished: newPublishedState,
            isPublic: isPublic
        };
    } catch (error) {
        console.error("Error toggling publish status:", error);
        return { success: false, error: "Failed to update publish status" };
    }
}

"use server"

import { db } from "@/db/drizzle";
import { flashcardSets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { getUserId } from "@/features/user/services/user";


export async function makeSetPrivate(setId: string) {
    try {
        const userId = await getUserId();

        await requireAdmin(userId);

        await db.update(flashcardSets)
            .set({ isPublic: false })
            .where(eq(flashcardSets.id, setId));

        revalidatePath("/discover");
        revalidatePath(`/practice/${setId}`);
        revalidatePath("/");

        revalidateTag("discover-sets", "max");
        revalidateTag("public-sets", "max");
        revalidateTag("flashcard-set", "max");
        revalidateTag(`set-${setId}`, "max");

        return { success: true };
    } catch (error) {
        console.error("Error making set private:", error);

        if (error instanceof Error && error.message.includes("Admin")) {
            return { success: false, error: "Unauthorized: Admin access required" };
        }

        return { success: false, error: "Failed to make set private" };
    }
}

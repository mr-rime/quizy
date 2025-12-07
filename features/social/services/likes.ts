"use server"

import { db } from "@/db/drizzle";
import { flashcardSets, setLikes } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { getUserId } from "@/features/user/services/user";

export async function likeSet(setId: string) {
    try {
        const userId = await getUserId();

        // Check if user has already liked this set
        const existingLike = await db.select()
            .from(setLikes)
            .where(and(
                eq(setLikes.setId, setId),
                eq(setLikes.userId, userId)
            ))
            .limit(1);

        if (existingLike.length > 0) {
            // User has already liked, so unlike
            return await unlikeSet(setId);
        }

        // User hasn't liked, so add the like
        await db.insert(setLikes).values({
            setId,
            userId,
        });

        // Increment the like count
        await db.update(flashcardSets)
            .set({
                likeCount: sql`${flashcardSets.likeCount} + 1`,
            })
            .where(eq(flashcardSets.id, setId));

        revalidateTag(`set-${setId}`, "max");
        revalidateTag("discover-sets", "max");
        revalidateTag("flashcard-set", "max");
        revalidateTag("flashcard-sets", "max");
        revalidateTag("public-sets", "max");

        return { success: true, liked: true };
    } catch (error) {
        console.error("Error toggling like:", error);
        return { success: false, error: "Failed to like set" };
    }
}

export async function unlikeSet(setId: string) {
    try {
        const userId = await getUserId();

        // Remove the like
        await db.delete(setLikes)
            .where(and(
                eq(setLikes.setId, setId),
                eq(setLikes.userId, userId)
            ));

        // Decrement the like count
        await db.update(flashcardSets)
            .set({
                likeCount: sql`GREATEST(${flashcardSets.likeCount} - 1, 0)`,
            })
            .where(eq(flashcardSets.id, setId));

        revalidateTag(`set-${setId}`, "max");
        revalidateTag("discover-sets", "max");
        revalidateTag("flashcard-set", "max");
        revalidateTag("flashcard-sets", "max");
        revalidateTag("public-sets", "max");

        return { success: true, liked: false };
    } catch (error) {
        console.error("Error unliking set:", error);
        return { success: false, error: "Failed to unlike set" };
    }
}

export async function getLikeCount(setId: string) {
    try {
        const result = await db.select({ likeCount: flashcardSets.likeCount })
            .from(flashcardSets)
            .where(eq(flashcardSets.id, setId))
            .limit(1);

        return result[0]?.likeCount || 0;
    } catch (error) {
        console.error("Error getting like count:", error);
        return 0;
    }
}

export async function isSetLikedByUser(setId: string, userId: string) {
    try {
        const result = await db.select()
            .from(setLikes)
            .where(and(
                eq(setLikes.setId, setId),
                eq(setLikes.userId, userId)
            ))
            .limit(1);

        return result.length > 0;
    } catch (error) {
        console.error("Error checking if set is liked:", error);
        return false;
    }
}

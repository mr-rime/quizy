"use server"

import { db } from "@/db/drizzle";
import { savedSets, flashcardSets } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserId } from "@/features/user/services/user";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

export async function saveSet(setId: string) {
    const userId = await getUserId();

    const set = await db.query.flashcardSets.findFirst({
        where: and(
            eq(flashcardSets.id, setId),
            eq(flashcardSets.isPublic, true)
        ),
    });

    if (!set) {
        return { success: false, error: "Set not found or not public" };
    }

    try {
        await db.insert(savedSets).values({
            userId,
            setId,
        }).onConflictDoNothing();

        revalidatePath("/saved", "page");
        revalidateTag("saved-sets", "max");

        return { success: true };
    } catch (error) {
        console.error("Error saving set:", error);
        return { success: false, error: "Failed to save set" };
    }
}


export async function unsaveSet(setId: string) {
    const userId = await getUserId();

    try {
        await db.delete(savedSets).where(
            and(
                eq(savedSets.userId, userId),
                eq(savedSets.setId, setId)
            )
        );

        revalidatePath("/saved", "page");
        revalidateTag("saved-sets", "max");

        return { success: true };
    } catch (error) {
        console.error("Error unsaving set:", error);
        return { success: false, error: "Failed to unsave set" };
    }
}


export const getSavedSets = unstable_cache(
    async (userId: string) => {
        const saved = await db.query.savedSets.findMany({
            where: eq(savedSets.userId, userId),
            with: {
                set: {
                    with: {
                        cards: true,
                        user: {
                            columns: {
                                id: true,
                                username: true,
                                image: true,
                            }
                        }
                    }
                }
            },
            orderBy: (savedSets, { desc }) => [desc(savedSets.createdAt)],
        });

        return saved.filter(item => item.set?.isPublic).map(item => item.set);
    },
    ["saved-sets"],
    {
        revalidate: 3600,
        tags: ["saved-sets"]
    }
);


export async function isSetSaved(setId: string): Promise<boolean> {
    try {
        const userId = await getUserId();

        const saved = await db.query.savedSets.findFirst({
            where: and(
                eq(savedSets.userId, userId),
                eq(savedSets.setId, setId)
            ),
        });

        return !!saved;
    } catch {
        return false;
    }
}

"use server"

import { db } from "@/db/drizzle";
import { flashcardSets } from "@/db/schema";
import { eq } from "drizzle-orm";

import { and } from "drizzle-orm";
import { getCurrentUser, getUserId } from "@/features/user/services/user";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";

export const getFlashcardSet = unstable_cache(
    async (id: string, userId: string) => {
        if (!id) {
            console.error("ID is undefined or null");
            return null;
        }

        const set = await db.query.flashcardSets.findFirst({
            where: and(
                eq(flashcardSets.id, id),
                eq(flashcardSets.userId, userId)
            ),
            with: {
                cards: true,
            },
        });

        return set;
    },
    ["flashcard-set"],
    {
        revalidate: 3600,
        tags: ["flashcard-set"]
    }
);

export const getFlashcardSets = unstable_cache(
    async (userId: string) => {
        if (!userId) return [];

        const sets = await db.query.flashcardSets.findMany({
            where: eq(flashcardSets.userId, userId),
            with: {
                cards: true,
                user: true,
            },
            orderBy: (sets, { desc }) => [desc(sets.createdAt)],
        });
        return sets;
    },
    ["flashcard-sets"],
    {
        revalidate: 3600,
        tags: ["flashcard-sets"]
    }
);

export async function getFlashcardSetsClient() {
    const userId = await getUserId();
    return getFlashcardSets(userId);
}

export async function deleteFlashcardSet(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) return {
        success: false,
        error: "Unauthorized"
    };


    await db
        .delete(flashcardSets)
        .where(
            and(
                eq(flashcardSets.id, id),
                eq(flashcardSets.userId, currentUser.id)
            )
        );

    revalidatePath("/library");
    revalidatePath("/");
    revalidatePath(`/practice/${id}`);
    revalidatePath("/latest");

    revalidateTag("flashcard-sets", "max");
    revalidateTag("flashcard-set", "max");
    revalidateTag("recent-sets", "max");
    redirect("/latest");
}

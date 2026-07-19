"use server"

import { db } from "@/db/drizzle";
import { flashcardSets, users } from "@/db/schema";
import { eq, and, ilike, ne } from "drizzle-orm";
import { getCurrentUser, getUserId } from "@/features/user/services/user";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";

export const getFlashcardSet = unstable_cache(
    async (id: string) => {
        if (!id) return null;

        return db.query.flashcardSets.findFirst({
            where: eq(flashcardSets.id, id),
            with: {
                cards: true,
                user: {
                    columns: {
                        id: true,
                        username: true,
                        image: true,
                    },
                },
                folderSets: {
                    with: {
                        folder: true,
                    },
                },
            },
        });
    },
    ["flashcard-set"],
    {
        revalidate: 60,
        tags: ["flashcard-set"],
    }
);

export const getFlashcardSets = unstable_cache(
    async (limit: number = 20, offset: number = 0) => {
        return db.query.flashcardSets.findMany({
            with: {
                cards: true,
                user: true,
            },
            orderBy: (sets, { desc }) => [desc(sets.createdAt)],
            limit,
            offset,
        });
    },
    ["flashcard-sets"],
    {
        revalidate: 3600,
        tags: ["flashcard-sets"],
    }
);

export async function getFlashcardSetsClient() {
    return getFlashcardSets();
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
    revalidateTag("discover-sets", "max");
    revalidateTag("public-sets", "max");
    revalidateTag("saved-sets", "max");
    revalidateTag("favorites", "max");
    revalidateTag("user-profile", "max");

    revalidatePath("/", "layout");

    redirect("/latest");
}

export async function searchUserFlashcardSets(query: string = "", limit: number = 50) {
    const userId = await getUserId();
    if (!userId) return [];

    const sets = await db.query.flashcardSets.findMany({
        where: and(
            eq(flashcardSets.userId, userId),
            ilike(flashcardSets.title, `%${query}%`)
        ),
        with: {
            cards: true,
            user: true,
        },
        orderBy: (sets, { desc }) => [desc(sets.createdAt)],
        limit: limit,
    });
    return sets;
}

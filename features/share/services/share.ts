"use server"

import { db } from "@/db/drizzle";
import { flashcardSets, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserId } from "@/features/user/services/user";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

/**
 * Toggle the public/private status of a flashcard set
 */
export async function toggleSetPrivacy(setId: string, isPublic: boolean) {
    const userId = await getUserId();

    const result = await db
        .update(flashcardSets)
        .set({ isPublic })
        .where(
            and(
                eq(flashcardSets.id, setId),
                eq(flashcardSets.userId, userId)
            )
        )
        .returning();

    revalidatePath(`/practice/${setId}`, "page");
    revalidatePath(`/share/${setId}`, "page");
    revalidatePath("/library", "page");
    revalidatePath("/latest", "page");
    revalidateTag("flashcard-set", "max");
    revalidateTag("flashcard-sets", "max");
    revalidateTag("public-sets", "max");

    return { success: true, set: result[0] };
}


export const getPublicSet = unstable_cache(
    async (setId: string) => {
        const set = await db.query.flashcardSets.findFirst({
            where: and(
                eq(flashcardSets.id, setId),
                eq(flashcardSets.isPublic, true)
            ),
            with: {
                cards: true,
                user: {
                    columns: {
                        id: true,
                        username: true,
                        image: true,
                        createdAt: true,
                    }
                }
            },
        });

        return set;
    },
    ["public-set"],
    {
        revalidate: 3600,
        tags: ["public-set", "flashcard-set"]
    }
);


export const getUserPublicSets = unstable_cache(
    async (userId: string) => {
        const sets = await db.query.flashcardSets.findMany({
            where: and(
                eq(flashcardSets.userId, userId),
                eq(flashcardSets.isPublic, true)
            ),
            with: {
                cards: true,
            },
            orderBy: (sets, { desc }) => [desc(sets.createdAt)],
        });

        return sets;
    },
    ["user-public-sets"],
    {
        revalidate: 3600,
        tags: ["public-sets"]
    }
);

export async function generateShareUrl(setId: string): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    return `${baseUrl}/share/${setId}`;
}


export const getUserProfile = unstable_cache(
    async (userId: string) => {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                id: true,
                username: true,
                image: true,
                createdAt: true,
            }
        });

        if (!user) return null;

        const publicSets = await getUserPublicSets(userId);
        const totalCards = publicSets.reduce((sum, set) => sum + set.cards.length, 0);

        return {
            ...user,
            publicSetsCount: publicSets.length,
            totalCardsCreated: totalCards,
        };
    },
    ["user-profile"],
    {
        revalidate: 3600,
        tags: ["user-profile"]
    }
);

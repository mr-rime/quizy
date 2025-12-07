"use server"

import { db } from "@/db/drizzle";
import { favorites } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { revalidateTag, revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";
import { createRateLimiter } from "@/lib/rate-limit";
import { isRateLimitError } from "@/types";

const favoriteLimiter = createRateLimiter({
    points: 30,
    duration: 60,
    keyPrefix: "toggle-favorite"
});

export async function toggleFavorite(cardId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const session = await getSessionCookie(token);

        if (!session) {
            throw new Error("Unauthorized");
        }

        await favoriteLimiter.consume(session.userId);

        const [existingFavorite] = await db
            .select()
            .from(favorites)
            .where(
                and(
                    eq(favorites.userId, session.userId),
                    eq(favorites.cardId, cardId)
                )
            );


        if (existingFavorite) {
            await db.delete(favorites).where(eq(favorites.id, existingFavorite.id));
        } else {
            await db.insert(favorites).values({
                userId: session.userId,
                cardId: cardId,
            });
        }

        revalidatePath("/favorites");

        revalidateTag("favorites", "max");
        revalidateTag("flashcard-set", "max");
    } catch (error) {
        if (isRateLimitError(error)) {
            const retryAfterSec = Math.ceil(error.msBeforeNext / 1000);
            throw new Error(`Too many favorites. Please wait ${retryAfterSec} seconds before trying again.`);
        }
        throw error;
    }
}

export const getFavorites = unstable_cache(
    async (userId: string) => {
        const userFavorites = await db.query.favorites.findMany({
            where: eq(favorites.userId, userId),
            with: {
                card: true,
            },
        });

        return userFavorites.map(f => f.card);
    },
    ["favorites"],
    {
        revalidate: 3600,
        tags: ["favorites"]
    }
);

export async function isFavorite(cardId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);

    if (!session) {
        return false;
    }

    const [favorite] = await db
        .select()
        .from(favorites)
        .where(
            and(
                eq(favorites.userId, session.userId),
                eq(favorites.cardId, cardId)
            )
        );

    return !!favorite;
}

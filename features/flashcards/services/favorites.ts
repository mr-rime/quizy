"use server"

import { db } from "@/db/drizzle";
import { favorites } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { revalidateTag, revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";

export async function toggleFavorite(cardId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);

    if (!session) {
        throw new Error("Unauthorized");
    }

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

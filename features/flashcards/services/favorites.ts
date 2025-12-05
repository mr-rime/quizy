"use server"

import { db } from "@/db/drizzle";
import { favorites, cards } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
    // We might want to revalidate the practice page too, but we don't know the set ID here easily without another query.
    // However, the client component will likely update its local state optimistically or re-fetch.
}

export async function getFavorites() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);

    if (!session) {
        return [];
    }

    const userFavorites = await db.query.favorites.findMany({
        where: eq(favorites.userId, session.userId),
        with: {
            card: true,
        },
    });

    return userFavorites.map(f => f.card);
}

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

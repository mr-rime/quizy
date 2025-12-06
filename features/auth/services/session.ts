import { db } from "@/db/drizzle";
import { sessions } from "@/db/schema";
import { randomUUID } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const [session] = await db
        .insert(sessions)
        .values({
            userId,
            token,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
            expiresAt,
        })
        .returning({ token: sessions.token, expiresAt: sessions.expiresAt });

    return session;
}



const getSessionCookieCached = unstable_cache(
    async (token: string) => {
        const [session] = await db
            .select({
                userId: sessions.userId,
                expiresAt: sessions.expiresAt,
            })
            .from(sessions)
            .where(
                and(
                    eq(sessions.token, token),
                    gt(sessions.expiresAt, new Date())
                )
            )
            .limit(1);

        return session || null;
    },
    ["session"],
    {
        revalidate: 300,
        tags: ["session"]
    }
);

export const getSessionCookie = cache(async (token: string | undefined) => {
    if (!token) return null;
    return getSessionCookieCached(token);
});
import { db } from "@/db/drizzle";
import { sessions } from "@/db/schema";
import { randomUUID } from "crypto";
import { and, eq, gt } from "drizzle-orm";

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


export async function getSessionCookie(token: string | undefined) {
    if (!token) return null;

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
}
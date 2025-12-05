'use server';

import { db } from "@/db/drizzle";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function logout(token?: string) {
    if (!token) return;

    await db
        .delete(sessions)
        .where(eq(sessions.token, token));
}

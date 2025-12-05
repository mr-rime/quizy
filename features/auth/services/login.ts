'use server'

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { compare } from "bcryptjs";
import { createSession } from "./session";
import { eq } from "drizzle-orm";

export async function login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) return { user: null, session: null };

    const isPasswordValid = await compare(password, user.password!);
    if (!isPasswordValid) return { user: null, session: null };

    const session = await createSession(user.id, ipAddress, userAgent);

    return { user, session };
}
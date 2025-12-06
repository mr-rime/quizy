import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { User } from "@/types/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSessionCookie } from "../../auth/services/session";


export async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);
    if (!session) throw new Error("Unauthorized");
    return session.userId;
}


export async function getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user as User || null;
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) return null;

    const session = await getSessionCookie(token);

    if (!session) return null;

    const [user] = await db.select().from(users).where(eq(users.id, session.userId));

    return user as User || null;
}

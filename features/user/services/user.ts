import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { User } from "@/types/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSessionCookie } from "../../auth/services/session";
import { cache } from "react";
import { unstable_cache } from "next/cache";


export async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);
    if (!session) throw new Error("Unauthorized");
    return session.userId;
}



const getUserByEmailCached = unstable_cache(
    async (email: string): Promise<User | null> => {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user as User || null;
    },
    ["user-by-email"],
    {
        revalidate: 900, // 15 minutes
        tags: ["user"]
    }
);

export const getUserByEmail = cache(getUserByEmailCached);


const getCurrentUserCached = unstable_cache(
    async (userId: string): Promise<User | null> => {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        return user as User || null;
    },
    ["current-user"],
    {
        revalidate: 300,
        tags: ["user"]
    }
);

export const getCurrentUser = cache(async (): Promise<User | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) return null;

    const session = await getSessionCookie(token);

    if (!session) return null;

    return getCurrentUserCached(session.userId);
});

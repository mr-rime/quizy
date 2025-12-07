import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function isAdmin(userId: string): Promise<boolean> {
    try {
        const [user] = await db
            .select({ role: users.role })
            .from(users)
            .where(eq(users.id, userId));

        return user?.role === "admin";
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}

export async function requireAdmin(userId: string): Promise<void> {
    const admin = await isAdmin(userId);
    if (!admin) {
        throw new Error("Unauthorized: Admin access required");
    }
}

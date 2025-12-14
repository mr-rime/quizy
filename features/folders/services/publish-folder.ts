"use server";

import { db } from "@/db/drizzle";
import { folders } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { eq, and } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function togglePublishFolder(folderId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const session = await getSessionCookie(token);

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const folder = await db.query.folders.findFirst({
            where: and(
                eq(folders.id, folderId),
                eq(folders.userId, session.userId)
            ),
        });

        if (!folder) {
            return { success: false, error: "Folder not found" };
        }

        const newPublishedState = !folder.isPublished;
        const isPublic = newPublishedState ? true : folder.isPublic;

        await db.update(folders)
            .set({
                isPublished: newPublishedState,
                isPublic: isPublic
            })
            .where(eq(folders.id, folderId));

        revalidatePath(`/folders/${folderId}`);
        revalidatePath("/folders");
        revalidatePath("/discover");
        revalidateTag("folders", "max");
        revalidateTag("folder", "max");
        revalidateTag("discover-folders", "max");

        return {
            success: true,
            isPublished: newPublishedState,
            isPublic: isPublic
        };
    } catch (error) {
        console.error("Error toggling publish status:", error);
        return { success: false, error: "Failed to update publish status" };
    }
}

"use server"

import { db } from "@/db/drizzle";
import { folders, folderSets, flashcardSets } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createFolderSchema, CreateFolderSchema, UpdateFolderSchema } from "../utils/validations";

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);
    if (!session) throw new Error("Unauthorized");
    return session.userId;
}

export async function createFolder(data: CreateFolderSchema) {
    const userId = await getUserId();
    const validated = createFolderSchema.parse(data);

    const [newFolder] = await db.insert(folders).values({
        title: validated.title,
        description: validated.description,
        userId,
    }).returning();

    revalidatePath("/folders");
    return newFolder;
}

export async function getFolders() {
    const userId = await getUserId();
    return db.query.folders.findMany({
        where: eq(folders.userId, userId),
        orderBy: [desc(folders.createdAt)],
        with: {
            folderSets: {
                with: {
                    set: true
                }
            }
        }
    });
}

export async function getFolder(id: string) {
    const userId = await getUserId();
    const folder = await db.query.folders.findFirst({
        where: and(eq(folders.id, id), eq(folders.userId, userId)),
        with: {
            folderSets: {
                with: {
                    set: {
                        with: {
                            user: true,
                            cards: true
                        }
                    }
                }
            }
        }
    });
    return folder;
}

export async function updateFolder(id: string, data: UpdateFolderSchema) {
    const userId = await getUserId();
    await db.update(folders)
        .set(data)
        .where(and(eq(folders.id, id), eq(folders.userId, userId)));
    revalidatePath(`/folders/${id}`);
    revalidatePath("/folders");
}

export async function deleteFolder(id: string) {
    const userId = await getUserId();
    await db.delete(folders).where(and(eq(folders.id, id), eq(folders.userId, userId)));
    revalidatePath("/folders");
}

export async function addSetToFolder(folderId: string, setId: string) {
    const userId = await getUserId();
    // Verify ownership
    const folder = await db.query.folders.findFirst({
        where: and(eq(folders.id, folderId), eq(folders.userId, userId)),
    });
    if (!folder) throw new Error("Folder not found");

    await db.insert(folderSets).values({
        folderId,
        setId,
    }).onConflictDoNothing();

    revalidatePath(`/folders/${folderId}`);
}

export async function removeSetFromFolder(folderId: string, setId: string) {
    const userId = await getUserId();
    const folder = await db.query.folders.findFirst({
        where: and(eq(folders.id, folderId), eq(folders.userId, userId)),
    });
    if (!folder) throw new Error("Folder not found");

    await db.delete(folderSets)
        .where(and(eq(folderSets.folderId, folderId), eq(folderSets.setId, setId)));

    revalidatePath(`/folders/${folderId}`);
}

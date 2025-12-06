"use server"

import { db } from "@/db/drizzle";
import { folders, folderSets } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { createFolderSchema, CreateFolderSchema, UpdateFolderSchema } from "../utils/validations";
import { getUserId } from "@/features/user/services/user";


export async function createFolder(data: CreateFolderSchema) {
    const userId = await getUserId();
    const validated = createFolderSchema.parse(data);

    const [newFolder] = await db.insert(folders).values({
        title: validated.title,
        description: validated.description,
        userId,
    }).returning();

    revalidatePath("/folders");
    revalidateTag("folders", "max");
    revalidateTag("folder", "max");
    return newFolder;
}

export async function getFolders(userId: string) {
    if (!userId) return [];

    const userFolders = await db.query.folders.findMany({
        where: eq(folders.userId, userId),
        orderBy: [desc(folders.createdAt)],
    });

    const folderIds = userFolders.map(f => f.id);
    const setsInFolders = await db.query.folderSets.findMany({
        where: inArray(folderSets.folderId, folderIds),
        with: { set: true },
    });

    return userFolders.map(folder => ({
        ...folder,
        folderSets: setsInFolders.filter(fs => fs.folderId === folder.id),
    }));
}

export async function getFolder(id: string, userId: string) {
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

"use server"

import { db } from "@/db/drizzle";
import { folders, folderSets, users } from "@/db/schema";
import { eq, and, desc, inArray, or, ne, exists, asc } from "drizzle-orm";

import { revalidatePath, revalidateTag } from "next/cache";
import { createFolderSchema, CreateFolderSchema, UpdateFolderSchema } from "../utils/validations";
import { getUserId } from "@/features/user/services/user";
import { unstable_cache } from "next/cache";
import { isAdmin } from "@/lib/auth-helpers";


export async function createFolder(data: CreateFolderSchema) {
    const userId = await getUserId();
    const validated = createFolderSchema.parse(data);

    const admin = await isAdmin(userId);

    const existingFolders = await db.query.folders.findMany({
        where: eq(folders.userId, userId),
    });

    if (!admin && existingFolders.length >= 4) {
        throw new Error("You can only create up to 4 folders. Delete an existing folder to create a new one.");
    }

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
    return unstable_cache(
        async () => {
            if (!userId) return [];

            const userFolders = await db.query.folders.findMany({
                where: eq(folders.userId, userId),
                orderBy: [asc(folders.order), desc(folders.createdAt)],
            });

            if (userFolders.length === 0) return [];

            const folderIds = userFolders.map(f => f.id);
            const setsInFolders = await db.query.folderSets.findMany({
                where: inArray(folderSets.folderId, folderIds),
                with: { set: true },
            });

            return userFolders.map(folder => ({
                ...folder,
                folderSets: setsInFolders
                    .filter(fs => fs.folderId === folder.id)
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            }));
        },
        ["folders", userId],
        {
            revalidate: 60,
            tags: ["folders"]
        }
    )();
}

export async function getFolder(id: string, userId: string) {
    return unstable_cache(
        async () => {
            const folder = await db.query.folders.findFirst({
                where: eq(folders.id, id),
                with: {
                    folderSets: {
                        with: {
                            set: {
                                with: {
                                    user: true,
                                    cards: true
                                }
                            }
                        },
                        orderBy: [asc(folderSets.order)]
                    }
                }
            });

            if (!folder) return undefined;

            // Owner access
            if (folder.userId === userId) return folder;

            // Public access check
            if (folder.isPublic) {
                const owner = await db.query.users.findFirst({
                    where: eq(users.id, folder.userId),
                    columns: { role: true }
                });

                if (owner?.role === "admin") {
                    const viewerIsAdmin = await isAdmin(userId);
                    if (!viewerIsAdmin) return undefined;
                }
                return folder;
            }

            return undefined;
        },
        ["folder", id, userId],
        {
            revalidate: 60,
            tags: ["folder"]
        }
    )();
}


export async function updateFolder(id: string, data: UpdateFolderSchema) {
    const userId = await getUserId();
    await db.update(folders)
        .set(data)
        .where(and(eq(folders.id, id), eq(folders.userId, userId)));
    revalidatePath("/folders");
    revalidatePath(`/folders/${id}`);
    revalidateTag("folder", "max");
    revalidateTag("folders", "max");
    revalidateTag("discover-folders", "max");
}

export async function deleteFolder(id: string) {
    const userId = await getUserId();
    await db.delete(folders).where(and(eq(folders.id, id), eq(folders.userId, userId)));
    revalidatePath("/folders");
    revalidateTag("folder", "max");
    revalidateTag("folders", "max");
    revalidateTag("discover-folders", "max");
}

export async function addSetToFolder(folderId: string, setId: string) {
    const userId = await getUserId();
    const folder = await db.query.folders.findFirst({
        where: and(eq(folders.id, folderId), eq(folders.userId, userId)),
    });
    if (!folder) throw new Error("Folder not found");

    await db.insert(folderSets).values({
        folderId,
        setId,
    }).onConflictDoNothing();

    revalidatePath(`/folders/${folderId}`);
    revalidatePath("/library");
    revalidateTag("folder", "max");
    revalidateTag("folders", "max");
    revalidateTag("discover-folders", "max");
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
    revalidatePath("/library");
    revalidateTag("folder", "max");
    revalidateTag("folders", "max");
    revalidateTag("discover-folders", "max");
}

export async function updateFolderSetsOrder(folderId: string, setIds: string[]) {
    const userId = await getUserId();
    const folder = await db.query.folders.findFirst({
        where: and(eq(folders.id, folderId), eq(folders.userId, userId)),
    });
    if (!folder) throw new Error("Folder not found or unauthorized");

    await db.transaction(async (tx) => {
        for (let i = 0; i < setIds.length; i++) {
            await tx.update(folderSets)
                .set({ order: i })
                .where(and(eq(folderSets.folderId, folderId), eq(folderSets.setId, setIds[i])));
        }
    });

    revalidatePath(`/folders/${folderId}`);
    revalidateTag("folder", "max");
}

export async function updateFoldersOrder(folderIds: string[]) {
    const userId = await getUserId();

    await db.transaction(async (tx) => {
        for (let i = 0; i < folderIds.length; i++) {
            await tx.update(folders)
                .set({ order: i })
                .where(and(eq(folders.id, folderIds[i]), eq(folders.userId, userId)));
        }
    });

    revalidatePath("/library");
    revalidatePath("/folders");
    revalidateTag("folders", "max");
}


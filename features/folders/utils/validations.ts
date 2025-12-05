import { z } from "zod";

export const createFolderSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().max(500, "Description is too long").optional(),
});

export type CreateFolderSchema = z.infer<typeof createFolderSchema>;

export const updateFolderSchema = createFolderSchema.partial();
export type UpdateFolderSchema = z.infer<typeof updateFolderSchema>;

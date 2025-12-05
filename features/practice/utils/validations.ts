import { z } from "zod";

export const editFlashcardSchema = z.object({
    term: z.string().min(1, "Term is required"),
    definition: z.string().optional(),
});

export type EditFlashcardSchema = z.infer<typeof editFlashcardSchema>;

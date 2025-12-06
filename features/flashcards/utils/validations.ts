import z from "zod";

export const createFlashcardSetSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    isPublic: z.boolean().optional().default(false),
    flashcards: z.array(z.object({
        term: z.string().min(1, "Term is required"),
        definition: z.string().optional(),
        image: z.string().optional(),
    }))
});
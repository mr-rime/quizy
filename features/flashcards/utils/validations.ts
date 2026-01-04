import z from "zod";

export const createFlashcardSetSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(200, "Title must be 200 characters or less"),
    description: z.string()
        .max(500, "Description must be 500 characters or less")
        .optional(),
    isPublic: z.boolean().optional().default(false),
    sourceLanguage: z.string().default("en"),
    targetLanguage: z.string().default("ar"),
    flashcards: z.array(z.object({
        term: z.string()
            .min(1, "Term is required")
            .max(200, "Term must be 200 characters or less"),
        definition: z.string()
            .min(1, "Definition is required")
            .max(1000, "Definition must be 1000 characters or less"),
        image: z.string().optional(),
        examples: z.array(z.object({
            english: z.string(),
            arabic: z.string()
        })).optional(),
    }))
});
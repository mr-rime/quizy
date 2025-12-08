"use client";

import { useEffect, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FlashcardFormData } from "../components/flashcard-form";

export function useSetDraft(setId?: string) {
    const { control, reset } = useFormContext<FlashcardFormData>();
    const values = useWatch({ control });

    if (setId) {
        return { clearDraft: () => { } };
    }


    const draftKey = "create-set-draft";

    useEffect(() => {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                reset(parsedDraft);
                toast.info("Restored draft from local storage");
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, [draftKey, reset]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const hasContent = values.title || values.description || (values.flashcards && values.flashcards.some(f => f.term || f.definition));

            if (hasContent) {
                localStorage.setItem(draftKey, JSON.stringify(values));
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [values, draftKey]);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(draftKey);
    }, [draftKey]);

    return { clearDraft };
}

"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FlashcardFormData } from "./flashcard-form";

export function AutoSaveDraft({ setId }: { setId?: string }) {
    const { control } = useFormContext<FlashcardFormData>();
    const values = useWatch({ control });
    const draftKey = "create-set-draft";

    useEffect(() => {
        if (setId) return;

        const timeoutId = setTimeout(() => {
            const hasContent = values.title || values.description || (values.flashcards && values.flashcards.some(f => f.term || f.definition));

            if (hasContent) {
                localStorage.setItem(draftKey, JSON.stringify(values));
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [values, draftKey, setId]);

    return null;
}

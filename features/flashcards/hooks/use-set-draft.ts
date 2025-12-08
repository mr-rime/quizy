"use client";

import { useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { FlashcardFormData } from "../components/flashcard-form";

export function useSetDraft(setId?: string) {
    const { reset } = useFormContext<FlashcardFormData>();
    const draftKey = "create-set-draft";

    useEffect(() => {
        if (setId) return;

        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                reset(parsedDraft);
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, [draftKey, reset, setId]);

    const clearDraft = useCallback(() => {
        localStorage.removeItem(draftKey);
    }, [draftKey]);


    if (setId) {
        return { clearDraft: () => { } };
    }

    return { clearDraft };
}

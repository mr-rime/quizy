"use client"

import { CardInformationForm } from "./card-information-form";
import CreateFlashcardForm from "./create-flashcard-form";
import { FormProvider, useForm, useWatch, useFormContext } from "react-hook-form";

import { useTransition, useEffect } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFlashcardSetSchema } from "../utils/validations";
import { createFlashcardSet } from "../services/create-set";

export type FlashcardFormData = {
    title: string;
    description?: string;
    isPublic?: boolean;
    flashcards: {
        id?: string;
        term: string;
        definition: string;
        image?: string;
    }[];
}

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateFlashcardSet } from "../services/update-set";

interface FlashcardFormProps {
    setId?: string;
    initialData?: FlashcardFormData;
}

import { useSetDraft } from "../hooks/use-set-draft";

// ... imports remain the same

export function FlashcardForm({ setId, initialData }: FlashcardFormProps = {}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const methods = useForm<FlashcardFormData>({
        resolver: zodResolver(createFlashcardSetSchema),
        defaultValues: initialData || {
            title: "",
            description: "",
            isPublic: false,
            flashcards: [{
                id: "1",
                term: "",
                definition: "",
                image: ""
            }]
        }
    });

    // We can't use the hook here directly because useSetDraft expects to be inside FormProvider context
    // So we need to create a wrapper or move FormProvider up.
    // However, the current structure has FlashcardForm rendering FormProvider.
    // So we must use a child component for the hook OR move the FormProvider out.
    // Moving FormProvider out is a larger refactor.
    // Keeping a "Logic" component inside is cleaner for now given the constraints.

    // Let's create a Helper component inside this file simply to invoke the hook.

    return (
        <FormProvider {...methods}>
            <FlashcardFormContent setId={setId} onSubmitProp={async (data) => {
                try {
                    const formData = {
                        ...data,
                        isPublic: data.isPublic ?? false,
                    };

                    const result = setId
                        ? await updateFlashcardSet({ ...formData, setId })
                        : await createFlashcardSet(formData);

                    if (result?.success && result.id) {
                        // clearDraft will be called inside the hook consumer if we expose it?
                        // Actually, the hook is inside. 
                        // We can pass a callback or ref? 
                        // Or simply, the hook handles auto-saving. Clearing must be manual?
                        // The hook returns { clearDraft }.
                        // So we need access to clearDraft in onSubmit.

                        // Re-structuring:
                        // 1. FlashcardForm renders FormProvider.
                        // 2. Inner component `SetFormInner` uses hook and handles submit.
                        return result;
                    } else {
                        toast.error(result?.error || (setId ? "Failed to update flashcard set" : "Failed to create flashcard set"));
                        return null;
                    }
                } catch (error) {
                    toast.error(setId ? "Failed to update flashcard set" : "Failed to create flashcard set");
                    console.error(error);
                    return null;
                }
            }} />
        </FormProvider>
    )
}

function FlashcardFormContent({ setId, onSubmitProp }: { setId?: string, onSubmitProp: (data: FlashcardFormData) => Promise<any> }) {
    const { handleSubmit } = useFormContext<FlashcardFormData>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { clearDraft } = useSetDraft(setId);

    const onSubmit = (data: FlashcardFormData) => {
        startTransition(async () => {
            const result = await onSubmitProp(data);
            if (result?.success) {
                clearDraft();
                toast.success(setId ? "Flashcard set updated successfully" : "Flashcard set created successfully");
                router.push(`/practice/${result.id}`);
            }
        });
    };

    return (
        <form id="create-set-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-medium">{setId ? "Edit flashcard set" : "Create a new flashcard set"}</h2>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending ? (setId ? "Updating..." : "Creating...") : (setId ? "Update" : "Create")}
                </Button>
            </div>
            <CardInformationForm />
            <CreateFlashcardForm />
        </form>
    );
}


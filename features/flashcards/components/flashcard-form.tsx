"use client"

import { CardInformationForm } from "./card-information-form";
import CreateFlashcardForm from "./create-flashcard-form";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { useTransition } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFlashcardSetSchema } from "../utils/validations";
import { createFlashcardSet } from "../services/create-set";

export type FlashcardFormData = {
    title: string;
    description?: string;
    category: "english" | "other";
    isPublic?: boolean;
    sourceLanguage?: string;
    targetLanguage?: string;
    flashcards: {
        id?: string;
        term: string;
        definition: string;
        image?: string;
        wordType?: string;
        examples?: { english: string; arabic: string;[key: string]: string }[];
    }[];
}

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateFlashcardSet } from "../services/update-set";

interface FlashcardFormProps {
    setId?: string;
    initialData?: FlashcardFormData;
    defaultCategory?: "english" | "other";
}

import { useSetDraft } from "../hooks/use-set-draft";
import { AutoSaveDraft } from "./auto-save-draft";


export function FlashcardForm({ setId, initialData, defaultCategory = "other" }: FlashcardFormProps = {}) {
    const methods = useForm<FlashcardFormData>({
        resolver: zodResolver(createFlashcardSetSchema),
        defaultValues: initialData || {
            title: "",
            description: "",
            category: defaultCategory,
            isPublic: false,
            sourceLanguage: "en",
            targetLanguage: "ar",
            flashcards: [{
                id: "1",
                term: "",
                definition: "",
                image: "",
                examples: []
            }]
        }
    });

    return (
        <FormProvider {...methods}>
            <FlashcardFormContent setId={setId} onSubmitProp={async (data) => {
                try {
                    const formData = {
                        ...data,
                        category: data.category,
                        isPublic: data.isPublic ?? false,
                        sourceLanguage: data.sourceLanguage ?? "en",
                        targetLanguage: data.targetLanguage ?? "ar",
                    };

                    const result = setId
                        ? await updateFlashcardSet({ ...formData, setId })
                        : await createFlashcardSet(formData);

                    if (result?.success && result.id) {
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
            }} defaultCategory={defaultCategory} />
        </FormProvider>
    )
}

type SetOperationResult = {
    success: boolean;
    id?: string;
    error?: string;
};

function FlashcardFormContent({ setId, onSubmitProp, defaultCategory }: { setId?: string, onSubmitProp: (data: FlashcardFormData) => Promise<SetOperationResult | null>, defaultCategory?: "english" | "other" }) {
    const { handleSubmit, register } = useFormContext<FlashcardFormData>();
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

    console.log("defaultCategory", defaultCategory);

    return (
        <form id="create-set-form" onSubmit={handleSubmit(onSubmit, (errors) => console.log("Form errors:", errors))}>
            <input type="hidden" {...register("category")} />
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-medium">{setId ? "Edit flashcard set" : "Create a new flashcard set"}</h2>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending ? (setId ? "Updating..." : "Creating...") : (setId ? "Update" : "Create")}
                </Button>
            </div>
            <CardInformationForm />
            <CreateFlashcardForm />
            <AutoSaveDraft setId={setId} />
        </form>
    );
}


"use client"

import { CardInformationForm } from "./card-information-form";
import CreateFlashcardForm from "./create-flashcard-form";
import { FormProvider, useForm } from "react-hook-form";

import { useTransition } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFlashcardSetSchema } from "../utils/validations";
import { createFlashcardSet } from "../services/create-set";

export type FlashcardFormData = {
    title: string;
    description?: string;
    flashcards: {
        id?: string;
        term: string;
        definition?: string;
        image?: string;
    }[];
}

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function FlashcardForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const methods = useForm<FlashcardFormData>({
        resolver: zodResolver(createFlashcardSetSchema),
        defaultValues: {
            title: "",
            description: "",
            flashcards: [{
                id: "1",
                term: "",
                definition: "",
                image: ""
            }]
        }
    });

    const onSubmit = (data: FlashcardFormData) => {
        startTransition(async () => {
            try {
                const result = await createFlashcardSet(data);
                if (result?.success && result.id) {
                    toast.success("Flashcard set created successfully");
                    router.push(`/practice/${result.id}`);
                } else {
                    toast.error(result?.error || "Failed to create flashcard set");
                }
            } catch (error) {
                toast.error("Failed to create flashcard set");
                console.error(error);
            }
        });
    };

    return (
        <FormProvider {...methods}>
            <form id="create-set-form" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-[1.5rem] font-medium">Create a new flashcard set</h2>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create"}
                    </Button>
                </div>
                <CardInformationForm />
                <CreateFlashcardForm />
            </form>
        </FormProvider>
    )
}

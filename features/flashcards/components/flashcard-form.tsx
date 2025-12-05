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

export function FlashcardForm() {
    const [, startTransition] = useTransition();
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
                await createFlashcardSet(data);
                toast.success("Flashcard set created successfully");
            } catch (error) {
                toast.error("Failed to create flashcard set");
                console.error(error);
            }
        });
    };

    return (
        <FormProvider {...methods}>
            <form id="create-set-form" className="mt-10" onSubmit={methods.handleSubmit(onSubmit)}>
                <CardInformationForm />
                <CreateFlashcardForm />
            </form>
        </FormProvider>
    )
}

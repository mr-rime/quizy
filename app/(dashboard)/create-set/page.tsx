import { FlashcardForm } from "@/features/flashcards/components/flashcard-form";
import { Suspense } from "react";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function page(props: PageProps) {
    const searchParams = await props.searchParams;
    const rawCategory = searchParams.category;
    const category = (rawCategory === "english" || rawCategory === "other") ? rawCategory : "other";

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FlashcardForm defaultCategory={category} />
        </Suspense>
    )
}

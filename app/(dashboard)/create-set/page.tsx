import { Button } from "@/components/ui/button";
import { FlashcardForm } from "@/features/flashcards/components/flashcard-form";

export default function page() {
    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-[1.5rem] font-medium">Create a new flashcard set</h2>
                <Button type="submit" form="create-set-form">
                    Create
                </Button>
            </div>
            <FlashcardForm />
        </div>
    )
}

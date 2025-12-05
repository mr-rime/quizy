import { Library } from "@/features/library/components/library";
import { getFlashcardSets } from "@/features/practice/services/flashcards";

export default async function page() {
    const sets = await getFlashcardSets();

    return (
        <div className="p-[1.5rem_3rem]">
            <h2 className="text-[2rem] font-medium">Your library</h2>

            <Library sets={sets} />
        </div>
    )
}

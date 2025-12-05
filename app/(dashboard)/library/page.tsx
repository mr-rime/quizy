import { Library } from "@/features/library/components/library";
import { getFlashcardSets } from "@/features/practice/services/flashcards";
import { getFolders } from "@/features/folders/services/folders";
import { getCurrentUser } from "@/features/user/services/user";

export default async function page() {
    const [sets, folders, currentUser] = await Promise.all([
        getFlashcardSets(),
        getFolders(),
        getCurrentUser()
    ]);

    return (
        <div className="p-[1.5rem_3rem]">
            <h2 className="text-[2rem] font-medium">Your library</h2>

            <Library
                sets={sets}
                folders={folders}
                currentUser={currentUser}
            />
        </div>
    )
}

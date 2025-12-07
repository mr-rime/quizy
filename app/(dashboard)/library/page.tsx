import { Library } from "@/features/library/components/library";
import { getFlashcardSets } from "@/features/practice/services/flashcards";
import { getFolders } from "@/features/folders/services/folders";
import { getUserId } from "@/features/user/services/user";
import { cache } from "react";

export const revalidate = 3600;

const getLibraryData = cache(async () => {
    const userId = await getUserId();
    const [sets, folders] = await Promise.all([
        getFlashcardSets(userId),
        getFolders(userId)
    ]);
    return { sets, folders };
});

export default async function page() {
    const { sets, folders } = await getLibraryData();

    return (
        <div className="p-[1.5rem_3rem]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[2rem] font-medium">Your library</h2>
                <p className="text-sm text-muted-foreground">
                    {folders.length}/4 folders
                </p>
            </div>

            <Library
                sets={sets}
                folders={folders}
            />
        </div>
    )
}

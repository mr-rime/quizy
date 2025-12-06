import { Library } from "@/features/library/components/library";
import { getFlashcardSets } from "@/features/practice/services/flashcards";
import { getFolders } from "@/features/folders/services/folders";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getUserId } from "@/features/user/services/user";

const getCachedFlodersAndSets = cache(unstable_cache(
    async (userId: string) => {
        const [sets, folders] = await Promise.all([
            getFlashcardSets(userId),
            getFolders(userId)
        ])

        return [sets, folders];
    }, ["folders", "sets"]
));

export default async function page() {
    const userId = await getUserId();
    const [sets, folders] = await getCachedFlodersAndSets(userId);

    return (
        <div className="p-[1.5rem_3rem]">
            <h2 className="text-[2rem] font-medium">Your library</h2>

            <Library
                sets={sets}
                folders={folders}
            />
        </div>
    )
}

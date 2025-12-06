import { FlashcardViewer } from "@/features/practice/components/flashcard-viewer";
import { getFavorites } from "@/features/flashcards/services/favorites";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getUserId } from "@/features/user/services/user";

const getCachedFavorites = cache(unstable_cache(
    async (userId: string) => {
        return getFavorites(userId);
    },
    ["favorites"],
    { revalidate: 3600, tags: ["favorites"] }
))

export default async function FavoritesPage() {
    const useId = await getUserId();
    const favoritesPromise = getCachedFavorites(useId);

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Favorites</h1>
                    <p className="text-muted-foreground">Practice your favorited cards</p>
                </div>
            </div>

            <FlashcardViewer favoritesPromise={favoritesPromise} setId="favorites" />
        </div>
    );
}
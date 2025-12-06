import { FlashcardViewer } from "@/features/practice/components/flashcard-viewer";
import { getFavorites } from "@/features/flashcards/services/favorites";
import { getUserId } from "@/features/user/services/user";
import { cache } from "react";

export const revalidate = 1800;

const getFavoritesData = cache(async () => {
    const userId = await getUserId();
    const favorites = await getFavorites(userId);
    const favoriteIds = favorites.map(f => f.id);
    return { favorites, favoriteIds, userId };
});

export default async function FavoritesPage() {
    const { favorites, favoriteIds, userId } = await getFavoritesData();

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Favorites</h1>
                    <p className="text-muted-foreground">Practice your favorited cards</p>
                </div>
            </div>

            <FlashcardViewer cards={favorites} setId="favorites" userId={userId} initialFavoriteIds={favoriteIds} />
        </div>
    );
}
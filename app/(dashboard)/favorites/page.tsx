import { FlashcardViewer } from "@/features/practice/components/flashcard-viewer";
import { getFavorites } from "@/features/flashcards/services/favorites";

export default async function FavoritesPage() {
    const favorites = await getFavorites();
    const favoriteIds = favorites.map(f => f.id);

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Favorites</h1>
                    <p className="text-muted-foreground">Practice your favorited cards</p>
                </div>
            </div>

            {favorites.length > 0 ? (
                <FlashcardViewer cards={favorites} setId="favorites" initialFavoriteIds={favoriteIds} />
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    You haven&apos;t favorited any cards yet.
                </div>
            )}
        </div>
    );
}

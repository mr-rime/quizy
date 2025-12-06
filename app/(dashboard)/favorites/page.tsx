import { FlashcardViewer } from "@/features/practice/components/flashcard-viewer";
import { getFavorites } from "@/features/flashcards/services/favorites";
import { getUserId } from "@/features/user/services/user";
import { cache } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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

            {favorites.length > 0 ? (
                <FlashcardViewer cards={favorites} setId="favorites" userId={userId} initialFavoriteIds={favoriteIds} />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
                        <Star className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                        <h3 className="text-2xl font-semibold tracking-tight">No favorites yet</h3>
                        <p className="text-muted-foreground">
                            Star flashcards while practicing to add them to your collection for quick review.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/latest">
                            Explore Practice Sets
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
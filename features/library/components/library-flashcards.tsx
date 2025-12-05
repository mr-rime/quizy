import { LibraryItemCard } from "./library-item-card";
import { FlashcardSet } from "@/types";

interface LibraryFlashcardsProps {
    sets: FlashcardSet[];
}

export function LibraryFlashcards({ sets }: LibraryFlashcardsProps) {
    const sortedItems = [...sets]
        .filter(item => item.createdAt)
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

    const recentItems = sortedItems.filter(item => {
        if (!item.createdAt) return false;
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return item.createdAt > oneHourAgo;
    });

    const thisWeekItems = sortedItems.filter(item => {
        if (!item.createdAt) return false;
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return item.createdAt > oneWeekAgo && item.createdAt <= oneHourAgo;
    });

    const olderItems = sortedItems.filter(item => {
        if (!item.createdAt) return false;
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return item.createdAt <= oneWeekAgo;
    });

    return (
        <div className="space-y-8">
            {recentItems.length > 0 && (
                <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">In the past hour</h3>
                    <div className="grid gap-4">
                        {recentItems.map(item => (
                            <LibraryItemCard
                                key={item.id}
                                item={{
                                    id: item.id,
                                    title: item.title,
                                    termCount: item.cards?.length || 0,
                                    author: {
                                        name: item.user?.username || 'Unknown',
                                        avatarUrl: item.user?.image || undefined
                                    },
                                    createdAt: item.createdAt!,
                                    type: 'set'
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {thisWeekItems.length > 0 && (
                <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">This Week</h3>
                    <div className="grid gap-4">
                        {thisWeekItems.map(item => (
                            <LibraryItemCard
                                key={item.id}
                                item={{
                                    id: item.id,
                                    title: item.title,
                                    termCount: item.cards?.length || 0,
                                    author: {
                                        name: item.user?.username || 'Unknown',
                                        avatarUrl: item.user?.image || undefined
                                    },
                                    createdAt: item.createdAt!,
                                    type: 'set'
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {olderItems.length > 0 && (
                <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Older</h3>
                    <div className="grid gap-4">
                        {olderItems.map(item => (
                            <LibraryItemCard
                                key={item.id}
                                item={{
                                    id: item.id,
                                    title: item.title,
                                    termCount: item.cards?.length || 0,
                                    author: {
                                        name: item.user?.username || 'Unknown',
                                        avatarUrl: item.user?.image || undefined
                                    },
                                    createdAt: item.createdAt!,
                                    type: 'set'
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {sets.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No flashcard sets found. Create one to get started!
                </div>
            )}
        </div>
    );
}

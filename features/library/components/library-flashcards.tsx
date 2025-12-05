import { LibraryItemCard } from "./library-item-card";

interface LibraryFlashcardsProps {
    sets: any[]; // TODO: Type properly with inferred type from Drizzle
}

export function LibraryFlashcards({ sets }: LibraryFlashcardsProps) {
    const sortedItems = [...sets]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const recentItems = sortedItems.filter(item => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return item.createdAt > oneHourAgo;
    });

    const thisWeekItems = sortedItems.filter(item => {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return item.createdAt > oneWeekAgo && item.createdAt <= oneHourAgo;
    });

    const olderItems = sortedItems.filter(item => {
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
                                    termCount: item.cards.length,
                                    author: { name: item.user.username, avatarUrl: item.user.image },
                                    createdAt: item.createdAt,
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
                                    termCount: item.cards.length,
                                    author: { name: item.user.username, avatarUrl: item.user.image },
                                    createdAt: item.createdAt,
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
                                    termCount: item.cards.length,
                                    author: { name: item.user.username, avatarUrl: item.user.image },
                                    createdAt: item.createdAt,
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

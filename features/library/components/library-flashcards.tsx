import { LibraryItemCard } from "./library-item-card";
import { FlashcardSet } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Layers } from "lucide-react";

interface LibraryFlashcardsProps {
    sets: FlashcardSet[];
}

const date = Date.now()

export function LibraryFlashcards({ sets }: LibraryFlashcardsProps) {
    const sortedItems = [...sets]
        .filter((item): item is FlashcardSet & { createdAt: string } => !!item.createdAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const recentItems = sortedItems.filter(item => {
        const itemDate = new Date(item.createdAt || '');
        const oneHourAgo = new Date(date - 60 * 60 * 1000);
        return itemDate > oneHourAgo;
    });

    const thisWeekItems = sortedItems.filter(item => {
        const itemDate = new Date(item.createdAt || '');
        const oneHourAgo = new Date(date - 60 * 60 * 1000);
        const oneWeekAgo = new Date(date - 7 * 24 * 60 * 60 * 1000);
        return itemDate > oneWeekAgo && itemDate <= oneHourAgo;
    });

    const olderItems = sortedItems.filter(item => {
        const itemDate = new Date(item.createdAt || '');
        const oneWeekAgo = new Date(date - 7 * 24 * 60 * 60 * 1000);
        return itemDate <= oneWeekAgo;
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
                                    createdAt: item.createdAt!,
                                    type: 'set'
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {sets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="rounded-full bg-muted p-6 mb-6">
                        <Layers className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Flashcard Sets Found</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        You haven&apos;t created any flashcard sets yet. Start building your collection now!
                    </p>
                    <Link href="/create-set">
                        <Button size="lg" className="rounded-full px-8">
                            Create New Set
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

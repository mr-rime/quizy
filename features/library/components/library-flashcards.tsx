"use client";

import { LibraryItemCard } from "./library-item-card";
import { FlashcardSet } from "@/types";
import { Layers, Loader2 } from "lucide-react";
import { CreateSetButton } from "@/features/flashcards/components/create-set-button";
import { useState, useRef, useCallback } from "react";
import { getLibrarySetsAction } from "../actions";

interface LibraryFlashcardsProps {
    sets: FlashcardSet[];
}

const date = Date.now()

export function LibraryFlashcards({ sets: initialSets }: LibraryFlashcardsProps) {
    const [items, setItems] = useState<FlashcardSet[]>(initialSets);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const loadMoreItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const { sets: newSets, nextPage } = await getLibrarySetsAction(page);

            if (newSets.length > 0) {
                setItems(prev => {
                    const existingIds = new Set(prev.map(s => s.id));
                    const uniqueNewSets = newSets.filter(s => !existingIds.has(s.id));
                    return [...prev, ...uniqueNewSets];
                });
                setPage(prev => prev + 1);
            }

            if (!nextPage) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more sets:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreItems();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, loadMoreItems]);

    const sortedItems = [...items]
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
        <div className="space-y-8 pb-8">
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
                        {olderItems.map((item, index) => {
                            if (index === olderItems.length - 1) {
                                return (
                                    <div ref={lastElementRef} key={item.id}>
                                        <LibraryItemCard
                                            item={{
                                                id: item.id,
                                                title: item.title,
                                                termCount: item.cards?.length || 0,
                                                createdAt: item.createdAt!,
                                                type: 'set'
                                            }}
                                        />
                                    </div>
                                )
                            }
                            return (
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
                            )
                        })}
                    </div>
                </section>
            )}

            {isLoading && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            )}

            {items.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="rounded-full bg-muted p-6 mb-6">
                        <Layers className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Flashcard Sets Found</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        You haven&apos;t created any flashcard sets yet. Start building your collection now!
                    </p>
                    <CreateSetButton className="rounded-full px-8" />
                </div>
            )}
        </div>
    );
}

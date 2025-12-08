"use client"

import { SetCard } from "../components/set-card";
import { FolderCard } from "@/features/folders/components/folder-card";
import { SearchBar } from "../components/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicFlashcardSet, PublicFolder } from "@/types";

interface DiscoverClientProps {
    initialSets: PublicFlashcardSet[];
    initialFolders: PublicFolder[];
    isAdmin?: boolean;
}

export function DiscoverClient({ initialSets, initialFolders, isAdmin = false }: DiscoverClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const allItems = [
        ...initialSets.map(s => ({ ...s, type: 'set' as const })),
        ...initialFolders.map(f => ({ ...f, type: 'folder' as const }))
    ].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
    });

    const handleSearch = (query: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set("q", query);
        } else {
            params.delete("q");
        }
        router.push(`/discover?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <SearchBar
                onSearch={handleSearch}
                initialValue={searchParams.get("q") || ""}
            />

            {allItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No public sets or folders found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allItems.map((item) => (
                        item.type === 'set' ? (
                            <SetCard key={`set-${item.id}`} set={item as PublicFlashcardSet} isAdmin={isAdmin} />
                        ) : (
                            <FolderCard key={`folder-${item.id}`} folder={item} />
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

"use client"

import { motion } from "framer-motion";

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
                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {allItems.map((item) => (
                        <motion.div
                            key={item.type === 'set' ? `set-${item.id}` : `folder-${item.id}`}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            {item.type === 'set' ? (
                                <SetCard set={item as PublicFlashcardSet} isAdmin={isAdmin} />
                            ) : (
                                <FolderCard folder={item} />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

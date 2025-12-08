"use client"

import { SetCard } from "../components/set-card";
import { FolderCard } from "@/features/folders/components/folder-card";
import { SearchBar } from "../components/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicFlashcardSet } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiscoverClientProps {
    initialSets: PublicFlashcardSet[];
    initialFolders: any[]; // Using any[] temporarily, should match the return type of getPublicFolders
    isAdmin?: boolean;
}

export function DiscoverClient({ initialSets, initialFolders, isAdmin = false }: DiscoverClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sets = initialSets;
    const folders = initialFolders;

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

            <Tabs defaultValue="sets" className="w-full">
                <TabsList>
                    <TabsTrigger value="sets">Flashcard Sets</TabsTrigger>
                    <TabsTrigger value="folders">Folders</TabsTrigger>
                </TabsList>

                <TabsContent value="sets" className="mt-6">
                    {sets.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No public sets found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sets.map((set) => (
                                <SetCard key={set.id} set={set} isAdmin={isAdmin} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="folders" className="mt-6">
                    {folders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No public folders found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {folders.map((folder) => (
                                <FolderCard key={folder.id} folder={folder} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

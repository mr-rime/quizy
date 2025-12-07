"use client"

import { SetCard } from "../components/set-card";
import { SearchBar } from "../components/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicFlashcardSet } from "@/types";

interface DiscoverClientProps {
    initialSets: PublicFlashcardSet[];
}

export function DiscoverClient({ initialSets }: DiscoverClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sets = initialSets;

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

            {sets.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No public sets found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sets.map((set) => (
                        <SetCard key={set.id} set={set} />
                    ))}
                </div>
            )}
        </div>
    );
}

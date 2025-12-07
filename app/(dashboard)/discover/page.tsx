import { getPublicSets } from "@/features/discover/services/discover";
import { DiscoverClient } from "@/features/discover/components/discover-client";
import { Compass } from "lucide-react";
import { getCurrentUser } from "@/features/user/services/user";

interface DiscoverPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
    const params = await searchParams;
    const query = params.q || "";

    const [sets, user] = await Promise.all([
        getPublicSets(query),
        getCurrentUser()
    ]);

    const isAdmin = user?.role === "admin";

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Compass className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">Discover</h1>
                </div>

                <p className="text-muted-foreground">
                    Explore public flashcard sets created by the community
                </p>

                <DiscoverClient initialSets={sets} isAdmin={isAdmin} />
            </div>
        </div>
    );
}

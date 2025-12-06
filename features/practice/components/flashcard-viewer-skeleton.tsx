"use client"

import { Skeleton } from "@/components/skeleton";
import { Card } from "@/components/ui/card";

export function FavoritesSkeleton() {
    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48 rounded" />
                    <Skeleton className="h-4 w-64 rounded" />
                </div>
            </div>

            <Card className="p-12 min-h-[300px] flex flex-col items-center justify-center text-center gap-6 relative">
                <Skeleton className="h-6 w-6 rounded-full absolute top-4 right-4" />
            </Card>

            <div className="flex gap-4">
                <Skeleton className="h-10 w-20 rounded" />
                <Skeleton className="h-10 w-20 rounded" />
                <Skeleton className="h-10 w-20 rounded" />
            </div>
        </div>
    );
}

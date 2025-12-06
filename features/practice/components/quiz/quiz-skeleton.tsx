"use client"

import { Skeleton } from "@/components/skeleton";
import { Card } from "@/components/ui/card";

export function QuizSkeleton() {
    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>

            <Card className="p-12 min-h-[300px] flex flex-col items-center justify-center text-center gap-6 relative">
                <Skeleton className="h-6 w-6 rounded-full absolute top-4 right-4" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-12 w-64 rounded" />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded" />
                ))}
            </div>
        </div>
    );
}

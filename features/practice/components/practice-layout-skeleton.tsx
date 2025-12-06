import { Skeleton } from "@/components/skeleton";


export function PracticeLayoutSkeleton() {
    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-24 rounded" />
                    <Skeleton className="h-10 w-32 rounded" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <Skeleton
                        key={i}
                        className="p-6 h-32 w-full rounded-lg"
                    />
                ))}
            </div>
        </div>
    );
}

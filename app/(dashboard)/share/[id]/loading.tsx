import { Skeleton } from "@/components/skeleton";

export default function loading() {
    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>
                </div>
                <Skeleton className="h-10 w-28 rounded-full" />
            </div>

            <Skeleton className="h-20 w-full rounded-lg" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}

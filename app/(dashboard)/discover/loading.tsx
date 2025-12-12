import { Skeleton } from "@/components/skeleton";

export default function loading() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-40 rounded" />
                </div>

                <Skeleton className="h-4 w-72 rounded" />
                <Skeleton className="h-10 w-full max-w-md rounded" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}

import { Skeleton } from "@/components/skeleton";

export default function loading() {
    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40 rounded" />
                    <Skeleton className="h-4 w-64 rounded" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}

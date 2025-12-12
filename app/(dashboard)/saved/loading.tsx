import { Skeleton } from "@/components/skeleton";

export default function loading() {
    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-6">
            <Skeleton className="h-8 w-48 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}

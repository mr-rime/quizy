import { Skeleton } from "@/components/skeleton";

export default function loading() {
    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 rounded" />
                    <Skeleton className="h-4 w-72 rounded" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                </div>
            </div>

            <div className="space-y-4">
                <Skeleton className="h-10 w-64 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}

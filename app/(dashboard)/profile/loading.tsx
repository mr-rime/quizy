import { Skeleton } from "@/components/skeleton";

export default function loading() {
    return (
        <div className="container mx-auto py-10 px-4 space-y-6 max-w-3xl">
            <div className="space-y-2">
                <Skeleton className="h-8 w-56 rounded" />
                <Skeleton className="h-4 w-80 rounded" />
            </div>

            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded" />
                ))}
            </div>
        </div>
    );
}

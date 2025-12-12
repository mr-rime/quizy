import { Skeleton } from "@/components/skeleton";

export default function loading() {
    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-40 rounded" />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-12 w-64 rounded-full" />
            </div>
        </div>
    );
}

import { Skeleton } from "@/components/skeleton";

export default function loading() {
    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <Skeleton className="h-8 w-72 rounded" />
                <Skeleton className="h-10 w-32 rounded" />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
            </div>
        </div>
    );
}

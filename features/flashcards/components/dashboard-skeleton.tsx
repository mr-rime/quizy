import { Skeleton } from "@/components/skeleton";

export function DashboardSkeleton() {
    return (
        <div className=" p-[1.5rem_3rem]">
            <h2 className="text-[1.25rem] font-medium">Recents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-5 w-full mt-5 mb-10">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 h-40 flex items-center"
                    >
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-15 w-15 rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-30" />
                                <Skeleton className="h-3 w-17" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row justify-between">

                <div className="flex-1 space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64" />
                    <div className="pt-6">
                        <Skeleton className="h-10 w-28 rounded-full" />
                    </div>
                </div>

                <div className="flex items-center justify-center mt-8 md:mt-0">
                    <Skeleton className="h-52 w-72 rounded-xl" />
                </div>

            </div>
        </div>
    );
}

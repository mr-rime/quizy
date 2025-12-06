
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/skeleton";

export function LibrarySkeleton() {
    return (
        <div className="p-[1.5rem_3rem]">
            <h2 className="text-[2rem] font-medium">Your library</h2>
            <div className="mt-10 space-y-6">
                <div className="flex space-x-3">
                    <Skeleton className="h-8 w-32 rounded" />
                    <Skeleton className="h-8 w-32 rounded" />
                </div>

                <div className="grid grid-cols-1  gap-4">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i} className="h-40">
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-4 w-32 rounded mb-2" />
                                    <Skeleton className="h-3 w-24 rounded" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-6 w-20 rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div >
    );
}

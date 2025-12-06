
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/skeleton";

export function FolderViewSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-48 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                </div>
            </div>

            <div className="flex justify-start">
                <Skeleton className="h-8 w-20 rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
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
    );
}

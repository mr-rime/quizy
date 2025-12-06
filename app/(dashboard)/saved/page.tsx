import { getSavedSets } from "@/features/saved-sets/services/saved-sets";
import { getUserId } from "@/features/user/services/user";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Calendar, User } from "lucide-react";

export default async function SavedPage() {
    const userId = await getUserId();
    const savedSets = await getSavedSets(userId);

    if (savedSets.length === 0) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Saved Sets</h1>
                <Card className="p-12">
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground text-lg">
                            You haven&apos;t saved any sets yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Browse public sets and click the Save button to bookmark them here
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Saved Sets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedSets.map((set) => (
                    <Link key={set.id} href={`/share/${set.id}`}>
                        <Card className="p-6 hover:bg-accent transition-colors cursor-pointer h-full">
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-semibold text-lg line-clamp-2">{set.title}</h3>
                                    {set.description && (
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {set.description}
                                        </p>
                                    )}
                                </div>

                                {set.user && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>{set.user.username}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                                    <div className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span>{set.cards?.length || 0} terms</span>
                                    </div>
                                    {set.createdAt && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(set.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Layers } from "lucide-react";
import Image from "next/image";
import { getRecentSets } from "@/features/practice/services/recent";
import { getActiveProgress } from "@/features/practice/services/progress";
import { JumpBackIn } from "@/features/practice/components/jump-back-in";
import { cookies } from "next/headers";
import { getSessionCookie } from "@/features/auth/services/session";
import { cache } from "react";

const getLatestData = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);
    const userId = session?.userId || "";

    const [recentSets, progressSessions] = await Promise.all([
        getRecentSets(userId, 4),
        getActiveProgress(userId),
    ]);

    return { recentSets, progressSessions };
});

export default async function LatestPage() {
    const { recentSets, progressSessions } = await getLatestData();

    return (
        <div className="flex items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full">
                <JumpBackIn progressSessions={progressSessions} />

                <h2 className="text-lg sm:text-xl font-medium">Recents</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-4 sm:gap-5 w-full">
                    {recentSets.map((set) => (
                        <Link key={set.id} href={`/practice/${set.id}`}>
                            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                                <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                                    <div className="p-3 sm:p-4 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <Layers className="h-6 w-6 sm:h-8 sm:w-8" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-base sm:text-lg truncate">{set.title}</h3>
                                        <p className="text-sm text-muted-foreground">{set.cards.length} cards</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {recentSets.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
                            <div className="rounded-full bg-muted p-4 sm:p-6 mb-4 sm:mb-6">
                                <Layers className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2">No Recent Sets Found</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-sm">
                                You haven&apos;t created or practiced any sets yet. Start by creating your first flashcard set!
                            </p>
                            <Link href="/create-set">
                                <Button size="lg" className="rounded-full px-6 sm:px-8">
                                    Create New Set
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {recentSets.length > 0 && (
                    <div className="mt-8 sm:mt-10">
                        <Card className="w-full min-h-[250px] sm:min-h-[310px] overflow-hidden">
                            <CardContent className="flex flex-col md:flex-row justify-between p-4 sm:p-6 gap-4 sm:gap-6">
                                <div className="flex flex-col justify-between">
                                    <div className="space-y-2 sm:space-y-4">
                                        <h2 className="text-xl sm:text-2xl font-bold">{recentSets[0].title}</h2>
                                        <p className="text-sm sm:text-base text-muted-foreground">Flip through terms and definitions</p>
                                    </div>

                                    <Link href={`/practice/${recentSets[0].id}`}>
                                        <Button className="rounded-full w-full sm:w-fit px-6 sm:px-8 mt-4 sm:mt-6">Practice</Button>
                                    </Link>
                                </div>

                                <div className="relative w-full md:w-[400px] lg:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] shrink-0">
                                    <Image
                                        src={"/flashcards_new.png"}
                                        alt="flashcard set icon"
                                        fill
                                        className="object-contain md:object-cover rounded-md select-none"
                                        unoptimized
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    );
}

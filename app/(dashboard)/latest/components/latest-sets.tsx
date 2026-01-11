import { getRecentSets } from "@/features/practice/services/recent";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LatestSetsHeader } from "./latest-sets-client";
import { CreateSetButton } from "@/features/flashcards/components/create-set-button";

interface LatestSetsProps {
    userId: string;
}

export async function LatestSets({ userId }: LatestSetsProps) {
    const recentSets = await getRecentSets(userId, 4);

    return (
        <>
            <LatestSetsHeader />
            <h2 className="text-lg sm:text-xl font-medium mb-5">Recents</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
                {recentSets.map((set) => (
                    <Link key={set.id} href={`/practice/${set.id}`}>
                        <Card className="hover:bg-accent/50 hover:border-indigo-500/50 transition-all cursor-pointer h-full border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                                <div className="p-3 sm:p-4 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
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
                    <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center border border-dashed rounded-xl border-border/50 bg-card/30">
                        <div className="rounded-full bg-muted p-4 sm:p-6 mb-4 sm:mb-6">
                            <Layers className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">No Recent Sets Found</h3>
                        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-sm">
                            You haven&apos;t created or practiced any sets yet. Start by creating your first flashcard set!
                        </p>
                        <CreateSetButton className="rounded-full px-6 sm:px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" />
                    </div>
                )}
            </div>

            {recentSets.length > 0 && (
                <div className="mt-8 sm:mt-10">
                    <Card className="w-full min-h-[250px] sm:min-h-[310px] overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <CardContent className="flex flex-col md:flex-row justify-between p-4 sm:p-6 gap-4 sm:gap-6">
                            <div className="flex flex-col justify-between z-10">
                                <div className="space-y-2 sm:space-y-4">
                                    <div className="inline-flex px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium w-fit">
                                        Recommended Review
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold">{recentSets[0].title}</h2>
                                    <p className="text-sm sm:text-base text-muted-foreground">Continue where you left off and boost your retention.</p>
                                </div>

                                <Link href={`/practice/${recentSets[0].id}`}>
                                    <Button className="rounded-full w-full sm:w-fit px-6 sm:px-8 mt-4 sm:mt-6 bg-white text-black hover:bg-zinc-200 dark:bg-white dark:text-black shadow-xl">Practice Now</Button>
                                </Link>
                            </div>

                            <div className="relative w-full md:w-[400px] lg:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent z-10 visible md:invisible"></div>
                                <Image
                                    src={"/flashcards_new.png"}
                                    alt="flashcard set icon"
                                    fill
                                    className="object-contain md:object-cover rounded-md select-none opacity-80"
                                    unoptimized
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}

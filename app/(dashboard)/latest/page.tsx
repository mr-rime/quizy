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

export const revalidate = 3600;

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
        <div className="flex items-center p-[1.5rem_3rem]">
            <div className="w-full">
                <JumpBackIn progressSessions={progressSessions} />

                <h2 className="text-[1.25rem] font-medium">Recents</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5 w-full">
                    {recentSets.map((set) => (
                        <Link key={set.id} href={`/practice/${set.id}`}>
                            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-lg bg-primary/10 text-primary">
                                        <Layers className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{set.title}</h3>
                                        <p className="text-muted-foreground">{set.cards.length} cards</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {recentSets.length === 0 && (
                        <div className="col-span-2 flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="rounded-full bg-muted p-6 mb-6">
                                <Layers className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Recent Sets Found</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                You haven&apos;t created or practiced any sets yet. Start by creating your first flashcard set!
                            </p>
                            <Link href="/create-set">
                                <Button size="lg" className="rounded-full px-8">
                                    Create New Set
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {recentSets.length > 0 && (
                    <div className="mt-10">
                        <Card className="w-full min-h-[310px] overflow-hidden">
                            <CardContent className="flex flex-col md:flex-row justify-between ">
                                <div className="flex flex-col justify-between ">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-bold">{recentSets[0].title}</h2>
                                        <p className="text-muted-foreground">Flip through terms and definitions</p>
                                    </div>

                                    <Link href={`/practice/${recentSets[0].id}`}>
                                        <Button className="rounded-full w-fit px-8 mt-6">Practice</Button>
                                    </Link>
                                </div>

                                <div className="relative w-full md:w-[500px] h-[300px]">
                                    <Image
                                        src={"/flashcards_new.png"}
                                        alt="flashcard set icon"
                                        fill
                                        className="object-cover rounded-md select-none"
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

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Layers } from "lucide-react";
import Image from "next/image";
import { getRecentSets } from "@/features/practice/services/recent";
import { cookies } from "next/headers";
import { getSessionCookie } from "@/features/auth/services/session";
import { unstable_cache } from "next/cache";
import { cache } from "react";


export const getCachedRecentSets = cache(unstable_cache(
    async (userId: string, limit = 4) => {
        return getRecentSets(userId, limit);
    },
    ["recent-sets"]
));

export default async function LatestPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);

    const recentSets = await getCachedRecentSets(session?.userId || "", 4);

    return (
        <div className="flex items-center p-[1.5rem_3rem]">
            <div className="w-full">
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
                        <div className="col-span-2 text-muted-foreground">No recent sets found.</div>
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

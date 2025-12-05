import { Card } from "@/components/ui/card";
import { Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRecentSets } from "@/features/practice/services/recent";

export default async function page() {
    const recentSets = await getRecentSets(2);

    return (
        <div className="p-[1.5rem_3rem] space-y-8">
            <section>
                <h2 className="text-xl font-bold mb-4">Recents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentSets.map(set => (
                        <Link key={set.id} href={`/practice/${set.id}`}>
                            <Card className="p-4 hover:bg-accent transition-colors cursor-pointer flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <Layers className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{set.title}</h3>
                                    <p className="text-sm text-muted-foreground">{set.cards.length} cards</p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                    {recentSets.length === 0 && (
                        <div className="col-span-2 text-muted-foreground text-sm">
                            No recent activity.
                        </div>
                    )}
                </div>
            </section>

            {recentSets.length > 0 && (
                <section>
                    <Card className="p-8 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white border-none overflow-hidden relative">
                        <div className="relative z-10 max-w-md space-y-4">
                            <h2 className="text-2xl font-bold">{recentSets[0].title}</h2>
                            <p className="text-zinc-300">Flip through terms and definitions</p>
                            <Link href={`/practice/${recentSets[0].id}`}>
                                <Button variant="secondary" className="mt-4">
                                    Practice
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </section>
            )}
        </div>
    );
}

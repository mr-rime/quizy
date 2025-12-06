"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Layers, BrainCircuit, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { getPublicSet } from "../services/share";

interface PublicPracticeLayoutProps<T> {
    flashcardSetPromise: Promise<T>;
    children?: React.ReactNode;
}

export function PublicPracticeLayout<T>({ flashcardSetPromise, children }: PublicPracticeLayoutProps<T>) {
    const router = useRouter();

    const set = use(flashcardSetPromise) as Awaited<ReturnType<typeof getPublicSet>>;

    if (!set) {
        return <p className="text-center py-8 text-muted-foreground">This set is not publicly available.</p>;
    }

    const { id: setId, title, cards, user } = set;
    const cardCount = cards.length;

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <p className="text-muted-foreground">{cardCount} terms</p>
                    </div>
                </div>
            </div>

            {user && (
                <Card className="p-4">
                    <Link
                        href={`/profile/${user.id}`}
                        className="flex items-center gap-3 hover:bg-accent transition-colors rounded-lg p-2 -m-2"
                    >
                        <div className="p-2 rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Created by</p>
                            <p className="font-semibold">{user.username}</p>
                        </div>
                    </Link>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={`/share/${setId}/flashcards`}>
                    <Card className="p-6 hover:bg-accent transition-colors cursor-pointer flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Layers className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Flashcards</h3>
                                <p className="text-sm text-muted-foreground">Review terms and definitions</p>
                            </div>
                        </div>
                    </Card>
                </Link>
                <Link href={`/share/${setId}/quizes`}>
                    <Card className="p-6 hover:bg-accent transition-colors cursor-pointer flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <BrainCircuit className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Quizzes</h3>
                                <p className="text-sm text-muted-foreground">Test your knowledge</p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>

            {children}
        </div>
    );
}

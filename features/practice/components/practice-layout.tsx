"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share, Layers, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PracticeDropdown } from "./practice-dropdown";

interface PracticeLayoutProps {
    setId: string;
    title: string;
    cardCount: number;
    children?: React.ReactNode;
}

export function PracticeLayout({ setId, title, cardCount, children }: PracticeLayoutProps) {
    const router = useRouter();

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
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Share className="h-4 w-4" />
                        Share
                    </Button>
                    <PracticeDropdown setId={setId} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={`/practice/${setId}/flashcards`}>
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
                <Link href={`/practice/${setId}/quizes`}>
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

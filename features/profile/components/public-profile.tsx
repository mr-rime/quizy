"use client";

import { Card } from "@/components/ui/card";
import { User, Calendar, Layers, FileText, ArrowLeft } from "lucide-react";
import { PublicSetCard } from "./public-set-card";
import { Button } from "@/components/ui/button";

interface PublicProfileProps {
    profile: {
        id: string;
        username: string;
        image: string | null;
        createdAt: Date | null;
        publicSetsCount: number;
        totalCardsCreated: number;
    };
    publicSets: Array<{
        id: string;
        title: string;
        description: string | null;
        createdAt: Date | null;
        cards: Array<{ id: string }>;
    }>;
}

export function PublicProfile({ profile, publicSets }: PublicProfileProps) {
    const joinDate = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Unknown';

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-8">
            <Card className="p-8">
                <div className="flex items-start gap-6">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="p-4 rounded-full bg-primary/10">
                        <User className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Joined {joinDate}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 rounded-lg bg-accent/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Layers className="h-4 w-4" />
                            <span className="text-sm">Public Sets</span>
                        </div>
                        <p className="text-2xl font-bold">{profile.publicSetsCount}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">Total Cards</span>
                        </div>
                        <p className="text-2xl font-bold">{profile.totalCardsCreated}</p>
                    </div>
                </div>
            </Card>

            <div>
                <h2 className="text-2xl font-bold mb-4">Public Sets</h2>
                {publicSets.length === 0 ? (
                    <Card className="p-8">
                        <p className="text-center text-muted-foreground">
                            This user hasn&apos;t made any sets public yet.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {publicSets.map((set) => (
                            <PublicSetCard key={set.id} set={set} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

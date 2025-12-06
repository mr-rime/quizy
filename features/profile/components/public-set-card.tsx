"use client";

import { Card } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";
import Link from "next/link";

interface PublicSetCardProps {
    set: {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date | null;
        cards: Array<{ id: string }>;
    };
}

export function PublicSetCard({ set }: PublicSetCardProps) {
    const createdDate = set.createdAt
        ? new Date(set.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Unknown';

    return (
        <Link href={`/share/${set.id}`}>
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

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{set.cards.length} terms</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{createdDate}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

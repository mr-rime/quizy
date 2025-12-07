import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { AuthorInfo } from "./author-info";
import { Heart, MessageSquare, Users, Layers } from "lucide-react";
import { PublicFlashcardSet } from "@/types";

interface SetCardProps {
    set: PublicFlashcardSet;
}

export function SetCard({ set }: SetCardProps) {
    return (
        <Link href={`/practice/${set.id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardContent className="p-5 space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg truncate">{set.title}</h3>
                        {set.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {set.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Layers className="h-4 w-4" />
                            <span>{set.cardCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{set.likeCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{set.commentCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{set.joinCount}</span>
                        </div>
                    </div>

                    {set.username && (
                        <div className="pt-2 border-t">
                            <AuthorInfo username={set.username} image={set.userImage} size="sm" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}

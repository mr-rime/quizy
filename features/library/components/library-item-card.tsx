import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FolderIcon } from "lucide-react";
import { LibraryItem } from "../types";

interface LibraryItemCardProps {
    item: LibraryItem;
}

import Link from "next/link";

export function LibraryItemCard({ item }: LibraryItemCardProps) {
    return (
        <Link href={`/practice/${item.id}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-none bg-card/50">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.termCount} Terms</span>
                            <span>|</span>
                            <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                    <AvatarImage src={item.author.avatarUrl} />
                                    <AvatarFallback className="text-[10px]">{item.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">{item.author.name}</span>
                            </div>
                        </div>
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                            {item.title}
                            {item.type === 'folder' && <FolderIcon className="h-4 w-4 text-muted-foreground" />}
                        </h4>
                    </div>

                    {item.progress !== undefined && (
                        <div className="text-sm font-bold text-muted-foreground">
                            {item.progress}%
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}

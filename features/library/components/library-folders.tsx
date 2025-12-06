import { LibraryItem } from "../types";
import { LibraryItemCard } from "./library-item-card";
import { Folder } from "@/types";

interface LibraryFoldersProps {
    folders: Folder[];
}

const date = Date.now()

export function LibraryFolders({ folders }: LibraryFoldersProps) {
    const sortedItems: LibraryItem[] = folders
        .map(folder => ({
            id: folder.id,
            title: folder.title,
            termCount: folder.folderSets?.length || 0,
            createdAt: folder.createdAt ? new Date(folder.createdAt) : new Date(),
            type: 'folder' as const
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const recentItems = sortedItems.filter(item => {
        const oneHourAgo = new Date(date - 60 * 60 * 1000);
        return item.createdAt > oneHourAgo;
    });

    const thisWeekItems = sortedItems.filter(item => {
        const oneWeekAgo = new Date(date - 7 * 24 * 60 * 60 * 1000);
        const oneHourAgo = new Date(date - 60 * 60 * 1000);
        return item.createdAt > oneWeekAgo && item.createdAt <= oneHourAgo;
    });

    const olderItems = sortedItems.filter(item => {
        const oneWeekAgo = new Date(date - 7 * 24 * 60 * 60 * 1000);
        return item.createdAt <= oneWeekAgo;
    });

    if (sortedItems.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10">
                No folders found. Create one to get started!
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {recentItems.length > 0 && (
                <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">In the past hour</h3>
                    <div className="grid gap-4">
                        {recentItems.map(item => <LibraryItemCard key={item.id} item={item} />)}
                    </div>
                </section>
            )}

            {thisWeekItems.length > 0 && (
                <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">This Week</h3>
                    <div className="grid gap-4">
                        {thisWeekItems.map(item => <LibraryItemCard key={item.id} item={item} />)}
                    </div>
                </section>
            )}

            {olderItems.length > 0 && (
                <section>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Older</h3>
                    <div className="grid gap-4">
                        {olderItems.map(item => <LibraryItemCard key={item.id} item={item} />)}
                    </div>
                </section>
            )}
        </div>
    );
}

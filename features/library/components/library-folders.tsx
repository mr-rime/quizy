import { LibraryItem } from "../types";
import { LibraryItemCard } from "./library-item-card";

const MOCK_ITEMS: LibraryItem[] = [
    {
        id: '1',
        title: 'A1 Test',
        termCount: 2,
        author: { name: 'Mr_Rime' },
        createdAt: new Date('2025-12-05T20:00:00'),
        type: 'set'
    },
    {
        id: '2',
        title: 'UNIT TEST (5)',
        termCount: 25,
        author: { name: 'Ahahsienss', avatarUrl: 'https://github.com/shadcn.png' },
        createdAt: new Date('2025-12-05T19:30:00'),
        type: 'set',
        progress: 96
    },
    {
        id: '3',
        title: 'Effective study strategies',
        termCount: 12,
        author: { name: 'Quizlet' },
        createdAt: new Date('2025-12-01T10:00:00'),
        type: 'set'
    },
    {
        id: '4',
        title: 'AI Jobs',
        termCount: 9,
        author: { name: 'Mr_Rime' },
        createdAt: new Date('2025-12-02T15:00:00'),
        type: 'folder'
    }
];

export function LibraryFolders() {
    const sortedItems = [...MOCK_ITEMS]
        .filter(item => item.type === 'folder')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const recentItems = sortedItems.filter(item => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return item.createdAt > oneHourAgo;
    });

    const thisWeekItems = sortedItems.filter(item => {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return item.createdAt > oneWeekAgo && item.createdAt <= oneHourAgo;
    });

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
        </div>
    );
}

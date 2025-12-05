import { Card, CardContent } from "@/components/ui/card";
import { FlashCardIcon } from "@/shared/ui/icons/flashcard-icon";

export function RecentItem() {
    return (
        <Card className="p-2 w-full">
            <CardContent className="flex items-center gap-5 p-2 w-full">
                <div className="border p-3 rounded-md">
                    <FlashCardIcon width={25} height={25} />
                </div>
                <div>
                    <div>A1 Jobs</div>
                    <div className="text-muted-foreground">12 cards</div>
                </div>
            </CardContent>
        </Card>
    )
}

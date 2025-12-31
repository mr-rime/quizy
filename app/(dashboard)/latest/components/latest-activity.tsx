import { JumpBackIn } from "@/features/practice/components/jump-back-in";
import { getActiveProgress } from "@/features/practice/services/progress";

interface LatestActivityProps {
    userId: string;
}

export async function LatestActivity({ userId }: LatestActivityProps) {
    const progressSessions = await getActiveProgress(userId);

    return <JumpBackIn progressSessions={progressSessions} />;
}

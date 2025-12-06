import { getUserProfile, getUserPublicSets } from "@/features/share/services/share";
import { notFound } from "next/navigation";
import { PublicProfile } from "@/features/profile/components/public-profile";

interface PageProps {
    params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
    const { userId } = await params;

    const [profile, publicSets] = await Promise.all([
        getUserProfile(userId),
        getUserPublicSets(userId)
    ]);

    if (!profile) {
        notFound();
    }

    return <PublicProfile profile={profile} publicSets={publicSets} />;
}

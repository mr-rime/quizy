import { getUserProfile, getUserPublicSets } from "@/features/share/services/share";
import { getCurrentUser } from "@/features/user/services/user";
import { notFound } from "next/navigation";
import { PublicProfile } from "@/features/profile/components/public-profile";

interface PageProps {
    params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
    const { userId } = await params;

    const [profile, publicSets, currentUser] = await Promise.all([
        getUserProfile(userId),
        getUserPublicSets(userId),
        getCurrentUser()
    ]);

    if (!profile) {
        notFound();
    }

    const isAdmin = currentUser?.role === "admin";
    
    if (profile.isPrivate && !isAdmin && currentUser?.id !== userId) {
        notFound();
    }

    return <PublicProfile profile={profile} publicSets={publicSets} isAdmin={isAdmin} />;
}

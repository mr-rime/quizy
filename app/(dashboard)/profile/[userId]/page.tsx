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
    
    const isProfileRestricted = profile.isPrivate || profile.role === "admin";
    const isViewerAuthorized = isAdmin || currentUser?.id === userId;

    if (isProfileRestricted && !isViewerAuthorized) {
        notFound();
    }

    return <PublicProfile profile={profile} publicSets={publicSets} isAdmin={isAdmin} />;
}

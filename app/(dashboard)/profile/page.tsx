import { getCurrentUser } from "@/features/user/services/user";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/features/user/components/profile-form";
import { Metadata } from "next";
import { isSitePrivate } from "@/features/user/services/site-settings";

export const metadata: Metadata = {
    title: "Profile Settings",
    description: "Manage your profile settings and preferences",
};

export default async function ProfilePage() {
    const [user, sitePrivate] = await Promise.all([
        getCurrentUser(),
        isSitePrivate()
    ]);

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            <ProfileForm 
                user={{
                    email: user.email,
                    username: user.username,
                    playAudioOnProgress: user.playAudioOnProgress,
                    isPrivate: user.isPrivate,
                    role: user.role
                }} 
                isSitePrivate={sitePrivate}
            />
        </div>
    );
}

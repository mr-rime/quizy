import { getPublicSet } from "@/features/share/services/share";
import { notFound } from "next/navigation";
import { PublicPracticeLayout } from "@/features/share/components/public-practice-layout";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PublicSharePage({ params }: PageProps) {
    const { id } = await params;

    const setPromise = getPublicSet(id);
    const set = await setPromise;

    if (!set) {
        notFound();
    }

    return <PublicPracticeLayout flashcardSetPromise={Promise.resolve(set)} />;
}

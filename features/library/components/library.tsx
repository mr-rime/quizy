import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryFlashcards } from "./library-flashcards";
import { LibraryFolders } from "./library-folders";
import { FlashcardSet, Folder } from "@/types";
import { User } from "@/types/auth";

interface LibraryProps {
    sets: FlashcardSet[];
    folders: Folder[];
    currentUser: User | null;
}

export function Library({ sets, folders, currentUser }: LibraryProps) {
    return (
        <div className="mt-10">
            <Tabs defaultValue="flashcards">
                <TabsList>
                    <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="folders">Folders</TabsTrigger>
                </TabsList>
                <TabsContent value="flashcards">
                    <LibraryFlashcards sets={sets} />
                </TabsContent>
                <TabsContent value="folders">
                    <LibraryFolders folders={folders} currentUser={currentUser} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

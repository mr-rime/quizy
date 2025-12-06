import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryFlashcards } from "./library-flashcards";
import { LibraryFolders } from "./library-folders";
import { FlashcardSet, Folder } from "@/types";

interface LibraryProps {
    sets: FlashcardSet[];
    folders: Folder[];
}

export function Library({ sets, folders }: LibraryProps) {
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
                    <LibraryFolders folders={folders} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

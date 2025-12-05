import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryFlashcards } from "./library-flashcards";
import { LibraryFolders } from "./library-folders";

interface LibraryProps {
    sets: any[];
}

export function Library({ sets }: LibraryProps) {
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
                    <LibraryFolders />
                </TabsContent>
            </Tabs>
        </div>
    )
}

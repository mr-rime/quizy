"use client"

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Languages, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/shared/constants/languages";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
    onSelectLanguage: (languageCode: string, languageName: string) => void;
    selectedLanguage?: string;
}

export function LanguageSelector({ onSelectLanguage, selectedLanguage }: LanguageSelectorProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredLanguages = useMemo(() => {
        if (!search) return SUPPORTED_LANGUAGES;
        return SUPPORTED_LANGUAGES.filter(lang =>
            lang.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const handleSelect = (languageCode: string, languageName: string) => {
        onSelectLanguage(languageCode, languageName);
        setOpen(false);
        setSearch("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    title="Translate definition"
                >
                    <Languages className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Select Language</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Search languages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                    />
                    <div className="max-h-[400px] overflow-y-auto space-y-1 pr-2">
                        {filteredLanguages.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No language found.</p>
                        ) : (
                            filteredLanguages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleSelect(language.code, language.name)}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left",
                                        selectedLanguage === language.code && "bg-accent"
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "h-4 w-4 flex-shrink-0",
                                            selectedLanguage === language.code ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span>{language.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

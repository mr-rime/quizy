"use client"

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useEffect } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
}

export function SearchBar({ onSearch, placeholder = "Search public sets...", initialValue = "" }: SearchBarProps) {
    const [value, setValue] = useState(initialValue);
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        if (debouncedValue !== initialValue) {
            onSearch(debouncedValue);
        }
    }, [debouncedValue, initialValue, onSearch]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="pl-10 pr-10"
            />
            {value && (
                <button
                    onClick={() => setValue("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

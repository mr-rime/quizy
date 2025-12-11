"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useImperativeHandle, forwardRef } from "react";

interface CharacterInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    index: number;
    status: "idle" | "correct" | "incorrect";
    onBack?: () => void;
    onForward?: () => void;
}

export const CharacterInput = forwardRef<HTMLInputElement, CharacterInputProps>(
    ({ className, status, onBack, onForward, onChange, ...props }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value.length > 1) {
                e.target.value = value.slice(-1);
            }

            onChange?.(e);

            if (e.target.value) {
                onForward?.();
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Backspace" && !e.currentTarget.value) {
                onBack?.();
            }
        };

        return (
            <input
                ref={inputRef}
                type="text"
                maxLength={1}
                className={cn(
                    "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-lg border-2 bg-background transition-all outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    status === "correct" && "border-green-500 bg-green-500/10 text-green-600",
                    status === "incorrect" && "border-destructive bg-destructive/10 text-destructive",
                    status === "idle" && "border-input",
                    className
                )}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                {...props}
            />
        );
    }
);

CharacterInput.displayName = "CharacterInput";

"use client";

import { useEffect, useRef } from "react";

export function useSoundEffects() {
    const correctAudio = useRef<HTMLAudioElement | null>(null);
    const incorrectAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        correctAudio.current = new Audio("/audio/correct-choice.mp3");
        incorrectAudio.current = new Audio("/audio/incorrect-choice.mp3");

        correctAudio.current.preload = "auto";
        incorrectAudio.current.preload = "auto";

        correctAudio.current.load();
        incorrectAudio.current.load();

        return () => {
            correctAudio.current = null;
            incorrectAudio.current = null;
        };
    }, []);

    const playCorrect = () => {
        if (correctAudio.current) {
            correctAudio.current.currentTime = 0;
            correctAudio.current.play().catch(e => console.error("Audio play failed", e));
        }
    };

    const playIncorrect = () => {
        if (incorrectAudio.current) {
            incorrectAudio.current.currentTime = 0;
            incorrectAudio.current.play().catch(e => console.error("Audio play failed", e));
        }
    };

    return { playCorrect, playIncorrect };
}

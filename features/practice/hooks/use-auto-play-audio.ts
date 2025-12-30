"use client";

import { useEffect, useRef } from "react";
import { useSpeech } from "./use-speech";


export function useAutoPlayAudio(playAudioOnProgress: boolean, term: string) {
    const { speak } = useSpeech();
    const hasPlayedRef = useRef(false);

    useEffect(() => {
        hasPlayedRef.current = false;
    }, [term]);

    const playIfEnabled = () => {
        if (playAudioOnProgress && term && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            setTimeout(() => {
                speak(term);
            }, 300);
        }
    };

    return { playIfEnabled };
}

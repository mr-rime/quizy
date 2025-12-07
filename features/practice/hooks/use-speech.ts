import { useCallback, useEffect, useRef } from "react";

export function useSpeech() {
    const lastSpeakTime = useRef(0);

    useEffect(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            const loadVoices = () => {
                window.speechSynthesis.getVoices();
            };
            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!text) return;

        const now = Date.now();
        const DEBOUNCE_DELAY = 1000;

        if (now - lastSpeakTime.current < DEBOUNCE_DELAY) {
            return;
        }

        if (typeof window === "undefined" || !window.speechSynthesis) {
            return;
        }

        window.speechSynthesis.cancel();
        lastSpeakTime.current = now;

        const utterance = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name === "Google US English")
            || voices.find(v => v.name.includes("Google") && v.lang.startsWith("en"))
            || voices.find(v => v.name.includes("Zira"))
            || voices.find(v => v.lang === "en-US")
            || voices.find(v => v.lang.startsWith("en"))
            || voices[0];

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
    }, []);

    return { speak };
}

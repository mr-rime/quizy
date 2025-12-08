import { useCallback, useEffect, useRef } from "react";

export function useSpeech() {
    const lastSpeakTime = useRef(0);

    const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

    const getBestArabicVoice = (voices: SpeechSynthesisVoice[]) => {
        const lower = (s: string) => s.toLowerCase();

        const googleArabic = voices.find(
            v => lower(v.name).includes("google") && lower(v.lang).startsWith("ar")
        );
        if (googleArabic) return googleArabic;

        const gendered = voices.find(
            v => lower(v.name).includes("arabic")
        );
        if (gendered) return gendered;

        const anyArabic = voices.find(
            v => lower(v.lang).startsWith("ar")
        );
        if (anyArabic) return anyArabic;

        return null;
    };

    const getBestEnglishVoice = (voices: SpeechSynthesisVoice[]) => {
        return (
            voices.find(v => v.name === "Google US English") ||
            voices.find(v => v.name.includes("Google") && v.lang.startsWith("en")) ||
            voices.find(v => v.name.includes("Zira")) ||
            voices.find(v => v.lang === "en-US") ||
            voices.find(v => v.lang.startsWith("en")) ||
            voices[0]
        );
    };

    useEffect(() => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        const loadVoices = () => window.speechSynthesis.getVoices();
        loadVoices();

        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const speak = useCallback((text: string) => {
        if (!text) return;

        const now = Date.now();
        if (now - lastSpeakTime.current < 1000) return;

        lastSpeakTime.current = now;

        const synth = window.speechSynthesis;
        if (!synth) return;

        synth.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();

        utter.voice = isArabic(text)
            ? getBestArabicVoice(voices) || getBestEnglishVoice(voices)
            : getBestEnglishVoice(voices);

        if (isArabic(text)) {
            utter.rate = 0.85;
            utter.pitch = 1.05;
        } else {
            utter.rate = 0.95;
            utter.pitch = 1;
        }

        utter.volume = 1;

        synth.speak(utter);
    }, []);

    return { speak };
}

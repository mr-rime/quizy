export { };

declare global {
    interface Window {
        responsiveVoice: {
            speak: (text: string, voice?: string, parameters?: object) => void;
            cancel: () => void;
            voiceSupport: () => boolean;
            setDefaultVoice: (voice: string) => void;
            isPlaying: () => boolean;
            pause: () => void;
            resume: () => void;
        };
    }
}

import { useState, useCallback, useRef } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [viseme, setViseme] = useState(0); // 0 to 1 for mouth opening
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop any current speech

      const utterance = new SpeechSynthesisUtterance(text);
      synthesisRef.current = utterance;

      utterance.onstart = () => {
        setIsSpeaking(true);
        animateViseme();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setViseme(0);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setViseme(0);
      };

      // Find a natural sounding voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const animateViseme = () => {
    if (!window.speechSynthesis.speaking) return;

    // Simple pseudo-viseme animation
    // In a real app, we'd use Web Audio API to analyze output or use a TTS with viseme events
    const frame = () => {
      if (window.speechSynthesis.speaking) {
        // Randomly jitter viseme to simulate speech
        setViseme(0.2 + Math.random() * 0.8);
        requestAnimationFrame(frame);
      } else {
        setViseme(0);
        setIsSpeaking(false);
      }
    };
    requestAnimationFrame(frame);
  };

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setViseme(0);
    }
  }, []);

  return {
    isSpeaking,
    viseme,
    speak,
    stop,
    hasSupport: typeof window !== "undefined" && !!window.speechSynthesis,
  };
}

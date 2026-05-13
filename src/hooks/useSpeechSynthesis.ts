import { useState, useCallback } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [viseme, setViseme] = useState(0); 

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onboundary = (event) => {
        const intensity = Math.min((event.charLength || 5) / 8, 1);
        setViseme(0.3 + intensity * 0.7);
        setTimeout(() => setViseme(0), 150);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setViseme(0);
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setViseme(0);
    }
  }, []);

  return { isSpeaking, viseme, speak, stop, hasSupport: typeof window !== "undefined" && !!window.speechSynthesis };
}



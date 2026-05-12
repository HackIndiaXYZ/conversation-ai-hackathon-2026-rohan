import { useState, useCallback, useRef } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [viseme, setViseme] = useState(0); 

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onboundary = (event) => {
        // Drive viseme based on boundary events (word/sentence)
        setViseme(event.charLength > 5 ? 0.8 : 0.4);
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

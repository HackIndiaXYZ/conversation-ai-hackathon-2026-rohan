import { useState, useCallback, useRef, useEffect } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [viseme, setViseme] = useState(0); 
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        // Setup Audio Analyser
        const audioCtx = new AudioContext();
        const dest = audioCtx.createMediaStreamDestination();
        const source = audioCtx.createBufferSource();
        // Note: Web Speech API doesn't expose raw audio stream directly easily,
        // we simulate intensity via a fallback or use the utterance volume.
        monitorVolume();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setViseme(0);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const monitorVolume = () => {
    // Fallback: Using speech synthesis state to drive viseme directly if raw audio isn't available
    const frame = () => {
      if (window.speechSynthesis.speaking) {
        // More sophisticated mapping based on utterance volume or progress
        setViseme(Math.sin(Date.now() / 100) * 0.3 + 0.5); 
        requestAnimationFrame(frame);
      } else {
        setViseme(0);
      }
    };
    requestAnimationFrame(frame);
  };

  return { isSpeaking, viseme, speak, hasSupport: typeof window !== "undefined" && !!window.speechSynthesis };
}

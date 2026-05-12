"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, User, MessageSquare, Settings, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Persona, personas } from "@/lib/personas";
import AvatarCanvas from "./AvatarCanvas";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function ChatInterface() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personas[0]);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  const { isListening, transcript, startListening, stopListening, hasSupport: hasSttSupport } = useSpeechRecognition();
  const { isSpeaking, viseme, speak, stop: stopSpeaking, hasSupport: hasTtsSupport } = useSpeechSynthesis();
  
  // Inside the return block, before the main layout
  {!hasTtsSupport && (
    <div className="bg-red-500 text-white p-2 text-center text-xs">Voice output is not supported in this browser.</div>
  )}
  
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", content: text }].slice(-15);
    setMessages(newMessages);
    setIsLoading(true);
    setChatInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: selectedPersona.systemPrompt },
            ...newMessages
          ]
        })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        // Split and process each line (handle potential multi-line chunks)
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
             fullResponse += line.slice(6);
          }
        }
      }

      setMessages([...newMessages, { role: "assistant", content: fullResponse }]);
      speak(fullResponse);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages([...newMessages, { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const transcriptRef = useRef("");
  
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      if (transcriptRef.current) handleSendMessage(transcriptRef.current);
    } else {
      stopSpeaking();
      startListening();
    }
  };

  const resetSession = () => {
    setMessages([]);
    stopSpeaking();
    stopListening();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar - Persona Switcher */}
      <div className="w-full lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Proxa Avatar RT</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pharma Sales Roleplay Engine</p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select HCP Persona</label>
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPersona(p);
                resetSession();
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedPersona.id === p.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >
              <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
              <div className="text-xs text-blue-500 mb-2">{p.role}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={resetSession}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <RotateCcw size={16} />
            Reset Session
          </button>
        </div>
      </div>

      {/* Main Content - Avatar & Transcript */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          {/* Avatar Panel */}
          <div className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <AvatarCanvas url={selectedPersona.avatarUrl} viseme={viseme} />
            
            {/* Persona Info Overlay */}
            <div className="absolute top-6 left-6 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-white max-w-xs">
              <div className="text-lg font-bold">{selectedPersona.name}</div>
              <div className="text-sm text-blue-300 mb-1">{selectedPersona.specialty}</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-slate-300">Mood: {selectedPersona.mood}</span>
              </div>
            </div>
          </div>

          {/* Transcript Panel */}
          <div className="h-48 lg:h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-lg">
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                <MessageSquare size={14} />
                Live Transcript
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isListening && transcript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm bg-blue-600/50 text-white rounded-tr-none italic animate-pulse">
                    {transcript}...
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-tl-none">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>

        {/* Interaction Controls */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={toggleListening}
              disabled={!hasSttSupport || !hasTtsSupport}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isListening 
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(chatInput)}
                placeholder={isListening ? "Listening..." : "Type your message or use the mic..."}
                className="w-full py-4 px-6 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white shadow-inner"
              />
              <button
                onClick={() => handleSendMessage(chatInput)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Powered by NVIDIA NIM & Web Speech API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

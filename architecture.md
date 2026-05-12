# Proxa Avatar RT - System Architecture

## Overview
Proxa Avatar RT is a real-time conversational AI system designed for pharmaceutical sales roleplay. It enables sales representatives to practice interactions with healthcare professionals (HCPs) using a lifelike, voice-driven AI avatar.

## High-Level Flow
1. **Audio Input**: User speaks into the browser microphone.
2. **STT (Speech-to-Text)**: Browser's Web Speech API transcribes audio in real-time.
3. **LLM Orchestration**: Transcription is sent to the backend.
4. **NVIDIA NIM LLM**: The system uses NVIDIA NIM (Llama-3-70b-instruct) with specific HCP persona prompts to generate a response.
5. **TTS (Text-to-Speech)**: The text response is converted to speech (using Web Speech API or OpenAI TTS).
6. **Avatar Animation**: Visemes/Audio data drive the 3D VRM avatar's lip movement and expressions in Three.js.

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion.
- **3D Rendering**: Three.js, @react-three/fiber, @pixiv/three-vrm.
- **AI/LLM**: NVIDIA NIM (Llama-3).
- **Voice**: Web Speech API (STT/TTS) for low latency; optional OpenAI TTS for higher quality.
- **State Management**: React Hooks & Context.

## Component Breakdown
- `AvatarCanvas`: Handles the 3D rendering and VRM model animation.
- `ChatInterface`: Main UI for interaction, transcript, and persona selection.
- `useSpeechRecognition`: Custom hook for real-time voice input.
- `useSpeechSynthesis`: Custom hook for voice output and lip-sync synchronization.
- `nvidia-nim.ts`: Integration layer for NVIDIA NIM APIs.

## Low Latency Strategy
- **Web Speech API**: Utilizes native browser capabilities for near-instant STT and TTS.
- **Streaming Responses**: LLM responses are processed to begin animation as soon as the first sentence is ready.
- **Optimized VRM Models**: Low-poly 3D models for fast loading and smooth performance in mobile browsers.

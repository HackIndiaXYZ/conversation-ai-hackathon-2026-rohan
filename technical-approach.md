# Technical Approach - Proxa Avatar RT

## 1. Real-Time Pipeline Optimization
To achieve the hackathon's requirement of <300ms latency, Proxa Avatar RT employs several strategies:
- **Client-Side STT/TTS**: By using the browser's Web Speech API, we eliminate the round-trip time of sending raw audio to a server for transcription. This provides near-instant feedback to the user.
- **Efficient LLM Inference**: NVIDIA NIM (NVIDIA Inference Microservices) provides state-of-the-art inference speeds for Llama-3, ensuring the "thinking" phase of the conversation is minimized.
- **Pseudo-Viseme Synthesis**: Instead of waiting for a complex viseme-generation model, we use a real-time amplitude-based animation strategy that syncs the avatar's mouth to the browser's audio output stream.

## 2. 3D Avatar System
The choice of the **VRM (Virtual Reality Model)** format is intentional:
- **Standardization**: VRM is an open standard based on GLTF, specifically designed for humanoid avatars.
- **Expression Management**: VRM provides a built-in `expressionManager` that allows easy programmatic control of facial features (e.g., mouth opening, blinking, smiling) which we map to the conversation's state.
- **Performance**: VRM models are highly optimized for web rendering, ensuring high frame rates even on mobile devices.

## 3. Persona Engineering
Our system prompt architecture uses a multi-layered approach:
- **Base Persona**: Identity, specialty, and years of experience.
- **Behavioral Constraints**: Level of skepticism, time availability, and priority values (e.g., patient safety vs. innovation).
- **Session Memory**: The system maintains a sliding window of the last 15 exchanges to ensure continuity and context-aware responses.

## 4. Integration Quality
Proxa Avatar RT is designed as an **internal SDK**. The separation between the `AvatarCanvas` and the `ChatInterface` allows Proxa Labs to easily embed the 3D avatar component into existing dashboards or learning management systems with minimal configuration.

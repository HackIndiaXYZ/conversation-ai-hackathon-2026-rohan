# Proxa Avatar RT

**Real-time Conversational AI Avatar for Pharmaceutical & Life Sciences Sales Roleplay.**

> 🚀 **[LIVE DEMO: Experience the Conversation AI Avatar](https://proxa-avatar-rt.vercel.app)**

Proxa Avatar RT is a high-fidelity, low-latency conversational platform that allows medical sales representatives to practice high-stakes interactions with AI-powered healthcare professionals.

## 🚀 Features
- **Real-Time 3D Avatar**: Lip-synced animation with natural head movement using Three.js and VRM models.
- **Voice-First Interaction**: Seamless push-to-talk experience with browser-native STT and TTS.
- **NVIDIA NIM Powered**: High-performance LLM responses using Llama-3-70B on NVIDIA's inference infrastructure.
- **HCP Personas**: Pre-configured specialized personas (Cardiologist, GP, Oncologist) with distinct personalities and skepticism levels.
- **Mobile Optimized**: Designed to run directly in mobile browsers for on-the-go practice.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion.
- **3D**: Three.js, `@react-three/fiber`, `@pixiv/three-vrm`.
- **AI**: NVIDIA NIM (LLM), Web Speech API (STT/TTS).
- **Deployment**: Vercel & Docker.

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- NVIDIA NIM API Key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/proxa-avatar-rt.git
   cd proxa-avatar-rt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file from `.env.example`:
   ```env
   NVIDIA_NIM_API_KEY=your_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Technical Approach

Proxa Avatar RT is a real-time conversational AI system designed for pharmaceutical sales roleplay. 

### Core Pipeline
1. **Audio Input**: User speaks into the browser microphone.
2. **STT (Speech-to-Text)**: Browser's Web Speech API transcribes audio in real-time.
3. **LLM Orchestration**: Transcription is sent to the backend.
4. **NVIDIA NIM LLM**: The system uses NVIDIA NIM (Llama-3.3-70b-instruct) to generate a response.
5. **TTS (Text-to-Speech)**: The text response is converted to speech (Web Speech API).
6. **Avatar Animation**: Audio-analysis-driven viseme animation in Three.js.

### Latency Optimization
- **Client-Side Processing**: By using the browser's native STT/TTS, we avoid unnecessary round-trips.
- **Streaming LLM Responses**: NVIDIA NIM streaming allows us to start processing the response before the full LLM inference completes, achieving near-zero wait time.
- **Pseudo-Viseme Synthesis**: We analyze the speech amplitude to drive the VRM model's mouth animation in real-time, providing immediate visual feedback.

---

## 🏗️ Architecture
See [architecture.md](./architecture.md) for a detailed breakdown of the system design.

## 📄 License
See [LICENSE](./LICENSE) for the project's MIT license and [third-party-licenses.md](./third-party-licenses.md) for details on dependencies.

---
Built for the **Conversation AI Hackathon 2026**.

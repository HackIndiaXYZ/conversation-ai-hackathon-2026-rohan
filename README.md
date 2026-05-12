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

See [architecture.md](architecture.md) and [technical-approach.md](technical-approach.md) for full system design details.

## 🏗️ Architecture
See [architecture.md](./architecture.md) for a detailed breakdown of the system design.

## 📄 License
See [third-party-licenses.md](./third-party-licenses.md) for details on components and APIs.

---
Built for the **Conversation AI Hackathon 2026**.

import { NextResponse } from "next/server";
import { getChatCompletion } from "@/lib/nvidia-nim";

const MAX_MESSAGES = 15;
const MAX_CONTENT_LENGTH = 1000;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const sanitizedMessages = messages
      .slice(-MAX_MESSAGES)
      .map(m => ({
        role: ["user", "assistant", "system"].includes(m.role) ? m.role : "user",
        content: String(m.content).slice(0, MAX_CONTENT_LENGTH)
      }));

    const apiKey = process.env.NVIDIA_NIM_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        await getChatCompletion(sanitizedMessages, apiKey, (chunk) => {
          controller.enqueue(encoder.encode(chunk));
        });
        controller.close();
      }
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

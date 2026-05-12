import { NextResponse } from "next/server";
import { getChatCompletion } from "@/lib/nvidia-nim";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.NVIDIA_NIM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "NVIDIA NIM API Key not configured" },
        { status: 500 }
      );
    }

    const content = await getChatCompletion(messages, apiKey);
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

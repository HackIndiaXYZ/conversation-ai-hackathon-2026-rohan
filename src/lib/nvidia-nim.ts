const NVIDIA_NIM_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export async function getChatCompletion(
  messages: { role: string; content: string }[],
  apiKey: string,
  onChunk: (chunk: string) => void
) {
  const response = await fetch(NVIDIA_NIM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta/llama-3.3-70b-instruct",
      messages,
      temperature: 0.7,
      max_tokens: 512,
      stream: true,
    }),
  });

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // Parse SSE format
    const lines = chunk.split("\n");
    for (const line of lines) {
        if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (data.choices[0].delta.content) {
                onChunk(data.choices[0].delta.content);
            }
        }
    }
  }
}

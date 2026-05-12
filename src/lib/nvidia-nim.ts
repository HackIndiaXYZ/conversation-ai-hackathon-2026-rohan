const NVIDIA_NIM_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export async function getChatCompletion(
  messages: { role: string; content: string }[],
  apiKey: string
) {
  const response = await fetch(NVIDIA_NIM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-70b-instruct", // or latest available
      messages,
      temperature: 0.7,
      max_tokens: 512,
      top_p: 1,
      stream: false, // For simpler demo, start with non-streaming
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get chat completion from NVIDIA NIM");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

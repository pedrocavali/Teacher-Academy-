import { GeminiProvider } from "@/lib/ai/gemini-provider";
import type { AIProvider, WritingFeedback } from "@/lib/ai/provider";

// The only place that knows which provider is behind AIProvider. Callers
// (server actions) only ever import from here, never gemini-provider.ts
// directly — swapping providers later means changing this one function.
let provider: AIProvider | null = null;

function getProvider(): AIProvider {
  if (provider) return provider;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured — AI feedback is unavailable until it is set.",
    );
  }

  provider = new GeminiProvider(apiKey);
  return provider;
}

export async function evaluateWriting(input: {
  prompt: string;
  submission: string;
  cefrLevel?: string;
}): Promise<WritingFeedback> {
  return getProvider().evaluateWriting(input);
}

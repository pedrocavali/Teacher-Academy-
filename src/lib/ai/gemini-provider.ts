import { GoogleGenAI, Type } from "@google/genai";
import type { AIProvider, WritingFeedback } from "@/lib/ai/provider";

// Free-tier friendly: fast, cheap, more than capable for structured
// feedback on a paragraph of writing. Change here only — nothing else
// references a model name (Blueprint Section 54: cost consciousness).
// gemini-2.5-flash is no longer available to new API keys as of mid-2026;
// confirmed gemini-3.5-flash works against this project's key.
const MODEL = "gemini-3.5-flash";

const WRITING_FEEDBACK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "1-3 specific things the learner did well, referencing their actual words.",
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "1-3 specific, actionable things to improve — never just 'wrong'.",
    },
    taskCompletion: {
      type: Type.STRING,
      enum: ["not_met", "partially_met", "met"],
    },
    overallComment: {
      type: Type.STRING,
      description: "One encouraging sentence summarizing the feedback.",
    },
  },
  required: ["strengths", "improvements", "taskCompletion", "overallComment"],
};

function buildWritingPrompt({
  prompt,
  submission,
  cefrLevel,
}: {
  prompt: string;
  submission: string;
  cefrLevel?: string;
}): string {
  return `You are an encouraging English teacher giving feedback to an adult learner${
    cefrLevel ? ` at approximately CEFR level ${cefrLevel}` : ""
  } on a writing task.

Writing task: "${prompt}"

Learner's submission:
"""
${submission}
"""

Evaluate the submission on grammar, vocabulary, coherence, and how well it completes the task. Be specific and constructive, referencing actual words or sentences from the submission. Never respond with just "wrong" — always explain what to improve and how to fix it.`;
}

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async evaluateWriting(input: {
    prompt: string;
    submission: string;
    cefrLevel?: string;
  }): Promise<WritingFeedback> {
    const response = await this.client.models.generateContent({
      model: MODEL,
      contents: buildWritingPrompt(input),
      config: {
        responseMimeType: "application/json",
        responseSchema: WRITING_FEEDBACK_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from the AI provider.");
    }

    return JSON.parse(text) as WritingFeedback;
  }
}

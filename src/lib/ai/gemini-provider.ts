import { GoogleGenAI, Type } from "@google/genai";
import type { AIProvider, SpeakingFeedback, WritingFeedback } from "@/lib/ai/provider";

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

const SKILL_RATING_ENUM = ["low", "medium", "high"];

const SPEAKING_FEEDBACK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    transcript: {
      type: Type.STRING,
      description: "What the speaker actually said, transcribed as-is (empty string if no speech).",
    },
    intelligibility: { type: Type.STRING, enum: SKILL_RATING_ENUM },
    fluency: { type: Type.STRING, enum: SKILL_RATING_ENUM },
    vocabulary: { type: Type.STRING, enum: SKILL_RATING_ENUM },
    grammar: { type: Type.STRING, enum: SKILL_RATING_ENUM },
    responseQuality: {
      type: Type.STRING,
      enum: ["not_met", "partially_met", "met"],
      description: "How well the response addresses the prompt.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "1-3 specific things the speaker did well, referencing what they actually said.",
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "1-3 specific, actionable things to improve — never just 'wrong'.",
    },
    overallComment: {
      type: Type.STRING,
      description: "One encouraging sentence summarizing the feedback.",
    },
  },
  required: [
    "transcript",
    "intelligibility",
    "fluency",
    "vocabulary",
    "grammar",
    "responseQuality",
    "strengths",
    "improvements",
    "overallComment",
  ],
};

function buildSpeakingPrompt({
  prompt,
  cefrLevel,
}: {
  prompt: string;
  cefrLevel?: string;
}): string {
  return `You are an encouraging English teacher giving spoken feedback to an adult learner${
    cefrLevel ? ` at approximately CEFR level ${cefrLevel}` : ""
  }.

Speaking task: "${prompt}"

Listen to the attached audio recording of the learner's response. First transcribe what they actually said. Then evaluate intelligibility (can you understand them), fluency (do they speak smoothly, without excessive pauses/restarts), vocabulary range, grammar accuracy, and how well the response addresses the task. Be specific and constructive, referencing what they actually said. Never respond with just "wrong" — always explain what to improve and how. If the audio has no speech (e.g. silence or noise), say so in the transcript and overall comment, and rate everything "low".`;
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

  async evaluateSpeaking(input: {
    prompt: string;
    audioBase64: string;
    audioMimeType: string;
    cefrLevel?: string;
  }): Promise<SpeakingFeedback> {
    // Browsers report MediaRecorder mime types with a codec suffix (e.g.
    // "audio/webm;codecs=opus"); confirmed live against the Gemini API that
    // it wants the bare type only.
    const mimeType = input.audioMimeType.split(";")[0];

    const response = await this.client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: buildSpeakingPrompt(input) },
            { inlineData: { mimeType, data: input.audioBase64 } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: SPEAKING_FEEDBACK_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from the AI provider.");
    }

    return JSON.parse(text) as SpeakingFeedback;
  }
}

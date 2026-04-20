import { action } from "./_generated/server";
import { v } from "convex/values";
import { z } from "zod";

const QuestionSchema = z.object({
  text: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().optional().or(z.literal("")),
});

const QuestionsSchema = z.array(QuestionSchema).min(1);

const TavilyResultSchema = z.object({
  results: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      url: z.string(),
    })
  ),
});

async function fetchWebContext(topic: string): Promise<string> {
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (!tavilyKey) return "";

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: topic,
        search_depth: "basic",
        max_results: 3,
        include_answer: false,
      }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    const parsed = TavilyResultSchema.safeParse(data);
    if (!parsed.success) return "";
    return parsed.data.results
      .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}`)
      .join("\n\n");
  } catch {
    return "";
  }
}

type GeneratedQuestion = {
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

async function attemptGenerate(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  count: number
): Promise<GeneratedQuestion[]> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.VERCEL_PROJECT_PRODUCTION_URL || "http://localhost:3000",
      "X-Title": "Quizlr",
    },
    body: JSON.stringify({
      model,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "quiz_questions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string", description: "The question text" },
                    options: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 4,
                      maxItems: 4,
                      description: "Exactly 4 answer choices",
                    },
                    correctIndex: {
                      type: "integer",
                      minimum: 0,
                      maximum: 3,
                      description: "Index of the correct option (0-3)",
                    },
                    explanation: {
                      type: "string",
                      description: "Brief explanation of why the answer is correct",
                    },
                  },
                  required: ["text", "options", "correctIndex", "explanation"],
                  additionalProperties: false,
                },
              },
            },
            required: ["questions"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const msg = `OpenRouter API error ${response.status}: ${errText.slice(0, 300)}`;
    const err = new Error(msg) as Error & { retryable: boolean };
    err.retryable = response.status === 429;
    throw err;
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("AI returned an empty response");

  let jsonStr = content.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("AI returned invalid JSON — could not parse response");
  }

  const rawArray = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { questions?: unknown }).questions)
      ? (parsed as { questions: unknown[] }).questions
      : [];

  const result = QuestionsSchema.safeParse(rawArray);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.issues[0]?.message ?? "unknown error"}`);
  }

  return result.data.slice(0, count).map((q) => ({
    text: q.text.trim(),
    options: q.options.map((o) => o.trim()),
    correctIndex: q.correctIndex,
    explanation: q.explanation?.trim(),
  }));
}

const MAX_ATTEMPTS = 5;

export const generateQuestions = action({
  args: {
    topic: v.string(),
    count: v.number(),
    timeLimit: v.number(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

    const model = process.env.OPENROUTER_MODEL ?? "openrouter/free";

    const webContext = await fetchWebContext(args.topic);
    const contextBlock = webContext
      ? `\n\nHere is recent web context to inform your questions — use it for accuracy but do not quote it verbatim:\n${webContext}`
      : "";

    const systemPrompt = `You are a quiz question generator. Generate exactly ${args.count} multiple-choice questions about the given topic. Each question must have exactly 4 answer options with one correct answer. Write a brief explanation for every question.`;

    const userPrompt = `Generate exactly ${args.count} quiz questions.
Topic: ${args.topic}
Time per question: ${args.timeLimit} seconds${contextBlock}`;

    let lastError: Error = new Error("Unknown error");
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await attemptGenerate(apiKey, model, systemPrompt, userPrompt, args.count);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const retryable = (err as Error & { retryable?: boolean }).retryable;
        // Only retry on rate limits (429) or bad output — throw immediately on hard API errors
        if (lastError.message.startsWith("OpenRouter API error") && retryable !== true) throw lastError;
      }
    }
    throw new Error(`Failed after ${MAX_ATTEMPTS} attempts: ${lastError.message}`);
  },
});

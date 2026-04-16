import { action } from "./_generated/server";
import { v } from "convex/values";

interface RawQuestion {
  text: unknown;
  options: unknown;
  correctIndex: unknown;
  explanation?: unknown;
}

export const generateQuestions = action({
  args: {
    topic: v.string(),
    count: v.number(),
    timeLimit: v.number(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

    const model = process.env.OPENROUTER_MODEL ?? "openrouter/auto";

    const systemPrompt = `You are a quiz question generator. Generate exactly ${args.count} multiple-choice questions about the given topic.
Return ONLY a valid JSON array — no markdown, no extra text, no code fences.
Each question object must have exactly these fields:
  "text": the question string
  "options": an array of exactly 4 answer strings
  "correctIndex": integer 0-3 indicating the correct option
  "explanation": a short explanation string (optional but encouraged)`;

    const userPrompt = `Topic: ${args.topic}
Time per question: ${args.timeLimit} seconds
Count: ${args.count}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://quizlr.app",
          "X-Title": "Quizlr",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `OpenRouter API error ${response.status}: ${errText.slice(0, 300)}`
      );
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    if (!content) throw new Error("AI returned an empty response");

    // Strip possible markdown code fences
    let jsonStr = content.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      throw new Error("AI returned invalid JSON — could not parse response");
    }

    // Handle both bare array and { questions: [...] } shapes
    const rawArray: RawQuestion[] = Array.isArray(parsed)
      ? (parsed as RawQuestion[])
      : Array.isArray((parsed as { questions?: unknown }).questions)
        ? ((parsed as { questions: RawQuestion[] }).questions)
        : [];

    if (rawArray.length === 0) {
      throw new Error("AI returned no questions — try a different topic");
    }

    // Validate and normalise
    return rawArray.map((q, i) => {
      if (typeof q.text !== "string" || !q.text.trim())
        throw new Error(`Question ${i + 1} is missing "text"`);
      if (!Array.isArray(q.options) || q.options.length !== 4)
        throw new Error(`Question ${i + 1} must have exactly 4 options`);
      if (
        typeof q.correctIndex !== "number" ||
        q.correctIndex < 0 ||
        q.correctIndex > 3 ||
        !Number.isInteger(q.correctIndex)
      )
        throw new Error(`Question ${i + 1} has an invalid "correctIndex"`);
      return {
        text: q.text.trim(),
        options: (q.options as unknown[]).map((o) => String(o).trim()),
        correctIndex: q.correctIndex,
        explanation:
          typeof q.explanation === "string" ? q.explanation.trim() : undefined,
      };
    });
  },
});

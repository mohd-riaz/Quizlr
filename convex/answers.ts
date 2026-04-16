import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listBySessionAndQuestion = query({
  args: {
    sessionId: v.id("sessions"),
    questionId: v.id("questions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("answers")
      .withIndex("by_sessionId_questionId", (q) =>
        q.eq("sessionId", args.sessionId).eq("questionId", args.questionId)
      )
      .collect();
  },
});

export const submit = mutation({
  args: {
    sessionId: v.id("sessions"),
    questionId: v.id("questions"),
    participantId: v.id("participants"),
    selectedIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.status !== "active") throw new Error("Question is not active");

    // Idempotency: ignore duplicate submissions
    const existing = await ctx.db
      .query("answers")
      .withIndex("by_sessionId_participantId_questionId", (q) =>
        q
          .eq("sessionId", args.sessionId)
          .eq("participantId", args.participantId)
          .eq("questionId", args.questionId)
      )
      .first();
    if (existing) return existing._id;

    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");

    const quiz = await ctx.db.get(session.quizId);
    if (!quiz) throw new Error("Quiz not found");

    const isCorrect = args.selectedIndex === question.correctIndex;
    const answeredAt = Date.now();
    const elapsedMs = session.questionStartedAt
      ? answeredAt - session.questionStartedAt
      : quiz.timeLimit * 1000;
    const timeLimitMs = quiz.timeLimit * 1000;

    let pointsEarned = 0;
    if (isCorrect) {
      const raw = 400 + 600 * (1 - elapsedMs / timeLimitMs);
      pointsEarned = Math.round(Math.max(400, Math.min(1000, raw)));
    }

    const answerId = await ctx.db.insert("answers", {
      sessionId: args.sessionId,
      questionId: args.questionId,
      participantId: args.participantId,
      selectedIndex: args.selectedIndex,
      answeredAt,
      isCorrect,
      pointsEarned,
    });

    // Update participant score
    const participant = await ctx.db.get(args.participantId);
    if (participant) {
      await ctx.db.patch(args.participantId, {
        score: participant.score + pointsEarned,
      });
    }

    return answerId;
  },
});

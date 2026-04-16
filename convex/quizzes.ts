import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const questionArgs = v.object({
  text: v.string(),
  options: v.array(v.string()),
  correctIndex: v.number(),
  explanation: v.optional(v.string()),
});

export const listByHost = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_hostId", (q) => q.eq("hostId", userId))
      .order("desc")
      .collect();
    // attach question count to each quiz
    const withCounts = await Promise.all(
      quizzes.map(async (quiz) => {
        const questions = await ctx.db
          .query("questions")
          .withIndex("by_quizId", (q) => q.eq("quizId", quiz._id))
          .collect();
        return { ...quiz, questionCount: questions.length };
      })
    );
    return withCounts;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    timeLimit: v.number(),
    questions: v.array(questionArgs),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    const quizId = await ctx.db.insert("quizzes", {
      hostId: userId,
      title: args.title,
      description: args.description,
      timeLimit: args.timeLimit,
      createdAt: now,
      updatedAt: now,
    });

    for (let i = 0; i < args.questions.length; i++) {
      const q = args.questions[i];
      await ctx.db.insert("questions", {
        quizId,
        order: i,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    }

    return quizId;
  },
});

export const update = mutation({
  args: {
    quizId: v.id("quizzes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    timeLimit: v.optional(v.number()),
    questions: v.optional(v.array(questionArgs)),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");
    if (quiz.hostId !== userId) throw new Error("Not authorized");

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) patch.title = args.title;
    if (args.description !== undefined) patch.description = args.description;
    if (args.timeLimit !== undefined) patch.timeLimit = args.timeLimit;
    await ctx.db.patch(args.quizId, patch);

    if (args.questions !== undefined) {
      // Full replace: delete existing questions then re-insert
      const existing = await ctx.db
        .query("questions")
        .withIndex("by_quizId", (q) => q.eq("quizId", args.quizId))
        .collect();
      for (const q of existing) await ctx.db.delete(q._id);

      for (let i = 0; i < args.questions.length; i++) {
        const q = args.questions[i];
        await ctx.db.insert("questions", {
          quizId: args.quizId,
          order: i,
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        });
      }
    }

    return args.quizId;
  },
});

export const deleteQuiz = mutation({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");
    if (quiz.hostId !== userId) throw new Error("Not authorized");

    // Cascade: delete all questions
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quizId", (q) => q.eq("quizId", args.quizId))
      .collect();
    for (const q of questions) await ctx.db.delete(q._id);

    await ctx.db.delete(args.quizId);
  },
});

export const getById = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) return null;
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quizId_order", (q) => q.eq("quizId", args.quizId))
      .order("asc")
      .collect();
    return { ...quiz, questions };
  },
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

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
  },
  handler: async (_ctx, _args) => {
    throw new Error("not implemented");
  },
});

export const update = mutation({
  args: {
    quizId: v.id("quizzes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    timeLimit: v.optional(v.number()),
  },
  handler: async (_ctx, _args) => {
    throw new Error("not implemented");
  },
});

export const deleteQuiz = mutation({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (_ctx, _args) => {
    throw new Error("not implemented");
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

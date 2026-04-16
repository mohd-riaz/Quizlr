import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/** 6-char uppercase alphanumeric join code */
function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // remove ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ── Queries ──────────────────────────────────────────────────────────────────

export const getByJoinCode = query({
  args: { joinCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_joinCode", (q) =>
        q.eq("joinCode", args.joinCode.toUpperCase())
      )
      .first();
  },
});

export const getById = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

// ── Mutations ─────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    quizId: v.id("quizzes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify ownership
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");
    if (quiz.hostId !== userId) throw new Error("Not authorized");

    // Generate a unique join code (retry on collision)
    let joinCode = generateJoinCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await ctx.db
        .query("sessions")
        .withIndex("by_joinCode", (q) => q.eq("joinCode", joinCode))
        .first();
      if (!existing) break;
      joinCode = generateJoinCode();
      attempts++;
    }

    const sessionId = await ctx.db.insert("sessions", {
      quizId: args.quizId,
      hostId: userId,
      joinCode,
      status: "lobby",
      currentQuestionIndex: 0,
      createdAt: Date.now(),
    });

    // Create the host participant record
    const hostParticipantId = await ctx.db.insert("participants", {
      sessionId,
      userId,
      nickname: "Host",
      isHost: true,
      score: 0,
      joinedAt: Date.now(),
    });

    return { sessionId, joinCode, hostParticipantId };
  },
});

export const start = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.hostId !== userId) throw new Error("Not authorized");
    if (session.status !== "lobby") throw new Error("Session is not in lobby");

    await ctx.db.patch(args.sessionId, {
      status: "active",
      currentQuestionIndex: 0,
      questionStartedAt: Date.now(),
    });
  },
});

export const endQuestion = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.hostId !== userId) throw new Error("Not authorized");
    if (session.status !== "active") throw new Error("Session is not active");

    await ctx.db.patch(args.sessionId, { status: "question_end" });
  },
});

export const advanceQuestion = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.hostId !== userId) throw new Error("Not authorized");
    if (session.status !== "question_end")
      throw new Error("Session is not in question_end state");

    // Check if there are more questions
    const quiz = await ctx.db.get(session.quizId);
    if (!quiz) throw new Error("Quiz not found");
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quizId", (q) => q.eq("quizId", session.quizId))
      .collect();

    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex >= questions.length) {
      // All questions done — finish
      await ctx.db.patch(args.sessionId, { status: "finished" });
    } else {
      await ctx.db.patch(args.sessionId, {
        status: "active",
        currentQuestionIndex: nextIndex,
        questionStartedAt: Date.now(),
      });
    }
  },
});

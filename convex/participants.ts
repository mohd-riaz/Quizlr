import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listBySession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const getById = query({
  args: { participantId: v.id("participants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.participantId);
  },
});

export const join = mutation({
  args: {
    sessionId: v.id("sessions"),
    nickname: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.status !== "lobby")
      throw new Error("Session has already started");

    const participantId = await ctx.db.insert("participants", {
      sessionId: args.sessionId,
      userId: undefined,
      nickname: args.nickname.trim(),
      isHost: false,
      score: 0,
      joinedAt: Date.now(),
    });

    return participantId;
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  quizzes: defineTable({
    hostId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    timeLimit: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_hostId", ["hostId"]),

  questions: defineTable({
    quizId: v.id("quizzes"),
    order: v.number(),
    text: v.string(),
    options: v.array(v.string()),
    correctIndex: v.number(),
    explanation: v.optional(v.string()),
  })
    .index("by_quizId", ["quizId"])
    .index("by_quizId_order", ["quizId", "order"]),

  sessions: defineTable({
    quizId: v.id("quizzes"),
    hostId: v.id("users"),
    joinCode: v.string(),
    status: v.union(
      v.literal("lobby"),
      v.literal("active"),
      v.literal("question_end"),
      v.literal("finished")
    ),
    currentQuestionIndex: v.number(),
    questionStartedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_joinCode", ["joinCode"]),

  participants: defineTable({
    sessionId: v.id("sessions"),
    userId: v.optional(v.id("users")),
    nickname: v.string(),
    isHost: v.boolean(),
    score: v.number(),
    joinedAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  answers: defineTable({
    sessionId: v.id("sessions"),
    questionId: v.id("questions"),
    participantId: v.id("participants"),
    selectedIndex: v.number(),
    answeredAt: v.number(),
    isCorrect: v.boolean(),
    pointsEarned: v.number(),
  })
    .index("by_sessionId_participantId_questionId", ["sessionId", "participantId", "questionId"])
    .index("by_sessionId_questionId", ["sessionId", "questionId"]),
});

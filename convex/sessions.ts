import { query } from "./_generated/server";
import { v } from "convex/values";

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

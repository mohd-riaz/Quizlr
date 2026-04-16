"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Wordmark / Logo */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            Quiz<span className="text-indigo-400">lr</span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm tracking-wide uppercase">
            The real-time quiz platform
          </p>
        </div>

        {/* Auth Card */}
        <Card className="w-full bg-slate-800/60 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="pb-2">
            <h2 className="text-xl font-semibold text-white text-center">
              {flow === "signIn" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-slate-400 text-sm text-center mt-1">
              {flow === "signIn"
                ? "Sign in to join your quiz session"
                : "Sign up to start hosting quizzes"}
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                setError(null);
                const formData = new FormData(e.target as HTMLFormElement);
                formData.set("flow", flow);
                void signIn("password", formData)
                  .catch((err: Error) => {
                    setError(err.message);
                    setLoading(false);
                  })
                  .then(() => {
                    router.push("/");
                  });
              }}
            >
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-slate-300 text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="bg-slate-900/70 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="password"
                  className="text-slate-300 text-sm font-medium"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                  className="bg-slate-900/70 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                />
                {flow === "signUp" && (
                  <p className="text-xs text-slate-500 px-0.5">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md hover:shadow-indigo-900/50 transition-all duration-200 cursor-pointer"
              >
                {loading
                  ? "Loading..."
                  : flow === "signIn"
                  ? "Sign in"
                  : "Sign up"}
              </Button>

              {/* Toggle flow */}
              <div className="flex flex-row gap-2 text-sm justify-center pt-1">
                <span className="text-slate-400">
                  {flow === "signIn"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>
                <button
                  type="button"
                  className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 hover:no-underline cursor-pointer transition-colors"
                  onClick={() =>
                    setFlow(flow === "signIn" ? "signUp" : "signIn")
                  }
                >
                  {flow === "signIn" ? "Sign up" : "Sign in"}
                </button>
              </div>

              {/* Error display */}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/40 rounded-lg p-4 mt-1">
                  <p className="text-rose-400 font-medium text-sm break-words">
                    {error}
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} Quizlr
        </p>
      </div>
    </div>
  );
}

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

/** GitHub SVG icon */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.628-5.479 5.923.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

/** Google SVG icon */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(null);
  const router = useRouter();

  const handleOAuth = async (provider: "github" | "google") => {
    setOauthLoading(provider);
    setError(null);
    try {
      await signIn(provider, { redirectTo: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth sign-in failed.");
      setOauthLoading(null);
    }
  };

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

          <CardContent className="pt-4 flex flex-col gap-5">
            {/* ── OAuth buttons ─────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleOAuth("github")}
                disabled={oauthLoading !== null}
                className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg border border-slate-600 transition-colors text-sm"
              >
                <GitHubIcon className="w-5 h-5" />
                {oauthLoading === "github" ? "Redirecting…" : "Continue with GitHub"}
              </button>

              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={oauthLoading !== null}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-medium py-2.5 rounded-lg border border-gray-200 transition-colors text-sm"
              >
                <GoogleIcon className="w-5 h-5" />
                {oauthLoading === "google" ? "Redirecting…" : "Continue with Google"}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* ── Email / Password form ─────────────────────────────── */}
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
                disabled={loading || oauthLoading !== null}
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
                  <p className="text-rose-400 font-medium text-sm wrap-break-word">
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

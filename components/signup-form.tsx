"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { mapConvexAuthError } from "@/utils/map-convex-auth-error";

const PASSWORD_RULES: { label: string; test: (p: string) => boolean }[] = [
  { label: "8+ characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  { label: "Special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
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

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [step, setStep] = useState<"signUp" | { email: string }>("signUp");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordRulesPassed = password.length > 0 && PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const showRules = password.length > 0;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  const handleOAuth = async (provider: "github" | "google") => {
    setOauthLoading(provider);
    setError(null);
    try {
      await signIn(provider, { redirectTo: "/" });
    } catch (err) {
      setError(mapConvexAuthError(err));
      setOauthLoading(null);
    }
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordRulesPassed) {
      setError("Please meet all password requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    formData.set("flow", "signUp");
    void signIn("password", formData)
      .then(() => { setLoading(false); setStep({ email }); })
      .catch((err: Error) => {
        setError(mapConvexAuthError(err));
        setLoading(false);
      });
  };

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    void signIn("password", formData)
      .then(() => router.push("/"))
      .catch((err: Error) => {
        setError(mapConvexAuthError(err));
        setLoading(false);
      });
  };

  const disabled = loading || oauthLoading !== null;

  if (step !== "signUp") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-foreground mx-auto mb-4"
            >
              Quiz<span className="text-muted-foreground">lr</span>
            </Link>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to <strong>{step.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form
                onSubmit={handleVerify}
                className="flex flex-col gap-5"
                onChange={() => setError(null)}
              >
                <input type="hidden" name="flow" value="email-verification" />
                <input type="hidden" name="email" value={step.email} />

                <Field>
                  <FieldLabel htmlFor="code">Verification code</FieldLabel>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    maxLength={6}
                    autoFocus
                    autoComplete="one-time-code"
                    required
                    disabled={loading}
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                  />
                  <FieldDescription>Enter the code from your email. It expires in 15 minutes.</FieldDescription>
                </Field>

                {error && (
                  <FieldDescription className="text-destructive">
                    {error}
                  </FieldDescription>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Verifying…" : "Verify email"}
                </Button>

                <FieldDescription className="text-center">
                  Wrong email?{" "}
                  <button
                    type="button"
                    className="underline underline-offset-4 hover:text-primary"
                    onClick={() => { setStep("signUp"); setError(null); }}
                  >
                    Go back
                  </button>
                </FieldDescription>
              </form>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-foreground mx-auto mb-4"
          >
            Quiz<span className="text-muted-foreground">lr</span>
          </Link>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to start hosting quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                size="lg"
                disabled={disabled}
                onClick={() => handleOAuth("github")}
              >
                <GitHubIcon className="size-4" />
                {oauthLoading === "github" ? "Redirecting…" : "GitHub"}
              </Button>
              <Button
                variant="outline"
                type="button"
                size="lg"
                disabled={disabled}
                onClick={() => handleOAuth("google")}
              >
                <GoogleIcon className="size-4" />
                {oauthLoading === "google" ? "Redirecting…" : "Google"}
              </Button>
            </div>

            <FieldSeparator color="bg-card">or</FieldSeparator>

            <form
              onSubmit={handleSignUp}
              className="flex flex-col gap-5"
              onChange={() => setError(null)}
            >
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={disabled}
                  aria-invalid={!!error}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  disabled={disabled}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
                  aria-invalid={showRules && !passwordRulesPassed}
                />
                {showRules && (
                  <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <span key={rule.label} className={`flex items-center gap-1 text-xs ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                          {passed ? <Check className="size-3 shrink-0" /> : <X className="size-3 shrink-0" />}
                          {rule.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  disabled={disabled}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value.replace(/\s/g, ""))}
                  aria-invalid={showMatchError}
                />
                {showMatchError && (
                  <FieldDescription className="text-destructive">
                    Passwords do not match.
                  </FieldDescription>
                )}
                {passwordsMatch && (
                  <FieldDescription className="text-emerald-600 dark:text-emerald-400">
                    Passwords match.
                  </FieldDescription>
                )}
              </Field>

              {error && (
                <FieldDescription className="text-destructive">
                  {error}
                </FieldDescription>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={disabled || !passwordRulesPassed || !passwordsMatch}
              >
                {loading ? "Loading…" : "Create account"}
              </Button>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </form>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

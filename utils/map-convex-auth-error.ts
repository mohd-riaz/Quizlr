export function mapConvexAuthError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  const msg = error.message;

  // Password auth
  if (msg.includes("InvalidAccountId") || msg.includes("InvalidSecret")) {
    return "Incorrect email or password.";
  }

  // if (msg.includes("InvalidAccountId")) {
  //   return "No account found with this email.";
  // }

  if (msg.includes("email not verified")) {
    return "Please verify your email before signing in.";
  }

  // OAuth
  if (msg.includes("oauth") || msg.includes("redirect")) {
    return "Sign-in failed. Try again or use another method.";
  }

  // Network / unknown
  return "Something went wrong. Please try again.";
}
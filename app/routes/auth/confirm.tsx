import { redirect } from "react-router";
import {
  validateMagicLinkKey,
  createUserSession,
  getSession,
} from "~/lib/auth";
import { handleEmailConfirmation } from "~/lib/billing/confirmEmail.server";
import { trackAuthEvent, EVENT_TYPES } from "~/lib/analytics/events.server";
import { authQueries } from "~/lib/db/index.server";
import type { Route } from "./+types/confirm";

// Primary loader for handling magic link confirmation
// This is the endpoint that gets hit when users click the link in their email
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const redirectTo = url.searchParams.get("redirectTo") || "/auth/success";

  // Get IP and user agent for analytics
  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    // @ts-expect-error - socket exists on request in development
    request.socket?.remoteAddress ||
    "localhost";
  const userAgent = request.headers.get("user-agent") || undefined;

  // Get session for analytics
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session?.id || "unknown";

  if (!key) {
    // Track failed login attempt
    await trackAuthEvent({
      eventType: EVENT_TYPES.LOGIN_FAILED,
      email: "unknown",
      sessionId,
      ipAddress: ipAddress.split(",")[0].trim(),
      userAgent,
      success: false,
      errorMessage: "Missing key in URL",
    });

    return redirect("/auth/login?error=Invalid+or+expired+link");
  }

  try {
    // Validate the magic link key
    const validation = await validateMagicLinkKey(key);

    if (!validation.valid || !validation.userId) {
      // Track failed login attempt
      await trackAuthEvent({
        eventType: EVENT_TYPES.LOGIN_FAILED,
        email: "unknown",
        sessionId,
        ipAddress: ipAddress.split(",")[0].trim(),
        userAgent,
        success: false,
        errorMessage: "Invalid or expired magic link",
      });

      return redirect("/auth/login?error=Invalid+or+expired+link");
    }

    // Get user for analytics tracking
    const user = await authQueries.getUserById(validation.userId);

    // Create or update Stripe customer record when email is confirmed
    // This happens asynchronously to not block the auth flow
    try {
      await handleEmailConfirmation(validation.userId);
    } catch (stripeError) {
      // Log but don't fail authentication if Stripe has issues
      console.error("Stripe customer creation failed:", stripeError);
    }

    // Determine redirect destination based on user role
    let destination = redirectTo;

    if (validation.role === "admin") {
      destination = "/admin";
    } else if (redirectTo === "/admin") {
      // Don't allow non-admins to access admin, redirect to success page instead
      destination = "/auth/success";
    } else {
      // For regular users, redirect to success page first
      // The success page will then redirect to profile after countdown
      destination = "/auth/success";
    }

    // Track successful login
    if (user) {
      await trackAuthEvent({
        eventType: EVENT_TYPES.LOGIN_SUCCESS,
        userId: validation.userId,
        email: user.email,
        sessionId,
        ipAddress: ipAddress.split(",")[0].trim(),
        userAgent,
        success: true,
      });
    }

    // Create a session and redirect
    return createUserSession(validation.userId, destination);
  } catch (error) {
    console.error("Error confirming magic link:", error);

    // Track failed login attempt
    await trackAuthEvent({
      eventType: EVENT_TYPES.LOGIN_FAILED,
      email: "unknown",
      sessionId,
      ipAddress: ipAddress.split(",")[0].trim(),
      userAgent,
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return redirect("/auth/login?error=Authentication+failed");
  }
}

// Fallback action for form submissions (though not expected to be used)
export async function action({ request }: Route.ActionArgs) {
  // Just redirect to login if somehow a POST request comes here
  return redirect("/auth/login");
}

// This component doesn't render anything since it always redirects
export default function Confirm() {
  return null;
}

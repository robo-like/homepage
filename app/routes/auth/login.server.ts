import { redirect } from "react-router";
import {
  auth,
  createMagicLinkKey,
  sendMagicLinkEmail,
  getSession,
  addUserToBrevoList,
} from "~/lib/auth";
import { authQueries } from "~/lib/db";
import {
  trackAuthEvent,
  trackUserCreated,
  EVENT_TYPES,
} from "~/lib/analytics/events.server";
import type { Route } from "./+types/login";

// Check for valid email format and constraints from prompts
function isValidEmail(email: string) {
  if (!email) return false;

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  // Check for "+" in the local part as per requirements
  const localPart = email.split("@")[0];
  if (localPart.includes("+")) return false;

  return true;
}

// Server-only code
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const authData = await auth(request);
  if (authData.user) {
    if (authData.user.role === "admin") {
      return redirect("/admin");
    } else {
      return redirect("/auth/success");
    }
  }
  return { error: error || undefined };
}

// Server-only code
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  // Normalize email: lowercase and trim whitespace
  const rawEmail = formData.get("email")?.toString() || "";
  const email = rawEmail.toLowerCase().trim();
  const redirectTo = formData.get("redirectTo")?.toString() || undefined;

  // Validate email presence
  if (!email) {
    return { success: false, error: "Email is required" };
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return {
      success: false,
      error: "Please provide a valid email address without + characters",
    };
  }

  try {
    // Get IP address and user agent for analytics
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

    // First check if user already exists
    let user = await authQueries.getUserByEmail(email);
    const isNewUser = !user;

    if (isNewUser) {
      // Determine role based on admin email
      const isAdmin = email === process.env.ADMIN_EMAIL?.toLowerCase();

      user = await authQueries.createUser({
        email,
        role: isAdmin ? "admin" : "user"
      });

      // Track new user sign up
      await trackUserCreated({
        userId: user.id,
        email,
        sessionId,
        ipAddress: ipAddress.split(",")[0].trim(),
        userAgent,
      });

      // Add the new user to Brevo "User Signups" list
      await addUserToBrevoList(email, 7);
    }
    if (!user) {
      return { success: false, error: "User not found and was not able to create a new one." };
    }

    // Generate magic link key for authentication
    const key = await createMagicLinkKey(user.id);

    // Construct the magic link URL
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;
    let magicLinkUrl = `${origin}/auth/confirm?key=${key}`;

    if (redirectTo) {
      magicLinkUrl += `&redirectTo=${encodeURIComponent(redirectTo)}`;
    }

    // Track login attempt event (existing user or signup)
    await trackAuthEvent({
      eventType: isNewUser ? EVENT_TYPES.SIGNUP : EVENT_TYPES.LOGIN_SUCCESS,
      userId: user.id,
      email,
      sessionId,
      ipAddress: ipAddress.split(",")[0].trim(),
      userAgent,
      success: true,
    });

    // Send the magic link email
    const emailSent = await sendMagicLinkEmail(email, magicLinkUrl, origin);

    if (!emailSent) {
      return {
        success: false,
        error: "Failed to send magic link email. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in authentication flow:", error);
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}

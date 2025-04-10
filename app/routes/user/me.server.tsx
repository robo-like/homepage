import { data } from "react-router";
import { auth, commitSession, getSession } from "~/lib/auth.server";
import { getUserSubscriptionDetails } from "~/lib/billing/stripe.server";
import type { Route } from "../+types/auth-common";

/**
 * Enhanced API endpoint to get the current user's information
 * This endpoint:
 * 1. Checks if the user is authenticated
 * 2. Refreshes the session (extends expiry)
 * 3. Returns comprehensive user data, subscription state, and session info
 * 4. Includes trial information for new users
 *
 * If not authenticated, returns a 401 response
 */
export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Get authentication data and check if user is logged in
    const authData = await auth(request);
    if (!authData.user) {
      return data(
        {
          authenticated: false,
          error: "Not authenticated",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    // Get user's subscription details
    const subscriptionDetails = await getUserSubscriptionDetails(
      authData.user.id
    );

    // Refresh the session by extending its expiration time
    // First, get existing session
    const session = authData.session;

    // Calculate session expiry time (7 days from now)
    const now = new Date();
    const sessionExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Calculate trial information
    // Trial is 3 days from user creation
    const userCreatedAt = new Date(authData.user.createdAt);
    const trialEnd = new Date(
      userCreatedAt.getTime() + 3 * 24 * 60 * 60 * 1000
    );
    const isInTrial = now < trialEnd;
    const trialDaysLeft = isInTrial
      ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate if account access has expired
    // Access is valid if any of these are true:
    // 1. User is in trial period
    // 2. User has active subscription
    // 3. User is an admin
    const hasExpired =
      !isInTrial &&
      !subscriptionDetails.subscribed &&
      authData.user.role !== "admin";

    // Return user data with refreshed session cookie
    return data(
      {
        authenticated: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.name,
          role: authData.user.role,
          createdAt: authData.user.createdAt,
        },
        subscription: {
          active: subscriptionDetails.subscribed,
          details: subscriptionDetails.subscription,
        },
        trial: {
          isInTrial,
          trialEndDate: trialEnd.toISOString(),
          daysLeft: trialDaysLeft,
        },
        access: {
          expired: hasExpired,
          reason: hasExpired
            ? isInTrial
              ? "Trial ended"
              : "No active subscription"
            : null,
        },
        session: {
          expiresAt: sessionExpiry.toISOString(),
        },
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
          // Set appropriate CORS headers for Electron app integration
          "Access-Control-Allow-Origin":
            process.env.NODE_ENV === "development"
              ? "*" // Dev mode - allow all origins
              : "app://robolike.desktop", // Prod - only allow Electron app
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Cookie, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Error in /u/me endpoint:", error);
    return data(
      {
        authenticated: false,
        error: "Internal server error",
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function action({ request }: Route.ActionArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":
          process.env.NODE_ENV === "development"
            ? "*"
            : "app://robolike.desktop",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Cookie, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  return data({ error: "Method not allowed" }, { status: 405 });
}

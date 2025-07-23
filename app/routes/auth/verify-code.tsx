import { validateMagicLinkKey, getSession, commitSession } from "~/lib/auth";
import { authQueries } from "~/lib/db";
import type { Route } from "./+types/verify-code";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Get IP address for rate limiting
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      // @ts-expect-error - socket exists on request in development
      request.socket?.remoteAddress ||
      "localhost";

    const cleanIpAddress = ipAddress.split(",")[0].trim();

    // Check rate limit for code verification
    const rateLimitCheck = await authQueries.checkCodeVerificationRateLimit(cleanIpAddress);
    if (!rateLimitCheck.canVerify) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Too many verification attempts. Please wait ${rateLimitCheck.timeUntilReset} seconds before trying again.`
      }), { 
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await request.json();
    const { code, redirectTo } = body;

    if (!code || typeof code !== "string" || code.length !== 6) {
      return new Response(JSON.stringify({ success: false, error: "Invalid code format" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate the code using the existing magic link validation
    const validation = await validateMagicLinkKey(code);

    if (!validation.valid || !validation.userId) {
      // Update rate limit after failed verification attempt
      await authQueries.updateCodeVerificationRateLimit(cleanIpAddress);
      
      return new Response(JSON.stringify({ success: false, error: "Invalid or expired code" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Create user session manually
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", validation.userId);
    
    const redirectUrl = redirectTo || "/auth/success";
    
    return new Response(JSON.stringify({ 
      success: true, 
      redirectTo: redirectUrl,
      userId: validation.userId 
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Set-Cookie": await commitSession(session)
      }
    });

  } catch (error) {
    console.error("Error verifying code:", error);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// This route is only for API calls, no loader needed
export async function loader() {
  return new Response(JSON.stringify({ error: "Method not allowed" }), { 
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}
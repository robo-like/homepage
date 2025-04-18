import { analyticsQueries } from "~/lib/db";
import { getSession } from "~/lib/auth";
import type { Route } from "./+types/metrics";

interface PageViewData {
  sessionId: string;
  path: string;
  eventType: string;
  eventValue?: string;
  userId?: string;
  description?: string;
}

export const action = async ({ request }: Route.ActionArgs) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = (await request.json()) as PageViewData;

    // Validate required fields
    if (!data.path) {
      throw new Response("Missing required fields", { status: 400 });
    }

    // Get IP address from request headers or socket
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      // @ts-expect-error - socket exists on request in development
      request.socket?.remoteAddress ||
      "localhost";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || undefined;

    // Get session data to retrieve user ID if available
    const session = await getSession(request.headers.get("Cookie"));
    const sessionData = session ? await session.get("userId") : null;

    // Use the user ID from the session if available, otherwise use the one from the request
    const userId = sessionData;

    // Create page view in database
    await analyticsQueries.createPageView({
      sessionId: session.id,
      path: data.path,
      eventType: data.eventType,
      eventValue: data.eventValue,
      description: data.description,
      ipAddress: ipAddress.split(",")[0].trim(), // Get first IP if multiple
      userAgent,
      userId: userId || undefined,
    });

    return { success: true };
  } catch (error) {
    console.error("Error tracking page view:", error);
    throw new Response(
      `Internal server error: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
};

import { getSession } from "~/lib/auth";
import { trackDownload } from "~/lib/analytics/events.server";
import type { Route } from "./+types/download-tracking";

/**
 * API endpoint to track download events
 * This is called when a user clicks any of the download buttons
 *
 * Expected payload:
 * {
 *   platform: 'windows' | 'macos' | 'linux',
 *   version?: string
 * }
 */
export async function action({ request }: Route.ActionArgs) {
  // Only allow POST requests
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = (await request.json()) as {
      platform: string;
      version?: string;
    };

    // Validate required fields
    if (!data.platform) {
      throw new Response("Missing platform field", { status: 400 });
    }

    // Validate platform is one of the expected values
    if (!["windows", "macos", "linux"].includes(data.platform.toLowerCase())) {
      throw new Response(
        "Invalid platform. Expected: windows, macos, or linux",
        { status: 400 }
      );
    }

    // Get IP address from request headers or socket
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      // Socket property might be available in some environments
      (request as any).socket?.remoteAddress ||
      "localhost";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || undefined;

    // Get session data to retrieve session ID and user ID if available
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session ? await session.get("userId") : undefined;
    const sessionId = session?.id || "unknown";

    // Track the download event
    await trackDownload({
      platform: data.platform.toLowerCase(),
      version: data.version,
      userId,
      sessionId,
      ipAddress: ipAddress.split(",")[0].trim(),
      userAgent,
    });

    return { success: true };
  } catch (error) {
    console.error("Error tracking download:", error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response(
      `Internal server error: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}

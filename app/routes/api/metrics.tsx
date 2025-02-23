import { analyticsQueries } from "~/lib/db";
import type { Route } from "./+types/metrics";

interface PageViewData {
    sessionId: string;
    path: string;
    userId?: string;
}

export const action = async ({ request }: Route.ActionArgs) => {
    // Only allow POST requests
    if (request.method !== "POST") {
        throw new Response("Method not allowed", { status: 405 });
    }

    try {
        const data = await request.json() as PageViewData;

        // Validate required fields
        if (!data.sessionId || !data.path) {
            throw new Response("Missing required fields", { status: 400 });
        }

        // Get IP address from request headers or socket
        const ipAddress = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            // @ts-expect-error - socket exists on request in development
            request.socket?.remoteAddress ||
            "unknown";

        // Get user agent
        const userAgent = request.headers.get("user-agent") || undefined;

        // Create page view in database
        await analyticsQueries.createPageView({
            sessionId: data.sessionId,
            path: data.path,
            ipAddress: ipAddress.split(",")[0].trim(), // Get first IP if multiple
            userAgent,
            userId: data.userId,
        });

        return { success: true };

    } catch (error) {
        console.error("Error tracking page view:", error);
        throw new Response("Internal server error", { status: 500 });
    }
};


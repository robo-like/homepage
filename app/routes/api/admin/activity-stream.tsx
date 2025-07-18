import { requireAuth } from "~/lib/auth";
import { db } from "~/lib/db";
import { analytics } from "~/lib/db/schema";
import { desc, gt } from "drizzle-orm";
import type { Route } from "./+types/activity-stream";

export async function loader({ request }: Route.LoaderArgs) {
  // Require admin authentication
  await requireAuth(request, "/auth/login", ["admin"]);

  // Create SSE response
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection confirmation
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

      // Set up interval to check for new events
      let lastEventTime = new Date();
      
      const checkForNewEvents = async () => {
        try {
          const newEvents = await db
            .select()
            .from(analytics)
            .where(gt(analytics.createdAt, lastEventTime))
            .orderBy(desc(analytics.createdAt))
            .limit(10);

          if (newEvents.length > 0) {
            // Update the last event time
            lastEventTime = new Date();
            
            // Send new events
            controller.enqueue(
              `data: ${JSON.stringify({ 
                type: 'newEvents', 
                events: newEvents 
              })}\n\n`
            );
          }
        } catch (error) {
          console.error('Error checking for new events:', error);
        }
      };

      // Check every 2 seconds
      const interval = setInterval(checkForNewEvents, 2000);

      // Clean up when connection closes
      return () => {
        clearInterval(interval);
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
import { redirect } from "react-router";
import Stripe from "stripe";
import { handleCheckoutSessionCompleted } from "~/lib/billing/stripe.server";
import { authQueries } from "~/lib/db";
import { trackSubscriptionEvent, EVENT_TYPES } from "~/lib/analytics/events.server";

/**
 * Initialize Stripe with API key
 */
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

/**
 * Handle Stripe webhook events
 */
export async function action({ request }: { request: Request }) {
  // Get the signature from the headers
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.error("No Stripe signature in webhook request");
    return new Response("No Stripe signature", { status: 400 });
  }

  // Get the webhook secret from environment variables
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe webhook secret is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    // Get the raw request body
    const payload = await request.text();

    // Verify the event with Stripe
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    // Handle specific event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Only handle subscription checkout sessions
        if (session.mode !== "subscription") break;
        
        // Verify we have user ID in the metadata
        if (!session.metadata?.userId) {
          throw new Error("Missing userId in session metadata");
        }

        // Process the checkout session
        await handleCheckoutSessionCompleted(session);

        // Track successful subscription
        await trackSubscriptionEvent({
          eventType: EVENT_TYPES.SUBSCRIPTION_STARTED,
          userId: session.metadata.userId,
          subscriptionId: 
            typeof session.subscription === "string" 
              ? session.subscription 
              : session.subscription?.id || "unknown",
          sessionId: session.id,
        });

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Only track if we have user ID
        if (session.metadata?.userId) {
          await trackSubscriptionEvent({
            eventType: EVENT_TYPES.SUBSCRIPTION_ABANDONED,
            userId: session.metadata.userId,
            subscriptionId: "checkout_expired",
            sessionId: session.id,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get the customer to retrieve user ID
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        
        if (customer.deleted) break;
        
        // Get user ID from metadata
        const userId = customer.metadata?.userId;
        if (!userId) break;
        
        // Update subscription in the database
        await authQueries.updateSubscription(subscription.id, {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });

        // Track subscription update
        await trackSubscriptionEvent({
          eventType: EVENT_TYPES.SUBSCRIPTION_UPDATED,
          userId,
          subscriptionId: subscription.id,
          sessionId: "webhook",
        });
        
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get the customer to retrieve user ID
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        
        if (customer.deleted) break;
        
        // Get user ID from metadata
        const userId = customer.metadata?.userId;
        if (!userId) break;
        
        // Mark subscription as canceled
        await authQueries.cancelSubscription(subscription.id);

        // Track subscription cancellation
        await trackSubscriptionEvent({
          eventType: EVENT_TYPES.SUBSCRIPTION_CANCELED,
          userId,
          subscriptionId: subscription.id,
          sessionId: "webhook",
        });
        
        break;
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    
    // Return a proper error response
    return new Response(
      `Webhook error: ${error instanceof Error ? error.message : "Unknown error"}`, 
      { status: 400 }
    );
  }
}

/**
 * This endpoint should respond to GET requests with a simple success message
 */
export function loader() {
  return new Response("Stripe webhook endpoint", { status: 200 });
}
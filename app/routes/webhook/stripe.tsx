import type { Route } from "~/+types/webhook-stripe";
import Stripe from "stripe";
import { handleCheckoutSessionCompleted } from "~/lib/billing/stripe.server";
import { authQueries } from "~/lib/db";
import { trackSubscriptionEvent, EVENT_TYPES } from "~/lib/analytics/events.server";

// Initialize Stripe with the API key from environment variables
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

/**
 * Stripe webhook handler
 * This endpoint receives events from Stripe when a subscription is created, updated, or deleted
 */
export async function action({ request }: Route.ActionArgs) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  try {
    // Verify the event came from Stripe
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Stripe webhook secret is not set");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    // Verify and construct the event
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    // Handle specific event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Only handle subscription sessions
        if (session.mode !== "subscription") {
          console.log("Not a subscription session, skipping");
          return new Response("Not a subscription session", { status: 200 });
        }

        // If userId is not in metadata, this is not our session
        if (!session.metadata?.userId) {
          console.error("No userId in session metadata");
          return new Response("Missing userId metadata", { status: 400 });
        }

        // Process the completed checkout
        await handleCheckoutSessionCompleted(session);

        // Track subscription event
        await trackSubscriptionEvent({
          eventType: EVENT_TYPES.SUBSCRIPTION_STARTED,
          userId: session.metadata.userId,
          subscriptionId: typeof session.subscription === "string" 
            ? session.subscription 
            : session.subscription?.id || "unknown",
          sessionId: session.id,
        });

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // If userId is not in metadata, this is not our session
        if (!session.metadata?.userId) {
          console.error("No userId in session metadata for expired session");
          return new Response("Missing userId metadata", { status: 400 });
        }

        // Track session expiration
        await trackSubscriptionEvent({
          eventType: EVENT_TYPES.SUBSCRIPTION_ABANDONED,
          userId: session.metadata.userId,
          subscriptionId: "checkout_expired",
          sessionId: session.id,
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Find the customer to get userId
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (!customer || customer.deleted) {
          console.error("Customer not found or deleted");
          return new Response("Customer not found", { status: 400 });
        }

        // Get userId from customer metadata
        const userId = customer.metadata.userId;
        if (!userId) {
          console.error("No userId in customer metadata");
          return new Response("Missing userId metadata", { status: 400 });
        }

        // Update subscription in our database
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
          sessionId: "webhook_update",
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Find the customer to get userId
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (!customer || customer.deleted) {
          console.error("Customer not found or deleted for canceled subscription");
          return new Response("Customer not found", { status: 400 });
        }

        // Get userId from customer metadata
        const userId = customer.metadata.userId;
        if (!userId) {
          console.error("No userId in customer metadata for canceled subscription");
          return new Response("Missing userId metadata", { status: 400 });
        }

        // Update subscription in our database
        await authQueries.cancelSubscription(subscription.id);

        // Track subscription deletion
        await trackSubscriptionEvent({
          eventType: EVENT_TYPES.SUBSCRIPTION_CANCELED,
          userId,
          subscriptionId: subscription.id,
          sessionId: "webhook_delete",
        });

        break;
      }

      // Handle other event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(`Webhook error: ${error instanceof Error ? error.message : String(error)}`, {
      status: 400,
    });
  }
}

// This is important to bypass CSRF protection for webhook endpoints
export function loader() {
  return new Response("Webhook endpoint", { status: 200 });
}
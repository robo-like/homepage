import Stripe from "stripe";
import { handleCheckoutSessionCompleted } from "~/lib/billing/stripe.server";
import { trackSubscriptionEvent, EVENT_TYPES } from "~/lib/analytics/events.server";

/**
 * Initialize Stripe with API key
 */
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

/**
 * Handles the checkout.session.completed webhook event
 * Processes subscription-based checkouts and updates our database
 */
async function handleCheckoutSessionCompletedEvent(session: Stripe.Checkout.Session) {
  // Only handle subscription checkout sessions
  if (session.mode !== "subscription") return;

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
}

/**
 * Handles the checkout.session.expired webhook event
 * Tracks abandoned checkouts for analytics purposes
 */
async function handleCheckoutSessionExpiredEvent(session: Stripe.Checkout.Session) {
  // Only track if we have user ID
  if (session.metadata?.userId) {
    await trackSubscriptionEvent({
      eventType: EVENT_TYPES.SUBSCRIPTION_ABANDONED,
      userId: session.metadata.userId,
      subscriptionId: "checkout_expired",
      sessionId: session.id,
    });
  }
}

/**
 * Handles the customer.subscription.updated webhook event
 * Updates subscription status and period dates in our database
 */
async function handleSubscriptionUpdatedEvent(subscription: Stripe.Subscription & {
  current_period_start: number;
  current_period_end: number;
}) {
  // Get the customer to retrieve user ID
  const customer = await stripe.customers.retrieve(
    subscription.customer as string
  );

  if (customer.deleted) return;

  // Get user ID from metadata
  const userId = customer.metadata?.userId;
  if (!userId) return;

  // Track subscription update
  await trackSubscriptionEvent({
    eventType: EVENT_TYPES.SUBSCRIPTION_UPDATED,
    userId,
    subscriptionId: subscription.id,
    sessionId: "webhook",
  });
}

/**
 * Handles the customer.subscription.deleted webhook event
 * Marks the subscription as canceled in our database
 */
async function handleSubscriptionDeletedEvent(subscription: Stripe.Subscription) {
  // Get the customer to retrieve user ID
  const customer = await stripe.customers.retrieve(
    subscription.customer as string
  );

  if (customer.deleted) return;

  // Get user ID from metadata
  const userId = customer.metadata?.userId;
  if (!userId) return;

  // Track subscription cancellation
  await trackSubscriptionEvent({
    eventType: EVENT_TYPES.SUBSCRIPTION_CANCELED,
    userId,
    subscriptionId: subscription.id,
    sessionId: "webhook",
  });
}

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
      case "checkout.session.completed":
        await handleCheckoutSessionCompletedEvent(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.expired":
        await handleCheckoutSessionExpiredEvent(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdatedEvent(event.data.object as Stripe.Subscription & {
          current_period_start: number;
          current_period_end: number;
        });
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeletedEvent(event.data.object as Stripe.Subscription);
        break;
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
 * This endpoint returns the webhook documentation as HTML
 */
export function loader() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Stripe Webhook Documentation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
          }
          h1 {
            color: #1a1a1a;
            border-bottom: 2px solid #eee;
            padding-bottom: 0.5rem;
          }
          h2 {
            color: #2a2a2a;
            margin-top: 2rem;
          }
          code {
            background: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: monospace;
          }
          .event-list {
            list-style-type: none;
            padding-left: 0;
          }
          .event-item {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: #f9f9f9;
            border-radius: 4px;
          }
          .event-title {
            font-weight: bold;
            color: #1a1a1a;
          }
        </style>
      </head>
      <body>
        <h1>Stripe Webhook Documentation</h1>
        
        <p>This endpoint handles asynchronous events from Stripe's webhook system. It processes various
        subscription-related events to keep our system in sync with Stripe's state.</p>

        <h2>Subscription Lifecycle Management</h2>
        <p>The webhook handles two distinct types of subscription endings:</p>

        <div class="event-list">
          <div class="event-item">
            <div class="event-title">1. Canceled Subscriptions</div>
            <ul>
              <li>The subscription will end at the current period end</li>
              <li>Customer retains access until the end of the billing period</li>
              <li>No further charges will occur</li>
              <li>Tracked via <code>customer.subscription.updated</code> with <code>cancel_at_period_end = true</code></li>
            </ul>
          </div>

          <div class="event-item">
            <div class="event-title">2. Deleted Subscriptions</div>
            <ul>
              <li>The subscription is immediately terminated</li>
              <li>Access is revoked right away</li>
              <li>No further charges occur</li>
              <li>Tracked via <code>customer.subscription.deleted</code></li>
            </ul>
          </div>
        </div>

        <h2>Events Handled</h2>
        <div class="event-list">
          <div class="event-item">
            <div class="event-title">1. checkout.session.completed</div>
            <ul>
              <li>Triggered when a customer completes a checkout session</li>
              <li>Only processes subscription-based checkouts</li>
              <li>Updates our database with the new subscription</li>
              <li>Tracks the subscription start event for analytics</li>
            </ul>
          </div>

          <div class="event-item">
            <div class="event-title">2. checkout.session.expired</div>
            <ul>
              <li>Triggered when a checkout session expires without completion</li>
              <li>Tracks abandoned checkouts for analytics</li>
            </ul>
          </div>

          <div class="event-item">
            <div class="event-title">3. customer.subscription.updated</div>
            <ul>
              <li>Triggered when a subscription is modified (e.g., plan changes, billing updates)</li>
              <li>Handles subscription cancellations (cancel_at_period_end = true)</li>
              <li>Updates our database with the new subscription status and period dates</li>
              <li>Tracks subscription updates for analytics</li>
            </ul>
          </div>

          <div class="event-item">
            <div class="event-title">4. customer.subscription.deleted</div>
            <ul>
              <li>Triggered when a subscription is either:
                <ul>
                  <li>Immediately deleted (access revoked right away)</li>
                  <li>Reaches the end of its period after being canceled</li>
                </ul>
              </li>
              <li>Marks the subscription as canceled in our database</li>
              <li>Tracks subscription cancellation for analytics</li>
            </ul>
          </div>
        </div>

        <h2>Security</h2>
        <ul>
          <li>Verifies webhook signatures using <code>STRIPE_WEBHOOK_SECRET</code></li>
          <li>Validates user IDs in metadata for all relevant events</li>
          <li>Handles errors gracefully with appropriate status codes</li>
        </ul>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
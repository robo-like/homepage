import Stripe from "stripe";
import { authQueries } from "../db/index.server";

// Initialize Stripe with the API key from environment variables
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

// Price ID for the monthly subscription - this should be an ID from a Stripe price object
// Create price objects in the Stripe Dashboard or via API following https://docs.stripe.com/products-prices/overview#create-prices
const MONTHLY_PRICE_ID =
  process.env.STRIPE_MONTHLY_PRICE_ID || "product_monthly_single_device";

/**
 * Create a Stripe customer for a user
 */
export async function createStripeCustomer(email: string, userId: string) {
  try {
    // Create customer in Stripe
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    return customer;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
}

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(userId: string, email: string) {
  // Get user from database
  const user = await authQueries.getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // If user already has a Stripe customer ID, return it
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Otherwise, create a new customer
  const customer = await createStripeCustomer(email, userId);
  return customer.id;
}

/**
 * Create a checkout session for subscribing
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  returnUrl: string
) {
  try {
    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(userId, email);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: MONTHLY_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      automatic_tax: { enabled: false },
      allow_promotion_codes: true,
      metadata: {
        userId,
      },
    });

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Create a billing portal session for managing subscriptions
 */
export async function createBillingPortalSession(
  userId: string,
  email: string,
  returnUrl: string
) {
  try {
    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(userId, email);

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    throw error;
  }
}

/**
 * Cancel a subscription in Stripe
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    // Cancel the subscription at period end to avoid prorated charges
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return subscription;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

/**
 * Process a checkout session completion
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    if (!session.subscription) {
      throw new Error("No subscription found in session");
    }
    // Get user ID from metadata
    const userId = session.metadata?.userId;
    if (!userId) {
      throw new Error("No user ID found in session metadata");
    }

    // const subscriptionId =
    //   typeof session.subscription === "string"
    //     ? session.subscription
    //     : session.subscription.id;

    // const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  } catch (error) {
    console.error("Error handling checkout session completed:", error);
    throw error;
  }
}

/**
 * Get subscription details for a user directly from Stripe
 */
export async function getUserSubscriptionDetails(userId: string) {
  try {
    // Get user from database to find Stripe customer ID
    const user = await authQueries.getUserById(userId);

    if (!user || !user.stripeCustomerId) {
      return { subscribed: false };
    }

    // Get all subscriptions for this customer directly from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1
    });

    // If no active subscriptions found
    if (subscriptions.data.length === 0) {
      return { subscribed: false };
    }

    // Use the most recent active subscription
    const stripeSubscription = subscriptions.data[0];

    return {
      subscribed: stripeSubscription.status === "active",
      subscription: {
        ...stripeSubscription
      },
    };
  } catch (error) {
    console.error("Error getting user subscription details from Stripe:", error);
    // Return not subscribed if there's an error
    return { subscribed: false };
  }
}

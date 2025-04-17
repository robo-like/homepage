import { redirect } from "react-router";
import { requireAuth, getSession } from "~/lib/auth";
import {
    createBillingPortalSession,
    createCheckoutSession,
    cancelSubscription,
} from "~/lib/billing/stripe.server";
import {
    trackSubscriptionEvent,
    EVENT_TYPES,
} from "~/lib/analytics/events.server";
import type { Route } from './+types/billing'

export async function action({ request }: Route.ActionArgs) {
    // Ensure user is authenticated
    const authData = await requireAuth(request, "/auth/login");
    const user = authData.user;

    const formData = await request.formData();
    const action = formData.get("action")?.toString();

    // Get URL for redirecting back to profile
    const origin = new URL(request.url).origin;
    const returnUrl = `${origin}/u/profile`;

    // Get session for analytics tracking
    const session = await getSession(request.headers.get("Cookie"));
    const sessionId = session?.id || "unknown";

    try {
        switch (action) {
            case "subscribe": {
                // Create checkout session
                const session = await createCheckoutSession(
                    user.id,
                    user.email,
                    returnUrl
                );

                // Track subscription attempt
                // The actual subscription started event will be tracked when webhook is received
                await trackSubscriptionEvent({
                    eventType: EVENT_TYPES.SUBSCRIPTION_STARTED,
                    userId: user.id,
                    subscriptionId: "pending_checkout", // We don't have ID yet
                    sessionId,
                });

                // Redirect to Stripe checkout
                return redirect(session.url || returnUrl);
            }
            case "manage": {
                // Create billing portal session
                const session = await createBillingPortalSession(
                    user.id,
                    user.email,
                    returnUrl
                );
                // Track subscription management action
                await trackSubscriptionEvent({
                    eventType: EVENT_TYPES.SUBSCRIPTION_UPDATED,
                    userId: user.id,
                    subscriptionId: "managed_via_portal",
                    sessionId,
                });
                // Redirect to Stripe billing portal
                return redirect(session.url);
            }
            case "cancel": {
                // Get subscription ID from form data
                const subscriptionId = formData.get("subscriptionId")?.toString();

                if (!subscriptionId) {
                    return { error: "Subscription ID is required" };
                }

                // Cancel subscription
                await cancelSubscription(subscriptionId);

                // Track subscription cancellation
                await trackSubscriptionEvent({
                    eventType: EVENT_TYPES.SUBSCRIPTION_CANCELED,
                    userId: user.id,
                    subscriptionId,
                    sessionId,
                });

                return {
                    success:
                        "Your subscription has been canceled. You will have access until the end of your billing period.",
                };
            }
            default:
                throw new Error(`Unhandled action: ${action}`);
        }
    } catch (error) {
        console.error("Error in profile action:", error);
        // Handle Stripe errors nicely
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An error occurred processing your request" };
    }
}

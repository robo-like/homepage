import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { auth, requireAuth, getSession, commitSession } from "~/lib/auth.server";
import {
  createBillingPortalSession,
  createCheckoutSession,
  cancelSubscription,
  getUserSubscriptionDetails
} from "~/lib/billing/stripe.server";
import { trackSubscriptionEvent, EVENT_TYPES } from "~/lib/analytics/events.server";
import type { Route } from "../+types/auth-common";

// Require authentication for this route
export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Ensure user is authenticated
    const authData = await requireAuth(request, '/auth/login');
    
    // Get user's subscription details directly
    const subscriptionDetails = await getUserSubscriptionDetails(authData.user.id);
    
    // Get session for refreshing
    const session = await getSession(request.headers.get("Cookie"));
    // Commit the session to refresh it
    const cookie = await commitSession(session);
    
    // Calculate expiry date - 7 days from now
    const now = new Date();
    const sessionExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Return user and subscription information with the refreshed session cookie
    return {
      headers: {
        "Set-Cookie": cookie
      },
      user: authData.user,
      subscriptionDetails,
      sessionExpiresAt: sessionExpiresAt.toISOString()
    };
  } catch (error) {
    // requireAuth will throw a redirect if not authenticated
    throw error;
  }
}

export async function action({ request }: Route.ActionArgs) {
  // Ensure user is authenticated
  const authData = await requireAuth(request, '/auth/login');
  const user = authData.user;
  
  const formData = await request.formData();
  const action = formData.get('action')?.toString();
  
  // Get URL for redirecting back to profile
  const origin = new URL(request.url).origin;
  const returnUrl = `${origin}/u/profile`;
  
  // Get session for analytics tracking
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session?.id || "unknown";
  
  try {
    switch (action) {
      case 'subscribe': {
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
          subscriptionId: 'pending_checkout', // We don't have ID yet
          sessionId
        });
        
        // Redirect to Stripe checkout
        return redirect(session.url || returnUrl);
      }
      
      case 'manage': {
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
          subscriptionId: 'managed_via_portal',
          sessionId
        });
        
        // Redirect to Stripe billing portal
        return redirect(session.url);
      }
      
      case 'cancel': {
        // Get subscription ID from form data
        const subscriptionId = formData.get('subscriptionId')?.toString();
        
        if (!subscriptionId) {
          return { error: 'Subscription ID is required' };
        }
        
        // Cancel subscription
        await cancelSubscription(subscriptionId);
        
        // Track subscription cancellation
        await trackSubscriptionEvent({
          eventType: EVENT_TYPES.SUBSCRIPTION_CANCELED,
          userId: user.id,
          subscriptionId,
          sessionId
        });
        
        return { success: 'Your subscription has been canceled. You will have access until the end of your billing period.' };
      }
      
      default:
        return { error: 'Invalid action' };
    }
  } catch (error) {
    console.error('Error in profile action:', error);
    
    // Handle Stripe errors nicely
    if (error instanceof Error) {
      return { error: error.message };
    }
    
    return { error: 'An error occurred processing your request' };
  }
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Your Profile | RoboLike" },
    { name: "description", content: "Manage your RoboLike account and subscription" }
  ];
}

export default function Profile() {
  const { user, subscriptionDetails, sessionExpiresAt } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  const isSubscribed = subscriptionDetails.subscribed;
  
  // Format session expiration date if available
  const formattedExpiryDate = sessionExpiresAt ? 
    new Date(sessionExpiresAt).toLocaleString() : 
    'Session information unavailable';
    
  // Check for trial information - in a real implementation this would come from the loader
  const createdAt = user.createdAt ? new Date(user.createdAt) : null;
  const now = new Date();
  const trialEnd = createdAt ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000) : null;
  const isInTrial = createdAt && now < trialEnd;
  const trialDaysLeft = isInTrial && trialEnd 
    ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-16 mb-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{
          fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
        }}>
          YOUR PROFILE
        </h1>
        <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
      </div>
      
      {/* Profile Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{
          fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
        }}>
          ACCOUNT INFO
        </h2>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
          <p className="mb-2" style={{
            fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
          }}>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="mb-2" style={{
            fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
          }}>
            <span className="font-semibold">Account Type:</span> {user.role}
          </p>
          {sessionExpiresAt && (
            <p className="text-xs text-gray-500 mt-4" style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}>
              Session active until: {formattedExpiryDate}
            </p>
          )}
        </div>
      </div>
      
      {/* Subscription Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{
          fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
        }}>
          SUBSCRIPTION
        </h2>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
          {isSubscribed ? (
            <div>
              <p className="mb-2 text-green-600 font-semibold" style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}>
                ✓ ACTIVE SUBSCRIPTION
              </p>
              
              {subscriptionDetails.subscription && (
                <>
                  <p className="mb-2" style={{
                    fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                  }}>
                    Your subscription is active until{' '}
                    {new Date(subscriptionDetails.subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                  
                  {subscriptionDetails.subscription.cancelAtPeriodEnd && (
                    <p className="mb-2 text-orange-500" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>
                      Your subscription will end after the current billing period
                    </p>
                  )}
                </>
              )}
            </div>
          ) : isInTrial ? (
            <div>
              <p className="mb-2 text-blue-600 font-semibold" style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}>
                ✓ FREE TRIAL ACTIVE
              </p>
              <p className="mb-2" style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}>
                You have {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left in your trial.
                Trial ends on {trialEnd?.toLocaleDateString()}.
              </p>
            </div>
          ) : (
            <p className="mb-2" style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}>
              You don't have an active subscription
            </p>
          )}
        </div>
        
        {/* Error/Success Messages */}
        {actionData?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{actionData.error}</p>
          </div>
        )}
        
        {actionData?.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>{actionData.success}</p>
          </div>
        )}
        
        {/* Subscription Action Buttons */}
        <div className="flex flex-col space-y-3">
          {isSubscribed ? (
            <>
              <Form method="post">
                <input type="hidden" name="action" value="manage" />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-[#07b0ef] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
                >
                  MANAGE SUBSCRIPTION
                </button>
              </Form>
              
              {!subscriptionDetails.subscription?.cancelAtPeriodEnd && (
                <Form method="post" onSubmit={(e) => {
                  if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
                    e.preventDefault();
                  }
                }}>
                  <input type="hidden" name="action" value="cancel" />
                  <input
                    type="hidden"
                    name="subscriptionId"
                    value={subscriptionDetails.subscription?.stripeSubscriptionId}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                    style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
                  >
                    CANCEL SUBSCRIPTION
                  </button>
                </Form>
              )}
            </>
          ) : (
            <Form method="post">
              <input type="hidden" name="action" value="subscribe" />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#07b0ef] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
              >
                SUBSCRIBE NOW
              </button>
            </Form>
          )}
          
          {/* Logout button */}
          <a
            href="/auth/logout"
            className="block text-center w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
            style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
          >
            LOGOUT
          </a>
          
          {/* Back to home */}
          <a
            href="/"
            className="block text-center text-gray-600 hover:text-[#07b0ef] mt-2"
            style={{ fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)' }}
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
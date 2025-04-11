import { Form, useActionData, useLoaderData } from "react-router";
export { action, loader } from "./profile.server";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

interface Subscription {
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionDetails {
  subscribed: boolean;
  subscription?: Subscription;
}

interface LoaderData {
  user: User;
  subscriptionDetails: SubscriptionDetails;
  sessionExpiresAt: string;
  checkoutMessage?: {
    type: "success" | "error" | "info";
    message: string;
  } | null;
}

// Client component section
export default function Profile() {
  const { user, subscriptionDetails, sessionExpiresAt, checkoutMessage } =
    useLoaderData() as LoaderData;
  const actionData = useActionData() as
    | { success?: string; error?: string }
    | undefined;

  const isSubscribed = subscriptionDetails.subscribed;

  // Format session expiration date if available
  const formattedExpiryDate = sessionExpiresAt
    ? new Date(sessionExpiresAt).toLocaleString()
    : "Session information unavailable";

  // Client-side calculation of trial information
  const createdAt = user.createdAt ? new Date(user.createdAt) : null;
  const now = new Date();
  const trialEnd = createdAt
    ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000)
    : null;
  const isInTrial = createdAt && now < trialEnd;
  const trialDaysLeft =
    isInTrial && trialEnd
      ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  // Client-side function to confirm subscription cancellation
  const confirmCancellation = (e: React.FormEvent) => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You will still have access until the end of your billing period."
      )
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-16 mb-16">
      <div className="text-center mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
          }}
        >
          YOUR PROFILE
        </h1>
        <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
      </div>
      
      {/* Checkout Message Display */}
      {checkoutMessage && (
        <div 
          className={`p-4 mb-6 rounded-lg ${
            checkoutMessage.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : checkoutMessage.type === 'error'
                ? 'bg-red-100 border border-red-400 text-red-700'
                : 'bg-blue-100 border border-blue-400 text-blue-700'
          }`}
        >
          <p>{checkoutMessage.message}</p>
        </div>
      )}

      {/* Profile Information */}
      <div className="mb-8">
        <h2
          className="text-xl font-semibold mb-4"
          style={{
            fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
          }}
        >
          ACCOUNT INFO
        </h2>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
          <p
            className="mb-2"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p
            className="mb-2"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            <span className="font-semibold">Account Type:</span> {user.role}
          </p>
          {sessionExpiresAt && (
            <p
              className="text-xs text-gray-500 mt-4"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              Session active until: {formattedExpiryDate}
            </p>
          )}
        </div>
      </div>

      {/* Subscription Information */}
      <div className="mb-8">
        <h2
          className="text-xl font-semibold mb-4"
          style={{
            fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
          }}
        >
          SUBSCRIPTION
        </h2>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
          {isSubscribed ? (
            <div>
              <p
                className="mb-2 text-green-600 font-semibold"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                ✓ ACTIVE SUBSCRIPTION
              </p>

              {subscriptionDetails.subscription && (
                <>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily:
                        'var(--body-font, "Chakra Petch", sans-serif)',
                    }}
                  >
                    Your subscription is active until{" "}
                    {new Date(
                      subscriptionDetails.subscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>

                  {subscriptionDetails.subscription.cancelAtPeriodEnd && (
                    <p
                      className="mb-2 text-orange-500"
                      style={{
                        fontFamily:
                          'var(--body-font, "Chakra Petch", sans-serif)',
                      }}
                    >
                      Your subscription will end after the current billing
                      period
                    </p>
                  )}
                </>
              )}
            </div>
          ) : isInTrial ? (
            <div>
              <p
                className="mb-2 text-blue-600 font-semibold"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                ✓ FREE TRIAL ACTIVE
              </p>
              <p
                className="mb-2"
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                You have {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}{" "}
                left in your trial. Trial ends on{" "}
                {trialEnd?.toLocaleDateString()}.
              </p>
            </div>
          ) : (
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
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
                  style={{
                    fontFamily:
                      'var(--subheading-font, "Orbitron", sans-serif)',
                  }}
                >
                  MANAGE SUBSCRIPTION
                </button>
              </Form>

              {!subscriptionDetails.subscription?.cancelAtPeriodEnd && (
                <Form method="post" onSubmit={confirmCancellation}>
                  <input type="hidden" name="action" value="cancel" />
                  <input
                    type="hidden"
                    name="subscriptionId"
                    value={
                      subscriptionDetails.subscription?.stripeSubscriptionId
                    }
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                    style={{
                      fontFamily:
                        'var(--subheading-font, "Orbitron", sans-serif)',
                    }}
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
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                ACTIVATE SUBSCRIPTION ($19.99/month)
              </button>
            </Form>
          )}

          {/* Logout button */}
          <a
            href="/auth/logout"
            className="block text-center w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            LOGOUT
          </a>

          {/* Back to home */}
          <a
            href="/"
            className="block text-center text-gray-600 hover:text-[#07b0ef] mt-2"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

// Meta function that doesn't use server imports
export function meta() {
  return [
    { title: "Your Profile | RoboLike" },
    {
      name: "description",
      content: "Manage your RoboLike account and subscription",
    },
  ];
}

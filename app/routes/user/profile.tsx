import { useOutletContext } from "react-router";
import type { ProfileLayoutContext } from "./layout";
import { useMemo, useEffect } from "react";
import { AuthCard } from "~/components/AuthCard";
import { Form, useFetcher } from "react-router";
import { cn } from "~/lib/utils";

export function meta() {
  return [
    { title: "Your Profile | RoboLike" },
    {
      name: "description",
      content: "Manage your RoboLike account.",
    },
  ];
}

export default function Profile() {
  const { user, sessionExpiresAt, subscriptionDetails } = useOutletContext<ProfileLayoutContext>();
  const subscribeFetcher = useFetcher();
  const manageFetcher = useFetcher();
  const cancelFetcher = useFetcher();

  const formattedExpiryDate = useMemo(() => sessionExpiresAt
    ? new Date(sessionExpiresAt).toLocaleString()
    : "Session information unavailable", [sessionExpiresAt]);

  // Helper function to render feedback message
  const renderFeedback = (fetcher: typeof subscribeFetcher) => {
    if (!fetcher.data) return null;

    const isError = 'error' in fetcher.data;
    const isSuccess = 'success' in fetcher.data;

    if (!isError && !isSuccess) return null;

    return (
      <div className={cn(
        "mt-2 p-3 rounded-md text-sm",
        isError
          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      )}>
        {isError ? fetcher.data.error : fetcher.data.success}
      </div>
    );
  };

  return (
    <>
      <AuthCard title="YOUR PROFILE" className="max-w-xl mb-16">
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
            <div
              className="mb-2 flex items-center gap-2"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              <span className="font-semibold">Account Type:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                {user.role === 'admin' ? 'Administrator' : 'Basic User'}
              </span>
            </div>
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

        <div className="mb-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            SUBSCRIPTION
          </h2>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            {!subscriptionDetails.subscribed ? (
              renderFeedback(subscribeFetcher)
            ) : (
              <>
                {renderFeedback(manageFetcher)}
                {renderFeedback(cancelFetcher)}
              </>
            )}

            <div
              className="mb-4"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${subscriptionDetails.subscribed && !subscriptionDetails.subscription.cancel_at_period_end
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : subscriptionDetails.subscription.cancel_at_period_end
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}>
                  {subscriptionDetails.subscribed
                    ? subscriptionDetails.subscription.cancel_at_period_end
                      ? "Active (Cancelling at period end)"
                      : "Active"
                    : "Inactive"}
                </span>
              </p>
              {subscriptionDetails.subscribed && (
                <>
                  <div className="mb-2">
                    <span className="font-semibold">Current Plan:</span>{" "}
                    <span>${(subscriptionDetails.subscription.items.data[0].price.unit_amount || 0) / 100}/month</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Next Charge is in </span>{" "}
                    <span>{subscriptionDetails.subscription.days_until_due} days</span>
                  </div>
                  {subscriptionDetails.subscription.cancel_at_period_end && subscriptionDetails.subscription.cancel_at && (
                    <div className="mb-2">
                      <span className="font-semibold">Cancellation Date:</span>{" "}
                      <span>{new Date(subscriptionDetails.subscription.cancel_at * 1000).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {!subscriptionDetails.subscribed ? (
                <subscribeFetcher.Form method="post" action="/u/billing">
                  <input type="hidden" name="action" value="subscribe" />
                  <button
                    type="submit"
                    disabled={subscribeFetcher.state !== "idle"}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscribeFetcher.state !== "idle" ? "Redirecting..." : "Start Subscription"}
                  </button>
                </subscribeFetcher.Form>
              ) : (
                <>
                  <manageFetcher.Form method="post" action="/u/billing">
                    <input type="hidden" name="action" value="manage" />
                    <button
                      type="submit"
                      disabled={manageFetcher.state !== "idle"}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {manageFetcher.state !== "idle" ? "Redirecting..." : "Manage Subscription"}
                    </button>
                  </manageFetcher.Form>

                  <cancelFetcher.Form method="post" action="/u/billing">
                    <input type="hidden" name="action" value="cancel" />
                    <input type="hidden" name="subscriptionId" value={subscriptionDetails.subscription.id} />
                    <button
                      type="submit"
                      disabled={cancelFetcher.state !== "idle"}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelFetcher.state !== "idle" ? "Redirecting..." : "Cancel Subscription"}
                    </button>
                  </cancelFetcher.Form>
                </>
              )}
            </div>
          </div>
        </div>
      </AuthCard>
    </>
  );
}
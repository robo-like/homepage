import { useFetcher } from "react-router";
import { cn } from "~/lib/utils";
import type { Stripe } from "stripe";
import { useState } from "react";

type SubscriptionSectionProps = {
    subscriptionDetails: {
        subscribed: boolean;
        subscription: Stripe.Subscription | undefined;
    };
};

export function SubscriptionSection({ subscriptionDetails }: SubscriptionSectionProps) {
    const subscribeFetcher = useFetcher();
    const cancelFetcher = useFetcher();
    const restartFetcher = useFetcher();
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

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

    // Helper function to render subscription status badge
    const renderStatusBadge = (status: string) => {
        const statusConfig = {
            active: {
                className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                text: "Active"
            },
            canceling: {
                className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                text: "Active (Cancelling at period end)"
            },
            inactive: {
                className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                text: "Inactive"
            }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
                {config.text}
            </span>
        );
    };

    // Helper function to render subscription details
    const renderSubscriptionDetails = () => {
        if (!subscriptionDetails.subscription) return null;

        const subscription = subscriptionDetails.subscription;
        const isActive = subscriptionDetails.subscribed && !subscription.cancel_at_period_end;
        const isCanceling = subscriptionDetails.subscribed && subscription.cancel_at_period_end;
        const isInactive = !subscriptionDetails.subscribed;

        return (
            <div className="mb-4">
                <p className="mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    {renderStatusBadge(
                        isActive ? "active" : isCanceling ? "canceling" : "inactive"
                    )}
                </p>
                {subscriptionDetails.subscribed && (
                    <>
                        {isActive && (
                            <>
                                <div className="mb-2">
                                    <span className="font-semibold">Current Plan:</span>{" "}
                                    <span>${(subscription.items.data[0].price.unit_amount || 0) / 100}/month</span>
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Next Charge is: </span>{" "}
                                    <span>{new Date(subscription.items.data[0].current_period_end * 1000).toLocaleDateString()}</span>
                                </div>
                            </>
                        )}
                        {subscription.cancel_at_period_end && subscription.cancel_at && (
                            <div className="mb-2">
                                <span className="font-semibold">Cancellation Date:</span>{" "}
                                <span>{new Date(subscription.cancel_at * 1000).toLocaleDateString()}</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    // Helper function to render subscription actions
    const renderSubscriptionActions = () => {
        if (!subscriptionDetails.subscription) {
            // No subscription - show start subscription button with context
            return (
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p className="mb-2">To start using RoboLike, you'll need to create a subscription profile.</p>
                        <p>This is a one-time setup process that will:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Create your billing profile</li>
                            <li>Set up your subscription</li>
                            <li>Activate your account immediately upon completion</li>
                        </ul>
                        <p className="mt-2">You'll be navigated back here once the process is complete.</p>
                    </div>
                    <subscribeFetcher.Form method="post" action="/u/billing">
                        <input type="hidden" name="action" value="subscribe" />
                        <button
                            type="submit"
                            disabled={subscribeFetcher.state !== "idle"}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {subscribeFetcher.state !== "idle" ? "Redirecting..." : "Create Subscription Profile"}
                        </button>
                    </subscribeFetcher.Form>
                </div>
            );
        }

        const subscription = subscriptionDetails.subscription;
        const isActive = subscriptionDetails.subscribed && !subscription.cancel_at_period_end;
        const isCanceling = subscriptionDetails.subscribed && subscription.cancel_at_period_end;

        if (isActive) {
            // Active subscription - show cancel option with confirmation
            return (
                <div className="space-y-4">
                    {!showCancelConfirmation ? (
                        <button
                            onClick={() => setShowCancelConfirmation(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium border-b border-dashed border-blue-600 hover:border-blue-700"
                        >
                            Cancel Subscription
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCancelConfirmation(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                                >
                                    Keep Subscription
                                </button>
                                <cancelFetcher.Form method="post" action="/u/billing" className="flex-1">
                                    <input type="hidden" name="action" value="cancel" />
                                    <input type="hidden" name="subscriptionId" value={subscription.id} />
                                    <button
                                        type="submit"
                                        disabled={cancelFetcher.state !== "idle"}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {cancelFetcher.state !== "idle" ? "Processing..." : "Confirm Cancellation"}
                                    </button>
                                </cancelFetcher.Form>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (isCanceling) {
            // Canceling subscription - show restart option
            return (
                <restartFetcher.Form method="post" action="/u/billing">
                    <input type="hidden" name="action" value="restart" />
                    <input type="hidden" name="subscriptionId" value={subscription.id} />
                    <button
                        type="submit"
                        disabled={restartFetcher.state !== "idle"}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {restartFetcher.state !== "idle" ? "Processing..." : "Restart Subscription"}
                    </button>
                </restartFetcher.Form>
            );
        }

        // Inactive subscription - show start subscription button
        return (
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
        );
    };

    return (
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
                {renderFeedback(subscribeFetcher)}
                {renderFeedback(cancelFetcher)}
                {renderFeedback(restartFetcher)}

                {renderSubscriptionDetails()}
                {renderSubscriptionActions()}
            </div>
        </div>
    );
} 
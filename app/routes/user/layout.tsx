import { commitSession, getSession, requireAuth, type User } from "~/lib/auth.js";
import type { Route } from './+types/layout.ts'
import { Outlet, useLoaderData } from "react-router";
import { getUserSubscriptionDetails } from "~/lib/billing/stripe.js";
import { cn } from "~/lib/utils";
import type Stripe from "stripe";

// ensure user is authenticated and refresh session
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "User Dashboard | RoboLike" },
    { name: "description", content: "User account dashboard and settings." },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const authData = await requireAuth(request, "/auth/login");

    const session = await getSession(request.headers.get("Cookie"));
    const cookie = await commitSession(session);
    const now = new Date();
    const sessionExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const subscriptionDetails = await getUserSubscriptionDetails(
      authData.user.id
    );
    const url = new URL(request.url);
    const success = url.searchParams.get("success") === "true";
    const canceled = url.searchParams.get("canceled") === "true";
    const sessionId = url.searchParams.get("session_id");

    let checkoutMessage = null;
    if (success && sessionId && subscriptionDetails.subscribed) {
      checkoutMessage = {
        type: "success",
        message: "Your subscription has been successfully set up! You now have full access to RoboLike."
      }
    } else if (success && sessionId && !subscriptionDetails.subscribed) {
      checkoutMessage = {
        type: "info",
        message: "Your payment is being processed. You'll have full access once the payment is confirmed."
      };
    } else if (canceled) {
      checkoutMessage = {
        type: "info",
        message: "You canceled the checkout process. You can subscribe anytime to get full access."
      };
    }
    return {
      headers: {
        "Set-Cookie": cookie,
      },
      user: authData.user,
      subscriptionDetails,
      sessionExpiresAt: sessionExpiresAt.toISOString(),
      checkoutMessage,
    };
  } catch (error) {
    throw error;
  }
}

export type ProfileLayoutContext = {
  user: User;
  sessionExpiresAt: string;
  subscriptionDetails: {
    subscribed: boolean;
    subscription: Stripe.Subscription | undefined;
  };
};

export default function ProfileLayout() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {data.checkoutMessage && (
          <div className={cn(
            "mb-6 p-4 rounded-lg border",
            data.checkoutMessage.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : data.checkoutMessage.type === "info"
                ? "bg-blue-50 text-blue-800 border-blue-200"
                : "bg-red-50 text-red-800 border-red-200"
          )}>
            <p className="text-sm font-medium">{data.checkoutMessage.message}</p>
          </div>
        )}
        <Outlet context={{ user: data.user, sessionExpiresAt: data.sessionExpiresAt, subscriptionDetails: data.subscriptionDetails }} />
      </div>
    </div>
  );
}

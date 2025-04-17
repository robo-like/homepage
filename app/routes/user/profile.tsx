import { useOutletContext } from "react-router";
import type { ProfileLayoutContext } from "./layout";
import { useMemo } from "react";
import { AuthCard } from "~/components/AuthCard";
import { SubscriptionSection } from "~/components/SubscriptionSection";

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

  const formattedExpiryDate = useMemo(() => sessionExpiresAt
    ? new Date(sessionExpiresAt).toLocaleString()
    : "Session information unavailable", [sessionExpiresAt]);

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

        <SubscriptionSection subscriptionDetails={subscriptionDetails} />
      </AuthCard>
    </>
  );
}
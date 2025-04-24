import { useOutletContext, Form, useActionData, useLoaderData } from "react-router";
import type { ProfileLayoutContext } from "./layout";
import { useMemo } from "react";
import { AuthCard } from "~/components/AuthCard";
import { SubscriptionSection } from "~/components/SubscriptionSection";
import { db } from "~/lib/db";
import { accessTokens } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth, requireAuth } from "~/lib/auth";
import type { Route } from "./+types/profile";

export async function loader({ request }: Route.LoaderArgs) {
  const { user } = await requireAuth(request, "/auth/login");
  
  // Get user's access token if it exists
  const token = await db
    .select()
    .from(accessTokens)
    .where(eq(accessTokens.userId, user.id))
    .get();

  return { token };
}

export async function action({ request }: Route.ActionArgs) {
  const { user } = await requireAuth(request, "/auth/login");

  try {
    // Generate new access token
    const token = crypto.randomUUID();

    // Insert into database
    await db.insert(accessTokens).values({
      userId: user.id,
      token,
    });

    return { success: true };
  } catch (error) {
    console.error("Error generating access token:", error);
    return { error: "Failed to generate access token" };
  }
}

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
  const { token } = useLoaderData();
  const actionData = useActionData();

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

        <div className="mb-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
          >
            ACCESS TOKEN
          </h2>

          {actionData?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{actionData.error}</p>
            </div>
          )}

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-6">
            {token ? (
              <div>
                <p
                  className="mb-2 font-semibold"
                  style={{
                    fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                  }}
                >
                  Your Access Token:
                </p>
                <p className="font-mono bg-gray-200 dark:bg-gray-600 p-2 rounded break-all">
                  {token.token}
                </p>
                <p
                  className="text-sm text-gray-500 mt-2"
                  style={{
                    fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                  }}
                >
                  Created: {new Date(token.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                }}
              >
                No access token generated yet
              </p>
            )}
          </div>

          {!token && (
            <Form method="post">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#07b0ef] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                style={{
                  fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                }}
              >
                GENERATE ACCESS TOKEN
              </button>
            </Form>
          )}
        </div>

        <SubscriptionSection subscriptionDetails={subscriptionDetails} />
      </AuthCard>
    </>
  );
}
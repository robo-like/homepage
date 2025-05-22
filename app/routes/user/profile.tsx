import {
  useOutletContext,
  Link,
  redirect,
  Form,
  useActionData,
} from "react-router";
import type { ProfileLayoutContext } from "./layout";
import { AuthCard } from "~/components/AuthCard";
import { SubscriptionSection } from "~/components/SubscriptionSection";
import { requireAuth } from "~/lib/auth";
import type { Route } from "./+types/profile";
import { isUserOnTrial } from "~/lib/user/trial";
import { useEffect } from "react";
import { db } from "~/lib/db";
import { accessTokens } from "~/lib/db/schema";
import { eq } from "drizzle-orm";

export async function action({ request }: Route.ActionArgs) {
  const { user } = await requireAuth(request, "/auth/login");

  // Check if user already has a token
  const existingToken = await db
    .select()
    .from(accessTokens)
    .where(eq(accessTokens.userId, user.id))
    .get();

  if (existingToken) {
    return { accessToken: existingToken.token };
  }

  const token = crypto.randomUUID();

  // Insert into database
  await db.insert(accessTokens).values({
    userId: user.id,
    token,
  });

  return { accessToken: token };
}

export async function loader({ request }: Route.LoaderArgs) {
  const { user } = await requireAuth(request, "/auth/login");

  if (await isUserOnTrial(user)) {
    return redirect("/u/trial");
  }

  return {};
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
  const { user, subscriptionDetails } =
    useOutletContext<ProfileLayoutContext>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.accessToken) {
      const link = document.createElement("a");
      link.href = `robolike://likes?accessToken=${actionData.accessToken}`;
      link.click();
    }
  }, [actionData]);

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
          </div>
        </div>

        <SubscriptionSection subscriptionDetails={subscriptionDetails} />

        <Form method="post" className="mt-6">
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            Start Liking
          </button>
        </Form>

        {user.role === "admin" && (
          <div className="mt-6">
            <Link
              to="/admin"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              Admin
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/auth/logout"
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            style={{
              fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
            }}
          >
            Logout
          </Link>
        </div>
      </AuthCard>
    </>
  );
}

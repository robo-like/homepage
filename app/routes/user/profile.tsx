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
      <AuthCard title="Your Profile">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Account Info
          </h2>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        </div>

        <SubscriptionSection subscriptionDetails={subscriptionDetails} />

        <Form method="post" className="mt-6">
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Start Liking
          </button>
        </Form>

        {user.role === "admin" && (
          <div className="mt-4">
            <Link
              to="/admin"
              className="w-full inline-flex justify-center items-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Admin
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/auth/logout"
            className="inline-flex justify-center items-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Logout
          </Link>
        </div>
      </AuthCard>
    </>
  );
}

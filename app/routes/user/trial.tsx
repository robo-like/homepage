import { redirect } from "react-router";
import { requireAuth } from "~/lib/auth";
import { Form, useLoaderData, useActionData, Link } from "react-router";
import { AuthCard } from "~/components/AuthCard";
import type { Route } from "./+types/trial";
import { getTrialExpiresAt, isUserOnTrial } from "~/lib/user/trial";
import { useEffect, useState } from "react";
import { db } from "~/lib/db";
import { accessTokens } from "~/lib/db/schema";
import { eq } from "drizzle-orm";

export function meta() {
  return [{ title: "RoboLike" }];
}

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

  if (isUserOnTrial(user)) {
    return {
      trialExpiresAt: getTrialExpiresAt(user),
    };
  } else {
    return redirect("/u/profile");
  }
}

export default function Trial() {
  const { trialExpiresAt } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(trialExpiresAt).getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft("Trial has expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [trialExpiresAt]);

  useEffect(() => {
    if (actionData?.accessToken) {
      const link = document.createElement("a");
      link.href = `robolike://likes?accessToken=${actionData.accessToken}`;
      link.click();
    }
  }, [actionData]);

  return (
    <>
      <AuthCard title="Trial Access">
        <div className="mb-8">
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <p className="mb-4 text-center text-gray-700">
              Your trial will expire on{" "}
              <span className="font-semibold">
                {new Date(trialExpiresAt).toLocaleString()}
              </span>
            </p>
            <p className="mb-6 text-lg font-bold text-center text-orange-600">
              {timeLeft}
            </p>

            <Form method="post">
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Start Liking
              </button>
            </Form>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Enjoying your trial?
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              Upgrade to a full subscription to continue using RoboLike after your trial expires.
            </p>
            <Link
              to="/social-media-automation-pricing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </AuthCard>
    </>
  );
}

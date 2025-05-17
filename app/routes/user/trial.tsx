import { redirect } from "react-router";
import { requireAuth } from "~/lib/auth";
import { Form, useLoaderData, useActionData } from "react-router";
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
      <AuthCard title="TRIAL" className="max-w-xl mb-16">
        <div className="mb-8">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p
              className="mb-4 text-center"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              {`Your trial will expire on ${new Date(trialExpiresAt).toLocaleString()}`}
            </p>
            <p
              className="mb-4 text-lg font-semibold text-center"
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
            >
              {timeLeft}
            </p>

            <Form method="post">
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
          </div>
        </div>
      </AuthCard>
    </>
  );
}

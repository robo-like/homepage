import { useOutletContext, Link, redirect } from "react-router";
import type { ProfileLayoutContext } from "./layout";
import { AuthCard } from "~/components/AuthCard";
import { SubscriptionSection } from "~/components/SubscriptionSection";
import { requireAuth } from "~/lib/auth";
import type { Route } from "./+types/profile";
import { isUserOnTrial } from "~/lib/user/trial";

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

import { Form, useActionData, useLoaderData } from "react-router";
import { auth, requireAuth } from "~/lib/auth";
import { db } from "~/lib/db";
import { accessTokens } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Route } from "../+types/auth-common";

export async function loader({ request }: Route.LoaderArgs) {
  // Ensure user is authenticated
  const authData = await requireAuth(request, "/auth/login");

  // Get user's access token if it exists
  const token = await db
    .select()
    .from(accessTokens)
    .where(eq(accessTokens.userId, authData.user.id))
    .get();

  return {
    user: authData.user,
    token,
  };
}

export async function action({ request }: Route.ActionArgs) {
  // Ensure user is authenticated
  const authData = await requireAuth(request, "/auth/login");

  try {
    // Generate new access token
    const token = crypto.randomUUID();

    // Insert into database
    await db.insert(accessTokens).values({
      userId: authData.user.id,
      token,
    });

    return { success: true };
  } catch (error) {
    console.error("Error generating access token:", error);
    return { error: "Failed to generate access token" };
  }
}

export default function AccessToken() {
  const { user, token } = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-16 mb-16">
      <div className="text-center mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
          }}
        >
          ACCESS TOKEN
        </h1>
        <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
      </div>

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

      <a
        href="/u/profile"
        className="block text-center text-gray-600 hover:text-[#07b0ef] mt-4"
        style={{ fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)' }}
      >
        Back to Profile
      </a>
    </div>
  );
}

export function meta() {
  return [
    { title: "Access Token | RoboLike" },
    {
      name: "description",
      content: "Manage your RoboLike API access token",
    },
  ];
}

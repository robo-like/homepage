import { Form, useActionData, useLoaderData, useLocation, redirect } from "react-router";
import { useState } from "react";
import { auth, createMagicLinkKey, sendMagicLinkEmail } from "~/lib/auth.server";
import { authQueries } from "~/lib/db";
import type { Route } from "../+types/auth-common";

// Check for valid email format and constraints from prompts
function isValidEmail(email: string) {
  if (!email) return false;

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  // Check for "+" in the local part as per requirements
  const localPart = email.split('@')[0];
  if (localPart.includes('+')) return false;

  return true;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const authData = await auth(request);
  if (authData.user) {
    if (authData.user.role === "admin") {
      return redirect("/admin");
    } else {
      return redirect("/auth/success");
    }
  }
  return { error: error || undefined };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString().toLowerCase();
  const redirectTo = formData.get("redirectTo")?.toString() || undefined;

  if (!email) {
    return { success: false, error: "Email is required" };
  }

  if (!isValidEmail(email)) {
    return {
      success: false,
      error: "Please provide a valid email address without + characters"
    };
  }

  try {
    const user = await authQueries.createUser({
      email,
      role: email == process.env.ADMIN_EMAIL ? "admin" : "user"
    });

    const key = await createMagicLinkKey(user.id);
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;
    let magicLinkUrl = `${origin}/auth/confirm?key=${key}`;

    if (redirectTo) {
      magicLinkUrl += `&redirectTo=${encodeURIComponent(redirectTo)}`;
    }
    const emailSent = await sendMagicLinkEmail(email, magicLinkUrl, origin);
    if (!emailSent) {
      return {
        success: false,
        error: "Failed to send magic link email. Please try again."
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Error creating magic link:", error);
    return {
      success: false,
      error: "An error occurred. Please try again."
    };
  }
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Log in to RoboLike" },
    { name: "description", content: "Log in to your RoboLike account" }
  ];
}

export default function Login() {
  const location = useLocation();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Get redirectTo from query params
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || undefined;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    if (!isValidEmail(email)) {
      e.preventDefault();
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{
          fontFamily: 'var(--heading-font, "Press Start 2P", cursive)'
        }}>
          LOGIN TO ROBOLIKE
        </h1>
        <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
      </div>

      {submitted && actionData?.success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Magic link sent! Check your email to log in.</p>
        </div>
      ) : (
        <Form method="post" onSubmit={handleSubmit}>
          {(loaderData?.error || actionData?.error) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{loaderData?.error || actionData?.error}</p>
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              style={{ fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)' }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {redirectTo && (
              <input type="hidden" name="redirectTo" value={redirectTo} />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#07b0ef] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
          >
            SEND MAGIC LINK
          </button>
        </Form>
      )}
    </div>
  );
}
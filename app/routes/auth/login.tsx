import { Form, useActionData, useLoaderData, useLocation } from "react-router";
import { useState } from "react";

// Client-side email validation (duplicated from server for safety)
function validateEmail(email: string) {
  if (!email) return false;

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  // Check for "+" in the local part as per requirements
  const localPart = email.split("@")[0];
  if (localPart.includes("+")) return false;

  return true;
}

// Meta function that doesn't use server imports
export function meta() {
  return [
    { title: "Log in or Sign up | RoboLike" },
    {
      name: "description",
      content:
        "Log in to your existing account or sign up for a new RoboLike account",
    },
  ];
}

// Interfaces for type safety
interface LoaderData {
  error?: string;
}

interface ActionData {
  success?: boolean;
  error?: string;
}

export { loader, action } from "./login.server";

// Client component only - no server imports
export default function Login() {
  const location = useLocation();
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get redirectTo from query params
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || params.get("returnTo") || undefined;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    if (!validateEmail(email)) {
      e.preventDefault();
      return;
    }
    setIsSubmitting(true);
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-16">
      <div className="text-center mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
          }}
        >
          ROBOLIKE ACCOUNT
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
              style={{
                fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
              }}
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
              disabled={isSubmitting}
            />
            {redirectTo && (
              <input type="hidden" name="redirectTo" value={redirectTo} />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#07b0ef] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-70"
            style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                PROCESSING...
              </span>
            ) : (
              "LOGIN / SIGNUP"
            )}
          </button>
        </Form>
      )}
    </div>
  );
}

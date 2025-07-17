import { Form, useActionData, useLoaderData, useLocation } from "react-router";
import { useState } from "react";
import { AuthCard } from "~/components/AuthCard";

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
  const redirectTo =
    params.get("redirectTo") || params.get("returnTo") || undefined;

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
    <AuthCard title="Welcome to RoboLike">
      {submitted && actionData?.success ? (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Magic link sent!</p>
          <p className="text-sm mt-1">Check your email to log in securely.</p>
        </div>
      ) : (
        <Form method="post" onSubmit={handleSubmit}>
          {(loaderData?.error || actionData?.error) && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">{loaderData?.error || actionData?.error}</p>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your email address"
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
            className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                Processing...
              </span>
            ) : (
              "Login / Sign Up"
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              We'll send you a secure magic link to log in or create your account.
              No passwords needed!
            </p>
          </div>
        </Form>
      )}
    </AuthCard>
  );
}

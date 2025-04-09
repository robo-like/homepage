import { redirect, useLoaderData } from "react-router";
import { auth } from "~/lib/auth.server";
import type { Route } from "../+types/auth-common";

// Loader to verify authentication and get user info
export async function loader({ request }: Route.LoaderArgs) {
  const authData = await auth(request);
  
  // If not authenticated, redirect to login
  if (!authData.user) {
    return redirect("/auth/login");
  }
  
  // If admin, redirect to admin dashboard
  if (authData.user.role === "admin") {
    return redirect("/admin");
  }
  
  // Return user email for display
  return { userEmail: authData.user.email };
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login Successful - RoboLike" },
    { name: "description", content: "You have successfully logged in to RoboLike" },
  ];
}

export default function Success() {
  const { userEmail } = useLoaderData<typeof loader>();
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{
          fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
        }}>
          LOGIN SUCCESSFUL
        </h1>
        <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
      </div>
      
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <p className="text-lg mb-2 font-semibold">You're logged in!</p>
        <p>You may close this browser and return to your desktop RoboLike application.</p>
      </div>
      
      <div className="mb-6 text-center">
        <p className="text-gray-600 dark:text-gray-300" style={{
          fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
        }}>
          Logged in as: <span className="font-semibold">{userEmail}</span>
        </p>
      </div>
      
      <div className="text-center">
        <a
          href="/"
          className="inline-block py-2 px-4 bg-[#07b0ef] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          style={{ fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)' }}
        >
          GO TO HOMEPAGE
        </a>
      </div>
    </div>
  );
}
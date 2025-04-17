// import { data, useLoaderData } from "react-router";
// import { getUserSubscriptionDetails } from "../../lib/billing/stripe.server";
// import type { Route } from "./+types/me";
// import { auth } from "../auth";
// /**
//  * API endpoint to get the current user's information
//  * This endpoint:
//  * 1. Checks if the user is authenticated
//  * 2. Refreshes the session (extends expiry)
//  * 3. Returns user data, subscription state, and session info
//  *
//  * If not authenticated, returns a 401 response
//  */
// export async function loader({ request }: Route.LoaderArgs) {
//   try {
//     // Get authentication data and check if user is logged in
//     const authData = await auth(request);
//     if (!authData.user) {
//       return data(
//         {
//           authenticated: false,
//           error: "Not authenticated",
//         },
//         {
//           status: 401,
//           // statusText: "Unauthorized",
//         }
//       );
//     }

//     // Get user's subscription details
//     const subscriptionDetails = await getUserSubscriptionDetails(
//       authData.user.id
//     );

//     // Refresh the session by extending its expiration time
//     // First, get existing session
//     const session = authData.session;

//     // Calculate session expiry time
//     const now = new Date();
//     const sessionExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

//     // Return user data with refreshed session cookie
//     return data(
//       {
//         authenticated: true,
//         user: {
//           id: authData.user.id,
//           email: authData.user.email,
//           name: authData.user.name,
//           role: authData.user.role,
//         },
//         subscription: {
//           active: subscriptionDetails.subscribed,
//           details: subscriptionDetails.subscription,
//         },
//         session: {
//           expiresAt: sessionExpiry.toISOString(),
//         },
//       },
//       {
//         headers: {
//           "Set-Cookie": await commitSession(session),
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Error in /api/me endpoint:", error);
//     return data(
//       {
//         authenticated: false,
//         error: "Internal server error",
//       },
//       {
//         status: 500,
//         statusText: "Internal Server Error",
//       }
//     );
//   }
// }

// export default function Me() {
//   const { authenticated, user, subscription, session } = useLoaderData();

//   return (
//     <div>
//       <h1>Me</h1>
//     </div>
//   );
// }

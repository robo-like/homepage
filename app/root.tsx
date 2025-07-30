import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
} from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import { auth, type User } from "./lib/auth";
import "./app.css";
import "./retro-fonts.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const authData = await auth(request);
  return {
    user: authData.user,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  // Generate canonical URL
  const canonicalUrl = `https://robolike.com${location.pathname}`;

  useEffect(() => {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('analyticsSessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('analyticsSessionId', sessionId);
    }

    fetch("/api/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventType: "pageView",
        path: location.pathname,
        sessionId: sessionId,
      }),
    }).catch((error) => {
      console.error("Error tracking page view:", error);
    });
  }, [location.pathname]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QE23FJW74Y"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QE23FJW74Y');      // Google Analytics
              gtag('config', 'AW-17396973459');    // Google Ads
            `,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export type OutletContext = {
  user: User;
};

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  
  useEffect(() => {
    // Set up Brevo visitor ID if user is logged in
    if (user?.id) {
      // Generate a consistent visitor ID from user ID
      // Using a simple hash-like approach to create a consistent string
      const visitorId = btoa(user.id).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      (window as any).BrevoConversationsSetup = {
        visitorId: visitorId
      };
    }
    
    // Initialize Brevo Conversations
    (function(d, w, c) {
      (w as any).BrevoConversationsID = '67ef041f7f0d6b20440aab59';
      (w as any)[c] = (w as any)[c] || function() {
        ((w as any)[c].q = (w as any)[c].q || []).push(arguments);
      };
      const s = d.createElement('script');
      s.async = true;
      s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
      if (d.head) d.head.appendChild(s);
    })(document, window, 'BrevoConversations');
  }, [user]);
  
  return <Outlet context={{ user }} />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

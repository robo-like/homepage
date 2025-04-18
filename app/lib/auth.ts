import { redirect, createSessionStorage } from "react-router";
import { authQueries } from "./db";
import emailTemplate from "./email-template";

// Define user type
export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  createdAt: Date | string;
}

// Define session data type
export type SessionData = {
  userId?: string;
};

// Define flash data type
export type SessionFlashData = {
  error?: string;
  success?: string;
};

// Create database session storage
function createDatabaseSessionStorage() {
  // Default session duration - 7 days
  const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

  return createSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__robolike_session",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.COOKIE_SECRET || "s3cr3t"],
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_DURATION, // 7 days
    },
    async createData(data, expires) {
      // Create a new session in the database
      const sessionId = crypto.randomUUID();
      // Use provided expiration time or calculate default
      const expirationTime = expires || new Date(Date.now() + SESSION_DURATION);

      await authQueries.createSession({
        id: sessionId,
        userId: data.userId,
        expiresAt: expirationTime,
      });
      return sessionId;
    },
    async readData(id) {
      // Read session from database
      const session = await authQueries.getSession(id);
      if (!session) return null;
      if (!session.userId) return null;
      // Return session data
      return { userId: session.userId };
    },
    async updateData(id, data, expires) {
      // Use provided expiration time or calculate default
      const expirationTime = expires || new Date(Date.now() + SESSION_DURATION);

      // Update session in database
      await authQueries.updateSession(id, {
        userId: data.userId,
        expiresAt: expirationTime,
      });
    },
    async deleteData(id) {
      // Delete session from database
      await authQueries.deleteSession(id);
    },
  });
}

// Create session storage instance
const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage();

// Export session functions
export { getSession, commitSession, destroySession };

/**
 * Main auth function to use in loaders and actions
 * Validates session and returns user if authenticated
 */
export async function auth(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (userId) {
    // If session has a userId, load the user
    const user = await authQueries.getUserById(userId);

    if (user) {
      return {
        session,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "user" | "admin",
          createdAt: user.createdAt,
        },
      };
    }
  }

  // No authenticated user
  return { session };
}

/**
 * Require authenticated user with optional role check
 * Use this in loaders/actions that require authentication
 */
export async function requireAuth(
  request: Request,
  redirectTo = "/auth/login",
  allowedRoles?: Array<"user" | "admin">
) {
  const authData = await auth(request);

  if (!authData.user) {
    throw redirect(redirectTo);
  }

  if (allowedRoles && !allowedRoles.includes(authData.user.role)) {
    throw redirect("/auth/login?error=unauthorized");
  }

  return authData;
}

/**
 * Create a magic link key for authentication
 */
export async function createMagicLinkKey(userId: string): Promise<string> {
  const key = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

  await authQueries.createEmailKey({
    key,
    userId,
    expiresAt,
  });

  return key;
}

/**
 * Validate a magic link key and create authenticated session
 */
export async function validateMagicLinkKey(key: string): Promise<{
  valid: boolean;
  userId?: string;
  role?: "user" | "admin";
}> {
  // Find the key and check if it's valid
  const emailKey = await authQueries.getEmailKey(key);

  if (!emailKey) {
    return { valid: false };
  }

  // Mark the key as utilized
  await authQueries.markEmailKeyAsUtilized(emailKey.id);

  // Get the user
  const user = await authQueries.getUserById(emailKey.userId);

  if (!user) {
    return { valid: false };
  }

  return {
    valid: true,
    userId: user.id,
    role: user.role as "user" | "admin",
  };
}

/**
 * Create an authenticated session for a user
 */
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

/**
 * Log out user by destroying session
 */
export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

/**
 * Add a user to Brevo contact list
 */
export async function addUserToBrevoList(
  email: string,
  listId: number = 7, // Default to "User Signups" list ID
  userName?: string
): Promise<boolean> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("BREVO_API_KEY not set in environment");
      return false;
    }

    // First, create or update the contact
    const createContactResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: userName || email.split("@")[0],
          SOURCE: "Website Signup"
        },
        listIds: [listId],
        updateEnabled: true // Update if contact already exists
      }),
    });

    if (!createContactResponse.ok) {
      console.error("Error adding contact to Brevo:", await createContactResponse.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error adding user to Brevo list:", error);
    return false;
  }
}

/**
 * Send magic link email using Brevo API
 */
export async function sendMagicLinkEmail(
  email: string,
  magicLinkUrl: string,
  origin: string
): Promise<boolean> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("BREVO_API_KEY not set in environment");
      return false;
    }
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "RoboLike",
          email: process.env.BREVO_SENDER_EMAIL || "self@robolike.com",
        },
        to: [
          {
            email,
            name: email.split("@")[0],
          },
        ],
        subject: "Your RoboLike Magic Link",
        htmlContent: emailTemplate(origin, magicLinkUrl),
      }),
    });

    if (!response.ok) {
      console.error("Error sending email:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending magic link email:", error);
    return false;
  }
}

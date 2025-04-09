import { randomUUID } from 'crypto';
import { redirect, createSessionStorage } from 'react-router';
import { authQueries } from './db';

// Define user type
export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'user' | 'admin';
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
    return createSessionStorage<SessionData, SessionFlashData>({
        cookie: {
            name: "__robolike_session",
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secrets: [process.env.COOKIE_SECRET || "s3cr3t"],
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        },
        async createData(data, expires) {
            // Create a new session in the database
            const sessionId = randomUUID();
            await authQueries.createSession({
                id: sessionId,
                userId: data.userId,
                expiresAt: expires || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
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
            // Update session in database
            await authQueries.updateSession(id, {
                userId: data.userId,
                expiresAt: expires || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });
        },
        async deleteData(id) {
            // Delete session from database
            await authQueries.deleteSession(id);
        },
    });
}

// Create session storage instance
const { getSession, commitSession, destroySession } = createDatabaseSessionStorage();

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
                    role: user.role as 'user' | 'admin'
                }
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
    redirectTo = '/auth/login',
    allowedRoles?: Array<'user' | 'admin'>
) {
    const authData = await auth(request);

    if (!authData.user) {
        throw redirect(redirectTo);
    }

    if (allowedRoles && !allowedRoles.includes(authData.user.role)) {
        throw redirect('/auth/login?error=unauthorized');
    }

    return authData;
}

/**
 * Create a magic link key for authentication
 */
export async function createMagicLinkKey(userId: string): Promise<string> {
    const key = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    await authQueries.createEmailKey({
        key,
        userId,
        expiresAt
    });

    return key;
}

/**
 * Validate a magic link key and create authenticated session
 */
export async function validateMagicLinkKey(key: string): Promise<{
    valid: boolean;
    userId?: string;
    role?: 'user' | 'admin';
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
        role: user.role as 'user' | 'admin'
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
            "Set-Cookie": await commitSession(session)
        }
    });
}

/**
 * Log out user by destroying session
 */
export async function logout(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));

    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session)
        }
    });
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
            console.error('BREVO_API_KEY not set in environment');
            return false;
        }

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: 'RoboLike',
                    email: 'auth@robo-like.com'
                },
                to: [
                    {
                        email,
                        name: email.split('@')[0]
                    }
                ],
                subject: 'Your RoboLike Magic Link',
                htmlContent: `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { display: inline-block; background-color: #07b0ef; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
                .logo { max-width: 200px; }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="${origin}/images/logo.png" alt="RoboLike Logo" class="logo" />
                <h1>Your Magic Link</h1>
                <p>Click the button below to log in to your RoboLike account. This link will expire in 5 minutes.</p>
                <p><a href="${magicLinkUrl}" class="button">Log In</a></p>
                <p>If you did not request this link, you can safely ignore this email.</p>
                <p>- The RoboLike Team</p>
              </div>
            </body>
          </html>
        `
            })
        });

        if (!response.ok) {
            console.error('Error sending email:', await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending magic link email:', error);
        return false;
    }
}
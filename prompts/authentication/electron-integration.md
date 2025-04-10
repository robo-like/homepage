# RoboLike Authentication Integration with Electron

This document outlines how to integrate RoboLike's web-based authentication system with a desktop Electron application. This approach enables a seamless experience where users can log in through the web interface and have their session recognized in the desktop application.

## Architecture Overview

RoboLike uses a hybrid authentication approach:

1. **Web Authentication**: Users authenticate via magic links sent to their email
2. **Session Management**: Authentication state is maintained via HTTP-only cookies
3. **Desktop Integration**: The Electron app uses a "log in via browser" flow to leverage the web auth system

## Authentication Flow

```
┌─────────────────┐     ┌────────────────────┐     ┌─────────────────┐
│                 │     │                    │     │                 │
│  Electron App   │     │  Web Browser       │     │  RoboLike API   │
│                 │     │                    │     │                 │
└────────┬────────┘     └─────────┬──────────┘     └────────┬────────┘
         │                        │                         │
         │                        │                         │
         │  1. Launch Browser     │                         │
         │───────────────────────>│                         │
         │  with login URL        │                         │
         │                        │                         │
         │                        │  2. Login via           │
         │                        │  Magic Link            │
         │                        │────────────────────────>│
         │                        │                         │
         │                        │  3. Set Session Cookie  │
         │                        │<────────────────────────│
         │                        │                         │
         │                        │  4. Redirect to         │
         │                        │  success page with      │
         │                        │  deep link              │
         │                        │<────────────────────────│
         │                        │                         │
         │  5. Deep link          │                         │
         │<───────────────────────│                         │
         │  invokes app           │                         │
         │                        │                         │
         │  6. App requests       │                         │
         │  /u/me endpoint        │                         │
         │────────────────────────┼────────────────────────>│
         │                        │                         │
         │  7. Return user data   │                         │
         │<───────────────────────┼─────────────────────────│
         │                        │                         │
         │                        │                         │
```

## Implementation Guide

### 1. Web Authentication Endpoint

The `/u/me` endpoint provides complete user information, subscription status, and session management:

**Request:**

```
GET /u/me HTTP/1.1
Host: app.robolike.com
Cookie: __robolike_session=<session_cookie>
```

**Response:**

```json
{
  "authenticated": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2023-04-01T00:00:00.000Z"
  },
  "subscription": {
    "active": true,
    "details": {
      "stripeSubscriptionId": "sub_123",
      "status": "active",
      "currentPeriodEnd": "2023-05-01T00:00:00.000Z",
      "cancelAtPeriodEnd": false
    }
  },
  "trial": {
    "isInTrial": false,
    "trialEndDate": "2023-04-04T00:00:00.000Z",
    "daysLeft": 0
  },
  "access": {
    "expired": false,
    "reason": null
  },
  "session": {
    "expiresAt": "2023-04-08T00:00:00.000Z"
  }
}
```

### 2. Electron App Integration

#### 2.1. Configure custom protocol handler

```javascript
// In your Electron app's main process
app.setAsDefaultProtocolClient("robolike");

// Handle the deep link
app.on("open-url", (event, url) => {
  // Parse the URL, extract auth token if present
  const authUrl = new URL(url);
  // Handle the authentication
  mainWindow.webContents.send("auth-callback", authUrl.searchParams);
});
```

#### 2.2. Implement "Log in with Browser" button

```javascript
// In your Electron app's renderer process
const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", () => {
  // Open the system browser with the login URL
  shell.openExternal(
    "https://app.robolike.com/auth/login?redirectTo=robolike://auth/callback"
  );
});
```

#### 2.3. Session Management in Electron

```javascript
// In your Electron app's renderer process
async function checkSession() {
  try {
    // Create a fetch request that includes credentials (cookies)
    const response = await fetch("https://app.robolike.com/u/me", {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      if (userData.authenticated) {
        // User is authenticated, update UI accordingly
        updateUserInterface(userData);

        // Check if user has valid access
        if (userData.access.expired) {
          showExpiredAccessMessage(userData.access.reason);
        }

        // Check if user is in trial
        if (userData.trial.isInTrial) {
          showTrialMessage(userData.trial.daysLeft);
        }

        return userData;
      }
    }

    // User is not authenticated, show login screen
    showLoginScreen();
    return null;
  } catch (error) {
    console.error("Error checking session:", error);
    showOfflineScreen();
    return null;
  }
}
```

### 3. Cross-Origin Considerations

For security, the Electron app should use a custom protocol (e.g., `app://robolike.desktop`) which requires proper CORS configuration on the server:

- The `/u/me` endpoint includes CORS headers to allow requests from the Electron app's origin
- For local development, it allows all origins (`*`)
- For production, it specifically allows the Electron app's protocol (`app://robolike.desktop`)

### 4. Session Synchronization

The Electron app should check the session status:

1. **On startup**: Verify if the user is authenticated
2. **On resume from sleep**: Refresh session information
3. **Periodically** (e.g., every 30 minutes): Check for session/subscription changes

```javascript
// Check session on app startup
checkSession();

// Check session when app comes from background
app.on("activate", () => {
  checkSession();
});

// Set up periodic session check
setInterval(checkSession, 30 * 60 * 1000);
```

### 5. Handling Offline Mode

The Electron app should gracefully handle offline scenarios:

1. Cache essential user information locally (encrypted)
2. Implement offline grace period (e.g., 7 days)
3. Require online verification for sensitive operations

```javascript
class SessionManager {
  constructor() {
    this.lastVerifiedTime = null;
    this.userData = null;
    this.offlineGracePeriod = 7 * 24 * 60 * 60 * 1000; // 7 days
  }

  async verify() {
    try {
      const userData = await checkSession();
      if (userData) {
        this.userData = userData;
        this.lastVerifiedTime = Date.now();
        this.saveToSecureStorage();
        return true;
      }
      return false;
    } catch (error) {
      // Check if we're within offline grace period
      if (
        this.lastVerifiedTime &&
        Date.now() - this.lastVerifiedTime < this.offlineGracePeriod
      ) {
        return true;
      }
      return false;
    }
  }

  // ... other methods
}
```

## Security Considerations

1. **Cookie Security**: All session cookies are HTTP-only, Secure, and SameSite=Lax
2. **Session Verification**: Sessions expire after 7 days of inactivity
3. **Offline Grace Period**: The desktop app allows limited offline usage (7 days max)
4. **Local Storage**: Sensitive data stored locally is encrypted
5. **Cross-Origin Protection**: Strict CORS policies prevent unauthorized access

## Testing Authentication Flow

To test the complete auth flow:

1. Start your Electron app
2. Click "Log in with Browser"
3. Complete the web login process
4. Verify that the app recognizes your authentication
5. Test offline mode by disconnecting from internet
6. Check session expiry handling

## Troubleshooting

Common issues and solutions:

1. **Cookie Not Set**: Ensure the browser is accepting third-party cookies
2. **CORS Errors**: Verify the Electron app's protocol is properly registered
3. **Session Expiry**: Confirm system clock is synchronized
4. **Deep Link Handling**: Test protocol handler registration

## References

- [Electron Documentation: Protocol Handler](https://www.electronjs.org/docs/latest/api/app#appsetasdefaultprotocolclientprotocol-path-args)
- [Electron Documentation: Web Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [CORS in Node.js](https://expressjs.com/en/resources/middleware/cors.html)

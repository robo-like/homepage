# RoboLike Authentication System

The RoboLike authentication system provides a secure, magic-link based authentication flow for both web and desktop application access.

## Features

- **Magic Link Authentication**: No passwords required
- **Trial Period**: New users get a 3-day free trial
- **Session Management**: HTTP-only cookies with 7-day expiry
- **Subscription Integration**: Seamless integration with Stripe subscriptions
- **Cross-platform Support**: Works with web browser and desktop app

## Architecture

The authentication system consists of:

1. **Magic Link Generation & Verification**: Secure, time-limited email links
2. **Session Management**: Secure cookie-based sessions
3. **User API**: Endpoint for retrieving user and subscription data
4. **Cross-platform Integration**: Deep-linking for desktop application

## Key Components

### Authentication Flow

1. User enters their email address
2. System sends a magic link to their email
3. User clicks link and is authenticated
4. System creates a session and redirects to the appropriate destination

### User Data API (`/u/me`)

This endpoint provides comprehensive data about the authenticated user, including:

- **Authentication Status**: Whether the user is authenticated
- **User Information**: ID, email, name, role, creation date
- **Subscription Status**: Active subscription details if present
- **Trial Information**: Trial status, end date, and days remaining
- **Access Information**: Whether account has expired and reason
- **Session Information**: Session expiry details

Example response:

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
    "isInTrial": true,
    "trialEndDate": "2023-04-04T00:00:00.000Z",
    "daysLeft": 2
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

### Session Management

- Sessions last for 7 days
- Sessions are automatically refreshed when accessing protected endpoints
- Sessions are stored in the database for persistence across server restarts

### Trial System

- New users get a 3-day free trial
- Trial status is calculated based on user creation date
- Trial information is included in the user API response

## Integration with Other Systems

### Desktop Application Integration

See [Electron Integration Guide](./electron-integration.md) for details on how to integrate the web authentication system with Electron desktop apps.

### Stripe Integration

The authentication system seamlessly integrates with Stripe for subscription management:

1. User authenticates through the web interface
2. User can purchase a subscription through Stripe checkout
3. Subscription status is automatically reflected in the user API
4. Desktop app can check subscription status through the user API

## Security Considerations

- Magic links expire after 5 minutes
- Magic links can only be used once
- Sessions use HTTP-only cookies with secure flag
- No sensitive information is stored in local storage or session storage
- CORS headers are carefully configured to prevent unauthorized access

## API Endpoints

| Endpoint        | Method | Description                                     |
| --------------- | ------ | ----------------------------------------------- |
| `/auth/login`   | POST   | Initiate login flow by sending magic link       |
| `/auth/confirm` | GET    | Confirm magic link and create session           |
| `/auth/logout`  | GET    | End session and log out user                    |
| `/u/me`         | GET    | Get authenticated user data and refresh session |
| `/u/profile`    | GET    | View and manage user profile and subscription   |

## Development and Testing

### Testing Trial Functionality

To test the trial functionality, you can manually adjust the user's `createdAt` date in the database:

```sql
UPDATE users SET created_at = datetime('now', '-2 days') WHERE id = 'user_id';
```

### Testing Session Expiry

To test session expiry, you can manually adjust the session's `expiresAt` date:

```sql
UPDATE active_sessions SET expires_at = datetime('now', '-1 hour') WHERE id = 'session_id';
```

## Reference Documentation

For more details on specific authentication components, see:

- [Email Template Customization](./email-templates.md)
- [Electron Integration](./electron-integration.md)
- [Stripe Integration](../billing/index.md)

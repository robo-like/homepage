import { analyticsQueries } from '../db';

/**
 * Track various user actions in the application.
 * All events are stored in the analytics table.
 */

// Event type constants
export const EVENT_TYPES = {
  // Page views
  PAGE_VIEW: 'pageView',
  
  // Authentication events
  SIGNUP: 'signup',
  LOGIN_SUCCESS: 'loginSuccess',
  LOGIN_FAILED: 'loginFailed',
  
  // Download events
  DOWNLOAD: 'download',
  
  // Subscription events
  SUBSCRIPTION_STARTED: 'subscriptionStarted',
  SUBSCRIPTION_CANCELED: 'subscriptionCanceled',
  SUBSCRIPTION_UPDATED: 'subscriptionUpdated',
  
  // User events
  USER_CREATED: 'userCreated',
};

/**
 * Track authentication events
 */
export async function trackAuthEvent({
  eventType,
  userId,
  email,
  sessionId,
  ipAddress,
  userAgent,
  success = true,
  errorMessage = '',
}: {
  eventType: string;
  userId?: string;
  email: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}) {
  try {
    return analyticsQueries.createPageView({
      sessionId,
      path: '/auth',
      eventType,
      eventValue: success ? 'success' : 'failed',
      description: success ? 
        `Auth event for ${email}` : 
        `Auth event failed for ${email}${errorMessage ? `: ${errorMessage}` : ''}`,
      ipAddress,
      userAgent,
      userId,
    });
  } catch (error) {
    console.error('Error tracking auth event:', error);
    // Don't throw - analytics should never break core functionality
  }
}

/**
 * Track download events
 */
export async function trackDownload({
  platform,
  version,
  userId,
  sessionId,
  ipAddress,
  userAgent,
}: {
  platform: string; // 'windows', 'macos', 'linux'
  version?: string;
  userId?: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return analyticsQueries.createProductEvent({
      sessionId,
      path: '/downloads',
      eventValue: platform,
      description: `Downloaded ${platform} version${version ? ` ${version}` : ''}`,
      userId,
    });
  } catch (error) {
    console.error('Error tracking download event:', error);
    // Don't throw - analytics should never break core functionality
  }
}

/**
 * Track subscription events
 */
export async function trackSubscriptionEvent({
  eventType,
  userId,
  subscriptionId,
  priceId,
  sessionId,
}: {
  eventType: string;
  userId: string;
  subscriptionId: string;
  priceId?: string;
  sessionId: string;
}) {
  try {
    return analyticsQueries.createProductEvent({
      sessionId,
      path: '/u/profile',
      eventValue: subscriptionId,
      description: `Subscription ${eventType}${priceId ? ` for plan ${priceId}` : ''}`,
      userId,
    });
  } catch (error) {
    console.error('Error tracking subscription event:', error);
    // Don't throw - analytics should never break core functionality
  }
}

/**
 * Track user created event
 */
export async function trackUserCreated({
  userId,
  email,
  sessionId,
  ipAddress,
  userAgent,
}: {
  userId: string;
  email: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return analyticsQueries.createPageView({
      sessionId,
      path: '/auth',
      eventType: EVENT_TYPES.USER_CREATED,
      eventValue: email,
      description: `New user created: ${email}`,
      ipAddress,
      userAgent,
      userId,
    });
  } catch (error) {
    console.error('Error tracking user created event:', error);
    // Don't throw - analytics should never break core functionality
  }
}
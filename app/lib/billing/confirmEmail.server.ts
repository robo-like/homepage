import { createStripeCustomer } from './stripe.server';
import { authQueries } from '../db';

/**
 * Create a Stripe customer when a user confirms their email for the first time
 * 
 * This function should be called when a user successfully confirms their email
 * through the magic link flow.
 */
export async function handleEmailConfirmation(userId: string) {
  try {
    // Get user from database
    const user = await authQueries.getUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // If user already has a Stripe customer ID, we don't need to create one
    if (user.stripeCustomerId) {
      return user;
    }

    // Create Stripe customer
    await createStripeCustomer(user.email, user.id);
    
    // Return updated user
    return authQueries.getUserById(user.id);
  } catch (error) {
    console.error('Error handling email confirmation:', error);
    // Return the original user object if there's an error
    // This way we don't block the authentication flow if Stripe is down
    return authQueries.getUserById(userId);
  }
}
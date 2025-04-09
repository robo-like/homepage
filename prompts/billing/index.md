# Introduction

We are using Stripe for our billing needs. We will use a balanced approach between prebuilt components and custom logic. For example, for the create subscription page, we can leverage Stripe Checkout to let our user create a subscription there and then return to the robolike page when they are done. 

# Billing Structure

Each RoboLike user will have a unique Stripe customer that gets created. The user trial will need to have the customer created without a subscription (we have a 3-day unlimited free trial no credit card required).

The Stripe customer should be created with as much meta data as we currently have at our disposal but at the very least "email" should be set in the profile. RoboLike_User_Id can be added to the metadata of the customer. 

# New Routes

```
/billing
    if (authenticated as user) show a list of the last 10 transaction paid to RoboLike as well as the status of their subscription and a button to cancel (if active) and a button to Subscript (if not yet activated)
/webhooks/stripe
    this will receieve inbound events from Stripe. We will listen for changes to subscription events handling actions from starting a new subscription and thus updating the state of our database on a per user basis to deactivating a user account when the subscription has failed to process. 
```

# Database Modifications
Billing is always a careful balance between having a single source of truth, and being able to have certain values cached. The 'users' table should get a new column for 'stripe_cust_id'. This will be set the first time they engage with our billing system. 

The 'users' table will also need a 'billing_active' boolean which our webhooks will enable or disable based on the webhook events which are created or other API related changes from our backend. 

# Sample Code and Env Variables
Env variables will be available as:

```
STRIPE_PRIVATE_KEY=
STRIPE_PUBLISHABLE_KEY=
```

How to receive webhooks:
```

```
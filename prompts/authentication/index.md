# Introduction

Authentication for the RoboLike application includes 2 main levels. From the user's perspective, they are able to see user specific information. This is in contrast with our admins who have a separate dashboard for viewing global data. Both types of users log in using an email magic link.

# New Routes
```
/auth
/auth/login
    presenational page. asks for user email address
    email address must NOT contain "+" or "." 
/auth/confirm/
    this is an ACTION only route
    if (error) redirects to login page with a flash message with human readable errors displayed above the input field
    otherwise, redirect user to their respective landing pages
/auth/success
    basic users see a success page which gives them additional instructions: "you may close this browser and return to your desktop application of RoboLike." 
/auth/logout
```

# Database Modifications and Models

## Expiring Email Keys Table
The email authentication process will require a temporary key to be created at the login step. That key gets delivered to their email address. The user will have 5 minutes to click the link and if it's NOT expired (otherwise take them back to login w/ the flash message appropriately) then direct them to:
    OPTION 1: if (user.role === "user") redirect to the /auth/success page
    OPTION 2: if (user.role === "admin") redirect to the /admin page
Let's call this table "expiring-email-keys" which has a user_id, expires_at (Date 5 minutes in the future from being created), key, utilized (if the user logs in, set this to "true" so we know it went through)

## Active Sessions Table
We will also need a table for "active sessions". this will let us delete any unwanted sessions and have it reflect in real time. This will be baked in the auth.server code to read from the session table upon each auth check. 

# Sending the Email
In order to actually send the email, we use a transactional email service called Brevo. Our environment will have a variable called BREVO_API_KEY which will be available in server code on process.env. The HTML should be pretty basic and can link to our assets like the logo image. The urls need to pull the "host" key off the request so that when the links are sent it's related to the current environment the code is running within. 

## Example Brevo Call
```bash
curl --request POST \
  --url https://api.brevo.com/v3/smtp/email \
  --header 'accept: application/json' \
  --header 'api-key:YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --data '{  
   "sender":{  
      "name":"Sender Alex",
      "email":"senderalex@example.com"
   },
   "to":[  
      {  
         "email":"testmail@example.com",
         "name":"John Doe"
      }
   ],
   "subject":"Hello world",
   "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Brevo.</p></body></html>"
}'
```
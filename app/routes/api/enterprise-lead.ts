/**
 * API endpoint to add enterprise lead emails to Brevo list #6
 */
export async function action({ request }: { request: Request }) {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();
    const email = formData.get("email");

    // Validate email
    if (!email || typeof email !== "string") {
      return new Response("Email is required", { status: 400 });
    }

    // Get Brevo API key from environment
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("BREVO_API_KEY not set in environment");
      return new Response("Server configuration error", { status: 500 });
    }

    // Add contact to Brevo list #6 (enterprise-leads)
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [6], // Enterprise leads list
        updateEnabled: true,
        attributes: {
          SOURCE: "Website Enterprise Form",
          DATE: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      console.error("Error adding contact to Brevo:", await response.text());
      return new Response("Error adding contact to mailing list", {
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing enterprise lead:", error);
    return new Response(
      `Internal server error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}

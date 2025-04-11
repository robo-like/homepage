import { json } from "react-router";
import { db } from "~/lib/db";
import { supportTickets } from "~/lib/db/schema";
import { auth } from "~/lib/auth";
import type { Route } from "../+types/auth-common";

export async function action({ request }: Route.ActionArgs) {
  try {
    // Check if user is authenticated
    const authData = await auth(request);
    if (!authData.user) {
      return json(
        { error: "You must be logged in to submit a support ticket" },
        { status: 401 }
      );
    }

    // Get request data
    const data = await request.json();
    const { subject, message } = data;

    // Validate inputs
    if (!subject || !message) {
      return json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Create new support ticket
    const ticket = await db
      .insert(supportTickets)
      .values({
        userId: authData.user.id,
        subject: subject.trim(),
        message: message.trim(),
        status: "OPEN", // Default status
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get();

    return json({ success: true, ticket });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return json(
      { error: "Failed to create support ticket" },
      { status: 500 }
    );
  }
}
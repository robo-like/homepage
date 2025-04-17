import { data } from "react-router";
import { db } from "~/lib/db";
import { supportTickets } from "~/lib/db/schema";
import { auth } from "~/lib/auth";
import type { Route } from "./+types/support-ticket";

export async function action({ request }: Route.ActionArgs) {
  try {
    // Check if user is authenticated
    const authData = await auth(request);
    if (!authData.user) {
      return data(
        { error: "You must be logged in to submit a support ticket" },
        { status: 401 }
      );
    }
    const { subject, message } = await request.json();

    // Validate inputs
    if (!subject || !message) {
      return data(
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

    return data({ success: true, ticket });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return data(
      { error: "Failed to create support ticket" },
      { status: 500 }
    );
  }
}
import { json } from "react-router";
import { db } from "~/lib/db";
import { supportTickets } from "~/lib/db/schema";
import { auth } from "~/lib/auth";
import { desc, eq } from "drizzle-orm";
import type { Route } from "../+types/auth-common";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Check if user is authenticated
    const authData = await auth(request);
    if (!authData.user) {
      return json(
        { error: "You must be logged in to view your support tickets" },
        { status: 401 }
      );
    }

    // Get all tickets for the current user, sorted by creation date (newest first)
    const tickets = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, authData.user.id))
      .orderBy(desc(supportTickets.createdAt));

    return json({ tickets });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return json(
      { error: "Failed to fetch support tickets" },
      { status: 500 }
    );
  }
}
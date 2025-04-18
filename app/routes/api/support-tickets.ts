import { data } from "react-router";
import { db } from "~/lib/db/index.server";
import { supportTickets } from "~/lib/db/schema";
import { auth } from "~/lib/auth";
import { desc, eq } from "drizzle-orm";
import type { Route } from "./+types/support-tickets";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Check if user is authenticated
    const authData = await auth(request);
    if (!authData.user) {
      return data(
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

    return { tickets };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return data(
      { error: "Failed to fetch support tickets" },
      { status: 500 }
    );
  }
}
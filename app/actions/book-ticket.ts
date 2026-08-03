"use server";

import { auth } from "@/app/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function bookTicket(eventId: string) {
  // 1. Get current user session
  const session = await auth();

  if (!session?.user) {
    return { 
      success: false, 
      error: "You must be signed in to book a ticket." 
    };
  }

  // 2. Safely extract user ID with type safety
  const userId = (session.user as { id?: string }).id;

  if (!userId) {
    return {
      success: false,
      error: "Invalid user session. Please sign in again.",
    };
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error("Event not found.");
      }

      if (event.availableTickets <= 0) {
        throw new Error("Sold out! No tickets remaining.");
      }

      const updatedEvent = await tx.event.update({
        where: { id: eventId },
        data: {
          availableTickets: {
            decrement: 1,
          },
        },
      });

      const order = await tx.order.create({
        data: {
          userEmail: userId,
          eventId: event.id,
          totalPrice: event.price,
        },
      });

      return { updatedEvent, order };
    });

    revalidatePath("/");
    revalidatePath(`/events/${eventId}`);

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Booking error:", error);
    return { success: false, error: error.message || "Failed to book ticket." };
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { eventId, userEmail, quantity = 1 } = await req.json();

    if (!eventId || !userEmail) {
      return NextResponse.json(
        { error: "Event ID and User Email are required" },
        { status: 400 }
      );
    }

    // ACID Transaction for safe booking
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      if (event.availableTickets < quantity) {
        throw new Error("Not enough tickets remaining!");
      }

      // 1. Decrement available ticket count
      const updatedEvent = await tx.event.update({
        where: { id: eventId },
        data: {
          availableTickets: {
            decrement: quantity,
          },
        },
      });

      // 2. Create the ticket order
      const order = await tx.order.create({
        data: {
          eventId,
          userEmail,
          quantity,
          totalPrice: (parseFloat(event.price) * quantity).toString(),
        },
      });

      return { order, updatedEvent };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Booking failed" },
      { status: 400 }
    );
  }
}
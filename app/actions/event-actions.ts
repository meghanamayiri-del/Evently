'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function bookTickets(
  eventId: string, 
  quantity: number = 1, 
  eventDetails?: { title: string; location: string; date: string; category: string; description: string; imageUrl: string },
  userId: string = 'default-user'
) {
  try {
    if (quantity <= 0) {
      throw new Error('Quantity must be at least 1.');
    }

    const result = await db.$transaction(async (tx) => {
      // 1. Check if event exists in DB
      let event = await tx.event.findUnique({
        where: { id: eventId },
      });

      // 2. If it doesn't exist, create it using the passed event details (Hackathon, Concert, etc.)
      if (!event) {
        event = await tx.event.create({
          data: {
            id: eventId,
            title: eventDetails?.title || 'Community Event',
            description: eventDetails?.description || 'Tech meetup and conference.',
            price: 'Free',
            location: eventDetails?.location || 'Hyderabad',
            date: eventDetails?.date || 'August 2026',
            totalTickets: 250,
            availableTickets: 250,
            organizerName: 'Evently Team',
            organizerHandle: '@evently',
            category: eventDetails?.category || 'Tech',
            imageUrl: eventDetails?.imageUrl || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
            organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
            banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b', // <-- Add this line to satisfy the banner requirement
          },
        });
      }

      if (event.availableTickets < quantity) {
        throw new Error(`Only ${event.availableTickets} tickets remaining.`);
      }

      // 3. Decrement available tickets
      const updatedEvent = await tx.event.update({
        where: { id: event.id },
        data: { availableTickets: event.availableTickets - quantity },
      });

      // 4. Create individual ticket records
      const ticketsData = Array.from({ length: quantity }).map(() => ({
        eventId: event.id,
        userId,
      }));

      await tx.ticket.createMany({
        data: ticketsData,
      });

      return { updatedEvent, quantity };
    }, {
      maxWait: 10000,
      timeout: 10000,
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/my-tickets');
    return { success: true, count: result.quantity };
  } catch (error: any) {
    console.error('Ticket booking error details:', error);
    return { success: false, error: error.message || 'Something went wrong during booking.' };
  }
}
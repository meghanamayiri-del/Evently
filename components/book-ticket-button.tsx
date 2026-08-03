"use client";

import { useState, useTransition } from "react";
import { bookTicket } from "@/app/actions/book-ticket";
import { Ticket, Loader2 } from "lucide-react";

export function BookTicketButton({
  eventId,
  availableTickets,
}: {
  eventId: string;
  availableTickets: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleBooking = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await bookTicket(eventId);
      if (res.success) {
        setMessage({ type: "success", text: "Ticket Secured!" });
      } else {
        setMessage({ type: "error", text: res.error || "Booking failed" });
      }
    });
  };

  const isSoldOut = availableTickets <= 0;

  return (
    <div className="w-full mt-4">
      <button
        onClick={handleBooking}
        disabled={isPending || isSoldOut}
        className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all ${
          isSoldOut
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            : "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Reserving spot...</span>
          </>
        ) : isSoldOut ? (
          <span>Sold Out</span>
        ) : (
          <>
            <Ticket className="h-4 w-4" />
            <span>Book Ticket</span>
          </>
        )}
      </button>

      {message && (
        <p
          className={`mt-2 text-xs text-center font-medium ${
            message.type === "success" ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
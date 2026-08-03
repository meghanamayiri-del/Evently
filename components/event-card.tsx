import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket, Heart } from "lucide-react";

interface EventProps {
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    banner: string;
    price: string;
    availableTickets: number;
    likes: string;
    organizerName: string;
    organizerHandle: string;
    organizerAvatar: string;
  };
}

export function EventCard({ event }: EventProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 transition-all hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-cyan-500/10">
      {/* Event Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={event.banner}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        <span className="absolute top-3 right-3 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-cyan-400 backdrop-blur-md border border-cyan-500/20">
          {event.price}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Organizer Header */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={event.organizerAvatar}
            alt={event.organizerName}
            width={28}
            height={28}
            className="rounded-full ring-1 ring-zinc-700"
          />
          <div className="text-xs">
            <p className="font-medium text-zinc-300">{event.organizerName}</p>
            <p className="text-zinc-500">@{event.organizerHandle}</p>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
          {event.description}
        </p>
        <Link href={`/events/${event.id}`}>
  <h3 className="text-lg font-bold text-white hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer">
    {event.title}
  </h3>
</Link>

        {/* Event Meta Details */}
        <div className="mt-4 space-y-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-400" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Ticket className="h-4 w-4" />
            <span>{event.availableTickets} tickets left</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Heart className="h-4 w-4" />
            <span>{event.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
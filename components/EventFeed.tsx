"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  date: string;
  organizerName: string;
  organizerAvatar: string;
  banner: string;
  category: string;
}

const CATEGORIES = ["All", "Sports", "Music", "Comedy", "Nightlife"];

export default function EventFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const url =
          selectedCategory === "All"
            ? "/api/events"
            : `/api/events?category=${selectedCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [selectedCategory]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Category Selection Bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-white text-black shadow-md scale-105"
                : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="text-center py-12 text-neutral-500 animate-pulse text-sm">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-sm">
          No events found in this category.
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={event.id}
              className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl hover:border-neutral-700 transition-all"
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b border-neutral-800/50">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
                    <Image
                      src={event.organizerAvatar}
                      alt={event.organizerName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {event.organizerName}
                    </h3>
                    <p className="text-xs text-neutral-400">{event.location}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-neutral-800 text-xs font-mono text-emerald-400 rounded-full border border-neutral-700">
                  ₹{event.price}
                </span>
              </div>

              {/* Event Image */}
              <Link href={`/events/${event.id}`}>
                <div className="relative w-full h-72 cursor-pointer group overflow-hidden">
                  <Image
                    src={event.banner}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority={idx < 2}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {event.category}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">
                      {event.title}
                    </h2>
                  </div>
                </div>
              </Link>

              {/* Action Footer */}
              <div className="p-4 flex items-center justify-between bg-neutral-900/50">
                <p className="text-xs text-neutral-400">
                  📅 {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Join Chat & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
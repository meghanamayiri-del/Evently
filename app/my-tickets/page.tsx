'use client';

import { useState } from 'react';
import Link from 'next/link';


export default function MyTicketsPage() {
  // Mock booked tickets matching your database schema
  const [bookedTickets] = useState([
    {
      id: 'tkt-1',
      eventTitle: 'Evently Launch Party',
      date: 'August 15, 2026',
      location: 'Tech Hub Arena, Hyderabad',
      bookingDate: 'August 3, 2026',
    },
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-400">My Tickets</h1>
          <Link 
            href="/" 
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Back to Events
          </Link>
        </div>

        {bookedTickets.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-slate-400 mb-4">You haven't booked any tickets yet.</p>
            <Link 
              href="/"
              className="inline-block py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookedTickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full mb-2">
                    Confirmed Ticket
                  </span>
                  <h2 className="text-xl font-bold text-slate-100">{ticket.eventTitle}</h2>
                  <p className="text-slate-400 text-sm mt-1">📍 {ticket.location}</p>
                  <p className="text-slate-500 text-xs mt-2">Event Date: {ticket.date} • Booked on {ticket.bookingDate}</p>
                </div>

                <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="block text-xs text-slate-400">Ticket ID</span>
                  <span className="font-mono text-xs text-indigo-400">{ticket.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
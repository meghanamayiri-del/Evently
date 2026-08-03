import { db } from '@/lib/db';
import { getTrendingTechEvents } from '@/lib/external-events';
import Link from 'next/link';

export default async function HomePage() {
  const userId = 'default-user';
  
  // Fetch local database events, tickets, and external internet events in parallel
  const [dbEvents, userTickets, externalEvents] = await Promise.all([
    db.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    db.ticket.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    getTrendingTechEvents(),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Evently Ticketing Platform
            </h1>
            <p className="text-slate-400 text-sm mt-1">Discover community meetups, live concerts, and global tech summits.</p>
          </div>
          <Link
            href="/my-tickets"
            className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold rounded-xl hover:bg-indigo-600/20 transition-all shadow-sm"
          >
            🎫 View All My Tickets →
          </Link>
        </div>

        {/* My Tickets Preview Section */}
        {userTickets.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-200">Your Recent Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userTickets.map((ticket) => (
                <div key={ticket.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
                      Confirmed Ticket
                    </span>
                    <span className="text-xs text-slate-500">ID: {ticket.id.slice(0, 6)}</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 truncate">{ticket.event.title}</h3>
                  <p className="text-xs text-slate-400">📍 {ticket.event.location}</p>
                  <p className="text-xs text-indigo-400 font-medium">Date: {ticket.event.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Global / External Events Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-200">Featured Global Summits & Concerts</h2>
            <span className="text-xs px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-medium">
              Live API Feed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {externalEvents.map((event) => (
              <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-indigo-500/50 transition-all">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-indigo-400 text-xs font-semibold rounded-full border border-slate-800">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400">{event.date}</span>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{event.description}</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-800/80">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Available: <strong className="text-indigo-400">{event.availableTickets}</strong></span>
                      <span className="truncate max-w-[150px]">📍 {event.location}</span>
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="block w-full py-2.5 text-center bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-sm font-medium rounded-xl transition-all shadow-sm"
                    >
                      View Details & Tickets
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Local Database Events Marketplace Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-200">Community & Database Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dbEvents.map((event) => (
              <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full">
                      {event.category}
                    </span>
                    <span className="text-xs text-slate-400">{event.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{event.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2">{event.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Avail: <strong className="text-indigo-400">{event.availableTickets}</strong></span>
                    <span className="truncate max-w-[120px]">📍 {event.location}</span>
                  </div>
                  <Link
                    href={`/events/${event.id}`}
                    className="block w-full py-2 text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
                  >
                    Book Tickets
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
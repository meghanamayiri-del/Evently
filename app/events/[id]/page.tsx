'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { bookTickets } from '@/app/actions/event-actions';

// Sample external events list to match the home page
const EXTERNAL_EVENTS: Record<string, any> = {
  'ext-1': {
    id: 'ext-1',
    title: 'Global AI & Cloud Summit 2026',
    description: 'Explore generative AI models, serverless architectures, and next-gen cloud scaling with global industry leaders. Join workshops, keynotes, and elite networking sessions.',
    location: 'Hyderabad International Convention Centre',
    date: 'September 12, 2026',
    availableTickets: 120,
    totalTickets: 250,
    category: 'Artificial Intelligence',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  },
  'ext-2': {
    id: 'ext-2',
    title: 'Full-Stack Developer Live Hackathon',
    description: 'Build high-performance web applications using Next.js, Prisma, and Tailwind CSS. Amazing prizes, mentors, and food provided throughout the hackathon.',
    location: 'HITEC City Tech Hub, Hyderabad',
    date: 'September 28, 2026',
    availableTickets: 45,
    totalTickets: 100,
    category: 'Hackathon',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
  },
  'ext-3': {
    id: 'ext-3',
    title: 'Indie Rock & Synthwave Live Concert',
    description: 'An unforgettable evening of live electronic music, immersive lighting displays, and indie bands performing their latest tracks live.',
    location: 'Shilpakala Vedika, Hyderabad',
    date: 'October 05, 2026',
    availableTickets: 15,
    totalTickets: 300,
    category: 'Music Concert',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
  },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

   useEffect(() => {
    if (EXTERNAL_EVENTS[eventId]) {
      setEvent(EXTERNAL_EVENTS[eventId]);
    } else {
      // Dynamically format title based on the actual ID or route parameter requested
      const formattedTitle = eventId
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setEvent({
        id: eventId,
        title: formattedTitle || 'Special Community Event',
        description: 'An exclusive live event session booked via the Evently network. Enjoy live interactions, networking, and expert keynotes.',
        totalTickets: 100,
        availableTickets: 85,
        date: 'August 20, 2026',
        location: 'Hyderabad Arena, Telangana',
        category: 'Featured',
        //imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
      });
    }
  }, [eventId]);

  const handleBookTickets = async () => {
    setBooking(true);
    setErrorMessage('');

    const res = await bookTickets(eventId, quantity);

    setBooking(false);

    if (res.success) {
      setSuccess(true);
      // Locally decrement available tickets so UI updates immediately
      setEvent((prev: any) => ({
        ...prev,
        availableTickets: Math.max(0, prev.availableTickets - quantity),
      }));
      setTimeout(() => {
        router.push('/my-tickets');
      }, 1500);
    } else {
      setErrorMessage(res.error || 'Failed to book tickets.');
    }
  };

  if (!event) {
    return <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">Loading event...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          ← Back to Events
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {event.imageUrl && (
            <div className="h-56 w-full overflow-hidden relative">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
          )}

          <div className="p-8">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full border border-indigo-500/20">
                {event.category || 'Live Event'}
              </span>
              <span className="text-sm text-slate-400">{event.date}</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-100 mb-3">{event.title}</h1>
            <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
              📍 {event.location}
            </p>

            <p className="text-slate-300 leading-relaxed mb-8 border-b border-slate-800 pb-6">
              {event.description}
            </p>

            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800 mb-8">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-400 font-medium">Available Tickets</span>
                <span className="font-bold text-indigo-400">
                  {event.availableTickets} / {event.totalTickets}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (event.availableTickets / event.totalTickets) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <p className="text-emerald-400 font-semibold mb-1">Successfully Booked {quantity} Ticket(s)! 🎉</p>
                <p className="text-slate-400 text-xs">Redirecting to your tickets dashboard...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  <label htmlFor="quantity" className="text-sm font-medium text-slate-300">
                    Select Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={Math.max(event.availableTickets, 1)}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-center text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-400 text-xs text-center">{errorMessage}</p>
                )}

                <button
                  onClick={handleBookTickets}
                  disabled={booking || event.availableTickets === 0}
                  className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer disabled:cursor-not-allowed"
                >
                  {booking ? 'Processing Transaction...' : event.availableTickets === 0 ? 'Sold Out' : `Book ${quantity} Ticket(s)`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
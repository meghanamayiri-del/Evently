import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-extrabold text-indigo-400 tracking-tight">
          Evently
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <Link href="/my-tickets" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
            My Tickets
          </Link>
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 text-xs rounded-full">
            GitHub Auth
          </span>
        </div>
      </div>
    </nav>
  );
}
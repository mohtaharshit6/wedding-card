import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {/* Admin Top Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-serif font-bold text-base shadow-sm">
                ✦
              </span>
              <span>Wedding Platform <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-normal">Admin</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                Weddings
              </Link>
              <Link
                href="/admin/rsvp"
                className="px-3 py-1.5 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                RSVP Submissions
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ritika-madhav"
              target="_blank"
              className="text-xs px-3 py-1.5 rounded-md border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Preview Demo</span>
              <span>↗</span>
            </Link>

            <Link
              href="/admin/weddings/new"
              className="text-xs px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium transition-colors shadow-sm"
            >
              + New Wedding
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 text-xs text-zinc-500 py-6 text-center">
        Multi-Tenant Wedding Invitation Platform &bull; Built with Next.js 15 & Supabase
      </footer>
    </div>
  );
}

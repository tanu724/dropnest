
import Link from "next/link";

const pages = [
  { name: "Overview", path: "/dashboard", number: "01", description: "Your DropNest command centre." },
  { name: "DropPool", path: "/pools", number: "02", description: "Discover shared transport routes." },
  { name: "Verified Nests", path: "/nests", number: "03", description: "Explore trusted storage spaces." },
  { name: "NestLock", path: "/escrow", number: "04", description: "Secure goods handovers." },
  { name: "My Bookings", path: "/bookings", number: "05", description: "Manage your reservations." },
  { name: "My Profile", path: "/profile", number: "06", description: "Your account and details." },
  { name: "Provider Hub", path: "/provider", number: "07", description: "Manage transport requests." },
  { name: "Payments", path: "/payments", number: "08", description: "Track demo earnings and payments." },
];

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">

        <header className="flex items-center justify-between border-b border-white/10 pb-7">
          <Link href="/" className="text-2xl font-semibold">
            DropNest<span className="text-white/35">.</span>
          </Link>
          <Link href="/" className="text-xs text-white/50 hover:text-white">
            Landing page ↗
          </Link>
        </header>

        <section className="relative mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-[#252525] via-[#101010] to-[#050505] p-8 md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-20 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative">
            <p className="text-[10px] uppercase tracking-[.3em] text-white/45">
              DROPNEST / MASTER PREVIEW
            </p>

            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Everything.
              <br />
              <span className="text-white/35">In one place.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">
              Explore the complete DropNest experience. Access transport,
              storage, secure handovers, bookings, provider operations
              and payments from one central hub.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-7 py-4 text-xs font-semibold text-black hover:bg-white/85"
              >
                Enter DropNest ↗
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/20 px-7 py-4 text-xs text-white hover:bg-white/10"
              >
                View landing page
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[.25em] text-white/35">
                All modules
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Explore the platform.
              </h2>
            </div>
            <p className="text-xs text-white/40">
              08 connected workspaces
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pages.map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#191919] to-[#080808] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/35 hover:shadow-[0_15px_45px_rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[.2em] text-white/35">
                    {page.number}
                  </span>
                  <span className="text-white/35 transition group-hover:translate-x-1 group-hover:text-white">
                    ↗
                  </span>
                </div>

                <h3 className="mt-10 text-xl font-semibold">
                  {page.name}
                </h3>

                <p className="mt-3 min-h-10 text-xs leading-5 text-white/45">
                  {page.description}
                </p>

                <div className="mt-7 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[.18em] text-white/40 group-hover:text-white">
                  Open workspace →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-16 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-7 text-[9px] tracking-[.2em] text-white/30">
          <span>DROPNEST · MOVE. STORE. SECURE.</span>
          <span>MASTER PREVIEW · PROTOTYPE</span>
        </footer>
      </div>
    </main>
  );
}

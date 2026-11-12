
"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  routeId: string;
  from: string;
  to: string;
  date: string;
  time: string;
  vehicle: string;
  driver: string;
  weight: number;
  price: number;
  status: "Pending" | "Accepted" | "Completed" | "Cancelled";
  createdAt: string;
};

const STORAGE_KEY = "dropnest_bookings";
const tabs = ["All", "Pending", "Accepted", "Completed", "Cancelled"];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      ) as Booking[];

      setBookings(saved);
    } catch {
      setBookings([]);
    }

    setReady(true);
  }, []);

  function saveBookings(updated: Booking[]) {
    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function cancelBooking(id: string) {
    const updated = bookings.map((booking) =>
      booking.id === id && booking.status === "Pending"
        ? { ...booking, status: "Cancelled" as const }
        : booking
    );

    saveBookings(updated);
  }

  const counts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Accepted: bookings.filter((b) => b.status === "Accepted").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };

  const visibleBookings = bookings.filter((booking) => {
    const matchesTab =
      activeTab === "All" || booking.status === activeTab;

    const query = search.toLowerCase();

    const matchesSearch =
      booking.id.toLowerCase().includes(query) ||
      booking.from.toLowerCase().includes(query) ||
      booking.to.toLowerCase().includes(query) ||
      booking.driver.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  function statusStyle(status: Booking["status"]) {
    switch (status) {
      case "Pending":
        return "border-yellow-500/30 text-yellow-200";
      case "Accepted":
        return "border-blue-400/30 text-blue-200";
      case "Completed":
        return "border-green-400/30 text-green-200";
      case "Cancelled":
        return "border-red-400/30 text-red-200";
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-white/[0.08] bg-[#080808] px-5 py-7 lg:flex">
          <Link href="/" className="mb-12 flex items-center gap-3 px-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/[0.05] text-lg font-bold">
              D
            </span>
            <span className="text-2xl font-semibold tracking-tight">
              DropNest<span className="text-white/40">.</span>
            </span>
          </Link>

          <p className="mb-4 px-3 text-[9px] uppercase tracking-[0.3em] text-white/30">
            Workspace
          </p>

          <nav className="space-y-1">
            {[
              ["Overview", "/dashboard", "▦"],
              ["DropPool", "/pools", "↗"],
              ["Verified Nests", "/nests", "⌂"],
              ["NestLock", "/escrow", "◇"],
              ["My Bookings", "/bookings", "▤"],
              ["My Profile", "/profile", "◉"],
            ].map(([name, href, icon]) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] transition ${
                  name === "My Bookings"
                    ? "border border-white/10 bg-white/[0.09] text-white"
                    : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg">{icon}</span>
                {name}
                {name === "My Bookings" && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
              YOUR ACTIVITY
            </p>
            <p className="mt-3 text-sm font-medium">
              Every move, organized.
            </p>
            <p className="mt-2 text-[10px] leading-5 text-white/40">
              Keep track of your transport and storage requests.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.08] bg-[#050505]/90 px-5 py-4 backdrop-blur-xl md:px-8">
            <span className="text-lg font-semibold lg:hidden">DropNest.</span>
            <span className="hidden text-[9px] uppercase tracking-[0.25em] text-white/35 lg:block">
              Workspace / My Bookings
            </span>
            <Link
              href="/pools"
              className="rounded-full bg-white px-4 py-2.5 text-[10px] font-semibold text-black hover:bg-white/80"
            >
              Find transport ↗
            </Link>
          </header>

          {/* MOBILE NAV */}
          <div className="border-b border-white/[0.07] px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {[
                ["Overview", "/dashboard"],
                ["DropPool", "/pools"],
                ["Nests", "/nests"],
                ["NestLock", "/escrow"],
                ["Bookings", "/bookings"],
              ].map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  className={`shrink-0 rounded-full border px-3 py-2 text-[10px] ${
                    name === "Bookings"
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-white/55"
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-10">

            {/* HERO */}
            <section className="relative overflow-hidden rounded-[26px] border border-white/[0.11] bg-[#0b0b0b] p-7 md:p-11">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(255,255,255,.10),transparent_45%)]" />
              <div className="relative">
                <p className="text-[9px] uppercase tracking-[0.28em] text-white/35">
                  Your logistics activity
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                  All your moves.
                  <br />
                  <span className="text-white/35">One place.</span>
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
                  Track your transport booking requests, review journey details
                  and stay updated on the status of your DropNest activities.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/pools" className="rounded-full bg-white px-6 py-3 text-xs font-semibold text-black hover:bg-white/80">
                    Book transport ↗
                  </Link>
                  <Link href="/nests" className="rounded-full border border-white/20 px-6 py-3 text-xs text-white/75 hover:bg-white/10">
                    Explore storage
                  </Link>
                </div>
              </div>
            </section>

            {/* STATISTICS */}
            <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Total bookings", counts.All],
                ["Pending", counts.Pending],
                ["Accepted", counts.Accepted],
                ["Completed", counts.Completed],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-white/[0.09] bg-[#0b0b0b] p-5">
                  <p className="text-[10px] text-white/40">{label}</p>
                  <p className="mt-4 text-3xl font-semibold">{value}</p>
                </div>
              ))}
            </section>

            {/* BOOKING MANAGER */}
            <section className="mt-14">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                    Booking manager
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    Your bookings.
                  </h2>
                  <p className="mt-2 text-xs text-white/45">
                    Review and manage your saved booking requests.
                  </p>
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search booking, city or driver..."
                  className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-xs outline-none placeholder:text-white/30 focus:border-white/40 md:max-w-sm"
                />
              </div>

              {/* STATUS FILTERS */}
              <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-[10px] transition ${
                      activeTab === tab
                        ? "border-white bg-white text-black"
                        : "border-white/15 text-white/55 hover:border-white/40"
                    }`}
                  >
                    {tab} ({counts[tab as keyof typeof counts]})
                  </button>
                ))}
              </div>

              {!ready ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b0b0b] p-12 text-center text-xs text-white/40">
                  Loading bookings...
                </div>
              ) : visibleBookings.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b0b0b] px-6 py-16 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
                    ▤
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">
                    No bookings found.
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/40">
                    Your transport booking requests will appear here after
                    you submit them through DropPool.
                  </p>
                  <Link
                    href="/pools"
                    className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-xs font-semibold text-black"
                  >
                    Explore available routes ↗
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {visibleBookings.map((booking) => (
                    <article
                      key={booking.id}
                      className="rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#131313] to-[#090909] p-5 md:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[9px] tracking-[0.15em] text-white/35">
                          {booking.id}
                        </span>
                        <span className={`rounded-full border px-3 py-1.5 text-[9px] ${statusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div>
                              <p className="text-2xl font-semibold">{booking.from}</p>
                              <p className="mt-1 text-[9px] text-white/35">ORIGIN</p>
                            </div>
                            <span className="text-white/40">→</span>
                            <div>
                              <p className="text-2xl font-semibold">{booking.to}</p>
                              <p className="mt-1 text-[9px] text-white/35">DESTINATION</p>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div><p className="text-[8px] text-white/35">DATE</p><p className="mt-2 text-[10px]">{booking.date}</p></div>
                            <div><p className="text-[8px] text-white/35">TIME</p><p className="mt-2 text-[10px]">{booking.time}</p></div>
                            <div><p className="text-[8px] text-white/35">VEHICLE</p><p className="mt-2 text-[10px]">{booking.vehicle}</p></div>
                            <div><p className="text-[8px] text-white/35">GOODS WEIGHT</p><p className="mt-2 text-[10px]">{booking.weight} kg</p></div>
                          </div>
                        </div>

                        <div className="border-t border-white/[0.08] pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                          <p className="text-[8px] text-white/35">ESTIMATED PRICE</p>
                          <p className="mt-2 text-2xl font-semibold">
                            ₹{booking.price.toLocaleString("en-IN")}
                          </p>
                          <p className="mt-2 text-[9px] text-white/40">
                            Driver: {booking.driver}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                        <p className="text-[9px] text-white/30">
                          Created: {booking.createdAt}
                        </p>
                        {booking.status === "Pending" && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="rounded-full border border-red-400/30 px-4 py-2 text-[9px] text-red-200 transition hover:bg-red-400/10"
                          >
                            Cancel request
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* STATUS GUIDE */}
            <section className="mt-12 rounded-2xl border border-white/[0.09] bg-[#0a0a0a] p-6 md:p-8">
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                Status guide
              </p>
              <h2 className="mt-3 text-xl font-semibold">
                What do the statuses mean?
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Pending", "Your booking request has been submitted and is awaiting provider response."],
                  ["Accepted", "The transport provider has accepted your request."],
                  ["Completed", "The journey has been marked as completed."],
                  ["Cancelled", "The booking request has been cancelled."],
                ].map(([title, description]) => (
                  <div key={title}>
                    <p className="text-xs font-medium">{title}</p>
                    <p className="mt-2 text-[10px] leading-5 text-white/40">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t border-white/[0.08] pt-4 text-[9px] leading-5 text-white/30">
                Prototype note: booking data is stored in your browser.
                Provider approval and live status updates are not connected yet.
              </p>
            </section>

            <footer className="mt-12 flex flex-col justify-between gap-4 border-t border-white/[0.08] py-7 text-[9px] tracking-[0.2em] text-white/25 sm:flex-row">
              <span>DROPNEST · MY BOOKINGS</span>
              <Link href="/dashboard">Back to dashboard ↗</Link>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

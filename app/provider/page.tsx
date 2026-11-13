
"use client";

/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BookingStatus = "Pending" | "Accepted" | "Rejected" | "Completed";

type ProviderBooking = {
  id: string;
  from: string;
  to: string;
  customer: string;
  vehicle: string;
  date: string;
  time: string;
  weight: number;
  price: number;
  status: BookingStatus;
};

const STORAGE_KEY = "dropnest_provider_bookings";
const CUSTOMER_BOOKING_KEY = "dropnest_bookings";

const demoBookings: ProviderBooking[] = [
  {
    id: "DP-2041",
    from: "Bengaluru",
    to: "Chennai",
    customer: "Aarav Sharma",
    vehicle: "Mini Truck",
    date: "18 Nov 2026",
    time: "09:30 AM",
    weight: 320,
    price: 4200,
    status: "Pending",
  },
  {
    id: "DP-2042",
    from: "Mysuru",
    to: "Bengaluru",
    customer: "Priya Nair",
    vehicle: "Cargo Van",
    date: "19 Nov 2026",
    time: "11:00 AM",
    weight: 180,
    price: 2100,
    status: "Pending",
  },
  {
    id: "DP-2043",
    from: "Chennai",
    to: "Hyderabad",
    customer: "Rohan Mehta",
    vehicle: "Heavy Truck",
    date: "20 Nov 2026",
    time: "06:00 AM",
    weight: 850,
    price: 7800,
    status: "Accepted",
  },
];

const navigation = [
  ["Overview", "/dashboard", "▦"],
  ["DropPool", "/pools", "↗"],
  ["Verified Nests", "/nests", "⌂"],
  ["NestLock", "/escrow", "◇"],
  ["My Bookings", "/bookings", "▤"],
  ["My Profile", "/profile", "◉"],
  ["Provider Hub", "/provider", "◈"],
];

export default function ProviderPage() {
  const [bookings, setBookings] =
    useState<ProviderBooking[]>(demoBookings);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [available, setAvailable] = useState(true);

  // Load provider requests and customer bookings.
  useEffect(() => {
    try {
      const savedProvider = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      const savedCustomerBookings = JSON.parse(
        localStorage.getItem(CUSTOMER_BOOKING_KEY) || "[]"
      );

      const providerBookings: ProviderBooking[] = [
        ...demoBookings,
        ...(Array.isArray(savedProvider) ? savedProvider : []),
      ];

      const existingIds = new Set(
        providerBookings.map((booking) => booking.id)
      );

      const customerRequests: ProviderBooking[] =
        Array.isArray(savedCustomerBookings)
          ? savedCustomerBookings
              .filter(
                (booking: Record<string, unknown>) =>
                  booking.id &&
                  !existingIds.has(String(booking.id))
              )
              .map((booking: Record<string, unknown>) => ({
                id: String(booking.id),
                from: String(booking.from || "Unknown"),
                to: String(booking.to || "Unknown"),
                customer: String(
                  booking.customer ||
                    booking.customerName ||
                    "DropNest Customer"
                ),
                vehicle: String(
                  booking.vehicle ||
                    booking.vehicleType ||
                    "Transport Vehicle"
                ),
                date: String(
                  booking.date || "Date not specified"
                ),
                time: String(
                  booking.time || "Time not specified"
                ),
                weight: Number(
                  booking.weight ||
                    booking.requestedWeight ||
                    0
                ),
                price: Number(booking.price || 0),
                status: "Pending" as const,
              }))
          : [];

      const mergedBookings = [
        ...providerBookings,
        ...customerRequests,
      ];

      setBookings(mergedBookings);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(mergedBookings)
      );
    } catch (error) {
      console.error("Could not load provider bookings:", error);
      setNotice("Could not load saved provider activity.");
    }

    setReady(true);
  }, []);

  function saveBookings(updated: ProviderBooking[]) {
    setBookings(updated);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  }

  function updateStatus(
    id: string,
    status: BookingStatus
  ) {
    const updated = bookings.map((booking) =>
      booking.id === id
        ? { ...booking, status }
        : booking
    );

    saveBookings(updated);
    setNotice(`${id} marked as ${status.toLowerCase()}.`);
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesFilter =
        filter === "All" || booking.status === filter;

      const query = search.toLowerCase();

      const matchesSearch =
        booking.id.toLowerCase().includes(query) ||
        booking.from.toLowerCase().includes(query) ||
        booking.to.toLowerCase().includes(query) ||
        booking.customer.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, search]);

  const pending = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const accepted = bookings.filter(
    (booking) => booking.status === "Accepted"
  ).length;

  const completed = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const earnings = bookings
    .filter((booking) => booking.status === "Completed")
    .reduce((sum, booking) => sum + booking.price, 0);

  function statusStyle(status: BookingStatus) {
    switch (status) {
      case "Pending":
        return "border-yellow-400/30 text-yellow-200";
      case "Accepted":
        return "border-blue-400/30 text-blue-200";
      case "Completed":
        return "border-green-400/30 text-green-200";
      case "Rejected":
        return "border-red-400/30 text-red-200";
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-white/10 bg-[#080808] px-5 py-7 lg:flex">
          <Link
            href="/"
            className="mb-12 flex items-center gap-3 px-2 text-2xl font-semibold"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/20">
              D
            </span>
            DropNest.
          </Link>

          <p className="mb-4 px-3 text-[9px] uppercase tracking-[.3em] text-white/30">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map(([name, href, icon]) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs transition ${
                  name === "Provider Hub"
                    ? "border border-white/10 bg-white/10 text-white"
                    : "text-white/45 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">{icon}</span>
                {name}
                {name === "Provider Hub" && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[9px] tracking-[.2em] text-white/35">
              PROVIDER MODE
            </p>
            <p className="mt-3 text-sm font-medium">
              Your fleet. Your terms.
            </p>
            <p className="mt-2 text-[10px] leading-5 text-white/40">
              Manage requests and keep your logistics moving.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050505]/90 px-5 py-4 backdrop-blur-xl md:px-8">
            <div>
              <p className="text-[9px] uppercase tracking-[.25em] text-white/35">
                Provider workspace
              </p>
              <p className="mt-1 text-sm font-medium">
                Operations centre
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`h-2 w-2 rounded-full ${
                  available ? "bg-green-400" : "bg-white/30"
                }`}
              />
              <span className="hidden text-[10px] text-white/55 sm:block">
                {available
                  ? "Available for requests"
                  : "Currently unavailable"}
              </span>
              <button
                onClick={() => setAvailable(!available)}
                className="rounded-full border border-white/15 px-3 py-2 text-[10px] hover:bg-white/10"
              >
                {available ? "Go offline" : "Go online"}
              </button>
            </div>
          </header>

          {/* MOBILE NAV */}
          <div className="border-b border-white/10 px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {navigation.map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  className={`shrink-0 rounded-full border px-3 py-2 text-[10px] ${
                    name === "Provider Hub"
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-white/55"
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[1450px] px-5 py-8 md:px-8 md:py-10">

            {/* HERO */}
            <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] p-7 md:p-11">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,.13),transparent_48%)]" />
              <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border border-white/[0.05]" />
              <div className="absolute -right-2 -top-12 h-56 w-56 rounded-full border border-white/[0.05]" />

              <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[.3em] text-white/40">
                    The DropNest provider network
                  </p>

                  <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                    Make every
                    <br />
                    <span className="text-white/35">
                      journey count.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
                    Turn available vehicle capacity into opportunity.
                    Manage transport requests, accept routes and track
                    your provider activity from one workspace.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href="#requests"
                      className="rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black hover:bg-white/80"
                    >
                      Manage requests ↗
                    </a>
                    <Link
                      href="/pools"
                      className="rounded-full border border-white/20 px-6 py-3.5 text-xs text-white/75 hover:bg-white/10"
                    >
                      Explore DropPool
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:min-w-[220px]">
                  <p className="text-[9px] tracking-[.2em] text-white/40">
                    PROVIDER STATUS
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        available
                          ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,.7)]"
                          : "bg-white/30"
                      }`}
                    />
                    <span className="text-lg font-semibold">
                      {available ? "Online" : "Offline"}
                    </span>
                  </div>
                  <p className="mt-3 text-[10px] leading-5 text-white/40">
                    {available
                      ? "Your provider profile is available for demo requests."
                      : "You are not accepting new requests."}
                  </p>
                </div>
              </div>
            </section>

            {/* METRICS */}
            <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[
                ["Incoming requests", pending, "Awaiting your response"],
                ["Accepted routes", accepted, "Ready for fulfilment"],
                ["Completed deliveries", completed, "Successfully completed"],
                [
                  "Demo earnings",
                  `₹${earnings.toLocaleString("en-IN")}`,
                  "From completed demo routes",
                ],
              ].map(([label, value, description]) => (
                <div
                  key={String(label)}
                  className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 md:p-6"
                >
                  <p className="text-[10px] text-white/40">{label}</p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    {value}
                  </p>
                  <p className="mt-2 text-[9px] text-white/30">
                    {description}
                  </p>
                </div>
              ))}
            </section>

            {/* WORKFLOW */}
            <section className="mt-12 grid gap-5 lg:grid-cols-[1.5fr_.8fr]">
              <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
                <p className="text-[9px] uppercase tracking-[.25em] text-white/35">
                  Provider workflow
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  From request to delivery.
                </h2>
                <p className="mt-2 text-xs leading-6 text-white/45">
                  A simple workflow for managing your available capacity.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {[
                    ["01", "Receive", "View incoming customer requests."],
                    ["02", "Accept", "Choose the routes you want to fulfil."],
                    ["03", "Complete", "Update delivery status after fulfilment."],
                  ].map(([number, title, description]) => (
                    <div
                      key={number}
                      className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <p className="text-[10px] text-white/35">{number}</p>
                      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                      <p className="mt-2 text-[10px] leading-5 text-white/40">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#202020] to-[#090909] p-6 md:p-8">
                <p className="text-[9px] uppercase tracking-[.25em] text-white/40">
                  Capacity opportunity
                </p>
                <div className="mt-8 text-6xl text-white/70">↗</div>
                <h2 className="mt-5 text-2xl font-semibold">
                  Don't leave space unused.
                </h2>
                <p className="mt-3 text-xs leading-6 text-white/45">
                  List an available route on DropPool and explore opportunities
                  to use spare vehicle capacity.
                </p>
                <Link
                  href="/pools"
                  className="mt-7 inline-block rounded-full border border-white/30 px-5 py-3 text-[10px] hover:bg-white hover:text-black"
                >
                  Visit DropPool ↗
                </Link>
              </div>
            </section>

            {/* REQUESTS */}
            <section id="requests" className="mt-14 scroll-mt-24">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[.25em] text-white/35">
                    Operations / Requests
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">
                    Route requests.
                  </h2>
                  <p className="mt-2 text-xs text-white/45">
                    Review customer requests and manage their status.
                  </p>
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search route, customer or ID..."
                  className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-xs outline-none placeholder:text-white/30 focus:border-white/40 md:max-w-sm"
                />
              </div>

              <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
                {["All", "Pending", "Accepted", "Completed", "Rejected"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`shrink-0 rounded-full border px-4 py-2.5 text-[10px] ${
                        filter === item
                          ? "border-white bg-white text-black"
                          : "border-white/15 text-white/55 hover:border-white/40"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              {!ready ? (
                <p className="mt-6 rounded-2xl border border-white/10 p-10 text-center text-xs text-white/40">
                  Loading provider requests...
                </p>
              ) : filteredBookings.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b0b0b] p-12 text-center">
                  <p className="text-3xl text-white/30">◇</p>
                  <h3 className="mt-4 text-lg font-semibold">
                    No matching requests.
                  </h3>
                  <p className="mt-2 text-xs text-white/40">
                    Try another filter or search term.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {filteredBookings.map((booking) => (
                    <article
                      key={booking.id}
                      className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 md:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[9px] tracking-[.15em] text-white/35">
                          {booking.id}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1.5 text-[9px] ${statusStyle(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div>
                              <p className="text-xl font-semibold">
                                {booking.from}
                              </p>
                              <p className="mt-1 text-[8px] text-white/35">
                                ORIGIN
                              </p>
                            </div>
                            <span className="text-white/40">⟶</span>
                            <div>
                              <p className="text-xl font-semibold">
                                {booking.to}
                              </p>
                              <p className="mt-1 text-[8px] text-white/35">
                                DESTINATION
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                              <p className="text-[8px] text-white/35">CUSTOMER</p>
                              <p className="mt-2 text-[10px]">
                                {booking.customer}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] text-white/35">VEHICLE</p>
                              <p className="mt-2 text-[10px]">
                                {booking.vehicle}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] text-white/35">
                                DATE & TIME
                              </p>
                              <p className="mt-2 text-[10px]">
                                {booking.date}
                              </p>
                              <p className="mt-1 text-[9px] text-white/40">
                                {booking.time}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] text-white/35">LOAD</p>
                              <p className="mt-2 text-[10px]">
                                {booking.weight} kg
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                          <p className="text-[8px] text-white/35">
                            ROUTE VALUE
                          </p>
                          <p className="mt-2 text-2xl font-semibold">
                            ₹{booking.price.toLocaleString("en-IN")}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {booking.status === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateStatus(booking.id, "Accepted")
                                  }
                                  disabled={!available}
                                  className="rounded-full bg-white px-4 py-2.5 text-[9px] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  Accept request
                                </button>
                                <button
                                  onClick={() =>
                                    updateStatus(booking.id, "Rejected")
                                  }
                                  className="rounded-full border border-red-400/30 px-4 py-2.5 text-[9px] text-red-200"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {booking.status === "Accepted" && (
                              <button
                                onClick={() =>
                                  updateStatus(booking.id, "Completed")
                                }
                                className="rounded-full bg-white px-4 py-2.5 text-[9px] font-semibold text-black"
                              >
                                Mark completed ✓
                              </button>
                            )}

                            {booking.status === "Completed" && (
                              <span className="text-[9px] text-green-300">
                                ✓ Delivery completed
                              </span>
                            )}

                            {booking.status === "Rejected" && (
                              <span className="text-[9px] text-red-300">
                                Request declined
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {notice && (
              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/[0.05] p-4 text-xs text-white/75">
                {notice}
                <button
                  onClick={() => setNotice("")}
                  className="text-white/40"
                >
                  ✕
                </button>
              </div>
            )}

            <footer className="mt-14 flex flex-wrap justify-between gap-3 border-t border-white/10 py-7 text-[9px] tracking-[.2em] text-white/30">
              <span>DROPNEST · PROVIDER HUB</span>
              <Link href="/dashboard" className="hover:text-white">
                Back to overview ↗
              </Link>
            </footer>

            <p className="mt-2 text-[9px] leading-5 text-white/25">
              Prototype note: provider requests and status changes are stored
              in this browser only. Sample requests are illustrative and are
              not connected to real customer bookings or payments.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

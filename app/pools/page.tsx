
"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Transport = {
  id: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  distance: string;
  date: string;
  time: string;
  vehicle: string;
  vehicleType: string;
  capacity: number;
  available: string;
  price: number;
  driver: string;
  rating: string;
  verified: boolean;
  tag: string;
};

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

const BOOKING_KEY = "dropnest_bookings";
const LISTING_KEY = "dropnest_vehicle_listings";

const initialTransports: Transport[] = [
  {
    id: "DP-1001",
    from: "Bengaluru",
    to: "Chennai",
    fromCode: "BLR",
    toCode: "MAA",
    distance: "346 km",
    date: "18 Nov 2026",
    time: "08:30 AM",
    vehicle: "Ashok Leyland",
    vehicleType: "20 ft Container",
    capacity: 68,
    available: "680 kg available",
    price: 2400,
    driver: "Arjun Kumar",
    rating: "4.9",
    verified: true,
    tag: "POPULAR ROUTE",
  },
  {
    id: "DP-1002",
    from: "Bengaluru",
    to: "Hyderabad",
    fromCode: "BLR",
    toCode: "HYD",
    distance: "570 km",
    date: "19 Nov 2026",
    time: "06:00 AM",
    vehicle: "Tata Motors",
    vehicleType: "14 ft Truck",
    capacity: 42,
    available: "420 kg available",
    price: 1850,
    driver: "Rahul Sharma",
    rating: "4.8",
    verified: true,
    tag: "BEST VALUE",
  },
  {
    id: "DP-1003",
    from: "Mysuru",
    to: "Bengaluru",
    fromCode: "MYS",
    toCode: "BLR",
    distance: "145 km",
    date: "20 Nov 2026",
    time: "10:00 AM",
    vehicle: "Mahindra",
    vehicleType: "Mini Truck",
    capacity: 55,
    available: "250 kg available",
    price: 950,
    driver: "Kiran Rao",
    rating: "4.7",
    verified: true,
    tag: "SHORT DISTANCE",
  },
  {
    id: "DP-1004",
    from: "Chennai",
    to: "Coimbatore",
    fromCode: "MAA",
    toCode: "CJB",
    distance: "505 km",
    date: "21 Nov 2026",
    time: "07:00 AM",
    vehicle: "BharatBenz",
    vehicleType: "17 ft Truck",
    capacity: 35,
    available: "350 kg available",
    price: 2100,
    driver: "Vikram Singh",
    rating: "4.9",
    verified: true,
    tag: "NEW LISTING",
  },
  {
    id: "DP-1005",
    from: "Hyderabad",
    to: "Bengaluru",
    fromCode: "HYD",
    toCode: "BLR",
    distance: "570 km",
    date: "22 Nov 2026",
    time: "09:00 AM",
    vehicle: "Tata Motors",
    vehicleType: "20 ft Container",
    capacity: 75,
    available: "750 kg available",
    price: 2250,
    driver: "Sandeep Reddy",
    rating: "4.8",
    verified: true,
    tag: "HIGH CAPACITY",
  },
  {
    id: "DP-1006",
    from: "Bengaluru",
    to: "Mangaluru",
    fromCode: "BLR",
    toCode: "IXE",
    distance: "350 km",
    date: "23 Nov 2026",
    time: "05:30 AM",
    vehicle: "Eicher",
    vehicleType: "14 ft Truck",
    capacity: 28,
    available: "280 kg available",
    price: 1600,
    driver: "Manoj Kumar",
    rating: "4.6",
    verified: true,
    tag: "LIMITED SPACE",
  },
];

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40";

export default function DropPoolPage() {
  const [listings, setListings] = useState<Transport[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const [filter, setFilter] = useState("All routes");
  const [selected, setSelected] = useState<Transport | null>(null);
  const [weight, setWeight] = useState("100");
  const [showFilters, setShowFilters] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [message, setMessage] = useState("");
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  const [listingForm, setListingForm] = useState({
    from: "",
    to: "",
    vehicle: "",
    vehicleType: "14 ft Truck",
    capacity: "",
    price: "",
    date: "",
    time: "",
    driver: "",
  });

  useEffect(() => {
    try {
      const savedListings = JSON.parse(
        localStorage.getItem(LISTING_KEY) || "[]"
      ) as Transport[];

      const savedBookings = JSON.parse(
        localStorage.getItem(BOOKING_KEY) || "[]"
      ) as Booking[];

      setListings(savedListings);
      setMyBookings(savedBookings);
    } catch {
      setListings([]);
      setMyBookings([]);
    }
  }, []);

  const allTransports = useMemo(
    () => [...listings, ...initialTransports],
    [listings]
  );

  const filteredTransports = useMemo(() => {
    let results = allTransports.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.from.toLowerCase().includes(query) ||
        item.to.toLowerCase().includes(query) ||
        item.vehicleType.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All routes" ||
        (filter === "Under ₹2,000" && item.price < 2000) ||
        (filter === "High capacity" && item.capacity >= 50) ||
        (filter === "Verified drivers" && item.verified);

      return matchesSearch && matchesFilter;
    });

    if (sort === "price-low") {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      results = [...results].sort((a, b) => b.price - a.price);
    } else if (sort === "capacity") {
      results = [...results].sort((a, b) => b.capacity - a.capacity);
    }

    return results;
  }, [allTransports, search, filter, sort]);

  function openBooking(item: Transport) {
    setSelected(item);
    setWeight("100");
    setMessage("");
  }

  function confirmBooking() {
    if (!selected) return;

    const requestedWeight = Number(weight);
    const availableKg = Number.parseInt(selected.available, 10);

    if (
      !Number.isFinite(requestedWeight) ||
      requestedWeight <= 0 ||
      requestedWeight > availableKg
    ) {
      setMessage(`Enter a weight between 1 and ${availableKg} kg.`);
      return;
    }

    const booking: Booking = {
      id: `BK-${Date.now()}`,
      routeId: selected.id,
      from: selected.from,
      to: selected.to,
      date: selected.date,
      time: selected.time,
      vehicle: selected.vehicleType,
      driver: selected.driver,
      weight: requestedWeight,
      price: selected.price,
      status: "Pending",
      createdAt: new Date().toLocaleString(),
    };

    const updated = [booking, ...myBookings];

    localStorage.setItem(BOOKING_KEY, JSON.stringify(updated));
    setMyBookings(updated);
    setMessage("Booking request saved successfully!");
  }

  function submitVehicleListing(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const capacity = Number(listingForm.capacity);
    const price = Number(listingForm.price);

    if (capacity <= 0 || price <= 0) {
      setMessage("Capacity and price must be greater than zero.");
      return;
    }

    const newListing: Transport = {
      id: `DP-${Date.now()}`,
      from: listingForm.from.trim(),
      to: listingForm.to.trim(),
      fromCode: listingForm.from.trim().slice(0, 3).toUpperCase(),
      toCode: listingForm.to.trim().slice(0, 3).toUpperCase(),
      distance: "Distance not specified",
      date: new Date(listingForm.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: listingForm.time,
      vehicle: listingForm.vehicle.trim(),
      vehicleType: listingForm.vehicleType,
      capacity,
      available: `${capacity} kg available`,
      price,
      driver: listingForm.driver.trim(),
      rating: "New",
      verified: false,
      tag: "COMMUNITY LISTING",
    };

    const updated = [newListing, ...listings];

    localStorage.setItem(LISTING_KEY, JSON.stringify(updated));
    setListings(updated);
    setShowListingForm(false);

    setListingForm({
      from: "",
      to: "",
      vehicle: "",
      vehicleType: "14 ft Truck",
      capacity: "",
      price: "",
      date: "",
      time: "",
      driver: "",
    });

    setSearch("");
    setFilter("All routes");
    setMessage("Your vehicle listing has been published!");

    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  name === "DropPool"
                    ? "border border-white/10 bg-white/[0.09] text-white"
                    : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg">{icon}</span>
                {name}
                {name === "DropPool" && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
              DROPPOOL
            </p>
            <p className="mt-3 text-sm font-medium">Don&apos;t move empty.</p>
            <p className="mt-2 text-[10px] leading-5 text-white/40">
              Share unused vehicle capacity. Make every journey count.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.08] bg-[#050505]/90 px-5 py-4 backdrop-blur-xl md:px-8">
            <span className="text-lg font-semibold lg:hidden">DropNest.</span>
            <span className="hidden text-[9px] uppercase tracking-[0.25em] text-white/35 lg:block">
              Marketplace / DropPool
            </span>

            <div className="flex items-center gap-4">
              <Link href="/bookings" className="text-[10px] text-white/50 hover:text-white">
                My bookings ↗
              </Link>
              <Link href="/profile" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/[0.08] text-xs">
                D
              </Link>
            </div>
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
                    name === "DropPool"
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-white/55"
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-[26px] border border-white/[0.11] bg-[#0b0b0b]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(255,255,255,.12),transparent_45%)]" />

              <div className="relative grid min-h-[340px] items-center gap-8 p-7 md:p-11 lg:grid-cols-[1.2fr_.8fr] xl:p-14">
                <div>
                  <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="text-[9px] uppercase tracking-[0.25em] text-white/55">
                      Shared transport network
                    </span>
                  </div>

                  <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.045em] md:text-6xl xl:text-7xl">
                    Don&apos;t move
                    <br />
                    <span className="text-white/35">empty.</span>
                  </h1>

                  <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
                    Every day, vehicles travel between cities with unused
                    capacity. DropPool connects those available spaces
                    with people who need to move goods — helping make
                    transportation smarter and more efficient.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#discover" className="rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black hover:bg-white/80">
                      Discover available routes ↗
                    </a>
                    <a href="#how-it-works" className="rounded-full border border-white/20 px-6 py-3.5 text-xs text-white/75 hover:bg-white/10">
                      How it works
                    </a>
                  </div>
                </div>

                <div className="relative flex min-h-[230px] items-center justify-center">
                  <div className="absolute h-64 w-64 rounded-full border border-white/[0.06]" />
                  <div className="absolute h-48 w-48 rounded-full border border-white/[0.09]" />
                  <div className="absolute h-32 w-32 rounded-full border border-white/[0.12]" />
                  <div className="relative z-10 grid h-24 w-24 place-items-center rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 to-white/[0.02] text-5xl shadow-[0_0_80px_rgba(255,255,255,0.08)]">
                    🚚
                  </div>
                  <div className="absolute right-0 top-4 rounded-xl border border-white/10 bg-[#151515]/90 px-4 py-3">
                    <p className="text-[8px] tracking-[0.18em] text-white/40">AVAILABLE SPACE</p>
                    <p className="mt-1 text-lg font-semibold">680 kg</p>
                  </div>
                  <div className="absolute bottom-3 left-0 rounded-xl border border-white/10 bg-[#151515]/90 px-4 py-3">
                    <p className="text-[8px] tracking-[0.18em] text-white/40">NETWORK</p>
                    <p className="mt-1 text-lg font-semibold">Shared journeys</p>
                  </div>
                </div>
              </div>
            </section>

            {/* MESSAGE */}
            {message && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-xs text-white/80">
                <span>{message}</span>
                <button onClick={() => setMessage("")} className="text-white/50">
                  ✕
                </button>
              </div>
            )}

            {/* BENEFITS */}
            <section className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["↗", "Share capacity", "Use available space in vehicles already travelling."],
                ["₹", "Split transport costs", "Share transportation expenses with other users."],
                ["◇", "Discover drivers", "Review driver and vehicle details before booking."],
              ].map(([icon, title, text]) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-lg">
                    {icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-medium">{title}</h3>
                    <p className="mt-2 text-[10px] leading-5 text-white/40">{text}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* DISCOVER */}
            <section id="discover" className="mt-16 scroll-mt-24">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-white/35">Explore the network</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">Find your next route.</h2>
                  <p className="mt-3 max-w-xl text-xs leading-6 text-white/45">
                    Discover vehicle capacity, compare prices and choose a transport option that fits your journey.
                  </p>
                </div>
                <span className="text-[10px] text-white/35">{filteredTransports.length} listings available</span>
              </div>

              {/* SEARCH AND FILTERS */}
              <div className="mt-7 rounded-2xl border border-white/10 bg-[#0b0b0b] p-4 md:p-5">
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search origin, destination or vehicle..."
                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-4 text-xs outline-none placeholder:text-white/30 focus:border-white/40"
                  />
                  <button onClick={() => setShowFilters(!showFilters)} className="rounded-xl border border-white/15 px-5 py-3 text-xs text-white/70 hover:bg-white/10">
                    {showFilters ? "Hide filters ↑" : "Filters +"}
                  </button>
                </div>

                {showFilters && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
                    {["All routes", "Under ₹2,000", "High capacity", "Verified drivers"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`rounded-full border px-4 py-2.5 text-[10px] ${
                          filter === item
                            ? "border-white bg-white text-black"
                            : "border-white/15 text-white/55"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[9px] text-white/35">Filter by route, price, capacity or driver verification.</p>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-[10px] text-white/70 outline-none">
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to high</option>
                    <option value="price-high">Price: High to low</option>
                    <option value="capacity">Most available capacity</option>
                  </select>
                </div>
              </div>

              {/* TRANSPORT CARDS */}
              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {filteredTransports.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#131313] to-[#090909] p-5 transition hover:border-white/30 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[8px] tracking-[0.15em] text-white/65">{item.tag}</span>
                      <span className="text-[9px] text-white/35">{item.id}</span>
                    </div>

                    <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div>
                        <p className="text-3xl font-semibold">{item.fromCode}</p>
                        <p className="mt-2 text-xs text-white/65">{item.from}</p>
                        <p className="mt-1 text-[9px] text-white/35">Origin</p>
                      </div>
                      <div className="min-w-[75px] text-center">
                        <p className="text-[9px] text-white/40">{item.distance}</p>
                        <div className="relative mt-3 flex items-center">
                          <div className="h-px w-full bg-white/20" />
                          <span className="absolute left-1/2 -translate-x-1/2 bg-[#111] px-2 text-white/70">→</span>
                        </div>
                        <p className="mt-3 text-[8px] tracking-[0.12em] text-white/35">ROUTE</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-semibold">{item.toCode}</p>
                        <p className="mt-2 text-xs text-white/65">{item.to}</p>
                        <p className="mt-1 text-[9px] text-white/35">Destination</p>
                      </div>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:grid-cols-4">
                      <div><p className="text-[8px] text-white/35">VEHICLE</p><p className="mt-2 text-[10px]">{item.vehicle}</p></div>
                      <div><p className="text-[8px] text-white/35">TYPE</p><p className="mt-2 text-[10px]">{item.vehicleType}</p></div>
                      <div><p className="text-[8px] text-white/35">DEPARTURE</p><p className="mt-2 text-[10px]">{item.time}</p></div>
                      <div><p className="text-[8px] text-white/35">DATE</p><p className="mt-2 text-[10px]">{item.date}</p></div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-white/45">Available vehicle capacity</span>
                        <span className="text-white/75">{item.available}</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-white/80" style={{ width: `${item.capacity}%` }} />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-sm">{item.driver.charAt(0)}</div>
                        <div>
                          <p className="text-xs font-medium">{item.driver}</p>
                          <p className="mt-1 text-[9px] text-white/45">
                            {item.verified ? `★ ${item.rating} · Verified` : "Community listing · Not verified"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-white/35">ESTIMATED PRICE</p>
                        <p className="mt-1 text-xl font-semibold">{formatPrice(item.price)}</p>
                      </div>
                    </div>

                    <button onClick={() => openBooking(item)} className="mt-6 w-full rounded-xl bg-white py-3.5 text-xs font-semibold text-black hover:bg-white/80">
                      View details & book ↗
                    </button>
                  </article>
                ))}
              </div>

              {filteredTransports.length === 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b0b0b] p-12 text-center">
                  <p className="text-2xl">⌕</p>
                  <h3 className="mt-4 text-lg font-medium">No routes found.</h3>
                  <p className="mt-2 text-xs text-white/40">Try another city or change your filters.</p>
                  <button onClick={() => { setSearch(""); setFilter("All routes"); }} className="mt-5 rounded-full border border-white/20 px-5 py-2.5 text-xs">
                    Clear filters
                  </button>
                </div>
              )}
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="mt-16 scroll-mt-24 rounded-2xl border border-white/[0.09] bg-[#0a0a0a] p-6 md:p-9">
              <p className="text-[9px] uppercase tracking-[0.28em] text-white/35">The process</p>
              <h2 className="mt-3 text-2xl font-semibold">From available space to shared journey.</h2>
              <div className="mt-9 grid gap-8 md:grid-cols-3">
                {[
                  ["01", "Find a route", "Discover vehicles with available space travelling in your direction."],
                  ["02", "Choose capacity", "Compare vehicle details, driver information and estimated price."],
                  ["03", "Book your space", "Submit a booking request and track it through My Bookings."],
                ].map(([number, title, description]) => (
                  <div key={number}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-xs">{number}</div>
                    <h3 className="mt-5 text-base font-semibold">{title}</h3>
                    <p className="mt-3 text-xs leading-6 text-white/45">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PROVIDER CTA */}
            <section className="mt-8 flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-r from-[#171717] to-[#080808] p-7 md:flex-row md:items-center md:p-9">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">For transport providers</p>
                <h2 className="mt-3 text-2xl font-semibold">Have unused vehicle space?</h2>
                <p className="mt-2 max-w-xl text-xs leading-6 text-white/45">
                  List your route and let other users discover your available capacity.
                </p>
              </div>
              <button
                onClick={() => { setMessage(""); setShowListingForm(true); }}
                className="w-fit shrink-0 rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black hover:bg-white/80"
              >
                List your vehicle ↗
              </button>
            </section>

            <footer className="mt-12 flex flex-col justify-between gap-4 border-t border-white/[0.08] py-7 text-[9px] tracking-[0.2em] text-white/25 sm:flex-row">
              <span>DROPNEST · DROPPOOL</span>
              <div className="flex gap-5">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/nests">Verified Nests</Link>
                <Link href="/escrow">NestLock</Link>
              </div>
            </footer>
          </div>
        </section>
      </div>

      {/* BOOKING MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-[#101010] p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">DropPool booking</p>
                <h2 className="mt-3 text-2xl font-semibold">Review your journey.</h2>
              </div>
              <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60">×</button>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/40">{selected.id}</span>
                <span className="text-[8px] text-white/60">{selected.tag}</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div><p className="text-2xl font-semibold">{selected.fromCode}</p><p className="mt-1 text-[10px] text-white/45">{selected.from}</p></div>
                <span className="text-white/40">→</span>
                <div className="text-right"><p className="text-2xl font-semibold">{selected.toCode}</p><p className="mt-1 text-[10px] text-white/45">{selected.to}</p></div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div><p className="text-[9px] text-white/35">VEHICLE</p><p className="mt-2 text-xs">{selected.vehicleType}</p></div>
                <div><p className="text-[9px] text-white/35">DEPARTURE</p><p className="mt-2 text-xs">{selected.date} · {selected.time}</p></div>
                <div><p className="text-[9px] text-white/35">DRIVER</p><p className="mt-2 text-xs">{selected.driver}</p></div>
                <div><p className="text-[9px] text-white/35">CAPACITY</p><p className="mt-2 text-xs">{selected.available}</p></div>
              </div>
            </div>

            <label className="mt-6 block text-[10px] text-white/55">Approximate weight of your goods (kg)</label>
            <input type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} />

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
              <div><p className="text-[9px] text-white/35">ESTIMATED PRICE</p><p className="mt-1 text-2xl font-semibold">{formatPrice(selected.price)}</p></div>
              <span className="text-[9px] text-white/35">Sample listing price</span>
            </div>

            {message && <p className="mt-4 text-xs text-white/75">{message}</p>}

            <button onClick={confirmBooking} className="mt-6 w-full rounded-xl bg-white py-4 text-xs font-semibold text-black hover:bg-white/80">
              Save booking request ↗
            </button>
            <p className="mt-3 text-center text-[9px] leading-5 text-white/30">
              Demo booking only. No payment or real transport reservation is created.
            </p>
          </div>
        </div>
      )}

      {/* VEHICLE LISTING MODAL */}
      {showListingForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowListingForm(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#101010] p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">Transport provider</p>
                <h2 className="mt-3 text-2xl font-semibold">List your vehicle.</h2>
                <p className="mt-2 text-xs text-white/40">
                  Share your available vehicle capacity with the DropNest network.
                </p>
              </div>
              <button type="button" onClick={() => setShowListingForm(false)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60">×</button>
            </div>

            <form onSubmit={submitVehicleListing} className="mt-7 grid gap-4 sm:grid-cols-2">
              <label className="text-[10px] text-white/55">
                Origin city
                <input required value={listingForm.from} onChange={(e) => setListingForm({ ...listingForm, from: e.target.value })} placeholder="e.g. Bengaluru" className={inputClass} />
              </label>

              <label className="text-[10px] text-white/55">
                Destination city
                <input required value={listingForm.to} onChange={(e) => setListingForm({ ...listingForm, to: e.target.value })} placeholder="e.g. Chennai" className={inputClass} />
              </label>

              <label className="text-[10px] text-white/55">
                Vehicle make / name
                <input required value={listingForm.vehicle} onChange={(e) => setListingForm({ ...listingForm, vehicle: e.target.value })} placeholder="e.g. Tata Motors" className={inputClass} />
              </label>

              <label className="text-[10px] text-white/55">
                Vehicle type
                <select value={listingForm.vehicleType} onChange={(e) => setListingForm({ ...listingForm, vehicleType: e.target.value })} className={inputClass}>
                  <option>Mini Truck</option>
                  <option>14 ft Truck</option>
                  <option>17 ft Truck</option>
                  <option>20 ft Container</option>
                  <option>Tempo</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="text-[10px] text-white/55">
                Available capacity (kg)
                <input required type="number" min="1" value={listingForm.capacity} onChange={(e) => setListingForm({ ...listingForm, capacity: e.target.value })} placeholder="e.g. 500" className={inputClass} />
              </label>

              <label className="text-[10px] text-white/55">
                Expected price (₹)
                <input required type="number" min="1" value={listingForm.price} onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })} placeholder="e.g. 2000" className={inputClass} />
              </label>

              <label className="text-[10px] text-white/55">
                Departure date
                <input required type="date" min={new Date().toISOString().split("T")[0]} value={listingForm.date} onChange={(e) => setListingForm({ ...listingForm, date: e.target.value })} className={inputClass} />
              </label>

              <label className="text-[10px] text-white/55">
                Departure time
                <input required type="time" value={listingForm.time} onChange={(e) => setListingForm({ ...listingForm, time: e.target.value })} className={inputClass} />
              </label>

              <label className="text-[10px] text-white/55 sm:col-span-2">
                Driver / provider name
                <input required value={listingForm.driver} onChange={(e) => setListingForm({ ...listingForm, driver: e.target.value })} placeholder="Enter provider name" className={inputClass} />
              </label>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[10px] leading-5 text-white/40 sm:col-span-2">
                Your listing will be stored in this browser for this prototype. It will be marked as a community listing, not a verified vehicle.
              </div>

              <button type="submit" className="rounded-xl bg-white py-4 text-xs font-semibold text-black hover:bg-white/80 sm:col-span-2">
                Publish vehicle listing ↗
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

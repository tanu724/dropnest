
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import RealRouteMap from "@/components/RealRouteMap";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: "▦" },
  { name: "DropPool", href: "/pools", icon: "↗" },
  { name: "Verified Nests", href: "/nests", icon: "⌂" },
  { name: "NestLock", href: "/escrow", icon: "◇" },
  { name: "My Bookings", href: "/bookings", icon: "▤" },
{ name: "Payments", href: "/payments", icon: "₹" },
{ name: "My Profile", href: "/profile", icon: "◎" },
];

const stats = [
  { label: "Active shipments", value: "08", note: "Demo activity", bars: [30, 45, 35, 60, 48, 75, 65, 90] },
  { label: "Transport capacity", value: "64%", note: "Sample availability", bars: [50, 40, 70, 55, 80, 60, 75, 64] },
  { label: "Storage spaces", value: "12", note: "Demo listings", bars: [35, 50, 45, 65, 55, 75, 70, 88] },
  { label: "Completed moves", value: "24", note: "Illustrative total", bars: [20, 35, 45, 40, 65, 58, 80, 95] },
];

const services = [
  {
    number: "01",
    name: "DropPool",
    tagline: "Make every journey count.",
    category: "SHARED TRANSPORT",
    description:
      "What if trucks travelling to the same destination could carry more than one customer's goods? DropPool connects people who need transportation with available vehicle capacity.",
    features: [
      "Discover available transport routes",
      "Share unused truck capacity",
      "Compare prices and vehicle details",
      "Book suitable transport",
    ],
    href: "/pools",
    icon: "↗",
  },
  {
    number: "02",
    name: "Verified Nests",
    tagline: "Space you can trust.",
    category: "SMART STORAGE",
    description:
      "Finding suitable storage shouldn't be difficult. Verified Nests helps users discover storage spaces, compare availability and find a place for their goods.",
    features: [
      "Explore storage listings",
      "View provider verification details",
      "Compare storage availability",
      "Reserve a suitable space",
    ],
    href: "/nests",
    icon: "⌂",
  },
  {
    number: "03",
    name: "NestLock",
    tagline: "Every handover, accounted for.",
    category: "SECURE HANDOVER",
    description:
      "A delivery is not complete until the handover is confirmed. NestLock demonstrates a verification workflow using OTP and QR confirmation.",
    features: [
      "Initiate a goods handover",
      "Demonstrate OTP verification",
      "Demonstrate QR confirmation",
      "View handover confirmation",
    ],
    href: "/escrow",
    icon: "◇",
  },
];

const activities = [
  {
    id: "DN-2048",
    name: "Bengaluru → Chennai",
    type: "Transport",
    date: "18 Nov 2026",
    amount: "₹2,400",
    status: "Confirmed",
  },
  {
    id: "DN-2049",
    name: "UrbanVault Storage",
    type: "Storage",
    date: "19 Nov 2026",
    amount: "₹1,200",
    status: "Pending",
  },
  {
    id: "DN-2047",
    name: "NestLock handover",
    type: "Verification",
    date: "10 Nov 2026",
    amount: "—",
    status: "Verified",
  },
];

const routes = [
  { from: "Bengaluru", to: "Chennai", distance: "346 km", vehicle: "20 ft Container", price: "₹2,400", capacity: 68 },
  { from: "Bengaluru", to: "Hyderabad", distance: "570 km", vehicle: "14 ft Truck", price: "₹1,850", capacity: 42 },
  { from: "Mysuru", to: "Bengaluru", distance: "145 km", vehicle: "Mini Truck", price: "₹950", capacity: 55 },
];

function MiniChart({ bars }: { bars: number[] }) {
  return (
    <div className="flex h-10 items-end gap-1">
      {bars.map((height, index) => (
        <div
          key={index}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-white/10 to-white/70"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.28em] text-white/35">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
          {description}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const matchesSearch =
        `${item.name} ${item.id} ${item.type}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesTab = tab === "All" || item.status === tab;

      return matchesSearch && matchesTab;
    });
  }, [search, tab]);

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
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] transition ${
                  item.name === "Overview"
                    ? "border border-white/10 bg-white/[0.09] text-white"
                    : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.name}
                {item.name === "Overview" && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-12 border-t border-white/[0.08] pt-6">
            <p className="mb-4 px-3 text-[9px] uppercase tracking-[0.3em] text-white/30">
              Your account
            </p>
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/[0.05]"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-xs">
                D
              </div>
              <div>
                <p className="text-xs font-medium">Demo User</p>
                <p className="mt-1 text-[10px] text-white/35">
                  DropNest member
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
              DROPNEST NETWORK
            </p>
            <p className="mt-3 text-sm font-medium">
              Move. Store. Secure.
            </p>
            <p className="mt-2 text-[10px] leading-5 text-white/40">
              Three connected services. One smarter logistics experience.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-[10px] text-white/70 underline underline-offset-4"
            >
              Visit homepage ↗
            </Link>
          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 flex-1">

          {/* TOP BAR */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.08] bg-[#050505]/90 px-5 py-4 backdrop-blur-xl md:px-8">
            <Link href="/" className="text-lg font-semibold lg:hidden">
              DropNest.
            </Link>
            <span className="hidden text-[9px] uppercase tracking-[0.25em] text-white/35 lg:block">
              Workspace / Overview
            </span>
            <div className="flex items-center gap-4">
              <span className="hidden text-[9px] tracking-[0.15em] text-white/35 sm:block">
                PROTOTYPE ENVIRONMENT
              </span>
              <Link
                href="/profile"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/[0.08] text-xs"
              >
                D
              </Link>
            </div>
          </header>

          {/* MOBILE NAV */}
          <div className="border-b border-white/[0.07] px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`shrink-0 rounded-full border px-3 py-2 text-[10px] ${
                    item.name === "Overview"
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-white/55"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[1600px] px-5 py-7 md:px-8 md:py-9">

            {/* HERO */}
            <section className="relative overflow-hidden rounded-[26px] border border-white/[0.11] bg-[#0a0a0a]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(255,255,255,.10),transparent_42%)]" />

              <div className="relative grid min-h-[490px] lg:grid-cols-[1fr_1.05fr]">
                <div className="relative z-10 flex flex-col justify-center p-7 md:p-11 xl:p-14">
                  <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="text-[9px] uppercase tracking-[0.25em] text-white/55">
                      The DropNest command centre
                    </span>
                  </div>

                  <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.045em] md:text-6xl xl:text-7xl">
                    Good moves
                    <br />
                    <span className="text-white/35">start here.</span>
                  </h1>

                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
                    One connected platform. Smarter logistics.
                  </p>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/50">
                    DropNest connects transport sharing, trusted storage
                    and secure goods handovers in one platform. Instead of
                    searching separately for a vehicle, a storage space
                    and a reliable handover process, users can explore
                    connected logistics services in one place.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/pools"
                      className="rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black transition hover:bg-white/80"
                    >
                      Explore transport ↗
                    </Link>
                    <Link
                      href="/nests"
                      className="rounded-full border border-white/20 px-6 py-3.5 text-xs text-white/80 transition hover:bg-white/10"
                    >
                      Find storage
                    </Link>
                  </div>

                  <div className="mt-9 grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-6">
                    {[
                      ["01", "SHARE TRANSPORT"],
                      ["02", "FIND STORAGE"],
                      ["03", "SECURE HANDOVER"],
                    ].map(([number, label]) => (
                      <div key={number}>
                        <p className="text-xl font-semibold">{number}</p>
                        <p className="mt-2 text-[8px] leading-4 tracking-[0.13em] text-white/40">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[330px] p-4 md:p-7 lg:min-h-0">
                  <RealRouteMap />
                </div>
              </div>
            </section>

            {/* PROBLEM */}
            <section className="mt-14">
              <SectionHeading
                eyebrow="The problem"
                title="Logistics shouldn't be this complicated."
                description="Moving and storing goods often involves disconnected services. People may struggle to find available transport, locate reliable storage or confirm that a handover has been completed."
              />

              <div className="mt-7 grid gap-3 md:grid-cols-3">
                {[
                  {
                    number: "01",
                    title: "Unused transport capacity",
                    description:
                      "Vehicles can travel with available space while other people are separately searching for transport.",
                    symbol: "↗",
                  },
                  {
                    number: "02",
                    title: "Difficult storage discovery",
                    description:
                      "Finding suitable, trustworthy storage can involve time-consuming searches and comparisons.",
                    symbol: "⌂",
                  },
                  {
                    number: "03",
                    title: "Unclear handovers",
                    description:
                      "Without a clear confirmation process, it can be difficult to establish whether goods were handed over.",
                    symbol: "◇",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="rounded-2xl border border-white/[0.09] bg-[#0b0b0b] p-6 transition hover:border-white/25"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.2em] text-white/35">
                        CHALLENGE {item.number}
                      </span>
                      <span className="text-2xl text-white/60">
                        {item.symbol}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs leading-6 text-white/45">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SOLUTION */}
            <section className="mt-14">
              <SectionHeading
                eyebrow="The DropNest solution"
                title="Three services. One connected experience."
                description="DropNest brings transport, storage and delivery verification together so users can discover options, connect with providers and manage their logistics journey through one platform."
              />

              <div className="mt-7 grid gap-4 lg:grid-cols-3">
                {services.map((service) => (
                  <Link
                    key={service.number}
                    href={service.href}
                    className="group flex min-h-[410px] flex-col rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#171717] to-[#080808] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 md:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.2em] text-white/35">
                        {service.number} / SERVICE
                      </span>
                      <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-xl transition group-hover:bg-white group-hover:text-black">
                        {service.icon}
                      </span>
                    </div>

                    <p className="mt-9 text-[8px] tracking-[0.2em] text-white/35">
                      {service.category}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-sm font-medium text-white/75">
                      {service.tagline}
                    </p>
                    <p className="mt-4 text-xs leading-6 text-white/45">
                      {service.description}
                    </p>

                    <div className="mt-6 border-t border-white/[0.09] pt-5">
                      <p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-white/35">
                        What you can do
                      </p>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex gap-2 text-[10px] text-white/60"
                          >
                            <span>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-7 text-[10px] text-white/75">
                      Explore {service.name}
                      <span className="transition group-hover:translate-x-1">
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="mt-14 rounded-2xl border border-white/[0.09] bg-[#0a0a0a] p-6 md:p-9">
              <SectionHeading
                eyebrow="Simple workflow"
                title="How DropNest works."
                description="A straightforward journey from discovering a service to confirming the transaction or handover."
              />

              <div className="mt-9 grid gap-8 md:grid-cols-3">
                {[
                  {
                    number: "01",
                    title: "Discover",
                    description:
                      "Search for shared transport routes or explore suitable storage spaces.",
                  },
                  {
                    number: "02",
                    title: "Connect & book",
                    description:
                      "Compare options, review details and select a service that fits your needs.",
                  },
                  {
                    number: "03",
                    title: "Track & confirm",
                    description:
                      "Manage your booking and use the NestLock verification workflow for handovers.",
                  },
                ].map((step, index) => (
                  <div key={step.number} className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-sm font-semibold">
                      {step.number}
                    </div>
                    {index !== 2 && (
                      <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-24px)] bg-white/15 md:block" />
                    )}
                    <h3 className="mt-6 text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-xs leading-6 text-white/45">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ANALYTICS */}
            <section className="mt-14">
              <SectionHeading
                eyebrow="Network intelligence"
                title="Your logistics at a glance."
                description="A sample overview of the activity and capacity information a DropNest workspace can present."
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#171717] to-[#090909] p-5 transition hover:-translate-y-1 hover:border-white/25"
                  >
                    <span className="text-[11px] text-white/45">
                      {item.label}
                    </span>
                    <div className="mt-5 flex items-end justify-between">
                      <span className="text-4xl font-semibold tracking-tight">
                        {item.value}
                      </span>
                      <span className="pb-1 text-[9px] text-white/35">
                        {item.note}
                      </span>
                    </div>
                    <div className="mt-5">
                      <MiniChart bars={item.bars} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[9px] text-white/30">
                These are illustrative prototype values, not live platform statistics.
              </p>
            </section>

            {/* MAP AND JOURNEY */}
            <section className="mt-12 grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
              <div className="rounded-2xl border border-white/[0.09] bg-[#0a0a0a] p-5 md:p-7">
                <div className="mb-6">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                    Geospatial overview
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Routes connect possibilities.
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-white/40">
                    Explore a sample geographical connection between Bengaluru and Chennai.
                  </p>
                </div>
                <RealRouteMap />
              </div>

              <div className="rounded-2xl border border-white/[0.09] bg-[#0a0a0a] p-6 md:p-7">
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                  Sample shipment
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  Journey overview.
                </h2>

                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-white/35">ORIGIN</p>
                    <p className="mt-2 text-lg font-semibold">BLR</p>
                    <p className="text-[10px] text-white/40">Bengaluru</p>
                  </div>
                  <div className="mx-3 flex-1 px-2 text-center">
                    <p className="text-[9px] text-white/35">346 KM</p>
                    <div className="relative mt-3 h-px bg-white/20">
                      <span className="absolute left-[60%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_white]" />
                    </div>
                    <p className="mt-3 text-[8px] tracking-[0.15em] text-white/45">
                      IN TRANSIT
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-white/35">DESTINATION</p>
                    <p className="mt-2 text-lg font-semibold">MAA</p>
                    <p className="text-[10px] text-white/40">Chennai</p>
                  </div>
                </div>

                <div className="mt-9 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">Shipment DN-2048</p>
                      <p className="mt-1 text-[9px] text-white/35">
                        Shared transport · Demo
                      </p>
                    </div>
                    <span className="rounded-full border border-white/20 px-2.5 py-1 text-[8px]">
                      On schedule
                    </span>
                  </div>
                  <div className="mt-7 grid grid-cols-3 gap-2">
                    {[
                      ["01", "Booked", true],
                      ["02", "In transit", true],
                      ["03", "Delivered", false],
                    ].map(([number, label, done]) => (
                      <div key={String(number)}>
                        <div className={`h-1 rounded-full ${done ? "bg-white" : "bg-white/15"}`} />
                        <p className="mt-3 text-[9px] text-white/35">{number}</p>
                        <p className="mt-1 text-[10px]">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-[9px] leading-5 text-white/30">
                  Demonstration data only. No live GPS tracking is connected.
                </p>
              </div>
            </section>

            {/* ROUTES */}
            <section className="mt-14">
              <SectionHeading
                eyebrow="Transport marketplace"
                title="Routes worth exploring."
                description="Example shared transport opportunities that users could discover through DropPool."
              />

              <div className="mt-6 grid gap-3 lg:grid-cols-3">
                {routes.map((route, index) => (
                  <div
                    key={route.from + route.to}
                    className="rounded-2xl border border-white/[0.09] bg-[#0b0b0b] p-5 transition hover:border-white/25"
                  >
                    <div className="flex justify-between text-[9px] tracking-[0.18em] text-white/35">
                      <span>ROUTE 0{index + 1}</span>
                      <span>SAMPLE LISTING</span>
                    </div>
                    <div className="mt-6 flex items-center gap-2">
                      <span className="text-lg font-semibold">{route.from}</span>
                      <span className="text-white/35">→</span>
                      <span className="text-lg font-semibold">{route.to}</span>
                    </div>
                    <p className="mt-2 text-[10px] text-white/40">
                      {route.distance} · {route.vehicle}
                    </p>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-[9px] text-white/40">
                        <span>Illustrative available capacity</span>
                        <span>{route.capacity}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-white/75"
                          style={{ width: `${route.capacity}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                      <span className="text-sm font-semibold">{route.price}</span>
                      <Link href="/pools" className="text-[10px] text-white/65 hover:text-white">
                        Explore route ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* RECENT ACTIVITY */}
            <section className="mt-14">
              <SectionHeading
                eyebrow="Activity centre"
                title="Your recent activity."
                description="Review sample transport, storage and handover records in one place."
              />

              <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search booking or reference..."
                  className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-xs outline-none placeholder:text-white/30 focus:border-white/35 md:max-w-sm"
                />
                <div className="flex flex-wrap gap-2">
                  {["All", "Confirmed", "Pending", "Verified"].map((value) => (
                    <button
                      key={value}
                      onClick={() => setTab(value)}
                      className={`rounded-full border px-3 py-2 text-[9px] transition ${
                        tab === value
                          ? "border-white bg-white text-black"
                          : "border-white/15 text-white/50 hover:border-white/40"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0b0b]">
                <div className="hidden grid-cols-[1.4fr_1fr_.8fr_.5fr] gap-4 border-b border-white/[0.08] px-6 py-4 text-[8px] uppercase tracking-[0.2em] text-white/30 md:grid">
                  <span>Booking</span>
                  <span>Reference</span>
                  <span>Status</span>
                  <span>Amount</span>
                </div>

                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="grid gap-3 border-b border-white/[0.07] px-5 py-5 last:border-0 md:grid-cols-[1.4fr_1fr_.8fr_.5fr] md:items-center md:gap-4 md:px-6"
                  >
                    <div>
                      <p className="text-xs font-medium">{activity.name}</p>
                      <p className="mt-1 text-[9px] text-white/35">
                        {activity.type} · {activity.date}
                      </p>
                    </div>
                    <span className="text-[10px] text-white/45">{activity.id}</span>
                    <span className="w-fit rounded-full border border-white/15 px-3 py-1 text-[9px] text-white/70">
                      {activity.status}
                    </span>
                    <span className="text-xs font-medium">{activity.amount}</span>
                  </div>
                ))}

                {filteredActivities.length === 0 && (
                  <div className="p-8 text-center text-xs text-white/40">
                    No matching activity found.
                  </div>
                )}
              </div>

              <p className="mt-3 text-[9px] text-white/30">
                All statistics, routes and bookings are illustrative prototype data.
              </p>
            </section>

            {/* FINAL CTA */}
            <section className="mt-12 flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-gradient-to-r from-[#171717] to-[#080808] p-7 md:flex-row md:items-center md:p-9">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                  Your next move starts now
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  Move smarter with DropNest.
                </h2>
                <p className="mt-2 text-xs text-white/40">
                  Share transport. Discover storage. Secure every handover.
                </p>
              </div>
              <Link
                href="/pools"
                className="w-fit rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black transition hover:bg-white/80"
              >
                Explore DropNest ↗
              </Link>
            </section>
          </div>

          <footer className="border-t border-white/[0.08] px-5 py-7 text-center text-[9px] tracking-[0.25em] text-white/25">
            DROPNEST · MOVE · STORE · SECURE
          </footer>
        </section>
      </div>
    </main>
  );
}

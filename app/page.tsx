

import Image from "next/image";
import Link from "next/link";

const services = [
  {
    number: "01",
    name: "DropPool",
    category: "SHARED TRANSPORT",
    description:
      "Find available vehicle space, connect with people travelling in the same direction and share transportation costs.",
    icon: "↗",
    href: "/pools",
  },
  {
    number: "02",
    name: "Verified Nests",
    category: "SMART STORAGE",
    description:
      "Discover trusted nearby storage spaces for your belongings whenever and wherever you need them.",
    icon: "⌂",
    href: "/nests",
  },
  {
    number: "03",
    name: "NestLock",
    category: "SECURE HANDOVER",
    description:
      "Make every exchange safer with digital verification, handover proof and transparent tracking.",
    icon: "◇",
    href: "/escrow",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Find transport or storage that fits your requirements.",
  },
  {
    number: "02",
    title: "Connect",
    description:
      "Connect with the right people and confirm your booking.",
  },
  {
    number: "03",
    title: "Move securely",
    description:
      "Track your journey and complete verified handovers.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* NAVIGATION */}
      <nav className="relative z-50 border-b border-white/[0.08] bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/[0.06] text-lg font-bold">
              D
            </span>
            <span className="text-2xl font-bold tracking-tight">
              DropNest<span className="text-white/40">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-white/45 md:flex">
            <Link href="/" className="text-white transition hover:text-white">
              Home
            </Link>
            <Link href="#features" className="transition hover:text-white">
              Explore
            </Link>
            <Link href="#how-it-works" className="transition hover:text-white">
              How it works
            </Link>
            <Link href="#about" className="transition hover:text-white">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-white/20 px-5 py-3 text-xs transition hover:bg-white/10 sm:block"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard"
              className="rounded-full bg-white px-5 py-3 text-xs font-semibold text-black transition hover:bg-white/80"
            >
              Get started ↗
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative isolate min-h-[760px] overflow-hidden bg-black lg:min-h-[850px]">

        {/* TRUCK IMAGE */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[78%]">
          <Image
            src="/dropnest-truck-hero.png"
            alt="DropNest transportation truck on a cinematic city highway"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 78vw"
            className="object-cover object-[65%_center] md:object-[60%_center]"
          />
        </div>

        {/* CINEMATIC OVERLAYS */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/85 to-black/10" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black via-transparent to-black/20" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_75%_35%,rgba(255,255,255,0.10),transparent_35%)]" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-6 py-20 lg:min-h-[850px] lg:px-10">
          <div className="max-w-2xl">

            <div className="mb-9 inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-5 py-3 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span className="text-[9px] tracking-[0.28em] text-white/75">
                THE FUTURE OF SMART LOGISTICS
              </span>
            </div>

            <h1 className="text-6xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-7xl lg:text-[100px]">
              Move beyond
              <br />
              <span className="text-white/40">the ordinary.</span>
              <br />
              Move smarter.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
              A smarter way to move goods, share transportation and
              discover trusted storage. One connected network.
              Endless possibilities.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition hover:scale-[1.03] hover:bg-white/85"
              >
                Explore DropNest ↗
              </Link>

              <Link
                href="#features"
                className="rounded-full border border-white/30 bg-black/20 px-8 py-4 text-sm text-white transition hover:bg-white/10"
              >
                Discover services
              </Link>
            </div>

            <div className="mt-16 grid max-w-lg grid-cols-3 gap-5 border-t border-white/15 pt-7">
              <div>
                <p className="text-2xl font-semibold">01</p>
                <p className="mt-2 text-[9px] uppercase tracking-[.18em] text-white/40">
                  Connected
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold">03</p>
                <p className="mt-2 text-[9px] uppercase tracking-[.18em] text-white/40">
                  Core services
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold">∞</p>
                <p className="mt-2 text-[9px] uppercase tracking-[.18em] text-white/40">
                  Possibilities
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-10 hidden text-right md:block">
          <p className="text-[9px] tracking-[.25em] text-white/35">
            DROPNEST NETWORK
          </p>
          <p className="mt-2 text-xs text-white/60">
            Move. Store. Secure.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="features"
        className="scroll-mt-20 bg-[#080808] px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[.3em] text-white/40">
                THE DROPNEST ECOSYSTEM
              </p>
              <h2 className="mt-5 text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
                One network.
                <br />
                <span className="text-white/35">
                  Three possibilities.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-white/50">
              Transportation, storage and secure handovers,
              brought together in one connected experience.
            </p>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.number}
                href={service.href}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-[#171717] to-[#090909] p-8 transition duration-500 hover:-translate-y-2 hover:border-white/35 hover:shadow-[0_25px_80px_rgba(255,255,255,0.06)] md:p-10"
              >
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/[0.06] transition duration-700 group-hover:scale-125" />

                <div className="relative flex items-center justify-between">
                  <p className="text-[10px] tracking-[.25em] text-white/45">
                    {service.category}
                  </p>

                  <span className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-2xl transition group-hover:bg-white group-hover:text-black">
                    {service.icon}
                  </span>
                </div>

                <div className="relative mt-16">
                  <p className="text-xs text-white/35">
                    {service.number}
                  </p>

                  <h3 className="mt-4 text-3xl font-semibold tracking-tight">
                    {service.name}
                  </h3>

                  <p className="mt-6 max-w-sm text-sm leading-8 text-white/50">
                    {service.description}
                  </p>
                </div>

                <div className="relative mt-auto flex items-center justify-between border-t border-white/10 pt-7">
                  <span className="text-sm font-semibold">
                    Explore service
                  </span>
                  <span className="text-xl transition group-hover:translate-x-2">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-white/[0.08] bg-black px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[.3em] text-white/40">
              SIMPLE BY DESIGN
            </p>

            <h2 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
              Three steps.
              <br />
              <span className="text-white/35">One seamless journey.</span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/50">
              DropNest simplifies logistics by bringing the discovery,
              connection and handover process into one place.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="border-t border-white/20 pt-7"
              >
                <p className="text-xs tracking-[.2em] text-white/35">
                  {step.number}
                </p>

                <h3 className="mt-9 text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 max-w-xs text-sm leading-7 text-white/45">
                  {step.description}
                </p>

                <div className="mt-12 h-px w-full bg-gradient-to-r from-white/30 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-20 bg-[#080808] px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

          <div>
            <p className="text-[10px] uppercase tracking-[.3em] text-white/40">
              WHY DROPNEST
            </p>

            <h2 className="mt-5 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
              Logistics should
              <br />
              work together.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-white/55">
              Moving goods often means searching separately for
              transportation, finding a suitable storage location
              and coordinating a reliable handover.
            </p>

            <p className="mt-5 text-base leading-8 text-white/55">
              DropNest brings these connected needs into one
              platform, helping people discover shared transport,
              trusted storage and more transparent exchanges.
            </p>

            <Link
              href="/dashboard"
              className="mt-9 inline-flex rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/80"
            >
              Enter the DropNest network ↗
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-24 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-[#292929] via-[#111111] to-[#080808] px-8 py-20 text-center md:px-16">

          <div className="pointer-events-none absolute -right-20 -top-36 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -left-20 -bottom-40 h-96 w-96 rounded-full border border-white/[0.06]" />

          <div className="relative">
            <p className="text-[10px] uppercase tracking-[.3em] text-white/40">
              YOUR JOURNEY STARTS HERE
            </p>

            <h2 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
              Ready to move smarter?
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/50">
              Explore a connected approach to transportation,
              storage and secure handovers with DropNest.
            </p>

            <Link
              href="/dashboard"
              className="mt-9 inline-flex rounded-full bg-white px-9 py-4 text-sm font-semibold text-black transition hover:scale-105 hover:bg-white/85"
            >
              Explore DropNest ↗
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">

          <div>
            <Link href="/" className="text-2xl font-bold">
              DropNest<span className="text-white/35">.</span>
            </Link>
            <p className="mt-3 text-xs text-white/35">
              Move. Store. Secure.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-4 text-xs text-white/45">
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/pools" className="hover:text-white">
              DropPool
            </Link>
            <Link href="/nests" className="hover:text-white">
              Verified Nests
            </Link>
            <Link href="/escrow" className="hover:text-white">
              NestLock
            </Link>
            <Link href="/bookings" className="hover:text-white">
              Bookings
            </Link>
            <Link href="/payments" className="hover:text-white">
              Payments
            </Link>
          </div>

          <p className="text-[9px] tracking-[.15em] text-white/30">
            © 2026 DROPNEST · ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </main>
  );
}

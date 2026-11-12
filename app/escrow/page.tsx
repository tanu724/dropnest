
"use client";

import Link from "next/link";
import { useState } from "react";

type Handover = {
  id: string;
  item: string;
  from: string;
  to: string;
  status: "Awaiting verification" | "Verified";
  otp: string;
};

const STORAGE_KEY = "dropnest_handover";

export default function NestLockPage() {
  const [reference, setReference] = useState("");
  const [handover, setHandover] = useState<Handover | null>(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  function createHandover(e: React.FormEvent) {
    e.preventDefault();

    const record: Handover = {
      id: `NL-${Date.now().toString().slice(-7)}`,
      item: reference.trim(),
      from: "Sender",
      to: "Receiver",
      status: "Awaiting verification",
      otp: String(Math.floor(100000 + Math.random() * 900000)),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    setHandover(record);
    setOtp("");
    setVerified(false);
    setMessage("Demo handover created. Share the generated OTP with the receiver.");
  }

  function loadHandover() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setMessage("No saved handover found in this browser.");
      return;
    }

    try {
      const record = JSON.parse(saved) as Handover;
      setHandover(record);
      setVerified(record.status === "Verified");
      setMessage("Handover loaded successfully.");
    } catch {
      setMessage("Unable to load the saved handover.");
    }
  }

  function verifyHandover(e: React.FormEvent) {
    e.preventDefault();

    if (!handover) return;

    if (otp.trim() !== handover.otp) {
      setMessage("Incorrect OTP. Please try again.");
      return;
    }

    const updated = { ...handover, status: "Verified" as const };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHandover(updated);
    setVerified(true);
    setMessage("Handover successfully verified!");
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 border-r border-white/10 bg-[#080808] px-5 py-7 lg:block">
          <Link href="/" className="mb-12 flex items-center gap-3 px-2 text-2xl font-semibold">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/20">D</span>
            DropNest.
          </Link>

          <p className="mb-4 px-3 text-[9px] uppercase tracking-[.3em] text-white/30">Workspace</p>

          <nav className="space-y-2">
            {[
              ["Overview", "/dashboard", "▦"],
              ["DropPool", "/pools", "↗"],
              ["Verified Nests", "/nests", "⌂"],
              ["NestLock", "/escrow", "◇"],
              ["My Bookings", "/bookings", "▤"],
              ["My Profile", "/profile", "◉"],
            ].map(([name, href, icon]) => (
              <Link key={name} href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs ${
                  name === "NestLock" ? "bg-white/10 text-white" : "text-white/45 hover:bg-white/5 hover:text-white"
                }`}>
                <span>{icon}</span>{name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-8">
            <span className="text-[9px] uppercase tracking-[.25em] text-white/40">Security / NestLock</span>
            <Link href="/bookings" className="text-xs text-white/50 hover:text-white">My bookings ↗</Link>
          </header>

          <div className="mx-auto max-w-[1200px] px-5 py-9 md:px-8">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] p-8 md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(255,255,255,.12),transparent_45%)]" />
              <div className="relative">
                <p className="text-[9px] uppercase tracking-[.3em] text-white/40">DropNest security layer</p>
                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/20 bg-white/5 text-3xl">◇</div>
                  <div>
                    <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">NestLock<span className="text-white/35">.</span></h1>
                    <p className="mt-2 text-xs text-white/45">A more transparent way to verify every handover.</p>
                  </div>
                </div>
                <p className="mt-7 max-w-xl text-sm leading-7 text-white/50">
                  NestLock is a handover verification concept designed to
                  help senders and receivers confirm that goods have reached
                  the intended person.
                </p>
              </div>
            </section>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                ["01", "Create reference", "Start a handover record for your goods."],
                ["02", "Share OTP", "Give the receiver the one-time verification code."],
                ["03", "Verify handover", "Confirm the handover using the code."],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
                  <p className="text-xs text-white/35">{number}</p>
                  <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                  <p className="mt-2 text-[10px] leading-5 text-white/40">{description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
                <p className="text-[9px] uppercase tracking-[.25em] text-white/35">New handover</p>
                <h2 className="mt-3 text-2xl font-semibold">Create a secure handover.</h2>
                <p className="mt-2 text-xs leading-6 text-white/45">Enter a booking or goods reference to create a demo verification record.</p>

                <form onSubmit={createHandover} className="mt-7">
                  <label className="text-[10px] text-white/55">Booking / goods reference</label>
                  <input required value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. DP-1001 or GOODS-001" className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-xs outline-none focus:border-white/40" />
                  <button className="mt-5 w-full rounded-xl bg-white py-4 text-xs font-semibold text-black hover:bg-white/80">Create handover ↗</button>
                </form>

                <button onClick={loadHandover} className="mt-3 w-full rounded-xl border border-white/15 py-3 text-xs text-white/65 hover:bg-white/5">Load saved handover</button>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
                <p className="text-[9px] uppercase tracking-[.25em] text-white/35">Verification centre</p>
                <h2 className="mt-3 text-2xl font-semibold">Confirm the handover.</h2>

                {handover ? (
                  <>
                    <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-white/40">REFERENCE ID</span>
                        <span className={`text-[9px] ${verified ? "text-green-300" : "text-yellow-200"}`}>{handover.status}</span>
                      </div>
                      <p className="mt-3 text-xl font-semibold">{handover.id}</p>
                      <p className="mt-2 text-xs text-white/45">Goods: {handover.item}</p>
                    </div>

                    {!verified && (
                      <>
                        <div className="mt-5 rounded-xl border border-dashed border-white/20 p-5 text-center">
                          <p className="text-[9px] tracking-[.2em] text-white/40">DEMO RECEIVER OTP</p>
                          <p className="mt-3 text-3xl font-semibold tracking-[.3em]">{handover.otp}</p>
                          <p className="mt-2 text-[9px] text-white/35">For demonstration only. This code is displayed in this browser.</p>
                        </div>

                        <form onSubmit={verifyHandover} className="mt-5">
                          <label className="text-[10px] text-white/55">Enter verification OTP</label>
                          <input required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="6-digit OTP" className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-center text-lg tracking-[.3em] outline-none focus:border-white/40" />
                          <button className="mt-4 w-full rounded-xl bg-white py-4 text-xs font-semibold text-black">Verify handover ↗</button>
                        </form>
                      </>
                    )}

                    {verified && (
                      <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/5 p-6 text-center">
                        <p className="text-3xl">✓</p>
                        <p className="mt-3 text-sm font-semibold text-green-200">Handover verified</p>
                        <p className="mt-2 text-[10px] text-white/40">This demo handover has been marked as verified.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-7 rounded-xl border border-dashed border-white/15 p-10 text-center">
                    <p className="text-3xl text-white/40">◇</p>
                    <p className="mt-4 text-sm">No active handover.</p>
                    <p className="mt-2 text-[10px] text-white/35">Create a handover record to begin verification.</p>
                  </div>
                )}
              </section>
            </div>

            {message && <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4 text-xs text-white/75">{message}</div>}

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-[9px] uppercase tracking-[.25em] text-white/35">Security note</p>
              <p className="mt-3 text-xs leading-6 text-white/45">
                This is a frontend demonstration. OTPs are generated and checked
                locally in the browser. It does not provide real identity
                verification, payment escrow, encryption or tamper-proof proof
                of delivery. A production system needs server-side verification
                and secure authentication.
              </p>
            </div>

            <footer className="mt-12 border-t border-white/10 py-7 text-[9px] tracking-[.2em] text-white/30">DROPNEST · NESTLOCK</footer>
          </div>
        </section>
      </div>
    </main>
  );
}

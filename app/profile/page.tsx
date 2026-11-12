
"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useState } from "react";

type Profile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
};

const STORAGE_KEY = "dropnest_profile";

const defaultProfile: Profile = {
  name: "Demo User",
  email: "demo@dropnest.com",
  phone: "",
  city: "Bengaluru",
  role: "DropNest Member",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProfile({ ...defaultProfile, ...JSON.parse(saved) });
      }
    } catch {
      setMessage("Could not load saved profile.");
    }
    setLoaded(true);
  }, []);

  function updateField(key: keyof Profile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setEditing(false);
    setMessage("Your profile has been saved successfully.");
  }

  const completed = [
    profile.name,
    profile.email,
    profile.phone,
    profile.city,
  ].filter((value) => value.trim().length > 0).length;

  const percentage = Math.round((completed / 4) * 100);

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
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs ${
                  name === "My Profile"
                    ? "bg-white/10 text-white"
                    : "text-white/45 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{icon}</span>{name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-8">
            <span className="text-[9px] uppercase tracking-[.25em] text-white/40">Account / My Profile</span>
            <Link href="/dashboard" className="text-xs text-white/50 hover:text-white">Dashboard ↗</Link>
          </header>

          <div className="mx-auto max-w-[1200px] px-5 py-9 md:px-8">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] p-8 md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(255,255,255,.12),transparent_45%)]" />
              <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl border border-white/20 bg-white/[0.06] text-4xl font-semibold">
                  {profile.name.charAt(0).toUpperCase() || "D"}
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[.3em] text-white/40">Your DropNest account</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{profile.name}</h1>
                  <p className="mt-2 text-xs text-white/45">{profile.role}</p>
                </div>
              </div>
            </section>

            <div className="mt-7 grid gap-4 md:grid-cols-[.8fr_1.2fr]">
              <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
                <p className="text-[9px] uppercase tracking-[.25em] text-white/35">Profile completion</p>
                <p className="mt-5 text-5xl font-semibold">{percentage}<span className="text-xl text-white/40">%</span></p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-white transition-all" style={{ width: `${percentage}%` }} />
                </div>
                <p className="mt-4 text-[10px] leading-5 text-white/40">{completed} of 4 profile details completed.</p>

                <div className="mt-7 space-y-4 border-t border-white/10 pt-5">
                  {[
                    ["Full name", Boolean(profile.name.trim())],
                    ["Email address", Boolean(profile.email.trim())],
                    ["Phone number", Boolean(profile.phone.trim())],
                    ["City", Boolean(profile.city.trim())],
                  ].map(([label, done]) => (
                    <div key={String(label)} className="flex items-center justify-between text-xs">
                      <span className="text-white/55">{label}</span>
                      <span className={done ? "text-green-300" : "text-white/30"}>{done ? "✓ Complete" : "Incomplete"}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[.25em] text-white/35">Personal information</p>
                    <h2 className="mt-3 text-2xl font-semibold">Your details.</h2>
                  </div>
                  {!editing && (
                    <button
                      onClick={() => { setEditing(true); setMessage(""); }}
                      className="rounded-full border border-white/20 px-4 py-2.5 text-[10px] text-white/75 hover:bg-white/10"
                    >
                      Edit profile ↗
                    </button>
                  )}
                </div>

                {!loaded ? (
                  <p className="mt-8 text-xs text-white/40">Loading profile...</p>
                ) : (
                  <form onSubmit={saveProfile} className="mt-8 space-y-5">
                    <label className="block text-[10px] text-white/45">
                      Full name
                      <input disabled={!editing} required value={profile.name} onChange={(e) => updateField("name", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-xs text-white outline-none disabled:opacity-60 focus:border-white/40" />
                    </label>

                    <label className="block text-[10px] text-white/45">
                      Email address
                      <input disabled={!editing} required type="email" value={profile.email} onChange={(e) => updateField("email", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-xs text-white outline-none disabled:opacity-60 focus:border-white/40" />
                    </label>

                    <label className="block text-[10px] text-white/45">
                      Phone number
                      <input disabled={!editing} type="tel" value={profile.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Enter your contact number" className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-xs text-white outline-none placeholder:text-white/25 disabled:opacity-60 focus:border-white/40" />
                    </label>

                    <label className="block text-[10px] text-white/45">
                      City
                      <input disabled={!editing} value={profile.city} onChange={(e) => updateField("city", e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-xs text-white outline-none disabled:opacity-60 focus:border-white/40" />
                    </label>

                    <label className="block text-[10px] text-white/45">
                      Account type
                      <input disabled value={profile.role} className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-xs text-white/50" />
                    </label>

                    {editing && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button type="submit" className="rounded-full bg-white px-6 py-3 text-xs font-semibold text-black">Save changes ↗</button>
                        <button type="button" onClick={() => { setEditing(false); setMessage(""); }} className="rounded-full border border-white/20 px-6 py-3 text-xs text-white/65">Cancel</button>
                      </div>
                    )}
                  </form>
                )}

                {message && <p className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4 text-xs text-white/75">{message}</p>}
              </section>
            </div>

            <section className="mt-7 rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
              <p className="text-[9px] uppercase tracking-[.25em] text-white/35">Quick access</p>
              <h2 className="mt-3 text-xl font-semibold">Your DropNest workspace.</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["DropPool", "/pools", "Find shared transport routes."],
                  ["Verified Nests", "/nests", "Discover storage spaces."],
                  ["NestLock", "/escrow", "Explore handover verification."],
                ].map(([name, href, description]) => (
                  <Link key={name} href={href} className="rounded-xl border border-white/10 p-5 transition hover:border-white/30 hover:bg-white/[0.03]">
                    <p className="text-sm font-medium">{name} ↗</p>
                    <p className="mt-2 text-[10px] leading-5 text-white/40">{description}</p>
                  </Link>
                ))}
              </div>
            </section>

            <footer className="mt-12 border-t border-white/10 py-7 text-[9px] tracking-[.2em] text-white/30">
              DROPNEST · MY PROFILE
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

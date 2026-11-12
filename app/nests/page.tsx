
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Nest = {
  id: number;
  name: string;
  city: string;
  type: string;
  size: string;
  price: number;
  rating: string;
  features: string[];
  description: string;
};

const nests: Nest[] = [
  { id: 1, name: "UrbanVault Storage", city: "Bengaluru", type: "Personal", size: "100 sq ft", price: 1200, rating: "4.9", features: ["CCTV", "24/7 Access", "Climate Controlled"], description: "Secure storage for household goods, luggage and personal belongings." },
  { id: 2, name: "MetroSpace Warehouse", city: "Bengaluru", type: "Business", size: "500 sq ft", price: 4500, rating: "4.8", features: ["CCTV", "Loading Dock", "Fire Safety"], description: "Flexible warehouse space for small businesses and inventory." },
  { id: 3, name: "SafeNest Hub", city: "Chennai", type: "Personal", size: "150 sq ft", price: 1600, rating: "4.7", features: ["CCTV", "Security Guard", "24/7 Access"], description: "Convenient short-term storage for personal belongings." },
  { id: 4, name: "CargoCorner", city: "Hyderabad", type: "Business", size: "800 sq ft", price: 6200, rating: "4.9", features: ["Loading Dock", "CCTV", "Fire Safety"], description: "A spacious storage option for commercial goods and stock." },
  { id: 5, name: "MiniNest Storage", city: "Mysuru", type: "Personal", size: "80 sq ft", price: 900, rating: "4.6", features: ["CCTV", "Security Guard"], description: "Affordable compact storage for everyday storage needs." },
  { id: 6, name: "SouthGate Logistics", city: "Chennai", type: "Business", size: "600 sq ft", price: 5200, rating: "4.8", features: ["Loading Dock", "CCTV", "24/7 Access"], description: "Organised storage for business inventory and packaged goods." },
];

export default function NestsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Nest | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [success, setSuccess] = useState("");

  const filtered = useMemo(() => nests.filter((nest) => {
    const matchesSearch =
      nest.city.toLowerCase().includes(search.toLowerCase()) ||
      nest.name.toLowerCase().includes(search.toLowerCase());

    return matchesSearch &&
      (category === "All" || nest.type === category);
  }), [search, category]);

  function bookNest(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    const booking = {
      id: `NEST-${Date.now()}`,
      nestId: selected.id,
      nestName: selected.name,
      city: selected.city,
      name: bookingName,
      phone: bookingPhone,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("dropnest_nest_bookings") || "[]");
    localStorage.setItem("dropnest_nest_bookings", JSON.stringify([booking, ...existing]));

    setSuccess(`Your storage request for ${selected.name} has been saved.`);
    setSelected(null);
    setBookingName("");
    setBookingPhone("");
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
              <Link key={name} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs ${name === "Verified Nests" ? "bg-white/10 text-white" : "text-white/45 hover:bg-white/5 hover:text-white"}`}>
                <span>{icon}</span>{name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#050505]/90 px-5 py-4 backdrop-blur-xl md:px-8">
            <span className="text-[9px] uppercase tracking-[.25em] text-white/40">Marketplace / Verified Nests</span>
            <Link href="/bookings" className="text-xs text-white/60 hover:text-white">My bookings ↗</Link>
          </header>

          <div className="mx-auto max-w-[1400px] px-5 py-9 md:px-8">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c] p-8 md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(255,255,255,.12),transparent_45%)]" />
              <div className="relative">
                <p className="text-[9px] uppercase tracking-[.3em] text-white/40">Trusted storage network</p>
                <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
                  Space for<br /><span className="text-white/35">what matters.</span>
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
                  Discover storage spaces for personal belongings and business inventory.
                  Compare facilities and send a storage request in minutes.
                </p>
                <a href="#discover" className="mt-8 inline-block rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black">Explore storage spaces ↗</a>
              </div>
            </section>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["01", "Discover", "Find spaces in your preferred city."],
                ["02", "Compare", "Review size, facilities and monthly prices."],
                ["03", "Request", "Submit your storage request."],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
                  <span className="text-xs text-white/40">{number}</span>
                  <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                  <p className="mt-2 text-[10px] leading-5 text-white/40">{description}</p>
                </div>
              ))}
            </div>

            <section id="discover" className="mt-14 scroll-mt-24">
              <p className="text-[9px] uppercase tracking-[.25em] text-white/35">Find your space</p>
              <h2 className="mt-3 text-3xl font-semibold">Explore verified nests.</h2>
              <p className="mt-2 text-xs text-white/40">Find a storage option that fits your needs.</p>

              <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by city or storage name..." className="rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-4 text-xs outline-none placeholder:text-white/30 focus:border-white/40" />
                <div className="flex gap-2">
                  {["All", "Personal", "Business"].map((item) => (
                    <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-[10px] ${category === item ? "border-white bg-white text-black" : "border-white/15 text-white/55"}`}>{item}</button>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((nest) => (
                  <article key={nest.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] transition hover:border-white/30">
                    <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-[#242424] to-[#090909]">
                      <div className="absolute h-36 w-36 rounded-full border border-white/10" />
                      <span className="relative text-5xl">⌂</span>
                      <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[8px] tracking-widest text-white/70">{nest.type.toUpperCase()}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold">{nest.name}</h3>
                          <p className="mt-2 text-[10px] text-white/45">⌖ {nest.city}</p>
                        </div>
                        <span className="text-xs text-white/70">★ {nest.rating}</span>
                      </div>
                      <p className="mt-4 min-h-10 text-[10px] leading-5 text-white/45">{nest.description}</p>
                      <div className="mt-4 flex items-center justify-between border-y border-white/10 py-4">
                        <div><p className="text-[8px] text-white/35">SPACE</p><p className="mt-1 text-xs">{nest.size}</p></div>
                        <div className="text-right"><p className="text-[8px] text-white/35">MONTHLY FROM</p><p className="mt-1 text-lg font-semibold">₹{nest.price.toLocaleString("en-IN")}</p></div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {nest.features.map((feature) => <span key={feature} className="rounded-full border border-white/10 px-2.5 py-1.5 text-[8px] text-white/50">{feature}</span>)}
                      </div>
                      <button onClick={() => { setSelected(nest); setSuccess(""); }} className="mt-5 w-full rounded-xl bg-white py-3.5 text-xs font-semibold text-black hover:bg-white/80">View details & request ↗</button>
                    </div>
                  </article>
                ))}
              </div>

              {filtered.length === 0 && <p className="mt-8 rounded-2xl border border-white/10 p-10 text-center text-xs text-white/40">No spaces found. Try another city.</p>}
            </section>

            {success && <div className="mt-8 rounded-xl border border-white/20 bg-white/5 p-4 text-xs text-white/80">{success}</div>}

            <footer className="mt-14 border-t border-white/10 py-7 text-[9px] tracking-[.2em] text-white/30">DROPNEST · VERIFIED NESTS</footer>
          </div>
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#111] p-7" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40">Storage request</p>
                <h2 className="mt-3 text-2xl font-semibold">{selected.name}</h2>
                <p className="mt-2 text-xs text-white/45">{selected.city} · {selected.size}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl text-white/50">×</button>
            </div>
            <p className="mt-5 text-xs leading-6 text-white/50">{selected.description}</p>
            <p className="mt-4 text-lg font-semibold">₹{selected.price.toLocaleString("en-IN")} / month</p>
            <form onSubmit={bookNest} className="mt-6 space-y-4">
              <input required value={bookingName} onChange={(e) => setBookingName(e.target.value)} placeholder="Your full name" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs outline-none" />
              <input required value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} placeholder="Contact number" type="tel" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs outline-none" />
              <button className="w-full rounded-xl bg-white py-4 text-xs font-semibold text-black">Submit storage request ↗</button>
            </form>
            <p className="mt-4 text-center text-[9px] text-white/30">Demo request only. No real storage reservation is made.</p>
          </div>
        </div>
      )}
    </main>
  );
}

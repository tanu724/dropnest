
"use client";

import Link from "next/link";
import { useState } from "react";

type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  type: "Credit" | "Debit";
};

const initialTransactions: Transaction[] = [
  {
    id: "DN-PAY-2041",
    title: "Transport delivery",
    subtitle: "Bengaluru → Chennai",
    date: "12 Nov 2026",
    amount: 4200,
    status: "Completed",
    type: "Credit",
  },
  {
    id: "DN-PAY-2042",
    title: "Storage reservation",
    subtitle: "Verified Nest · Mysuru",
    date: "11 Nov 2026",
    amount: 1200,
    status: "Completed",
    type: "Debit",
  },
  {
    id: "DN-PAY-2043",
    title: "Transport booking",
    subtitle: "Chennai → Hyderabad",
    date: "10 Nov 2026",
    amount: 7800,
    status: "Pending",
    type: "Credit",
  },
  {
    id: "DN-PAY-2044",
    title: "NestLock protection",
    subtitle: "Secure handover service",
    date: "09 Nov 2026",
    amount: 350,
    status: "Completed",
    type: "Debit",
  },
  {
    id: "DN-PAY-2045",
    title: "Transport delivery",
    subtitle: "Mysuru → Bengaluru",
    date: "08 Nov 2026",
    amount: 2100,
    status: "Failed",
    type: "Credit",
  },
];

const filters = ["All", "Completed", "Pending", "Failed"];

const navItems = [
  ["Overview", "/dashboard", "▦"],
  ["DropPool", "/pools", "↗"],
  ["Verified Nests", "/nests", "⌂"],
  ["NestLock", "/escrow", "◇"],
  ["My Bookings", "/bookings", "▤"],
  ["My Profile", "/profile", "◉"],
  ["Provider Hub", "/provider", "◈"],
  ["Payments", "/payments", "₹"],
];

export default function PaymentsPage() {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const completedCredits = transactions
    .filter((t) => t.status === "Completed" && t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCredits = transactions
    .filter((t) => t.status === "Pending" && t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const completedDebits = transactions
    .filter((t) => t.status === "Completed" && t.type === "Debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = completedCredits - completedDebits;

  const query = search.toLowerCase();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "All" || transaction.status === filter;

    const matchesSearch =
      transaction.id.toLowerCase().includes(query) ||
      transaction.title.toLowerCase().includes(query) ||
      transaction.subtitle.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  function statusStyle(status: Transaction["status"]) {
    if (status === "Completed") {
      return "border-green-400/30 text-green-300 bg-green-400/5";
    }

    if (status === "Pending") {
      return "border-yellow-400/30 text-yellow-200 bg-yellow-400/5";
    }

    return "border-red-400/30 text-red-300 bg-red-400/5";
  }

  function exportTransactions() {
    const header = [
      "Transaction ID",
      "Title",
      "Description",
      "Date",
      "Amount",
      "Type",
      "Status",
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.title,
      t.subtitle,
      t.date,
      t.amount,
      t.type,
      t.status,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "dropnest-transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
    setNotice("Your transaction report has been exported.");
  }

  function requestPayout() {
    setNotice(
      "Demo payout request created. No real money has been transferred."
    );
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
            {navItems.map(([name, href, icon]) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs transition ${
                  name === "Payments"
                    ? "border border-white/10 bg-white/10 text-white"
                    : "text-white/45 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">{icon}</span>
                {name}
                {name === "Payments" && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[9px] tracking-[.2em] text-white/35">
              DROPNEST FINANCE
            </p>
            <p className="mt-3 text-sm font-medium">
              Every move matters.
            </p>
            <p className="mt-2 text-[10px] leading-5 text-white/40">
              Your transactions, earnings and payout overview.
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050505]/90 px-5 py-4 backdrop-blur-xl md:px-8">
            <div>
              <p className="text-[9px] uppercase tracking-[.25em] text-white/35">
                Finance / Overview
              </p>
              <p className="mt-1 text-sm font-medium">
                Payments & earnings
              </p>
            </div>

            <Link
              href="/dashboard"
              className="text-[10px] text-white/50 hover:text-white"
            >
              Back to overview ↗
            </Link>
          </header>

          {/* MOBILE NAV */}
          <div className="border-b border-white/10 px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {navItems.map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  className={`shrink-0 rounded-full border px-3 py-2 text-[10px] ${
                    name === "Payments"
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
            <section className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#101010] p-7 md:p-11">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(255,255,255,.14),transparent_45%)]" />
              <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border border-white/[0.07]" />
              <div className="absolute -right-2 -top-10 h-64 w-64 rounded-full border border-white/[0.06]" />

              <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[.3em] text-white/40">
                    DropNest financial centre
                  </p>

                  <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                    Every move.
                    <br />
                    <span className="text-white/35">
                      Accounted for.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
                    Track your transport earnings, storage expenses and
                    payment activity from one connected financial workspace.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      onClick={exportTransactions}
                      className="rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black hover:bg-white/80"
                    >
                      Export report ↓
                    </button>

                    <a
                      href="#transactions"
                      className="rounded-full border border-white/20 px-6 py-3.5 text-xs text-white/75 hover:bg-white/10"
                    >
                      View transactions
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl md:min-w-[245px]">
                  <p className="text-[9px] tracking-[.2em] text-white/40">
                    AVAILABLE DEMO BALANCE
                  </p>

                  <p className="mt-5 text-4xl font-semibold tracking-tight">
                    ₹{netBalance.toLocaleString("en-IN")}
                  </p>

                  <div className="mt-5 h-px bg-white/10" />

                  <p className="mt-4 text-[10px] leading-5 text-white/40">
                    Calculated from completed sample transactions.
                  </p>
                </div>
              </div>
            </section>

            {/* SUMMARY CARDS */}
            <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[
                {
                  label: "Completed credits",
                  value: completedCredits,
                  detail: "Successful incoming payments",
                  icon: "↗",
                },
                {
                  label: "Pending payments",
                  value: pendingCredits,
                  detail: "Awaiting completion",
                  icon: "◷",
                },
                {
                  label: "Completed expenses",
                  value: completedDebits,
                  detail: "Successful outgoing payments",
                  icon: "↘",
                },
                {
                  label: "Net balance",
                  value: netBalance,
                  detail: "Credits minus expenses",
                  icon: "₹",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 md:p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/40">
                      {item.label}
                    </p>
                    <span className="text-xl text-white/45">
                      {item.icon}
                    </span>
                  </div>

                  <p className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
                    ₹{item.value.toLocaleString("en-IN")}
                  </p>

                  <p className="mt-2 text-[9px] text-white/30">
                    {item.detail}
                  </p>
                </div>
              ))}
            </section>

            {/* EARNINGS BREAKDOWN */}
            <section className="mt-12 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">

              <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
                <p className="text-[9px] uppercase tracking-[.25em] text-white/35">
                  Financial breakdown
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  Where your money moves.
                </h2>

                <p className="mt-2 text-xs text-white/40">
                  Completed incoming and outgoing sample transactions.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="mb-3 flex justify-between text-xs">
                      <span className="text-white/65">Transport credits</span>
                      <span className="font-medium">
                        ₹{completedCredits.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[82%] rounded-full bg-white" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex justify-between text-xs">
                      <span className="text-white/65">Service expenses</span>
                      <span className="font-medium">
                        ₹{completedDebits.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[28%] rounded-full bg-white/45" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex justify-between text-xs">
                      <span className="text-white/65">Pending credits</span>
                      <span className="font-medium">
                        ₹{pendingCredits.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[55%] rounded-full bg-white/25" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#242424] to-[#090909] p-6 md:p-8">
                <p className="text-[9px] uppercase tracking-[.25em] text-white/40">
                  Payout centre
                </p>

                <div className="mt-8 text-5xl text-white/65">↗</div>

                <h2 className="mt-5 text-2xl font-semibold">
                  Ready to settle?
                </h2>

                <p className="mt-3 text-xs leading-6 text-white/45">
                  Review your demo balance and simulate a payout request.
                </p>

                <p className="mt-6 text-3xl font-semibold">
                  ₹{netBalance.toLocaleString("en-IN")}
                </p>

                <button
                  onClick={requestPayout}
                  className="mt-6 w-full rounded-full bg-white px-5 py-3.5 text-xs font-semibold text-black hover:bg-white/80"
                >
                  Request demo payout ↗
                </button>
              </div>
            </section>

            {/* TRANSACTIONS */}
            <section id="transactions" className="mt-14 scroll-mt-24">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[.25em] text-white/35">
                    Finance / Activity
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold">
                    Transaction history.
                  </h2>

                  <p className="mt-2 text-xs text-white/45">
                    A detailed record of your DropNest financial activity.
                  </p>
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-xs outline-none placeholder:text-white/30 focus:border-white/40 md:max-w-sm"
                />
              </div>

              <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
                {filters.map((item) => (
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
                ))}
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]">
                <div className="hidden grid-cols-[1.1fr_1.5fr_1fr_.8fr_.8fr] gap-4 border-b border-white/10 px-6 py-4 text-[9px] uppercase tracking-[.15em] text-white/35 md:grid">
                  <span>Transaction</span>
                  <span>Description</span>
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>

                {filteredTransactions.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-lg font-semibold">
                      No transactions found.
                    </p>
                    <p className="mt-2 text-xs text-white/40">
                      Try a different search or filter.
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="grid gap-4 border-b border-white/[0.07] px-5 py-5 last:border-b-0 md:grid-cols-[1.1fr_1.5fr_1fr_.8fr_.8fr] md:items-center md:px-6"
                    >
                      <div>
                        <p className="text-xs font-medium">
                          {transaction.id}
                        </p>
                        <p className="mt-1 text-[9px] text-white/35 md:hidden">
                          {transaction.date}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium">
                          {transaction.title}
                        </p>
                        <p className="mt-1 text-[10px] text-white/40">
                          {transaction.subtitle}
                        </p>
                      </div>

                      <p className="hidden text-xs text-white/50 md:block">
                        {transaction.date}
                      </p>

                      <p
                        className={`text-sm font-semibold ${
                          transaction.type === "Credit"
                            ? "text-green-300"
                            : "text-white/80"
                        }`}
                      >
                        {transaction.type === "Credit" ? "+" : "−"}₹
                        {transaction.amount.toLocaleString("en-IN")}
                      </p>

                      <div>
                        <span
                          className={`inline-block rounded-full border px-3 py-1.5 text-[9px] ${statusStyle(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* NOTICE */}
            {notice && (
              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/[0.05] p-4 text-xs text-white/75">
                <span>{notice}</span>
                <button
                  onClick={() => setNotice("")}
                  className="text-white/40"
                >
                  ✕
                </button>
              </div>
            )}

            {/* FOOTER */}
            <footer className="mt-14 flex flex-wrap justify-between gap-3 border-t border-white/10 py-7 text-[9px] tracking-[.2em] text-white/30">
              <span>DROPNEST · FINANCIAL CENTRE</span>
              <Link
                href="/dashboard"
                className="hover:text-white"
              >
                Back to overview ↗
              </Link>
            </footer>

            <p className="mt-2 text-[9px] leading-5 text-white/25">
              Prototype notice: all transactions and balances shown here
              are illustrative demo data. No real payment processing,
              bank connection or payout is performed.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

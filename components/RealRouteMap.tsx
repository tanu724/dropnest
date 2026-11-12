
"use client";

import dynamic from "next/dynamic";

const RealRouteMapClient = dynamic(
  () => import("./RealRouteMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[350px] w-full items-center justify-center rounded-2xl border border-white/10 bg-[#080808] text-xs text-white/50 md:h-[430px]">
        Loading geographical map...
      </div>
    ),
  }
);

export default function RealRouteMap() {
  return <RealRouteMapClient />;
}

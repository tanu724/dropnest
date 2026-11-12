
"use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  ZoomControl,
} from "react-leaflet";

const route: [number, number][] = [
  [12.9716, 77.5946],
  [13.0707, 77.7982],
  [13.1367, 78.1292],
  [12.9165, 79.1325],
  [12.9675, 79.9418],
  [13.0827, 80.2707],
];

export default function RealRouteMapClient() {
  return (
    <div className="dropnest-dark-map relative h-[350px] w-full overflow-hidden rounded-2xl border border-white/10 md:h-[430px]">
      <MapContainer
        center={[13.02, 78.95]}
        zoom={7}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />

        <Polyline
          positions={route}
          pathOptions={{
            color: "#ffffff",
            weight: 4,
            opacity: 0.9,
          }}
        />

        <CircleMarker
          center={route[0]}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#ffffff",
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>
            <strong>Bengaluru</strong>
            <br />
            Origin · Karnataka
          </Popup>
        </CircleMarker>

        {route.slice(1, -1).map((point, index) => (
          <CircleMarker
            key={index}
            center={point}
            radius={4}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#999999",
              fillOpacity: 1,
              weight: 1,
            }}
          >
            <Popup>Route point {index + 1}</Popup>
          </CircleMarker>
        ))}

        <CircleMarker
          center={route[route.length - 1]}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#ffffff",
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>
            <strong>Chennai</strong>
            <br />
            Destination · Tamil Nadu
          </Popup>
        </CircleMarker>
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-lg border border-white/15 bg-black/90 px-4 py-3 backdrop-blur-md">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
          Active route
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          Bengaluru → Chennai
        </p>
        <p className="mt-1 text-[10px] text-white/45">
          Approx. 350 km · Demo route
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-lg border border-white/10 bg-black/85 px-3 py-2 text-[9px] tracking-wider text-white/55 backdrop-blur-md">
        OPENSTREETMAP · ILLUSTRATIVE ROUTE
      </div>
    </div>
  );
}

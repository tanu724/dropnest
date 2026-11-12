
import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import AppTheme from "@/components/AppTheme";
import GlobalButtonGlow from "@/components/GlobalButtonGlow";

export const metadata: Metadata = {
  title: "DropNest | Move. Store. Secure.",
  description:
    "A smarter way to move goods, share transportation and discover trusted storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppTheme />
        <GlobalButtonGlow />
        {children}
      </body>
    </html>
  );
}

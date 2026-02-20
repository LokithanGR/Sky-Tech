import "./globals.css";
import type { Metadata } from "next";
import SplashLoader from "../components/SplashLoader";

export const metadata: Metadata = {
  title: "Sky Tech",
  description: "CCTV, Inverter, Water Purifier - Sales, Service & Installation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-950">
        <SplashLoader />
        {children}
      </body>
    </html>
  );
}

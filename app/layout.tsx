import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aunty Sebi's Jewelry | Handcrafted Stories from Around the World",
  description:
    "Each piece carries the heritage of multiple cultures, united by artisan hands into singular works of wearable art. Explore handcrafted jewelry with immersive 3D storytelling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} bg-cream text-rich-black font-body antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

import { getAllPieces } from "@/lib/data";
import GlobePageClient from "@/components/GlobePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Pieces from Around the World | Aunty Sebi's Jewelry",
  description:
    "Discover handcrafted jewelry from Ghana, Iran, and Nigeria. Explore the origins of each piece on our interactive globe.",
};

export default function GlobePage() {
  const pieces = getAllPieces();

  return <GlobePageClient pieces={pieces} />;
}

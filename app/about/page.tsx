import type { Metadata } from "next";
import AboutPageClient from "@/components/AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Aunty Sebi's handcrafted jewelry. Learn about our artisan philosophy, cultural heritage, and commitment to honoring craft traditions from around the world.",
  openGraph: {
    title: "About Aunty Sebi's Jewelry",
    description:
      "The story behind Aunty Sebi's handcrafted jewelry. Learn about our artisan philosophy, cultural heritage, and commitment to honoring craft traditions from around the world.",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}

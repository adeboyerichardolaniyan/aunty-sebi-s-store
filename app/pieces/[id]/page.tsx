import { notFound } from "next/navigation";
import { getAllSlugs, getPieceBySlug } from "@/lib/data";
import ProductPageClient from "@/components/ProductPageClient";
import type { Metadata } from "next";

interface PageProps {
  params: { id: string };
  searchParams: { from?: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ id: slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const piece = getPieceBySlug(params.id);
  if (!piece) return { title: "Piece Not Found" };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: piece.currency,
    minimumFractionDigits: 0,
  }).format(piece.price);

  return {
    title: piece.name,
    description: piece.description,
    openGraph: {
      title: `${piece.name} — ${formattedPrice}`,
      description: piece.description,
    },
  };
}

export default function ProductPage({ params, searchParams }: PageProps) {
  const piece = getPieceBySlug(params.id);
  if (!piece) notFound();

  return (
    <ProductPageClient
      piece={piece}
      skipEntrance={searchParams.from === "globe"}
    />
  );
}

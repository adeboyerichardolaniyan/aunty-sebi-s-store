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

  return {
    title: `${piece.name} | Aunty Sebi's Jewelry`,
    description: piece.description,
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

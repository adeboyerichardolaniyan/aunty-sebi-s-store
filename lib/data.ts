import piecesData from "@/data/pieces.json";
import type { Piece, PiecesData } from "./types";

const data = piecesData as PiecesData;

export function getAllPieces(): Piece[] {
  return data.pieces;
}

export function getPieceBySlug(slug: string): Piece | undefined {
  return data.pieces.find((p) => p.slug === slug);
}

export function getPieceById(id: string): Piece | undefined {
  return data.pieces.find((p) => p.id === id);
}

export function getAllSlugs(): string[] {
  return data.pieces.map((p) => p.slug);
}

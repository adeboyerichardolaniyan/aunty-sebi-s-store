export interface Hotspot {
  id: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  title: string;
  story: string;
  component: string;
  materials: string[];
}

export interface Origin {
  country: string;
  city: string;
  lat: number;
  lng: number;
  regionStory: string;
}

export interface PieceDimensions {
  ringSize?: string;
  adjustable?: boolean;
  weight: string;
  materials: string[];
  length?: string;
  width?: string;
  height?: string;
}

export interface Piece {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  currency: string;
  modelUrl: string;
  modelScale?: number;
  modelRotation?: [number, number, number];
  images: string[];
  origin: Origin;
  description: string;
  culturalNarrative: string;
  hotspots: Hotspot[];
  dimensions: PieceDimensions;
  care: string;
}

export interface PiecesData {
  pieces: Piece[];
}

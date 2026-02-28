"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Piece, Hotspot } from "@/lib/types";
import StoryPanel from "./StoryPanel";
import ProductSidebar from "./ProductSidebar";
import ViewerErrorBoundary from "./ViewerErrorBoundary";

const ProductViewer3D = dynamic(() => import("./ProductViewer3D"), {
  ssr: false,
});

interface ProductPageClientProps {
  piece: Piece;
}

export default function ProductPageClient({ piece }: ProductPageClientProps) {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    setActiveHotspot(hotspot);
  }, []);

  const handleHotspotClose = useCallback(() => {
    setActiveHotspot(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* 3D Viewer — 70% on desktop, ~50vh on mobile */}
      <div className="relative w-full lg:w-[70%] h-[50vh] lg:h-screen lg:sticky lg:top-0">
        <ViewerErrorBoundary>
          <ProductViewer3D
            piece={piece}
            activeHotspot={activeHotspot}
            onHotspotClick={handleHotspotClick}
            onHotspotClose={handleHotspotClose}
          />
        </ViewerErrorBoundary>
      </div>

      {/* Product Info Sidebar — 30% on desktop */}
      <div className="w-full lg:w-[30%] lg:min-h-screen lg:overflow-y-auto">
        <ProductSidebar piece={piece} />
      </div>

      {/* Story Panel overlay */}
      <StoryPanel hotspot={activeHotspot} onClose={handleHotspotClose} />
    </div>
  );
}

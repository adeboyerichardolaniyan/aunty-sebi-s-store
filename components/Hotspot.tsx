"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { Hotspot as HotspotType } from "@/lib/types";

interface HotspotProps {
  hotspot: HotspotType;
  isActive: boolean;
  isDimmed: boolean;
  onClick: (hotspot: HotspotType) => void;
}

export default function Hotspot({
  hotspot,
  isActive,
  isDimmed,
  onClick,
}: HotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();

    if (isActive) {
      meshRef.current.scale.setScalar(1.3);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 1;
    } else if (isDimmed) {
      meshRef.current.scale.setScalar(1.0);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2;
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 0.2;
    } else {
      // Idle pulsing animation — 2s cycle
      const pulse = Math.sin(t * Math.PI) * 0.5 + 0.5; // 0-1 over ~2s
      const scale = 1.0 + pulse * 0.1;
      const opacity = 0.8 + pulse * 0.2;
      meshRef.current.scale.setScalar(hovered ? 1.15 : scale);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + pulse * 0.3;
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = opacity;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={hotspot.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(hotspot);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshStandardMaterial
        color="#CD7F32"
        emissive="#CD7F32"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </mesh>
  );
}

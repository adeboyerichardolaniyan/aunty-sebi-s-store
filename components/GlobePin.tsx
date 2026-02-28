"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor, Line } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/globe-utils";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASING } from "@/lib/timing";
import type { Piece } from "@/lib/types";

const STALK_HEIGHT = 1.8;
const UP = new THREE.Vector3(0, 1, 0);

interface GlobePinProps {
  piece: Piece;
  index: number;
  isFlying: boolean;
  isFlyTarget: boolean;
  onHover: (piece: Piece | null, worldPos: THREE.Vector3 | null) => void;
  onClick: (piece: Piece) => void;
}

const AnimatedGroup = animated.group;

export default function GlobePin({
  piece,
  index,
  isFlying,
  isFlyTarget,
  onHover,
  onClick,
}: GlobePinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  useCursor(hovered && !isFlying);

  // Surface position (base of stalk)
  const surfacePos = useMemo(
    () => latLngToVector3(piece.origin.lat, piece.origin.lng),
    [piece.origin.lat, piece.origin.lng]
  );

  // Pin position (tip of stalk — straight up from surface)
  const pinPos = useMemo(
    () => surfacePos.clone().add(UP.clone().multiplyScalar(STALK_HEIGHT)),
    [surfacePos]
  );

  // Line points: from surface to pin tip
  const linePoints = useMemo(
    () => [surfacePos, pinPos] as [THREE.Vector3, THREE.Vector3],
    [surfacePos, pinPos]
  );

  // Staggered entrance animation
  const { scale: entranceScale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    delay: prefersReduced ? 0 : 300 + index * 150,
    config: prefersReduced
      ? { duration: 0 }
      : {
          mass: EASING.spring.mass,
          tension: EASING.spring.tension,
          friction: EASING.spring.friction,
        },
  });

  // Pulsing and fly state via useFrame
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    if (isFlying && !isFlyTarget) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.08);
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        0,
        0.08
      );
      return;
    }

    if (isFlying && isFlyTarget) {
      mat.emissiveIntensity = 2.0;
      mat.opacity = 1;
      meshRef.current.scale.setScalar(1.5);
      return;
    }

    // Idle pulsing
    const t = clock.getElapsedTime();
    const pulse = Math.sin(t * Math.PI + index * 0.7) * 0.5 + 0.5;

    if (hovered) {
      meshRef.current.scale.setScalar(1.3);
      mat.emissiveIntensity = 1.2;
      mat.opacity = 1;
    } else {
      const scale = 1.0 + pulse * 0.1;
      meshRef.current.scale.setScalar(scale);
      mat.emissiveIntensity = 0.6 + pulse * 0.4;
      mat.opacity = 0.85 + pulse * 0.15;
    }
  });

  return (
    <AnimatedGroup scale={entranceScale}>
      {/* Stalk line */}
      <Line
        points={linePoints}
        color="#ffffff"
        lineWidth={1.5}
        transparent
        opacity={0.7}
      />

      {/* Pin head */}
      <mesh
        ref={meshRef}
        position={[pinPos.x, pinPos.y, pinPos.z]}
        onClick={(e) => {
          e.stopPropagation();
          if (!isFlying) onClick(piece);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!isFlying) {
            setHovered(true);
            onHover(piece, pinPos);
          }
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null, null);
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>

      {/* Small dot at base on globe surface */}
      <mesh position={[surfacePos.x, surfacePos.y, surfacePos.z]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </AnimatedGroup>
  );
}

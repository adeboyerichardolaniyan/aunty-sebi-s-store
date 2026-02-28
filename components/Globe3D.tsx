"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { GLOBE_RADIUS, GLOBE_CAMERA_DISTANCE, latLngToVector3 } from "@/lib/globe-utils";
import { useReducedMotion } from "@/lib/useReducedMotion";
import GlobePin from "./GlobePin";
import GlobeTooltip from "./GlobeTooltip";
import type { Piece } from "@/lib/types";

// --- Inner scene components (must be inside Canvas) ---

function EarthSphere() {
  const earthMap = useTexture("/textures/earth.jpg");

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <meshBasicMaterial map={earthMap} />
    </mesh>
  );
}

function GlobeAtmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.015, 64, 64]} />
      <meshPhongMaterial
        color="#4da6ff"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

interface GlobeSceneProps {
  pieces: Piece[];
  flyingToPiece: Piece | null;
  onPinHover: (piece: Piece | null, worldPos: THREE.Vector3 | null) => void;
  onPinClick: (piece: Piece) => void;
  onFlyComplete: (slug: string) => void;
  onCameraReady: (camera: THREE.Camera) => void;
}

function GlobeScene({
  pieces,
  flyingToPiece,
  onPinHover,
  onPinClick,
  onFlyComplete,
  onCameraReady,
}: GlobeSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const globeGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const prefersReduced = useReducedMotion();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Report camera to parent for tooltip projection
  useEffect(() => {
    onCameraReady(camera);
  }, [camera, onCameraReady]);

  // Globe entrance animation
  const { scale: globeScale } = useSpring({
    from: { scale: prefersReduced ? 1 : 0.3 },
    to: { scale: 1 },
    config: prefersReduced
      ? { duration: 0 }
      : { mass: 1, tension: 120, friction: 20 },
  });

  // Fly animation when a pin is clicked
  useEffect(() => {
    if (!flyingToPiece || !controlsRef.current) return;

    if (prefersReduced) {
      onFlyComplete(flyingToPiece.slug);
      return;
    }

    const controls = controlsRef.current;
    controls.autoRotate = false;
    controls.enabled = false;

    const pinPos = latLngToVector3(
      flyingToPiece.origin.lat,
      flyingToPiece.origin.lng
    );

    // Camera flies to just above the pin
    const flyTarget = pinPos.clone().normalize().multiplyScalar(GLOBE_RADIUS);
    const flyCamera = pinPos
      .clone()
      .normalize()
      .multiplyScalar(GLOBE_RADIUS + 1.2);

    const tl = gsap.timeline({
      onUpdate: () => controls.update(),
    });
    timelineRef.current = tl;

    // Phase 1: Zoom toward pin (0–0.8s)
    tl.to(
      camera.position,
      {
        x: flyCamera.x,
        y: flyCamera.y,
        z: flyCamera.z,
        duration: 0.8,
        ease: "power2.inOut",
      },
      0
    );
    tl.to(
      controls.target,
      {
        x: flyTarget.x,
        y: flyTarget.y,
        z: flyTarget.z,
        duration: 0.8,
        ease: "power2.inOut",
      },
      0
    );

    // Phase 2: Fade globe group (0.6–1.2s)
    if (globeGroupRef.current) {
      globeGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.transparent === undefined) mat.transparent = true;
          tl.to(
            mat,
            {
              opacity: 0,
              duration: 0.6,
              ease: "power2.in",
            },
            0.6
          );
        }
      });
    }

    // Phase 3: Navigate after animation
    tl.call(
      () => {
        onFlyComplete(flyingToPiece.slug);
      },
      [],
      1.4
    );

    return () => {
      timelineRef.current?.kill();
    };
  }, [flyingToPiece, camera, prefersReduced, onFlyComplete]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.5}
        color="#FAF8F3"
      />
      <directionalLight
        position={[-5, -2, -5]}
        intensity={0.8}
        color="#F5E6D3"
      />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#FAF8F3" />

      {/* Globe */}
      <animated.group ref={globeGroupRef} scale={globeScale}>
        <EarthSphere />
        <GlobeAtmosphere />

        {/* Pins */}
        {pieces.map((piece, i) => (
          <GlobePin
            key={piece.id}
            piece={piece}
            index={i}
            isFlying={!!flyingToPiece}
            isFlyTarget={flyingToPiece?.id === piece.id}
            onHover={onPinHover}
            onClick={onPinClick}
          />
        ))}
      </animated.group>

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        autoRotate
        autoRotateSpeed={0.3}
        enablePan={false}
        minDistance={3}
        maxDistance={20}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

// --- Main exported component ---

interface Globe3DProps {
  pieces: Piece[];
  onNavigate: (slug: string) => void;
}

export default function Globe3D({ pieces, onNavigate }: Globe3DProps) {
  const [hoveredPiece, setHoveredPiece] = useState<Piece | null>(null);
  const [hoveredWorldPos, setHoveredWorldPos] =
    useState<THREE.Vector3 | null>(null);
  const [flyingToPiece, setFlyingToPiece] = useState<Piece | null>(null);
  const [threeCamera, setThreeCamera] = useState<THREE.Camera | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Track container size for tooltip projection
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setCanvasSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePinHover = useCallback(
    (piece: Piece | null, worldPos: THREE.Vector3 | null) => {
      setHoveredPiece(piece);
      setHoveredWorldPos(worldPos);
    },
    []
  );

  const handlePinClick = useCallback((piece: Piece) => {
    setFlyingToPiece(piece);
    setHoveredPiece(null);
  }, []);

  const handleFlyComplete = useCallback(
    (slug: string) => {
      onNavigate(slug);
    },
    [onNavigate]
  );

  const handleCameraReady = useCallback((camera: THREE.Camera) => {
    setThreeCamera(camera);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        camera={{
          position: [0, 0, GLOBE_CAMERA_DISTANCE],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <GlobeScene
          pieces={pieces}
          flyingToPiece={flyingToPiece}
          onPinHover={handlePinHover}
          onPinClick={handlePinClick}
          onFlyComplete={handleFlyComplete}
          onCameraReady={handleCameraReady}
        />
      </Canvas>

      {/* Tooltip overlay (outside Canvas, in screen space) */}
      {hoveredPiece && hoveredWorldPos && threeCamera && canvasSize.width > 0 && (
        <GlobeTooltip
          piece={hoveredPiece}
          worldPosition={hoveredWorldPos}
          camera={threeCamera}
          canvasSize={canvasSize}
        />
      )}
    </div>
  );
}

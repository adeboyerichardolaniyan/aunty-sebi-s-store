"use client";

import { Suspense, useRef, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Piece, Hotspot as HotspotType } from "@/lib/types";
import {
  animateCamera,
  resetCamera,
  DEFAULT_CAMERA_POSITION,
} from "@/lib/three-helpers";
import { useReducedMotion } from "@/lib/useReducedMotion";
import Hotspot from "./Hotspot";
import LoadingState from "./LoadingState";

interface JewelryModelProps {
  piece: Piece;
  activeHotspot: HotspotType | null;
}

function JewelryModel({ piece, activeHotspot }: JewelryModelProps) {
  const { scene } = useGLTF(piece.modelUrl);
  const modelRef = useRef<THREE.Group>(null);

  // Make all materials transparent-capable on mount
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.needsUpdate = true;
      }
    });
  }, [scene]);

  // Isolation mode: fade model when hotspot is active
  useEffect(() => {
    const targetOpacity = activeHotspot ? 0.4 : 1.0;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.opacity = targetOpacity;
      }
    });
  }, [activeHotspot, scene]);

  return (
    <Center>
      <group
        ref={modelRef}
        scale={piece.modelScale ?? 1}
        rotation={
          piece.modelRotation
            ? (piece.modelRotation.map(
                (r) => (r * Math.PI) / 180
              ) as [number, number, number])
            : undefined
        }
      >
        <primitive object={scene} />
      </group>
    </Center>
  );
}

interface SceneProps {
  piece: Piece;
  activeHotspot: HotspotType | null;
  onHotspotClick: (hotspot: HotspotType) => void;
  onHotspotClose: () => void;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  prefersReducedMotion: boolean;
}

function Scene({
  piece,
  activeHotspot,
  onHotspotClick,
  onHotspotClose,
  controlsRef,
  prefersReducedMotion,
}: SceneProps) {
  const { camera } = useThree();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Kill active GSAP timeline on unmount
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const handleHotspotClick = useCallback(
    (hotspot: HotspotType) => {
      if (!controlsRef.current) return;

      // Kill any in-flight animation
      timelineRef.current?.kill();

      const duration = prefersReducedMotion ? 0.1 : 1.2;
      const resetDuration = prefersReducedMotion ? 0.1 : 1.0;

      if (activeHotspot?.id === hotspot.id) {
        onHotspotClose();
        timelineRef.current = resetCamera(camera, controlsRef.current, undefined, resetDuration, () => {
          if (controlsRef.current) {
            controlsRef.current.autoRotate = true;
          }
        });
        return;
      }

      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      timelineRef.current = animateCamera(
        camera,
        controlsRef.current,
        hotspot.cameraPosition,
        hotspot.cameraTarget,
        duration,
        () => {
          onHotspotClick(hotspot);
        }
      );
    },
    [activeHotspot, camera, controlsRef, onHotspotClick, onHotspotClose, prefersReducedMotion]
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 2, -5]} intensity={0.6} />
      <spotLight position={[0, 10, 0]} intensity={0.3} penumbra={1} />
      <Environment preset="studio" />
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Model */}
      <JewelryModel piece={piece} activeHotspot={activeHotspot} />

      {/* Hotspots */}
      {piece.hotspots.map((hs) => (
        <Hotspot
          key={hs.id}
          hotspot={hs}
          isActive={activeHotspot?.id === hs.id}
          isDimmed={activeHotspot !== null && activeHotspot.id !== hs.id}
          onClick={handleHotspotClick}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        minDistance={1.5}
        maxDistance={5}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  );
}

function LoadingOverlay() {
  const { progress, active } = useProgress();
  return <LoadingState isLoading={active} progress={progress} />;
}

interface ProductViewer3DProps {
  piece: Piece;
  activeHotspot: HotspotType | null;
  onHotspotClick: (hotspot: HotspotType) => void;
  onHotspotClose: () => void;
}

export default function ProductViewer3D({
  piece,
  activeHotspot,
  onHotspotClick,
  onHotspotClose,
}: ProductViewer3DProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <LoadingOverlay />
      <Canvas
        camera={{
          position: [
            DEFAULT_CAMERA_POSITION.x,
            DEFAULT_CAMERA_POSITION.y,
            DEFAULT_CAMERA_POSITION.z,
          ],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene
            piece={piece}
            activeHotspot={activeHotspot}
            onHotspotClick={onHotspotClick}
            onHotspotClose={onHotspotClose}
            controlsRef={controlsRef}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

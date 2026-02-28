"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Center,
  useGLTF,
} from "@react-three/drei";

function PreviewModel() {
  const { scene } = useGLTF("/models/jewelry.glb");
  return (
    <Center>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.3}>
        <primitive object={scene} />
      </Float>
    </Center>
  );
}

export default function HeroPreview3D() {
  return (
    <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-3, 2, -5]} intensity={0.4} />
          <Environment preset="studio" />
          <PreviewModel />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

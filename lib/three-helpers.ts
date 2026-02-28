import * as THREE from "three";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 0, 3.5);
export const DEFAULT_CAMERA_TARGET = new THREE.Vector3(0, 0, 0);

export function animateCamera(
  camera: THREE.Camera,
  controls: OrbitControlsImpl,
  targetPos: THREE.Vector3 | [number, number, number],
  lookAtTarget: THREE.Vector3 | [number, number, number],
  duration = 1.2,
  onComplete?: () => void
) {
  const pos =
    targetPos instanceof THREE.Vector3
      ? targetPos
      : new THREE.Vector3(...targetPos);
  const target =
    lookAtTarget instanceof THREE.Vector3
      ? lookAtTarget
      : new THREE.Vector3(...lookAtTarget);

  controls.enabled = false;

  const tl = gsap.timeline({
    onComplete: () => {
      controls.enabled = true;
      onComplete?.();
    },
    onUpdate: () => {
      controls.update();
    },
  });

  tl.to(
    camera.position,
    {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      duration,
      ease: "power2.inOut",
    },
    0
  );

  tl.to(
    controls.target,
    {
      x: target.x,
      y: target.y,
      z: target.z,
      duration,
      ease: "power2.inOut",
    },
    0
  );

  return tl;
}

export function resetCamera(
  camera: THREE.Camera,
  controls: OrbitControlsImpl,
  defaults?: {
    position?: THREE.Vector3;
    target?: THREE.Vector3;
  },
  duration = 1.0,
  onComplete?: () => void
) {
  const pos = defaults?.position ?? DEFAULT_CAMERA_POSITION;
  const target = defaults?.target ?? DEFAULT_CAMERA_TARGET;

  return animateCamera(camera, controls, pos, target, duration, onComplete);
}

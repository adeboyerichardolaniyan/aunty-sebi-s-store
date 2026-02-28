import * as THREE from "three";

export const GLOBE_RADIUS = 2.0;
export const GLOBE_CAMERA_DISTANCE = 7.0;

/**
 * Converts geographic coordinates (latitude/longitude) to a 3D position
 * on the surface of a sphere.
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = GLOBE_RADIUS
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

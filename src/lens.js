/** Radial source displacement for a convex spherical lens, in units of radius.
 * Snell's law sets the ray deflection; sphere depth tapers to zero at the rim.
 * A clear central window transitions into the curved outer shell.
 */
export function sphereDisplacement(radius) {
  const r = Math.max(0, Math.min(1, radius));
  if (r === 0 || r === 1) return 0;
  const depth = Math.sqrt(Math.max(0, 1 - r * r));
  const deflection = Math.asin(r) - Math.asin(r / 1.45);
  const edge = Math.max(0, Math.min(1, (r - .30) / .50));
  const shell = edge * edge * (3 - 2 * edge);
  return -.75 * shell * depth * Math.tan(deflection);
}

/** Edge refraction adapted from Neel Dedkawala's MIT-licensed shader.
 * Use the original convex-surface profile for the live backdrop as well as
 * the WebGL lighting. A flatter crown and narrower curved shell preserve
 * central dashboard text while the outer meniscus wraps it around the rim.
 */
export function glassDisplacement(radius) {
  const r = Math.max(0, Math.min(1, radius));
  if (r === 0 || r === 1) return 0;
  const distance = (1 - r) * 43;
  const u = distance / 58;
  const arc = Math.max(0, 1 - (1 - u) ** 16);
  const height = 31 * Math.sqrt(arc);
  const slope = (31 / 58) * (1 - u) ** 15 / Math.max(Math.sqrt(arc), .05);
  const incidence = Math.atan(slope);
  const transmission = Math.asin(Math.sin(incidence) / 3.05);
  return -height * Math.tan(incidence - transmission) * 1.5 / 43;
}

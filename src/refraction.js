/** Live backdrop refraction, progressively enhanced through an inline SVG filter.
 * No DOM capture or remote textures: the browser composites the actual backdrop.
 */
export class GlassRefraction {
  constructor(host) {
    this.host = host;
    const id = `siri-glass-${Math.random().toString(36).slice(2)}`;
    const map = document.createElement('canvas');
    const size = 256;
    map.width = map.height = size;
    const context = map.getContext('2d');
    if (!context) return;
    const pixels = context.createImageData(size, size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const nx = (x + .5) / (size / 2) - 1, ny = (y + .5) / (size / 2) - 1;
      const r = Math.hypot(nx, ny);
      // Keep the central window legible, then compress the sampled scene
      // rapidly around the curved perimeter. Unlike a bell-shaped bump,
      // displacement does not return to zero at the rim.
      const edge = Math.max(0, Math.min(1, (r - .30) / .70));
      const curvature = edge * edge * (3 - 2 * edge);
      const bend = r < 1 ? Math.min(.98, r * curvature) : 0;
      const i = (y * size + x) * 4;
      pixels.data.set([128 - nx / Math.max(r, .001) * bend * 127,
        128 - ny / Math.max(r, .001) * bend * 127, 128, 255], i);
    }
    context.putImageData(pixels, 0, 0);
    const ns = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(ns, 'svg');
    this.svg.setAttribute('width', '0'); this.svg.setAttribute('height', '0');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.style.position = 'absolute';
    this.svg.innerHTML = `<defs><filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage width="100%" height="100%" preserveAspectRatio="none" result="lens"/><feDisplacementMap in="SourceGraphic" in2="lens" xChannelSelector="R" yChannelSelector="G" scale="64"/></filter></defs>`;
    this.svg.querySelector('feImage').setAttribute('href', map.toDataURL());
    this.displace = this.svg.querySelector('feDisplacementMap');
    this.el = document.createElement('div');
    this.el.className = 'siri-island-refraction';
    this.el.setAttribute('aria-hidden', 'true');
    this.el.style.backdropFilter = `url(#${id})`;
    this.el.style.webkitBackdropFilter = `url(#${id})`;
    host.prepend(this.svg, this.el);
  }

  update(amount, ready) {
    if (!this.el) return;
    if (this.amount !== amount) { this.displace.setAttribute('scale', String(amount)); this.amount = amount; }
    this.el.style.visibility = ready && amount > 0 ? 'visible' : 'hidden';
  }
}

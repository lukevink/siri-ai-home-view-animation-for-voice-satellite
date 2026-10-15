import { glassDisplacement } from './lens.js';

const MAP_RANGE = 0.31; // Use most of the 8-bit channel range to avoid visible steps.

/** Live backdrop refraction, progressively enhanced through an inline SVG filter.
 * No DOM capture or remote textures: the browser composites the actual backdrop.
 */
export class GlassRefraction {
  constructor(host) {
    this.host = host;
    const id = `siri-glass-${Math.random().toString(36).slice(2)}`;
    const ns = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(ns, 'svg');
    this.svg.setAttribute('width', '0'); this.svg.setAttribute('height', '0');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.style.position = 'absolute';
    this.svg.innerHTML = `<defs><filter id="${id}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="0" y="0" color-interpolation-filters="sRGB"><feImage x="0" y="0" preserveAspectRatio="none" result="lens"/><feDisplacementMap in="SourceGraphic" in2="lens" xChannelSelector="R" yChannelSelector="G" scale="64"/></filter></defs>`;
    this.filter = this.svg.querySelector('filter');
    this.mapImage = this.svg.querySelector('feImage');
    this.displace = this.svg.querySelector('feDisplacementMap');
    this.el = document.createElement('div');
    this.el.className = 'siri-island-refraction';
    this.el.setAttribute('aria-hidden', 'true');
    this.el.style.backdropFilter = `url(#${id})`;
    this.el.style.webkitBackdropFilter = `url(#${id})`;
    host.prepend(this.svg, this.el);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.el);
  }

  resize() {
    const width = this.el.clientWidth, height = this.el.clientHeight;
    if (!width || !height || (width === this.width && height === this.height)) return;
    this.width = width; this.height = height;
    this.diameter = Math.max(width, height);
    const map = document.createElement('canvas');
    const size = 512;
    map.width = map.height = size;
    const context = map.getContext('2d');
    if (!context) return;
    const pixels = context.createImageData(size, size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const nx = (x + .5) / (size / 2) - 1, ny = (y + .5) / (size / 2) - 1;
      const r = Math.hypot(nx, ny);
      const bend = r > 0 && r < 1 ? glassDisplacement(r) / r : 0;
      // SVG displacement samples source at destination + scale * (channel - .5).
      // Encode each axis in its own radius so resizing and island aspect ratios
      // retain the same optical curvature rather than a fixed pixel shift.
      pixels.data.set([
        Math.round(255 * (.5 + nx * bend * width / this.diameter / (2 * MAP_RANGE))),
        Math.round(255 * (.5 + ny * bend * height / this.diameter / (2 * MAP_RANGE))),
        128, 255,
      ], (y * size + x) * 4);
    }
    context.putImageData(pixels, 0, 0);
    this.mapImage.setAttribute('href', map.toDataURL());
    // Explicit pixel bounds: percentage feImage sizes can resolve against the
    // SVG viewport, producing a translated crop instead of a centered lens.
    for (const node of [this.filter, this.mapImage]) {
      node.setAttribute('width', String(width)); node.setAttribute('height', String(height));
    }
    this.setScale();
  }

  setScale() {
    this.displace.setAttribute('scale', String((this.amount ?? 64) / 64 * (this.diameter || 0) * MAP_RANGE));
  }

  update(amount, ready) {
    if (!this.el) return;
    if (this.amount !== amount) { this.amount = amount; this.setScale(); }
    this.el.style.visibility = ready && amount > 0 ? 'visible' : 'hidden';
  }

  dispose() { this.resizeObserver?.disconnect(); }
}

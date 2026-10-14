/** Live backdrop refraction, progressively enhanced through an inline SVG filter.
 * No DOM capture or remote textures: the browser composites the actual backdrop.
 */
export class GlassRefraction {
  constructor(host) {
    this.host = host;
    const id = `siri-glass-${Math.random().toString(36).slice(2)}`;
    const map = document.createElement('canvas');
    map.width = map.height = 128;
    const context = map.getContext('2d');
    if (!context) return;
    const pixels = context.createImageData(128, 128);
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
      const nx = (x + .5) / 64 - 1, ny = (y + .5) / 64 - 1;
      const r = Math.hypot(nx, ny);
      const bend = r < 1 ? Math.pow(r, 3) * Math.sqrt(1 - r) * 4 : 0;
      const i = (y * 128 + x) * 4;
      pixels.data.set([128 - nx / Math.max(r, .001) * bend * 127,
        128 - ny / Math.max(r, .001) * bend * 127, 128, 255], i);
    }
    context.putImageData(pixels, 0, 0);
    const ns = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(ns, 'svg');
    this.svg.setAttribute('width', '0'); this.svg.setAttribute('height', '0');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.style.position = 'absolute';
    this.svg.innerHTML = `<defs><filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage width="100%" height="100%" preserveAspectRatio="none" result="lens"/><feDisplacementMap in="SourceGraphic" in2="lens" xChannelSelector="R" yChannelSelector="G" scale="18"/></filter></defs>`;
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

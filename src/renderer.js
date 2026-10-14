import { fragmentShader } from './shader.js';
import { Spring } from './state.js';

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const COLORS = ['002fff', '00ffde', 'fa1f1f', 'ff930d', '9900ff', '00ff88'];
const VALUES = {
  u_introStartAmp: 0.20, u_scaleRatio: 3.8, u_bezelWidth: 58,
  u_glassThickness: 31, u_ior: 3.05, u_dispersionScale: 2,
  u_surfaceCurvature: 8, u_absorption: 0, u_showBackground: 1,
  u_topMorphUp: 4.5, u_waveRefract: 6.3, u_waveDispersion: 15,
  u_waveEdgeBand: 4.5, u_wavePower: 1.55, u_bottomRimIntensity: 0.97,
  u_bottomRimWidth: 1.4, xScale: 1.6, yScale: 0.11,
  phaseDistance: -4.1, lineThickness: 0.056, pinTaper: 2.8,
  spindleWidth: 2.3, glowFalloff: 1.5, glowIntensity: 1.15,
  edgeFade: 0.42, hotCoreThreshold: 7.2, hotCoreIntensity: 3.2,
  fillOpacity: 1, u_bgCrossFade: 0,
};

/** Original GLSL effect, rendered into a small canvas without Three.js. */
export class IslandRenderer {
  constructor(canvas, onContextLost) {
    this.canvas = canvas;
    this.spring = new Spring();
    this.time = 0;
    this.fade = 0;
    this.intro = 0;
    this.level = 0;
    this.drop = 0;
    this.thinking = 0;
    this.locations = new Map();
    this.shaders = [];
    const gl = canvas.getContext('webgl', {
      alpha: true, antialias: true, premultipliedAlpha: false,
      depth: false, stencil: false, powerPreference: 'low-power',
    });
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl;
    this.contextLost = (event) => { event.preventDefault(); onContextLost(); };
    canvas.addEventListener('webglcontextlost', this.contextLost);
    try {
      if (!gl.getExtension('OES_standard_derivatives')) throw new Error('Shader derivatives unavailable');
      this.program = gl.createProgram();
      for (const [type, source] of [[gl.VERTEX_SHADER, vertexShader], [gl.FRAGMENT_SHADER, fragmentShader]]) {
        const shader = gl.createShader(type);
        this.shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
        gl.attachShader(this.program, shader);
      }
      gl.linkProgram(this.program);
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this.program));
      gl.useProgram(this.program);
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(this.program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      for (const [name, value] of Object.entries(VALUES)) this.float(name, value);
      gl.uniform2f(this.location('u_resolution'), 144, 112);
      gl.uniform4f(this.location('u_shapeParams'), 53, 41, 0.01, 0);
      gl.uniform3f(this.location('u_glassTint'), 0.94, 0.96, 1);
      gl.uniform1i(this.location('activeWaves'), 6);
      gl.uniform3fv(this.location('uColors[0]'), COLORS.flatMap(hex => {
        const n = parseInt(hex, 16);
        return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
      }));
      this.createEnvironment();
      this.resize();
    } catch (error) {
      this.dispose();
      throw error;
    }
  }

  location(name) {
    if (!this.locations.has(name)) this.locations.set(name, this.gl.getUniformLocation(this.program, name));
    return this.locations.get(name);
  }

  float(name, value) { this.gl.uniform1f(this.location(name), value); }

  createEnvironment() {
    // A local studio-light texture replaces the demo's wallpaper. WebGL cannot
    // sample live dashboard HTML; this deliberately makes no screenshot capture.
    const gl = this.gl;
    const size = 128;
    const pixels = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size, v = y / size;
        const light = 15 + 90 * Math.exp(-((u - 0.65) ** 2 * 10 + (v - 0.75) ** 2 * 5));
        const i = (y * size + x) * 4;
        pixels.set([light * 0.84, light * 0.94, light * 1.07, 255], i);
      }
    }
    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    for (const name of ['u_bgTexture', 'u_bgTextureNext']) gl.uniform1i(this.location(name), 0);
    for (const name of ['u_bgScale', 'u_bgNextScale']) gl.uniform2f(this.location(name), 1, 1);
    for (const name of ['u_bgOffset', 'u_bgNextOffset']) gl.uniform2f(this.location(name), 0, 0);
  }

  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.clientWidth || 240;
    const height = this.canvas.clientHeight || width * 112 / 144;
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.location('u_resolution'), 144, height / width * 144);
    this.float('u_top', Math.max(0, height / width * 144 - 112));
  }

  reset() {
    this.spring.value = this.spring.velocity = this.fade = this.intro = this.time = this.level = this.drop = this.thinking = 0;
    this.drop = 0;
    this.thinking = 0;
  }

  render(delta, { state, level, reducedMotion = false, circle = false, opacity = 0.14, bottomGlow = 0.8, entrance = true, bulgeWidth = 1, bulgeStretch = 1, elapsed = delta }) {
    const active = state !== 'idle';
    const liquidMotion = !reducedMotion && entrance;
    this.drop = Math.max(0, Math.min(1, this.drop + (active ? 1 : -1) * elapsed / (active ? 0.52 : 0.8)));
    // Keep the orb full-sized while it rises. Collapse only after it has
    // merged into the bezel, rather than shrinking to a pill in mid-air.
    this.spring.target = active || (liquidMotion && this.drop > 0) ? 1 : 0;
    this.thinking = Math.max(0, Math.min(1,
      this.thinking + (state === 'processing' ? 1 : -1) * elapsed / 0.55));
    this.float('u_drop', reducedMotion || !entrance ? 1 : this.drop);
    this.float('u_circle', Number(circle));
    this.float('u_bulgeWidth', bulgeWidth);
    this.float('u_bulgeStretch', bulgeStretch);
    this.float('u_bodyOpacity', opacity);
    this.float('u_bottomGlow', bottomGlow);
    this.float('u_thinking', reducedMotion ? Number(state === 'processing') : this.thinking);
    const progress = reducedMotion ? Number(active) : this.spring.update(delta);
    this.level += (level - this.level) * (1 - Math.exp(-delta * (level > this.level ? 18 : 7)));
    if (active && progress > 0.98) {
      this.fade = Math.min(1, this.fade + delta / 0.3);
      this.intro = Math.min(1, this.intro + delta / 0.65);
    } else if (!active) {
      this.fade = Math.max(0, this.fade - delta / 0.16);
    }
    this.time -= delta * (state === 'processing' ? 1.2 : 2.7 + this.level * 1.6);
    this.float('u_progress', Math.max(0, Math.min(1.07, progress)));
    this.float('u_waveFade', reducedMotion ? Number(active) : this.fade);
    this.float('u_waveIntro', reducedMotion ? 1 : this.intro);
    this.float('u_time', reducedMotion ? -1.8 : this.time);
    this.float('yScale', reducedMotion ? 0.11 : (state === 'processing' ? 0.065 : 0.085 + this.level * 0.13));
    this.float('glowIntensity', 1.15 + (reducedMotion ? 0 : this.level * 0.25));
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    return liquidMotion ? active || this.drop > 0 : active || progress > 0.002 || Math.abs(this.spring.velocity) > 0.002;
  }

  dispose() {
    const gl = this.gl;
    this.canvas.removeEventListener('webglcontextlost', this.contextLost);
    for (const shader of this.shaders) gl.deleteShader(shader);
    if (this.buffer) gl.deleteBuffer(this.buffer);
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.program) gl.deleteProgram(this.program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

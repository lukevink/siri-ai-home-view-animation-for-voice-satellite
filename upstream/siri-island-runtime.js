/*! Shader attribution:
MIT License

Copyright (c) 2026 Neel Dedkawala

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

// src/island.css
var island_default = '/* Scoped to the opt-in host: other Voice Satellite skins stay untouched. */\n#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar,\n#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar::before,\n#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar::after {\n  opacity: 0 !important;\n  animation: none !important;\n  filter: none !important;\n  pointer-events: none !important;\n}\n#voice-satellite-ui.siri-island-enabled .vs-blur-overlay {\n  backdrop-filter: blur(var(--siri-island-backdrop-blur, 2px));\n  -webkit-backdrop-filter: blur(var(--siri-island-backdrop-blur, 2px));\n}\n#voice-satellite-ui .siri-island {\n  position: fixed;\n  top: calc(env(safe-area-inset-top, 0px) + var(--siri-island-top, 20px));\n  left: 50%;\n  width: min(var(--siri-island-width, 240px), 80vw);\n  transform: translateX(-50%);\n  z-index: 10002;\n  pointer-events: none;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 180ms ease, visibility 180ms;\n  contain: layout style;\n}\n#voice-satellite-ui .siri-island[data-visible="true"] { opacity: 1; visibility: visible; }\n#voice-satellite-ui .siri-island canvas { width: 100%; aspect-ratio: 144 / 112; display: block; }\n#voice-satellite-ui .siri-island-label {\n  display: block;\n  color: var(--siri-island-label-color, #f3f4fb);\n  background: rgba(12, 15, 24, 0.82);\n  border: 1px solid rgba(255,255,255,.1);\n  border-radius: 30px;\n  padding: 6px 14px;\n  width: max-content;\n  max-width: 100%;\n  box-sizing: border-box;\n  margin: -5px auto 0;\n  text-align: center;\n  font: 500 12px/1.3 system-ui, sans-serif;\n  letter-spacing: .02em;\n}\n#voice-satellite-ui .siri-island-fallback {\n  display: none;\n  height: 132px;\n  margin: 24px 12%;\n  border-radius: 42%;\n  border: 1px solid #8a8eaa;\n  background: radial-gradient(ellipse at 55% 60%, #47475e, #080912 70%);\n  box-shadow: inset 0 -2px 4px #cdd9e5, 0 16px 35px #0004;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n}\n#voice-satellite-ui .siri-island-fallback i {\n  width: 15px; height: 22px; border-radius: 50%;\n  background: #005fff; box-shadow: 0 0 18px currentColor;\n}\n#voice-satellite-ui .siri-island-fallback i:nth-child(2) { background: #00ffde; height: 36px; }\n#voice-satellite-ui .siri-island-fallback i:nth-child(3) { background: #fa1f1f; height: 30px; }\n#voice-satellite-ui .siri-island-fallback i:nth-child(4) { background: #ff930d; height: 18px; }\n#voice-satellite-ui .siri-island[data-renderer="fallback"] canvas { display: none; }\n#voice-satellite-ui .siri-island[data-renderer="fallback"] .siri-island-fallback { display: flex; }\n@media (max-height: 540px) {\n  #voice-satellite-ui .siri-island { width: min(var(--siri-island-width, 170px), 40vw); }\n}\n@media (prefers-reduced-motion: reduce) {\n  #voice-satellite-ui .siri-island { transition: none; }\n}\n';

// src/shader.js
var fragmentShader = `
#extension GL_OES_standard_derivatives : enable

            precision highp float;

            uniform float u_time;
            uniform float u_progress;
            uniform float u_waveFade;
            uniform float u_waveIntro;
            uniform float u_introStartAmp;
            uniform vec2 u_resolution;
            uniform float u_pixelRatio;

            // Dual Texture Background Cross-Fade Uniforms
            uniform sampler2D u_bgTexture;
            uniform sampler2D u_bgTextureNext;
            uniform vec2 u_bgScale;
            uniform vec2 u_bgOffset;
            uniform vec2 u_bgNextScale;
            uniform vec2 u_bgNextOffset;
            uniform float u_bgCrossFade;

            // Snell's Law Liquid Glass Physical Optics Uniforms
            uniform float u_scaleRatio;
            uniform float u_bezelWidth;
            uniform float u_glassThickness;
            uniform float u_ior;
            uniform float u_dispersionScale;
            uniform float u_surfaceCurvature;
            uniform vec3 u_glassTint;
            uniform float u_absorption;
            uniform float u_showBackground;
            uniform vec4 u_shapeParams;
            uniform float u_topMorphUp;

            // Wave Edge Refraction Uniforms
            uniform float u_waveRefract;
            uniform float u_waveDispersion;
            uniform float u_waveEdgeBand;
            uniform float u_wavePower;

            // Physical Bottom Edge Rim Highlight
            uniform float u_bottomRimIntensity;
            uniform float u_bottomRimWidth;

            // Volumetric Spindle Wave Uniforms
            uniform float xScale;
            uniform float yScale;
            uniform float phaseDistance;
            uniform float lineThickness;
            uniform float pinTaper;
            uniform float spindleWidth;
            uniform float glowFalloff;
            uniform float glowIntensity;
            uniform float edgeFade;
            uniform float hotCoreThreshold;
            uniform float hotCoreIntensity;
            uniform float fillOpacity;
            uniform int activeWaves;
            uniform vec3 uColors[6];

            varying vec2 vUv;

            #define PI 3.14159265359

            float sdPill(vec2 p, vec2 b, float r) {
                vec2 d = abs(p) - b + vec2(r);
                return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
            }

            float sdBulbousSquircle(vec2 p, vec2 dim, float topArch, float botArch) {
                vec2 np = p / dim;

                float yWeight = smoothstep(-dim.y * 0.35, dim.y * 0.35, p.y);
                float archTop = 1.0 - (np.x * np.x) * 0.45 * topArch;
                float archBot = 1.0 - (np.x * np.x) * 0.70 * botArch;
                float arch = mix(archTop, archBot, yWeight);

                vec2 scaledP = p;
                scaledP.y /= max(arch, 0.15);

                float px = abs(scaledP.x) / max(dim.x, 0.1);
                float py = abs(scaledP.y) / max(dim.y, 0.1);
                float exponent = 2.4;

                float dist = pow(pow(px, exponent) + pow(py, exponent), 1.0 / exponent) - 1.0;
                return dist * min(dim.x, dim.y);
            }

            float getIslandSDF(vec2 p, float prog) {
                vec2 pillDim = vec2(40.0, 11.5);
                float pillRad = 11.5;
                float d1 = sdPill(p, pillDim, pillRad);

                vec2 expDim = u_shapeParams.xy;
                float topArch = u_shapeParams.z;
                float botArch = u_shapeParams.w;
                float d2 = sdBulbousSquircle(p, expDim, topArch, botArch);

                return mix(d1, d2, prog);
            }

            vec2 calcNormal2D(vec2 p, float prog) {
                float h = 0.50;
                vec2 k = vec2(1.0, -1.0);
                return normalize(
                    k.xy * getIslandSDF(p + k.xy * h, prog) +
                    k.yy * getIslandSDF(p + k.yy * h, prog) +
                    k.yx * getIslandSDF(p + k.yx * h, prog) +
                    k.xx * getIslandSDF(p + k.xx * h, prog)
                );
            }

            float computeSnellDisplacement(float d, float bWidth, float thickness, float nMedium, float curveExp, out float outH) {
                if (d >= bWidth || d <= 0.0) {
                    outH = (d <= 0.0) ? 0.0 : thickness;
                    return 0.0;
                }

                float u = clamp(d / max(bWidth, 1.0), 0.0, 1.0);
                float innerArc = clamp(1.0 - pow(1.0 - u, curveExp), 0.0, 1.0);
                outH = thickness * sqrt(innerArc);

                float denom = max(sqrt(innerArc), 0.05);
                float dh_dd = (thickness / max(bWidth, 1.0)) * (pow(1.0 - u, max(curveExp - 1.0, 0.0)) / denom);

                float theta1 = atan(dh_dd);
                float sinTheta2 = sin(theta1) / max(nMedium, 1.001);
                sinTheta2 = clamp(sinTheta2, -0.999, 0.999);
                float theta2 = asin(sinTheta2);

                float thetaDev = theta1 - theta2;
                return outH * tan(thetaDev);
            }

            vec3 sampleRefractedBackground(sampler2D tex, vec2 scale, vec2 offset, vec2 uvR, vec2 uvG, vec2 uvB) {
                vec2 fUvR = uvR * scale + offset;
                vec2 fUvG = uvG * scale + offset;
                vec2 fUvB = uvB * scale + offset;
                return vec3(texture2D(tex, fUvR).r, texture2D(tex, fUvG).g, texture2D(tex, fUvB).b);
            }

            void main() {
                vec2 uv = vec2(vUv.x, 1.0 - vUv.y) * u_resolution;
                float cx = 72.0;
                float cy = 20.0;
                vec2 p = uv - vec2(cx, cy);

                float yShiftDown = mix(0.0, (u_shapeParams.y - 11.5) - u_topMorphUp, u_progress);
                p.y -= yShiftDown;

                float dIsland = getIslandSDF(p, u_progress);

                float afwidth = length(vec2(dFdx(dIsland), dFdy(dIsland))) * 0.7071;
                float edgeIsland = (1.0 - smoothstep(-afwidth, afwidth, dIsland));

                vec2 norm2D = calcNormal2D(p, u_progress);
                float distFromBorder = max(0.0, -dIsland);

                float glassH = 0.0;
                float nBase = u_ior;
                float dispFactor = u_dispersionScale * 0.15;
                float nR = nBase - dispFactor * 0.04;
                float nG = nBase;
                float nB = nBase + dispFactor * 0.07;

                float dispMagR = computeSnellDisplacement(distFromBorder, u_bezelWidth, u_glassThickness, nR, u_surfaceCurvature, glassH);
                float dispMagG = computeSnellDisplacement(distFromBorder, u_bezelWidth, u_glassThickness, nG, u_surfaceCurvature, glassH);
                float dispMagB = computeSnellDisplacement(distFromBorder, u_bezelWidth, u_glassThickness, nB, u_surfaceCurvature, glassH);

                float scaleMul = u_scaleRatio * u_progress;
                vec2 uvR = vUv + vec2(-norm2D.x * dispMagR * scaleMul / u_resolution.x, norm2D.y * dispMagR * scaleMul / u_resolution.y);
                vec2 uvG = vUv + vec2(-norm2D.x * dispMagG * scaleMul / u_resolution.x, norm2D.y * dispMagG * scaleMul / u_resolution.y);
                vec2 uvB = vUv + vec2(-norm2D.x * dispMagB * scaleMul / u_resolution.x, norm2D.y * dispMagB * scaleMul / u_resolution.y);

                vec3 bgCurrent = sampleRefractedBackground(u_bgTexture, u_bgScale, u_bgOffset, uvR, uvG, uvB);
                vec3 bgNext = sampleRefractedBackground(u_bgTextureNext, u_bgNextScale, u_bgNextOffset, uvR, uvG, uvB);
                vec3 refractedBg = mix(bgCurrent, bgNext, u_bgCrossFade);

                float opticalDepth = (glassH / max(u_glassThickness, 1.0)) * u_absorption;
                vec3 transmission = exp(-opticalDepth * (vec3(1.0) - u_glassTint));
                refractedBg *= transmission;

                float currentH = mix(11.5, u_shapeParams.y, u_progress);
                float yRatio = clamp((p.y + currentH * 0.15) / (currentH * 1.15), 0.0, 1.0);
                float glassTranslucency = smoothstep(0.18, 0.92, yRatio) * u_progress;

                vec3 glassBody = mix(vec3(0.0), refractedBg * u_showBackground, glassTranslucency);

                // Volumetric Spindle Wave
                vec3 accumulatedWave = vec3(0.0);

                if (u_waveFade > 0.001) {
                    float currentW = mix(40.0, u_shapeParams.x, u_progress);

                    float ampWeights[6];
                    ampWeights[0] = 1.30;
                    ampWeights[1] = 0.70;
                    ampWeights[2] = 1.22;
                    ampWeights[3] = 0.72;
                    ampWeights[4] = 0.60;
                    ampWeights[5] = 0.60;

                    float thickWeights[6];
                    thickWeights[0] = 1.35;
                    thickWeights[1] = 0.72;
                    thickWeights[2] = 1.30;
                    thickWeights[3] = 0.75;
                    thickWeights[4] = 0.60;
                    thickWeights[5] = 0.60;

                    float phWeights[6];
                    phWeights[0] = 0.00;
                    phWeights[1] = 0.38;
                    phWeights[2] = 0.75;
                    phWeights[3] = 1.15;
                    phWeights[4] = 1.50;
                    phWeights[5] = 1.85;

                    vec3 waveAccum = vec3(0.0);
                    float totalDensity = 0.0;
                    float waveIntersectCount = 0.0;

                    float edgeZone = clamp(1.0 - (distFromBorder / max(u_waveEdgeBand, 1.0)), 0.0, 1.0);
                    float edgeMask = pow(edgeZone, u_wavePower);

                    for (int i = 0; i < 6; i++) {
                        if (i >= activeWaves) break;

                        float numW = max(float(activeWaves - 1), 1.0);
                        float staggerStart = (float(i) / numW) * 0.42;
                        float staggerDuration = 0.58;
                        float rawWaveProg = clamp((u_waveIntro - staggerStart) / staggerDuration, 0.0, 1.0);
                        float waveProgress = rawWaveProg * rawWaveProg * (3.0 - 2.0 * rawWaveProg);

                        float dispersionOffset = (float(i) - 1.5) * (u_waveDispersion * 0.25);
                        float waveDispMag = (edgeZone * u_waveRefract * 4.0) + (dispersionOffset * edgeMask);

                        vec2 waveOffset = norm2D * (waveDispMag * edgeMask * u_progress);
                        vec2 pWave = p - waveOffset;

                        vec2 wp = vec2(pWave.x, pWave.y + 0.5 * u_progress) / currentW;
                        float nx = (wp.x / spindleWidth) + 0.5;

                        if (nx > 0.0 && nx < 1.0) {
                            float envelope = pow(sin(nx * PI), pinTaper);
                            float eFade = max(edgeFade, 0.001);
                            float fadeMask = smoothstep(0.0, eFade, nx) * (1.0 - smoothstep(1.0 - eFade, 1.0, nx));

                            float baseAngle = wp.x * xScale;
                            float dynamicHarmonic = 1.0 + 0.12 * sin(u_time * 1.5 + float(i) * 1.3);
                            float targetAmp = ampWeights[i] * dynamicHarmonic;

                            float currentYScale = yScale * envelope;
                            float amp = mix(u_introStartAmp, targetAmp, waveProgress) * currentYScale;
                            float ph = phaseDistance * phWeights[i] * waveProgress;

                            float waveY = sin(baseAngle + u_time + ph) * amp;
                            float dist = abs(wp.y + waveY);

                            float targetThickMult = thickWeights[i];
                            float thickMult = mix(1.0, targetThickMult, waveProgress);
                            float currentThickness = lineThickness * envelope * thickMult;

                            float w = pow(clamp(currentThickness / max(dist + currentThickness * 0.32, 0.00001), 0.0, 1.0), glowFalloff);
                            w *= fillOpacity;

                            waveAccum += w * uColors[i] * fadeMask;
                            totalDensity += w * fadeMask;

                            waveIntersectCount += (1.0 - smoothstep(0.0, max(currentThickness * 2.2, 0.00001), dist));
                        }
                    }

                    if (totalDensity > hotCoreThreshold && waveIntersectCount >= 2.6) {
                        float whiteFactor = smoothstep(hotCoreThreshold, hotCoreThreshold + 3.0, totalDensity);
                        waveAccum = mix(waveAccum, vec3(1.0) * hotCoreIntensity, whiteFactor * 0.85);
                    }

                    accumulatedWave = waveAccum * glowIntensity * u_waveFade;
                }

                // Apple Physical Glass Bottom Edge White Meniscus Sheen
                float bottomFactor = clamp((p.y + currentH * 0.25) / (currentH * 1.25), 0.0, 1.0);
                float rimGlow = (1.0 - smoothstep(0.0, max(u_bottomRimWidth, 0.1), distFromBorder)) * bottomFactor * u_progress;
                vec3 bottomRimHighlight = vec3(0.96, 0.98, 1.0) * (rimGlow * u_bottomRimIntensity);

                vec3 finalRGB = glassBody + accumulatedWave + bottomRimHighlight;
                gl_FragColor = vec4(clamp(finalRGB, 0.0, 1.0), edgeIsland);
            }
        `;

// src/state.js
function readActivity(bar) {
  if (!bar?.classList.contains("visible")) return "idle";
  if (bar.classList.contains("error-mode")) return "error";
  if (bar.classList.contains("processing")) return "processing";
  if (bar.classList.contains("speaking")) return "speaking";
  if (bar.classList.contains("listening")) return "listening";
  return "connecting";
}
function audioLevel(bar, state) {
  if (!["listening", "speaking"].includes(state)) return 0;
  if (!bar?.classList.contains("reactive")) return 0;
  const value = Number.parseFloat(bar.style.getPropertyValue("--vs-audio-level"));
  return Number.isFinite(value) ? Math.max(0, Math.min(value, 1)) : 0;
}
var Spring = class {
  value = 0;
  velocity = 0;
  target = 0;
  update(delta) {
    const step = Math.min(Math.max(delta, 0), 0.033) / 4;
    for (let i = 0; i < 4; i++) {
      this.velocity += (-450 * (this.value - this.target) - 28 * this.velocity) * step;
      this.value += this.velocity * step;
    }
    if (Math.abs(this.velocity) < 1e-4 && Math.abs(this.value - this.target) < 1e-4) {
      this.value = this.target;
      this.velocity = 0;
    }
    return this.value;
  }
};

// src/renderer.js
var vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;
var COLORS = ["002fff", "00ffde", "fa1f1f", "ff930d", "9900ff", "00ff88"];
var VALUES = {
  u_introStartAmp: 0.2,
  u_scaleRatio: 3.8,
  u_bezelWidth: 58,
  u_glassThickness: 31,
  u_ior: 3.05,
  u_dispersionScale: 2,
  u_surfaceCurvature: 8,
  u_absorption: 0,
  u_showBackground: 1,
  u_topMorphUp: 4.5,
  u_waveRefract: 6.3,
  u_waveDispersion: 15,
  u_waveEdgeBand: 4.5,
  u_wavePower: 1.55,
  u_bottomRimIntensity: 0.97,
  u_bottomRimWidth: 1.4,
  xScale: 1.6,
  yScale: 0.11,
  phaseDistance: -4.1,
  lineThickness: 0.056,
  pinTaper: 2.8,
  spindleWidth: 2.3,
  glowFalloff: 1.5,
  glowIntensity: 1.15,
  edgeFade: 0.42,
  hotCoreThreshold: 7.2,
  hotCoreIntensity: 3.2,
  fillOpacity: 1,
  u_bgCrossFade: 0
};
var IslandRenderer = class {
  constructor(canvas, onContextLost) {
    this.canvas = canvas;
    this.spring = new Spring();
    this.time = 0;
    this.fade = 0;
    this.intro = 0;
    this.level = 0;
    this.locations = /* @__PURE__ */ new Map();
    this.shaders = [];
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power"
    });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    this.contextLost = (event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", this.contextLost);
    try {
      if (!gl.getExtension("OES_standard_derivatives")) throw new Error("Shader derivatives unavailable");
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
      const position = gl.getAttribLocation(this.program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      for (const [name, value] of Object.entries(VALUES)) this.float(name, value);
      gl.uniform2f(this.location("u_resolution"), 144, 112);
      gl.uniform4f(this.location("u_shapeParams"), 53, 41, 0.01, 0);
      gl.uniform3f(this.location("u_glassTint"), 0.94, 0.96, 1);
      gl.uniform1i(this.location("activeWaves"), 4);
      gl.uniform3fv(this.location("uColors[0]"), COLORS.flatMap((hex) => {
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
  float(name, value) {
    this.gl.uniform1f(this.location(name), value);
  }
  createEnvironment() {
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
    for (const name of ["u_bgTexture", "u_bgTextureNext"]) gl.uniform1i(this.location(name), 0);
    for (const name of ["u_bgScale", "u_bgNextScale"]) gl.uniform2f(this.location(name), 1, 1);
    for (const name of ["u_bgOffset", "u_bgNextOffset"]) gl.uniform2f(this.location(name), 0, 0);
  }
  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.clientWidth || 240;
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(width * 112 / 144 * ratio);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  reset() {
    this.spring.value = this.spring.velocity = this.fade = this.intro = this.time = this.level = 0;
  }
  render(delta, { state, level, reducedMotion = false }) {
    const active = state !== "idle";
    this.spring.target = active ? 1 : 0;
    const progress = reducedMotion ? Number(active) : this.spring.update(delta);
    this.level += (level - this.level) * (1 - Math.exp(-delta * (level > this.level ? 18 : 7)));
    if (active && progress > 0.98) {
      this.fade = Math.min(1, this.fade + delta / 0.3);
      this.intro = Math.min(1, this.intro + delta / 0.65);
    } else if (!active) {
      this.fade = Math.max(0, this.fade - delta / 0.16);
    }
    this.time -= delta * (state === "processing" ? 1.2 : 2.7 + this.level * 1.6);
    this.float("u_progress", Math.max(0, Math.min(1.07, progress)));
    this.float("u_waveFade", reducedMotion ? Number(active) : this.fade);
    this.float("u_waveIntro", reducedMotion ? 1 : this.intro);
    this.float("u_time", reducedMotion ? -1.8 : this.time);
    this.float("yScale", reducedMotion ? 0.11 : state === "processing" ? 0.065 : 0.085 + this.level * 0.13);
    this.float("glowIntensity", 1.15 + (reducedMotion ? 0 : this.level * 0.25));
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    return active || progress > 2e-3 || Math.abs(this.spring.velocity) > 2e-3;
  }
  dispose() {
    const gl = this.gl;
    this.canvas.removeEventListener("webglcontextlost", this.contextLost);
    for (const shader of this.shaders) gl.deleteShader(shader);
    if (this.buffer) gl.deleteBuffer(this.buffer);
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.program) gl.deleteProgram(this.program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
};

// src/runtime.js
var KEY = Symbol.for("voice-satellite.siri-island");
var LABELS = { idle: "", connecting: "Connecting", listening: "Listening", processing: "Thinking", speaking: "Speaking", error: "Check Voice Satellite" };
var Island = class {
  constructor(ui, bar) {
    this.ui = ui;
    this.bar = bar;
    this.state = "idle";
    this.raf = 0;
    this.lastTime = 0;
    this.lastDraw = 0;
    this.el = document.createElement("div");
    this.el.className = "siri-island";
    this.el.dataset.visible = "false";
    this.el.innerHTML = '<canvas aria-hidden="true"></canvas><div class="siri-island-fallback" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span class="siri-island-label" role="status" aria-live="polite"></span>';
    this.canvas = this.el.querySelector("canvas");
    this.label = this.el.querySelector(".siri-island-label");
    ui.append(this.el);
    ui.classList.add("siri-island-enabled");
    this.motion = matchMedia("(prefers-reduced-motion: reduce)");
    this.change = () => this.sync();
    this.motion.addEventListener("change", this.change);
    document.addEventListener("visibilitychange", this.change);
    this.observer = new MutationObserver(this.change);
    this.observer.observe(bar, { attributes: true, attributeFilter: ["class"] });
    this.resizeObserver = new ResizeObserver(() => {
      this.renderer?.resize();
      if (this.state !== "idle") this.start();
    });
    this.resizeObserver.observe(this.canvas);
    this.sync();
  }
  initRenderer() {
    if (this.renderer || this.failed) return;
    try {
      this.renderer = new IslandRenderer(this.canvas, () => this.fallback());
      this.el.dataset.renderer = "webgl";
    } catch (error) {
      console.warn("[Siri Island] Using static fallback:", error.message);
      this.fallback();
    }
  }
  fallback() {
    this.failed = true;
    this.stop();
    this.el.dataset.renderer = "fallback";
  }
  sync() {
    const next = readActivity(this.bar);
    const wasIdle = this.state === "idle";
    this.state = next;
    this.el.dataset.state = next;
    this.label.textContent = LABELS[next];
    if (document.hidden) {
      this.stop();
      this.el.dataset.visible = "false";
      return;
    }
    if (next !== "idle") {
      this.initRenderer();
      if (wasIdle) this.renderer?.reset();
      this.el.dataset.visible = "true";
      this.start();
    } else if (this.motion.matches || this.failed) {
      this.stop();
      this.el.dataset.visible = "false";
    } else if (this.renderer) {
      this.start();
    }
  }
  start() {
    if (this.raf || this.failed || !this.renderer || document.hidden) return;
    this.lastTime = this.lastDraw = 0;
    this.raf = requestAnimationFrame((time) => this.tick(time));
  }
  tick(time) {
    this.raf = 0;
    if (document.hidden || this.failed) return;
    if (this.lastDraw && time - this.lastDraw < 30) {
      this.raf = requestAnimationFrame((next) => this.tick(next));
      return;
    }
    const delta = this.lastTime ? Math.min((time - this.lastTime) / 1e3, 0.05) : 1 / 30;
    this.lastDraw = this.lastTime = time;
    const running = this.renderer.render(delta, {
      state: this.state,
      level: audioLevel(this.bar, this.state),
      reducedMotion: this.motion.matches
    });
    if (!running) this.el.dataset.visible = "false";
    else if (!this.motion.matches) this.raf = requestAnimationFrame((next) => this.tick(next));
  }
  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
  dispose() {
    this.stop();
    this.observer.disconnect();
    this.resizeObserver.disconnect();
    this.motion.removeEventListener("change", this.change);
    document.removeEventListener("visibilitychange", this.change);
    this.renderer?.dispose();
    this.ui.classList.remove("siri-island-enabled");
    this.el.remove();
  }
};
function installSiriIsland() {
  if (window[KEY]) return window[KEY];
  const style = document.createElement("style");
  style.id = "siri-island-styles";
  style.textContent = island_default;
  document.head.append(style);
  let island = null;
  let queued = false;
  let disposed = false;
  const sync = () => {
    queued = false;
    if (disposed) return;
    const ui = document.getElementById("voice-satellite-ui");
    const bar = ui?.querySelector(".vs-rainbow-bar");
    const enabled = ui && getComputedStyle(ui).getPropertyValue("--siri-island-enabled").trim() === "1";
    if (island && (!enabled || island.ui !== ui || island.bar !== bar)) {
      island.dispose();
      island = null;
    }
    if (enabled && bar && !island) island = new Island(ui, bar);
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(sync);
  };
  const bodyObserver = new MutationObserver(schedule);
  bodyObserver.observe(document.body, { childList: true });
  const headObserver = new MutationObserver(schedule);
  headObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
  const api = {
    version: "0.1.0",
    refresh: sync,
    dispose() {
      disposed = true;
      bodyObserver.disconnect();
      headObserver.disconnect();
      island?.dispose();
      style.remove();
      delete window[KEY];
    }
  };
  window[KEY] = api;
  sync();
  return api;
}
export {
  installSiriIsland
};

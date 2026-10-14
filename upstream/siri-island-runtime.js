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
var island_default = '/* Scoped to the opt-in host: other Voice Satellite skins stay untouched. */\n#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar,\n#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar::before,\n#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar::after {\n  opacity: 0 !important;\n  animation: none !important;\n  filter: none !important;\n  pointer-events: none !important;\n}\n#voice-satellite-ui.siri-island-enabled .vs-blur-overlay {\n  backdrop-filter: blur(var(--siri-island-backdrop-blur, 2px));\n  -webkit-backdrop-filter: blur(var(--siri-island-backdrop-blur, 2px));\n  background-image: linear-gradient(to top, rgba(0,0,0,.94), rgba(0,0,0,.64) 18%, transparent 54%) !important;\n}\n#voice-satellite-ui.siri-island-enabled .vs-chat-msg {\n  color: #fff !important;\n  font-weight: 300 !important;\n  font-size: calc(clamp(18px, 2.4vw, 30px) * var(--vs-text-scale, 1));\n  text-shadow: 0 2px 12px rgba(0,0,0,.5);\n  max-width: 100%;\n  text-align: left;\n  align-self: stretch;\n}\n#voice-satellite-ui.siri-island-enabled .vs-chat-container {\n  padding: clamp(22px, 3.5vw, 38px);\n  border: 1px solid rgba(255,255,255,.15);\n  border-radius: clamp(28px, 4vw, 48px);\n  background: radial-gradient(ellipse at 50% 112%, rgba(255,247,231,.24), transparent 40%),\n    linear-gradient(to bottom, #000 0%, rgba(0,0,0,.97) 68%, rgba(0,0,0,.72) 100%);\n  backdrop-filter: blur(12px) saturate(115%);\n  -webkit-backdrop-filter: blur(12px) saturate(115%);\n  box-shadow: inset 0 -1px 1px rgba(255,255,255,.65), inset 0 -12px 30px -25px #fff,\n    0 12px 48px rgba(0,0,0,.28);\n  max-height: min(58vh, 600px);\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: #ffffff45 transparent;\n}\n#voice-satellite-ui.siri-island-enabled .vs-chat-container:not(.announcement-mode) {\n  --siri-caption-inset: max(24px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px), env(safe-area-inset-bottom, 0px));\n  left: var(--siri-caption-inset);\n  right: var(--siri-caption-inset);\n  width: auto;\n  max-width: none;\n  box-sizing: border-box;\n  margin-inline: auto;\n  bottom: var(--siri-caption-inset) !important;\n}\n#voice-satellite-ui.siri-island-enabled .vs-chat-msg.assistant {\n  max-height: none;\n  overflow-y: visible;\n}\n#voice-satellite-ui .siri-island {\n  position: fixed;\n  top: 0;\n  --siri-island-offset: max(0px, calc(env(safe-area-inset-top, 0px) + var(--siri-island-top, calc(var(--siri-island-size) * 0.096))));\n  left: var(--siri-island-left, 50%);\n  --siri-island-size: min(var(--siri-island-width, 240px), 80vw);\n  width: var(--siri-island-size);\n  transform: translateX(-50%);\n  z-index: 10002;\n  pointer-events: none;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 180ms ease, visibility 180ms;\n  contain: layout style;\n}\n#voice-satellite-ui .siri-island[data-visible="true"] { opacity: 1; visibility: visible; }\n#voice-satellite-ui .siri-island canvas { width: 100%; height: calc(var(--siri-island-size) * 112 / 144 + var(--siri-island-offset)); display: block; }\n#voice-satellite-ui .siri-island-label {\n  display: none;\n  color: var(--siri-island-label-color, #f3f4fb);\n  background: rgba(12, 15, 24, 0.82);\n  border: 1px solid rgba(255,255,255,.1);\n  border-radius: 30px;\n  padding: 6px 14px;\n  width: max-content;\n  max-width: 100%;\n  box-sizing: border-box;\n  margin: -5px auto 0;\n  text-align: center;\n  font: 500 12px/1.3 system-ui, sans-serif;\n  letter-spacing: .02em;\n}\n#voice-satellite-ui.siri-island-show-status .siri-island-label { display: block; }\n#voice-satellite-ui .siri-island[data-state="idle"] .siri-island-label { visibility: hidden; }\n#voice-satellite-ui .siri-island-fallback {\n  display: none;\n  height: 132px;\n  margin: 24px 12%;\n  border-radius: 42%;\n  border: 1px solid #8a8eaa;\n  background: radial-gradient(ellipse at 50% 95%, #fff9, transparent 30%), linear-gradient(#000f 10%, #0002 75%);\n  box-shadow: inset 0 -2px 4px #cdd9e5, 0 16px 35px #0004;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n}\n#voice-satellite-ui .siri-island-fallback i {\n  width: 15px; height: 22px; border-radius: 50%;\n  background: #005fff; box-shadow: 0 0 18px currentColor;\n}\n#voice-satellite-ui .siri-island-fallback i:nth-child(2) { background: #00ffde; height: 36px; }\n#voice-satellite-ui .siri-island-fallback i:nth-child(3) { background: #fa1f1f; height: 30px; }\n#voice-satellite-ui .siri-island-fallback i:nth-child(4) { background: #ff930d; height: 18px; }\n#voice-satellite-ui .siri-island[data-renderer="fallback"] canvas { display: none; }\n#voice-satellite-ui .siri-island[data-renderer="fallback"] .siri-island-fallback { display: flex; }\n@media (max-height: 540px) {\n  #voice-satellite-ui .siri-island { --siri-island-size: min(var(--siri-island-width, 170px), 40vw); }\n}\n@media (prefers-reduced-motion: reduce) {\n  #voice-satellite-ui .siri-island { transition: none; }\n}\n\n#voice-satellite-ui .siri-island[data-shape="circle"] .siri-island-fallback {\n  aspect-ratio: 1; height: auto; border-radius: 50%; margin: var(--siri-island-offset) 20% 16px;\n}\n\n#voice-satellite-ui .siri-island-refraction {\n  position: absolute;\n  left: calc(50% - var(--siri-island-size) * 53 / 144);\n  top: var(--siri-island-offset);\n  width: calc(var(--siri-island-size) * 106 / 144);\n  height: calc(var(--siri-island-size) * 82 / 144);\n  border-radius: 44%;\n  visibility: hidden;\n  pointer-events: none;\n}\n#voice-satellite-ui .siri-island[data-shape="circle"] .siri-island-refraction {\n  left: calc(50% - var(--siri-island-size) * 43 / 144);\n  width: calc(var(--siri-island-size) * 86 / 144);\n  height: calc(var(--siri-island-size) * 86 / 144);\n  border-radius: 50%;\n}\n#voice-satellite-ui .siri-island canvas { position: relative; }\n';

// src/shader.js
var fragmentShader = `
#extension GL_OES_standard_derivatives : enable

            precision highp float;

            uniform float u_time;
            uniform float u_progress;
            uniform float u_drop;
            uniform float u_bulgeWidth;
            uniform float u_bulgeStretch;
            uniform float u_circle;
            uniform float u_thinking;
            uniform float u_bodyOpacity;
            uniform float u_top;
            uniform float u_bottomGlow;
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

                float circle = length(p) - 43.0;
                return mix(d1, mix(d2, circle, u_circle), prog);
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

            float smoothUnion(float a, float b, float k) {
                float h = max(k - abs(a - b), 0.0) / k;
                return min(a, b) - h * h * k * 0.25;
            }

            // Original motion; visual inspiration: 40973894's Siri Wave / Fluid Dots.
            vec2 dotCenter(float index, float time) {
                float t = -time * 0.85;
                float angle = index * (2.0 * PI / 5.0) + t * 1.6;
                float radius = 0.40;
                return vec2(cos(angle), sin(angle)) * radius * 43.0;
            }

            float dotSize(float index, float time) {
                return (0.080 + 0.018 * sin(-time * 0.85 * 1.3 + index * 2.0)) * 43.0;
            }

            void main() {
                if (u_drop <= 0.0) { gl_FragColor = vec4(0.0); return; }
                vec2 uv = vec2(vUv.x, 1.0 - vUv.y) * u_resolution;
                float currentH = mix(41.0, 43.0, u_circle);
                // Two simple surfaces: a rounded bezel bulge and a compact drop.
                // The drop clears the bulge before it spreads back into the bezel.
                float fall = smoothstep(0.0, 0.44, u_drop);
                float grow = mix(0.35, 1.0, smoothstep(0.0, 1.0, u_drop));
                float widen = smoothstep(0.24, 0.78, u_drop);
                // Clear the moving bulge before its stretch flows into retraction.
                float clearance = currentH * (0.60 * u_bulgeStretch + 0.14);
                float topEdge = mix(-currentH * 0.70, max(u_top, clearance), fall);
                topEdge = mix(topEdge, u_top, smoothstep(0.58, 1.0, u_drop));
                // The clearance-to-rest trajectory supplies the positional settle.
                float centerY = topEdge + currentH * grow;
                vec2 p = (uv - vec2(72.0, centerY)) / grow;
                p.x /= mix(0.70, 1.0, widen);
                float dOrb = getIslandSDF(p, u_progress) * grow;
                float birth = smoothstep(0.0, 0.12, u_drop);
                float pull = smoothstep(0.08, 0.44, u_drop);
                // Once the drop clears, the stretched liquid recoils quickly
                // into a broad shallow shoulder, then settles flush with the edge.
                float reabsorb = smoothstep(0.44, 0.56, u_drop);
                float retract = (1.0 - 0.82 * reabsorb) *
                    (1.0 - smoothstep(0.56, 0.74, u_drop));
                // Surface tension draws the narrow tip upward while its base
                // spreads back to the original width, rather than shrinking away.
                float lipWidth = max(0.01, currentH * 1.10 * u_bulgeWidth *
                    mix(mix(1.0, 0.65, pull), 1.0, reabsorb) * birth);
                float lipDepth = currentH * mix(0.18, 0.60, pull) *
                    u_bulgeStretch * birth * retract;
                float shoulderX = min(1.0, abs(uv.x - 72.0) / lipWidth);
                float shoulder = 0.5 + 0.5 * cos(3.14159265 * shoulderX);
                float dLip = uv.y - lipDepth * shoulder;
                float dIsland = u_drop < 0.74
                    ? smoothUnion(dOrb, dLip, max(0.001, currentH * 0.60 * (1.0 - smoothstep(0.20, 0.40, u_drop))))
                    : dOrb;

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

                currentH = mix(11.5, currentH, u_progress);
                float yRatio = clamp((p.y + currentH * 0.15) / (currentH * 1.15), 0.0, 1.0);
                float glassTranslucency = smoothstep(0.18, 0.92, yRatio) * u_progress;

                vec3 glassBody = refractedBg * 0.025 * glassTranslucency;

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

                    // Contract the curves into one droplet, then immediately
                    // separate into five orbiting droplets. The
                    // same stages reverse continuously when speech resumes.
                    float morph = smoothstep(0.0, 0.40, u_thinking);
                    float spread = smoothstep(0.40, 1.0, u_thinking);
                    float liquidField = 10000.0;
                    vec3 liquidTint = vec3(0.0);
                    float tintWeight = 0.0;

                    for (int i = 0; i < 6; i++) {
                        if (i >= activeWaves) break;

                        float numW = max(float(activeWaves - 1), 1.0);
                        float staggerStart = (float(i) / numW) * 0.42;
                        float rawWaveProg = clamp((u_waveIntro - staggerStart) / 0.58, 0.0, 1.0);
                        float waveProgress = rawWaveProg * rawWaveProg * (3.0 - 2.0 * rawWaveProg);
                        float dispersionOffset = (float(i) - 2.0) * (u_waveDispersion * 0.25);
                        float waveDispMag = (edgeZone * u_waveRefract * 4.0) + (dispersionOffset * edgeMask);
                        vec2 waveOffset = norm2D * (waveDispMag * edgeMask * u_progress);

                        // The curved capsule first becomes a centered circle;
                        // only then does its center move to an orbit position.
                        float dotIndex = mod(float(i), 5.0);
                        vec2 center = dotCenter(dotIndex, u_time) * spread;
                        vec2 pWave = p - waveOffset * (1.0 - morph) - center;
                        float contraction = max(0.001, 1.0 - morph);
                        float span = currentW * spindleWidth * 0.5 * (1.0 - morph);
                        vec2 wp = vec2(pWave.x / contraction,
                            pWave.y + 0.5 * u_progress * (1.0 - morph)) / currentW;
                        float nx = (wp.x / spindleWidth) + 0.5;
                        float envelope = pow(max(sin(clamp(nx, 0.0, 1.0) * PI), 0.0), pinTaper);
                        float eFade = max(edgeFade, 0.001);
                        float fadeMask = smoothstep(0.0, eFade, nx) * (1.0 - smoothstep(1.0 - eFade, 1.0, nx));
                        float baseAngle = clamp(wp.x, -spindleWidth * 0.5, spindleWidth * 0.5) * xScale;
                        float dynamicHarmonic = 1.0 + 0.12 * sin(u_time * 1.5 + float(i) * 1.3);
                        float targetAmp = ampWeights[i] * dynamicHarmonic;
                        float amp = mix(u_introStartAmp, targetAmp, waveProgress) * yScale * envelope;
                        float ph = phaseDistance * phWeights[i] * waveProgress;
                        float waveY = sin(baseAngle + u_time + ph) * amp * (1.0 - morph);
                        float dist = abs(wp.y + waveY);
                        float thickMult = mix(1.0, thickWeights[i], waveProgress);
                        float currentThickness = lineThickness * envelope * thickMult;

                        if (nx > 0.0 && nx < 1.0) {
                            float w = pow(clamp(currentThickness / max(dist + currentThickness * 0.32, 0.00001), 0.0, 1.0), glowFalloff);
                            w *= fillOpacity;
                            waveAccum += w * uColors[i] * fadeMask;
                            totalDensity += w * fadeMask;
                            waveIntersectCount += (1.0 - smoothstep(0.0, max(currentThickness * 2.2, 0.00001), dist));
                        }

                        float radius = mix(currentThickness * currentW,
                            mix(4.5, dotSize(dotIndex, u_time), spread), morph);
                        float curveDistance = length(vec2(max(abs(pWave.x) - span, 0.0),
                            (wp.y + waveY) * currentW)) - radius;
                        if (i < 5 || u_thinking < 0.40) {
                            liquidField = smoothUnion(liquidField, curveDistance, mix(1.4, 4.7, spread));
                        }
                        float tint = exp(-length(pWave) * 0.2);
                        liquidTint += uColors[i] * tint;
                        tintWeight += tint;
                    }

                    if (totalDensity > hotCoreThreshold && waveIntersectCount >= 2.6) {
                        float whiteFactor = smoothstep(hotCoreThreshold, hotCoreThreshold + 3.0, totalDensity);
                        waveAccum = mix(waveAccum, vec3(1.0) * hotCoreIntensity, whiteFactor * 0.85);
                    }

                    liquidTint /= max(tintWeight, 0.001);
                    float core = 1.0 - smoothstep(-0.9, 0.8, liquidField);
                    float glow = exp(-max(liquidField, 0.0) * 0.5) * 0.14;
                    float liquidEdge = exp(-abs(liquidField) * 1.5) * 0.1;
                    vec3 liquidLight = mix(liquidTint, vec3(1.0), 0.92) * core + liquidTint * glow + liquidEdge;
                    accumulatedWave = mix(waveAccum * glowIntensity, liquidLight,
                        smoothstep(0.05, 0.55, morph)) * u_waveFade;
                }

                // A transmissive lower hemisphere, a dark upper cap and white caustic.
                float lower = smoothstep(-0.3, 0.65, p.y / max(currentH, 1.0));
                float bodyAlpha = mix(0.96, u_bodyOpacity, lower);
                float rim = exp(-distFromBorder * 1.7) * (0.18 + 0.82 * lower);
                float bottomLight = exp(-pow(p.x / 20.0, 2.0) - pow((p.y - currentH * 0.83) / 9.0, 2.0));
                float horizon = exp(-pow((p.y - 4.0 + 3.0 * cos(p.x / 28.0)) / 1.9, 2.0)) *
                    exp(-pow(p.x / 37.0, 4.0));
                float sheen = (rim * 0.75 + bottomLight * u_bottomGlow + horizon * 0.18) * u_progress;
                vec3 lights = accumulatedWave;
                lights += vec3(1.0, 0.97, 0.93) * sheen;
                float lightAlpha = clamp(max(max(lights.r, lights.g), lights.b), 0.0, 1.0);
                float alpha = max(bodyAlpha, lightAlpha);
                // The neck is pure black; illumination belongs to the detached glass.
                float orbMask = 1.0 - smoothstep(-1.0, 1.0, dOrb);
                float glassReveal = smoothstep(0.32, 0.84, u_drop);
                vec3 color = clamp((glassBody + lights) / max(alpha, 0.001), 0.0, 1.0) * orbMask * glassReveal;
                alpha = mix(1.0, alpha, orbMask * glassReveal);
                gl_FragColor = vec4(color, edgeIsland * alpha);
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
    this.drop = 0;
    this.thinking = 0;
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
      gl.uniform1i(this.location("activeWaves"), 6);
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
    const height = this.canvas.clientHeight || width * 112 / 144;
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.location("u_resolution"), 144, height / width * 144);
    this.float("u_top", Math.max(0, height / width * 144 - 112));
  }
  reset() {
    this.spring.value = this.spring.velocity = this.fade = this.intro = this.time = this.level = this.drop = this.thinking = 0;
    this.drop = 0;
    this.thinking = 0;
  }
  render(delta, { state, level, reducedMotion = false, circle = false, opacity = 0.14, bottomGlow = 0.8, entrance = true, bulgeWidth = 1, bulgeStretch = 1, elapsed = delta }) {
    const active = state !== "idle";
    const liquidMotion = !reducedMotion && entrance;
    this.drop = Math.max(0, Math.min(1, this.drop + (active ? 1 : -1) * elapsed / (active ? 0.45 : 0.8)));
    this.spring.target = active || liquidMotion && this.drop > 0 ? 1 : 0;
    this.thinking = Math.max(0, Math.min(
      1,
      this.thinking + (state === "processing" ? 1 : -1) * elapsed / 0.55
    ));
    this.float("u_drop", reducedMotion || !entrance ? 1 : this.drop);
    this.float("u_circle", Number(circle));
    this.float("u_bulgeWidth", bulgeWidth);
    this.float("u_bulgeStretch", bulgeStretch);
    this.float("u_bodyOpacity", opacity);
    this.float("u_bottomGlow", bottomGlow);
    this.float("u_thinking", reducedMotion ? Number(state === "processing") : this.thinking);
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
    return liquidMotion ? active || this.drop > 0 : active || progress > 2e-3 || Math.abs(this.spring.velocity) > 2e-3;
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

// src/refraction.js
var GlassRefraction = class {
  constructor(host) {
    this.host = host;
    const id = `siri-glass-${Math.random().toString(36).slice(2)}`;
    const map = document.createElement("canvas");
    const size = 256;
    map.width = map.height = size;
    const context = map.getContext("2d");
    if (!context) return;
    const pixels = context.createImageData(size, size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const nx = (x + 0.5) / (size / 2) - 1, ny = (y + 0.5) / (size / 2) - 1;
      const r = Math.hypot(nx, ny);
      const edge = Math.max(0, Math.min(1, (r - 0.3) / 0.7));
      const curvature = edge * edge * (3 - 2 * edge);
      const bend = r < 1 ? Math.min(0.98, r * curvature) : 0;
      const i = (y * size + x) * 4;
      pixels.data.set([
        128 - nx / Math.max(r, 1e-3) * bend * 127,
        128 - ny / Math.max(r, 1e-3) * bend * 127,
        128,
        255
      ], i);
    }
    context.putImageData(pixels, 0, 0);
    const ns = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(ns, "svg");
    this.svg.setAttribute("width", "0");
    this.svg.setAttribute("height", "0");
    this.svg.setAttribute("aria-hidden", "true");
    this.svg.style.position = "absolute";
    this.svg.innerHTML = `<defs><filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage width="100%" height="100%" preserveAspectRatio="none" result="lens"/><feDisplacementMap in="SourceGraphic" in2="lens" xChannelSelector="R" yChannelSelector="G" scale="64"/></filter></defs>`;
    this.svg.querySelector("feImage").setAttribute("href", map.toDataURL());
    this.displace = this.svg.querySelector("feDisplacementMap");
    this.el = document.createElement("div");
    this.el.className = "siri-island-refraction";
    this.el.setAttribute("aria-hidden", "true");
    this.el.style.backdropFilter = `url(#${id})`;
    this.el.style.webkitBackdropFilter = `url(#${id})`;
    host.prepend(this.svg, this.el);
  }
  update(amount, ready) {
    if (!this.el) return;
    if (this.amount !== amount) {
      this.displace.setAttribute("scale", String(amount));
      this.amount = amount;
    }
    this.el.style.visibility = ready && amount > 0 ? "visible" : "hidden";
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
    this.glass = new GlassRefraction(this.el);
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
    this.glass.update(0, false);
  }
  sync() {
    const style = getComputedStyle(this.ui);
    const number = (name, fallback, max = 1) => {
      const value = parseFloat(style.getPropertyValue(name));
      return Number.isFinite(value) ? Math.max(0, Math.min(value, max)) : fallback;
    };
    this.appearance = {
      circle: style.getPropertyValue("--siri-island-shape").trim() !== "island",
      opacity: number("--siri-island-glass-opacity", 0.14),
      bulgeWidth: number("--siri-island-bulge-width", 1, 1.4),
      bulgeStretch: number("--siri-island-bulge-stretch", 1, 2.5),
      bottomGlow: number("--siri-island-bottom-glow", 0.8, 2),
      entrance: style.getPropertyValue("--siri-island-entrance").trim() !== "none"
    };
    this.refraction = number("--siri-island-refraction", 64, 120);
    this.el.dataset.shape = this.appearance.circle ? "circle" : "island";
    const next = readActivity(this.bar);
    const wasIdle = this.state === "idle";
    this.state = next;
    this.el.dataset.state = next;
    this.label.textContent = LABELS[next];
    if (document.hidden) {
      this.stop();
      this.el.dataset.visible = "false";
      this.glass.update(0, false);
      return;
    }
    if (next !== "idle") {
      this.initRenderer();
      if (wasIdle && this.el.dataset.visible !== "true") this.renderer?.reset();
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
    const elapsed = this.lastTime ? (time - this.lastTime) / 1e3 : 1 / 30;
    const delta = Math.min(elapsed, 0.05);
    this.lastDraw = this.lastTime = time;
    const running = this.renderer.render(delta, {
      ...this.appearance,
      elapsed,
      state: this.state,
      level: audioLevel(this.bar, this.state),
      reducedMotion: this.motion.matches
    });
    this.glass.update(this.refraction, this.state !== "idle" && (this.motion.matches || !this.appearance.entrance || this.renderer.drop >= 1));
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
    else island?.sync();
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
    version: "0.2.0",
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

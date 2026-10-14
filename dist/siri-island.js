/*! Siri AI Home View Animation for Voice Satellite 0.2.15 — AGPL-3.0-only.
 * Source: https://github.com/lukevink/siri-homeview-hass-animation
 * Shader adapted from neeldedkawala/ios-siri-animation (MIT).
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
var y=`/* Scoped to the opt-in host: other Voice Satellite skins stay untouched. */
#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar,
#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar::before,
#voice-satellite-ui.siri-island-enabled .vs-rainbow-bar::after {
  opacity: 0 !important;
  animation: none !important;
  filter: none !important;
  pointer-events: none !important;
}
#voice-satellite-ui.siri-island-enabled .vs-blur-overlay {
  backdrop-filter: blur(var(--siri-island-backdrop-blur, 2px));
  -webkit-backdrop-filter: blur(var(--siri-island-backdrop-blur, 2px));
  background-image: linear-gradient(to top, rgba(0,0,0,.94), rgba(0,0,0,.64) 18%, transparent 54%) !important;
}
#voice-satellite-ui.siri-island-enabled .vs-chat-msg {
  color: #fff !important;
  font-weight: 300 !important;
  font-size: calc(clamp(18px, 2.4vw, 30px) * var(--vs-text-scale, 1));
  text-shadow: 0 2px 12px rgba(0,0,0,.5);
  max-width: 100%;
  text-align: left;
  align-self: stretch;
}
#voice-satellite-ui.siri-island-enabled .vs-chat-container {
  padding: clamp(22px, 3.5vw, 38px);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: clamp(28px, 4vw, 48px);
  background: radial-gradient(ellipse at 50% 112%, rgba(255,247,231,.24), transparent 40%),
    linear-gradient(to bottom, #000 0%, rgba(0,0,0,.97) 68%, rgba(0,0,0,.72) 100%);
  backdrop-filter: blur(12px) saturate(115%);
  -webkit-backdrop-filter: blur(12px) saturate(115%);
  box-shadow: inset 0 -1px 1px rgba(255,255,255,.65), inset 0 -12px 30px -25px #fff,
    0 12px 48px rgba(0,0,0,.28);
  max-height: min(58vh, 600px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ffffff45 transparent;
}
#voice-satellite-ui.siri-island-enabled .vs-chat-container:not(.announcement-mode) {
  --siri-caption-inset: max(24px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px), env(safe-area-inset-bottom, 0px));
  left: var(--siri-caption-inset);
  right: var(--siri-caption-inset);
  width: auto;
  max-width: none;
  box-sizing: border-box;
  margin-inline: auto;
  bottom: var(--siri-caption-inset) !important;
}
#voice-satellite-ui.siri-island-enabled .vs-chat-msg.assistant {
  max-height: none;
  overflow-y: visible;
}
#voice-satellite-ui .siri-island {
  position: fixed;
  top: 0;
  --siri-island-offset: max(0px, calc(env(safe-area-inset-top, 0px) + var(--siri-island-top, calc(var(--siri-island-size) * 0.096))));
  left: var(--siri-island-left, 50%);
  --siri-island-size: min(var(--siri-island-width, 240px), 80vw);
  width: var(--siri-island-size);
  transform: translateX(-50%);
  z-index: 10002;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 180ms ease, visibility 180ms;
  contain: layout style;
}
#voice-satellite-ui .siri-island[data-visible="true"] { opacity: 1; visibility: visible; }
#voice-satellite-ui .siri-island canvas { width: 100%; height: calc(var(--siri-island-size) * 112 / 144 + var(--siri-island-offset)); display: block; }
#voice-satellite-ui .siri-island-label {
  display: none;
  color: var(--siri-island-label-color, #f3f4fb);
  background: rgba(12, 15, 24, 0.82);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 30px;
  padding: 6px 14px;
  width: max-content;
  max-width: 100%;
  box-sizing: border-box;
  margin: -5px auto 0;
  text-align: center;
  font: 500 12px/1.3 system-ui, sans-serif;
  letter-spacing: .02em;
}
#voice-satellite-ui.siri-island-show-status .siri-island-label { display: block; }
#voice-satellite-ui .siri-island[data-state="idle"] .siri-island-label { visibility: hidden; }
#voice-satellite-ui .siri-island-fallback {
  display: none;
  height: 132px;
  margin: 24px 12%;
  border-radius: 42%;
  border: 1px solid #8a8eaa;
  background: radial-gradient(ellipse at 50% 95%, #fff9, transparent 30%), linear-gradient(#000f 10%, #0002 75%);
  box-shadow: inset 0 -2px 4px #cdd9e5, 0 16px 35px #0004;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
#voice-satellite-ui .siri-island-fallback i {
  width: 15px; height: 22px; border-radius: 50%;
  background: #005fff; box-shadow: 0 0 18px currentColor;
}
#voice-satellite-ui .siri-island-fallback i:nth-child(2) { background: #00ffde; height: 36px; }
#voice-satellite-ui .siri-island-fallback i:nth-child(3) { background: #fa1f1f; height: 30px; }
#voice-satellite-ui .siri-island-fallback i:nth-child(4) { background: #ff930d; height: 18px; }
#voice-satellite-ui .siri-island[data-renderer="fallback"] canvas { display: none; }
#voice-satellite-ui .siri-island[data-renderer="fallback"] .siri-island-fallback { display: flex; }
@media (max-height: 540px) {
  #voice-satellite-ui .siri-island { --siri-island-size: min(var(--siri-island-width, 170px), 40vw); }
}
@media (prefers-reduced-motion: reduce) {
  #voice-satellite-ui .siri-island { transition: none; }
}

#voice-satellite-ui .siri-island[data-shape="circle"] .siri-island-fallback {
  aspect-ratio: 1; height: auto; border-radius: 50%; margin: var(--siri-island-offset) 20% 16px;
}

#voice-satellite-ui .siri-island-refraction {
  position: absolute;
  left: calc(50% - var(--siri-island-size) * 53 / 144);
  top: var(--siri-island-offset);
  width: calc(var(--siri-island-size) * 106 / 144);
  height: calc(var(--siri-island-size) * 82 / 144);
  border-radius: 44%;
  visibility: hidden;
  pointer-events: none;
}
#voice-satellite-ui .siri-island[data-shape="circle"] .siri-island-refraction {
  left: calc(50% - var(--siri-island-size) * 43 / 144);
  width: calc(var(--siri-island-size) * 86 / 144);
  height: calc(var(--siri-island-size) * 86 / 144);
  border-radius: 50%;
}
#voice-satellite-ui .siri-island canvas { position: relative; }
`;var k=`
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
                float releasePhase = u_drop / 1.15;
                float fall = smoothstep(0.0, 0.44, releasePhase);
                float grow = mix(0.35, 1.0, fall);
                float widen = smoothstep(0.36, 0.65, u_drop);
                // A small positional settle after separation; width expansion
                // stays monotonic and does not bounce.
                float topEdge = mix(-currentH * 0.70, u_top, fall);
                float settle = clamp((releasePhase - 0.40) / 0.40, 0.0, 1.0);
                topEdge += currentH * 0.035 * pow(sin(3.14159265 * settle), 2.0);
                float centerY = topEdge + currentH * grow;
                vec2 p = (uv - vec2(72.0, centerY)) / grow;
                p.x /= mix(0.70, 1.0, widen);
                float dOrb = getIslandSDF(p, u_progress) * grow;
                float birth = smoothstep(0.0, 0.12, releasePhase);
                float pull = smoothstep(0.08, 0.28, releasePhase);
                // Once the drop clears, the stretched liquid recoils quickly
                // into a broad shallow shoulder, then settles flush with the edge.
                float reabsorb = smoothstep(0.28, 0.36, releasePhase);
                float retract = (1.0 - 0.82 * reabsorb) *
                    (1.0 - smoothstep(0.36, 0.60, releasePhase));
                // Surface tension draws the narrow tip upward while its base
                // spreads back to the original width, rather than shrinking away.
                float lipWidth = max(0.01, currentH * 1.10 * u_bulgeWidth *
                    mix(mix(1.0, 0.65, pull), 1.0, reabsorb) * birth);
                float lipDepth = currentH * mix(0.18, 0.60, pull) *
                    u_bulgeStretch * birth * retract;
                float shoulderX = min(1.0, abs(uv.x - 72.0) / lipWidth);
                float shoulder = 0.5 + 0.5 * cos(3.14159265 * shoulderX);
                float dLip = uv.y - lipDepth * shoulder;
                float dIsland = releasePhase < 0.60
                    ? smoothUnion(dOrb, dLip, max(0.001, currentH * 0.60 * (1.0 - smoothstep(0.20, 0.32, releasePhase))))
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
                // Keep the bezel black, but reveal the glass during separation.
                float orbMask = 1.0 - smoothstep(-1.0, 1.0, dOrb);
                float glassReveal = smoothstep(0.12, 0.32, releasePhase);
                vec3 color = clamp((glassBody + lights) / max(alpha, 0.001), 0.0, 1.0) * orbMask * glassReveal;
                alpha = mix(1.0, alpha, orbMask * glassReveal);
                gl_FragColor = vec4(color, edgeIsland * alpha);
            }
        `;function T(o){return o?.classList.contains("visible")?o.classList.contains("error-mode")?"error":o.classList.contains("processing")?"processing":o.classList.contains("speaking")?"speaking":o.classList.contains("listening")?"listening":"connecting":"idle"}function S(o,e){if(!["listening","speaking"].includes(e)||!o?.classList.contains("reactive"))return 0;let i=Number.parseFloat(o.style.getPropertyValue("--vs-audio-level"));return Number.isFinite(i)?Math.max(0,Math.min(i,1)):0}var m=class{value=0;velocity=0;target=0;update(e){let i=Math.min(Math.max(e,0),.033)/4;for(let t=0;t<4;t++)this.velocity+=(-450*(this.value-this.target)-28*this.velocity)*i,this.value+=this.velocity*i;return Math.abs(this.velocity)<1e-4&&Math.abs(this.value-this.target)<1e-4&&(this.value=this.target,this.velocity=0),this.value}};var D=`
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,M=["002fff","00ffde","fa1f1f","ff930d","9900ff","00ff88"],R={u_introStartAmp:.2,u_scaleRatio:3.8,u_bezelWidth:58,u_glassThickness:31,u_ior:3.05,u_dispersionScale:2,u_surfaceCurvature:8,u_absorption:0,u_showBackground:1,u_topMorphUp:4.5,u_waveRefract:6.3,u_waveDispersion:15,u_waveEdgeBand:4.5,u_wavePower:1.55,u_bottomRimIntensity:.97,u_bottomRimWidth:1.4,xScale:1.6,yScale:.11,phaseDistance:-4.1,lineThickness:.056,pinTaper:2.8,spindleWidth:2.3,glowFalloff:1.5,glowIntensity:1.15,edgeFade:.42,hotCoreThreshold:7.2,hotCoreIntensity:3.2,fillOpacity:1,u_bgCrossFade:0},g=class{constructor(e,i){this.canvas=e,this.spring=new m,this.time=0,this.fade=0,this.intro=0,this.level=0,this.drop=0,this.thinking=0,this.locations=new Map,this.shaders=[];let t=e.getContext("webgl",{alpha:!0,antialias:!0,premultipliedAlpha:!1,depth:!1,stencil:!1,powerPreference:"low-power"});if(!t)throw new Error("WebGL unavailable");this.gl=t,this.contextLost=a=>{a.preventDefault(),i()},e.addEventListener("webglcontextlost",this.contextLost);try{if(!t.getExtension("OES_standard_derivatives"))throw new Error("Shader derivatives unavailable");this.program=t.createProgram();for(let[s,r]of[[t.VERTEX_SHADER,D],[t.FRAGMENT_SHADER,k]]){let l=t.createShader(s);if(this.shaders.push(l),t.shaderSource(l,r),t.compileShader(l),!t.getShaderParameter(l,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(l));t.attachShader(this.program,l)}if(t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(this.program));t.useProgram(this.program),this.buffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.buffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);let a=t.getAttribLocation(this.program,"position");t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0);for(let[s,r]of Object.entries(R))this.float(s,r);t.uniform2f(this.location("u_resolution"),144,112),t.uniform4f(this.location("u_shapeParams"),53,41,.01,0),t.uniform3f(this.location("u_glassTint"),.94,.96,1),t.uniform1i(this.location("activeWaves"),6),t.uniform3fv(this.location("uColors[0]"),M.flatMap(s=>{let r=parseInt(s,16);return[(r>>16&255)/255,(r>>8&255)/255,(r&255)/255]})),this.createEnvironment(),this.resize()}catch(a){throw this.dispose(),a}}location(e){return this.locations.has(e)||this.locations.set(e,this.gl.getUniformLocation(this.program,e)),this.locations.get(e)}float(e,i){this.gl.uniform1f(this.location(e),i)}createEnvironment(){let e=this.gl,i=128,t=new Uint8Array(i*i*4);for(let a=0;a<i;a++)for(let s=0;s<i;s++){let r=s/i,l=a/i,n=15+90*Math.exp(-((r-.65)**2*10+(l-.75)**2*5)),h=(a*i+s)*4;t.set([n*.84,n*.94,n*1.07,255],h)}this.texture=e.createTexture(),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,i,i,0,e.RGBA,e.UNSIGNED_BYTE,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);for(let a of["u_bgTexture","u_bgTextureNext"])e.uniform1i(this.location(a),0);for(let a of["u_bgScale","u_bgNextScale"])e.uniform2f(this.location(a),1,1);for(let a of["u_bgOffset","u_bgNextOffset"])e.uniform2f(this.location(a),0,0)}resize(){let e=Math.min(window.devicePixelRatio||1,2),i=this.canvas.clientWidth||240,t=this.canvas.clientHeight||i*112/144;this.canvas.width=Math.round(i*e),this.canvas.height=Math.round(t*e),this.gl.viewport(0,0,this.canvas.width,this.canvas.height),this.gl.uniform2f(this.location("u_resolution"),144,t/i*144),this.float("u_top",Math.max(0,t/i*144-112))}reset(){this.spring.value=this.spring.velocity=this.fade=this.intro=this.time=this.level=this.drop=this.thinking=0,this.drop=0,this.thinking=0}render(e,{state:i,level:t,reducedMotion:a=!1,circle:s=!1,opacity:r=.14,bottomGlow:l=.8,entrance:n=!0,bulgeWidth:h=1,bulgeStretch:d=1,elapsed:u=e}){let c=i!=="idle",f=!a&&n;this.drop=Math.max(0,Math.min(1,this.drop+(c?1:-1)*u/(c?.52:.8))),this.spring.target=c||f&&this.drop>0?1:0,this.thinking=Math.max(0,Math.min(1,this.thinking+(i==="processing"?1:-1)*u/.55)),this.float("u_drop",a||!n?1:this.drop),this.float("u_circle",Number(s)),this.float("u_bulgeWidth",h),this.float("u_bulgeStretch",d),this.float("u_bodyOpacity",r),this.float("u_bottomGlow",l),this.float("u_thinking",a?+(i==="processing"):this.thinking);let p=a?Number(c):this.spring.update(e);return this.level+=(t-this.level)*(1-Math.exp(-e*(t>this.level?18:7))),c&&p>.98?(this.fade=Math.min(1,this.fade+e/.3),this.intro=Math.min(1,this.intro+e/.65)):c||(this.fade=Math.max(0,this.fade-e/.16)),this.time-=e*(i==="processing"?1.2:2.7+this.level*1.6),this.float("u_progress",Math.max(0,Math.min(1.07,p))),this.float("u_waveFade",a?Number(c):this.fade),this.float("u_waveIntro",a?1:this.intro),this.float("u_time",a?-1.8:this.time),this.float("yScale",a?.11:i==="processing"?.065:.085+this.level*.13),this.float("glowIntensity",1.15+(a?0:this.level*.25)),this.gl.drawArrays(this.gl.TRIANGLES,0,6),f?c||this.drop>0:c||p>.002||Math.abs(this.spring.velocity)>.002}dispose(){let e=this.gl;this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(let i of this.shaders)e.deleteShader(i);this.buffer&&e.deleteBuffer(this.buffer),this.texture&&e.deleteTexture(this.texture),this.program&&e.deleteProgram(this.program),e.getExtension("WEBGL_lose_context")?.loseContext()}};var v=class{constructor(e){this.host=e;let i=`siri-glass-${Math.random().toString(36).slice(2)}`,t=document.createElement("canvas"),a=256;t.width=t.height=a;let s=t.getContext("2d");if(!s)return;let r=s.createImageData(a,a);for(let n=0;n<a;n++)for(let h=0;h<a;h++){let d=(h+.5)/(a/2)-1,u=(n+.5)/(a/2)-1,c=Math.hypot(d,u),f=Math.max(0,Math.min(1,(c-.3)/.7)),p=f*f*(3-2*f),_=c<1?Math.min(.98,c*p):0,W=(n*a+h)*4;r.data.set([128-d/Math.max(c,.001)*_*127,128-u/Math.max(c,.001)*_*127,128,255],W)}s.putImageData(r,0,0);let l="http://www.w3.org/2000/svg";this.svg=document.createElementNS(l,"svg"),this.svg.setAttribute("width","0"),this.svg.setAttribute("height","0"),this.svg.setAttribute("aria-hidden","true"),this.svg.style.position="absolute",this.svg.innerHTML=`<defs><filter id="${i}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage width="100%" height="100%" preserveAspectRatio="none" result="lens"/><feDisplacementMap in="SourceGraphic" in2="lens" xChannelSelector="R" yChannelSelector="G" scale="64"/></filter></defs>`,this.svg.querySelector("feImage").setAttribute("href",t.toDataURL()),this.displace=this.svg.querySelector("feDisplacementMap"),this.el=document.createElement("div"),this.el.className="siri-island-refraction",this.el.setAttribute("aria-hidden","true"),this.el.style.backdropFilter=`url(#${i})`,this.el.style.webkitBackdropFilter=`url(#${i})`,e.prepend(this.svg,this.el)}update(e,i){this.el&&(this.amount!==e&&(this.displace.setAttribute("scale",String(e)),this.amount=e),this.el.style.visibility=i&&e>0?"visible":"hidden")}};var b=Symbol.for("voice-satellite.siri-island"),A={idle:"",connecting:"Connecting",listening:"Listening",processing:"Thinking",speaking:"Speaking",error:"Check Voice Satellite"},x=class{constructor(e,i){this.ui=e,this.bar=i,this.state="idle",this.raf=0,this.lastTime=0,this.lastDraw=0,this.el=document.createElement("div"),this.el.className="siri-island",this.el.dataset.visible="false",this.el.innerHTML='<canvas aria-hidden="true"></canvas><div class="siri-island-fallback" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span class="siri-island-label" role="status" aria-live="polite"></span>',this.glass=new v(this.el),this.canvas=this.el.querySelector("canvas"),this.label=this.el.querySelector(".siri-island-label"),e.append(this.el),e.classList.add("siri-island-enabled"),this.motion=matchMedia("(prefers-reduced-motion: reduce)"),this.change=()=>this.sync(),this.motion.addEventListener("change",this.change),document.addEventListener("visibilitychange",this.change),this.observer=new MutationObserver(this.change),this.observer.observe(i,{attributes:!0,attributeFilter:["class"]}),this.resizeObserver=new ResizeObserver(()=>{this.renderer?.resize(),this.state!=="idle"&&this.start()}),this.resizeObserver.observe(this.canvas),this.sync()}initRenderer(){if(!(this.renderer||this.failed))try{this.renderer=new g(this.canvas,()=>this.fallback()),this.el.dataset.renderer="webgl"}catch(e){console.warn("[Siri Island] Using static fallback:",e.message),this.fallback()}}fallback(){this.failed=!0,this.stop(),this.el.dataset.renderer="fallback",this.glass.update(0,!1)}sync(){let e=getComputedStyle(this.ui),i=(s,r,l=1)=>{let n=parseFloat(e.getPropertyValue(s));return Number.isFinite(n)?Math.max(0,Math.min(n,l)):r};this.appearance={circle:e.getPropertyValue("--siri-island-shape").trim()!=="island",opacity:i("--siri-island-glass-opacity",.14),bulgeWidth:i("--siri-island-bulge-width",1,1.4),bulgeStretch:i("--siri-island-bulge-stretch",1,2.5),bottomGlow:i("--siri-island-bottom-glow",.8,2),entrance:e.getPropertyValue("--siri-island-entrance").trim()!=="none"},this.refraction=i("--siri-island-refraction",64,120),this.el.dataset.shape=this.appearance.circle?"circle":"island";let t=T(this.bar),a=this.state==="idle";if(this.state=t,this.el.dataset.state=t,this.label.textContent=A[t],document.hidden){this.stop(),this.el.dataset.visible="false",this.glass.update(0,!1);return}t!=="idle"?(this.initRenderer(),a&&this.el.dataset.visible!=="true"&&this.renderer?.reset(),this.el.dataset.visible="true",this.start()):this.motion.matches||this.failed?(this.stop(),this.el.dataset.visible="false"):this.renderer&&this.start()}start(){this.raf||this.failed||!this.renderer||document.hidden||(this.lastTime=this.lastDraw=0,this.raf=requestAnimationFrame(e=>this.tick(e)))}tick(e){if(this.raf=0,document.hidden||this.failed)return;if(this.lastDraw&&e-this.lastDraw<30){this.raf=requestAnimationFrame(s=>this.tick(s));return}let i=this.lastTime?(e-this.lastTime)/1e3:1/30,t=Math.min(i,.05);this.lastDraw=this.lastTime=e;let a=this.renderer.render(t,{...this.appearance,elapsed:i,state:this.state,level:S(this.bar,this.state),reducedMotion:this.motion.matches});this.glass.update(this.refraction,this.state!=="idle"&&(this.motion.matches||!this.appearance.entrance||this.renderer.drop>=1)),a?this.motion.matches||(this.raf=requestAnimationFrame(s=>this.tick(s))):this.el.dataset.visible="false"}stop(){cancelAnimationFrame(this.raf),this.raf=0}dispose(){this.stop(),this.observer.disconnect(),this.resizeObserver.disconnect(),this.motion.removeEventListener("change",this.change),document.removeEventListener("visibilitychange",this.change),this.renderer?.dispose(),this.ui.classList.remove("siri-island-enabled"),this.el.remove()}};function w(){if(window[b])return window[b];let o=document.createElement("style");o.id="siri-island-styles",o.textContent=y,document.head.append(o);let e=null,i=!1,t=!1,a=()=>{if(i=!1,t)return;let h=document.getElementById("voice-satellite-ui"),d=h?.querySelector(".vs-rainbow-bar"),u=h&&getComputedStyle(h).getPropertyValue("--siri-island-enabled").trim()==="1";e&&(!u||e.ui!==h||e.bar!==d)&&(e.dispose(),e=null),u&&d&&!e?e=new x(h,d):e?.sync()},s=()=>{i||(i=!0,queueMicrotask(a))},r=new MutationObserver(s);r.observe(document.body,{childList:!0});let l=new MutationObserver(s);l.observe(document.head,{childList:!0,subtree:!0,characterData:!0});let n={version:"0.2.0",refresh:a,dispose(){t=!0,r.disconnect(),l.disconnect(),e?.dispose(),o.remove(),delete window[b]}};return window[b]=n,a(),n}document.body?w():document.addEventListener("DOMContentLoaded",w,{once:!0});

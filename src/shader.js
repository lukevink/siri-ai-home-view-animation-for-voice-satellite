// Adapted from Neel Dedkawala, ios-siri-animation, commit 801ac85.
// MIT license: see licenses/ios-siri-animation.txt.
// Changes: cropped viewport, portable smoothstep falloffs, finite wave-tip division.
export const fragmentShader = `
#extension GL_OES_standard_derivatives : enable

            precision highp float;

            uniform float u_time;
            uniform float u_progress;
            uniform float u_drop;
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

            // Original implementation; visual inspiration: 40973894's Siri Wave / Fluid Dots.
            vec3 fluidDots(vec2 p, float time) {
                float t = -time * 0.65;
                float gather = 0.5 + 0.5 * sin(t * 0.85);
                float distanceField = 10.0;
                vec3 tint = vec3(0.0);
                float weight = 0.0;
                for (int i = 0; i < 5; i++) {
                    float f = float(i);
                    float angle = f * 1.256637 + t * 0.45;
                    float radius = mix(0.12, 0.40, gather) + 0.035 * sin(t * 1.7 + f);
                    vec2 center = vec2(cos(angle), sin(angle)) * radius;
                    center.y *= 0.72;
                    float size = 0.105 + 0.025 * sin(t * 1.3 + f * 2.0);
                    float d = length(p - center) - size;
                    distanceField = smoothUnion(distanceField, d, 0.18);
                    float w = exp(-length(p - center) * 9.0);
                    vec3 c = 0.55 + 0.45 * cos(vec3(0.0, 2.1, 4.2) + f * 1.25 + t * 0.25);
                    tint += c * w;
                    weight += w;
                }
                tint /= max(weight, 0.001);
                float core = 1.0 - smoothstep(-0.025, 0.018, distanceField);
                float glow = exp(-max(distanceField, 0.0) * 20.0) * 0.22;
                float edge = exp(-abs(distanceField) * 65.0);
                return mix(tint, vec3(1.0), 0.65) * core + tint * glow + vec3(0.3) * edge;
            }

            void main() {
                vec2 uv = vec2(vUv.x, 1.0 - vUv.y) * u_resolution;
                float currentH = mix(41.0, 43.0, u_circle);
                // Extrude, pinch off, then settle: one continuous surface at the bezel.
                float travel = smoothstep(0.0, 0.78, u_drop);
                float settle = sin((u_drop - 0.78) * 18.0) *
                    (1.0 - smoothstep(0.78, 1.0, u_drop)) * 3.0 * step(0.78, u_drop);
                float centerY = mix(-14.0, u_top + currentH + 5.0, travel) + settle;
                float grow = mix(0.32, 1.0, smoothstep(0.08, 0.85, u_drop));
                vec2 p = uv - vec2(72.0, centerY);
                p /= grow;
                p.y /= 1.0 + 0.22 * sin(u_drop * PI);
                float dOrb = getIslandSDF(p, u_progress) * grow;
                float neckEnd = max(centerY, 1.0);
                float along = clamp(uv.y / neckEnd, 0.0, 1.0);
                float pinch = 1.0 - smoothstep(0.32, 0.62, u_drop);
                float neckWidth = (3.0 + 30.0 * pow(1.0 - along, 3.0)) * pinch;
                float dNeck = max(abs(uv.x - 72.0) - neckWidth, uv.y - neckEnd);
                float join = 10.0 * pinch;
                float blend = max(join - abs(dOrb - dNeck), 0.0) / max(join, 0.001);
                float joined = min(dOrb, dNeck) - blend * blend * join * 0.25;
                float dIsland = u_drop < 0.62 ? joined : dOrb;

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

                // A transmissive lower hemisphere, a dark upper cap and white caustic.
                float lower = smoothstep(-0.3, 0.65, p.y / max(currentH, 1.0));
                float bodyAlpha = mix(0.96, u_bodyOpacity, lower);
                float rim = exp(-distFromBorder * 1.7) * (0.18 + 0.82 * lower);
                float bottomLight = exp(-pow(p.x / 20.0, 2.0) - pow((p.y - currentH * 0.83) / 9.0, 2.0));
                float horizon = exp(-pow((p.y - 4.0 + 3.0 * cos(p.x / 28.0)) / 1.9, 2.0)) *
                    exp(-pow(p.x / 37.0, 4.0));
                float sheen = (rim * 0.75 + bottomLight * u_bottomGlow + horizon * 0.18) * u_progress;
                vec3 lights = accumulatedWave * (1.0 - u_thinking) + fluidDots(p / 43.0, u_time) * u_thinking * u_waveFade;
                lights += vec3(1.0, 0.97, 0.93) * sheen;
                float lightAlpha = clamp(max(max(lights.r, lights.g), lights.b), 0.0, 1.0);
                float alpha = max(bodyAlpha, lightAlpha);
                // The neck is pure black; illumination belongs to the detached glass.
                float orbMask = 1.0 - smoothstep(-1.0, 1.0, dOrb);
                vec3 color = clamp((glassBody + lights) / max(alpha, 0.001), 0.0, 1.0) * orbMask;
                alpha = mix(1.0, alpha, orbMask);
                gl_FragColor = vec4(color, edgeIsland * alpha);
            }
        `;

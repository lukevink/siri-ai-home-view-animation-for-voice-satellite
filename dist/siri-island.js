/*! Siri Island 0.1.0 — AGPL-3.0-only.
 * Source: https://github.com/lukevink/siriAI-voicesatellite
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
var g=`/* Scoped to the opt-in host: other Voice Satellite skins stay untouched. */
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
}
#voice-satellite-ui .siri-island {
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + var(--siri-island-top, 20px));
  left: 50%;
  width: min(var(--siri-island-width, 240px), 80vw);
  transform: translateX(-50%);
  z-index: 10002;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 180ms ease, visibility 180ms;
  contain: layout style;
}
#voice-satellite-ui .siri-island[data-visible="true"] { opacity: 1; visibility: visible; }
#voice-satellite-ui .siri-island canvas { width: 100%; aspect-ratio: 144 / 112; display: block; }
#voice-satellite-ui .siri-island-label {
  display: block;
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
#voice-satellite-ui .siri-island-fallback {
  display: none;
  height: 132px;
  margin: 24px 12%;
  border-radius: 42%;
  border: 1px solid #8a8eaa;
  background: radial-gradient(ellipse at 55% 60%, #47475e, #080912 70%);
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
  #voice-satellite-ui .siri-island { width: min(var(--siri-island-width, 170px), 40vw); }
}
@media (prefers-reduced-motion: reduce) {
  #voice-satellite-ui .siri-island { transition: none; }
}
`;var b=`
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
        `;function x(r){return r?.classList.contains("visible")?r.classList.contains("error-mode")?"error":r.classList.contains("processing")?"processing":r.classList.contains("speaking")?"speaking":r.classList.contains("listening")?"listening":"connecting":"idle"}function _(r,e){if(!["listening","speaking"].includes(e)||!r?.classList.contains("reactive"))return 0;let i=Number.parseFloat(r.style.getPropertyValue("--vs-audio-level"));return Number.isFinite(i)?Math.max(0,Math.min(i,1)):0}var h=class{value=0;velocity=0;target=0;update(e){let i=Math.min(Math.max(e,0),.033)/4;for(let t=0;t<4;t++)this.velocity+=(-450*(this.value-this.target)-28*this.velocity)*i,this.value+=this.velocity*i;return Math.abs(this.velocity)<1e-4&&Math.abs(this.value-this.target)<1e-4&&(this.value=this.target,this.velocity=0),this.value}};var y=`
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,k=["002fff","00ffde","fa1f1f","ff930d","9900ff","00ff88"],T={u_introStartAmp:.2,u_scaleRatio:3.8,u_bezelWidth:58,u_glassThickness:31,u_ior:3.05,u_dispersionScale:2,u_surfaceCurvature:8,u_absorption:0,u_showBackground:1,u_topMorphUp:4.5,u_waveRefract:6.3,u_waveDispersion:15,u_waveEdgeBand:4.5,u_wavePower:1.55,u_bottomRimIntensity:.97,u_bottomRimWidth:1.4,xScale:1.6,yScale:.11,phaseDistance:-4.1,lineThickness:.056,pinTaper:2.8,spindleWidth:2.3,glowFalloff:1.5,glowIntensity:1.15,edgeFade:.42,hotCoreThreshold:7.2,hotCoreIntensity:3.2,fillOpacity:1,u_bgCrossFade:0},u=class{constructor(e,i){this.canvas=e,this.spring=new h,this.time=0,this.fade=0,this.intro=0,this.level=0,this.locations=new Map,this.shaders=[];let t=e.getContext("webgl",{alpha:!0,antialias:!0,premultipliedAlpha:!1,depth:!1,stencil:!1,powerPreference:"low-power"});if(!t)throw new Error("WebGL unavailable");this.gl=t,this.contextLost=a=>{a.preventDefault(),i()},e.addEventListener("webglcontextlost",this.contextLost);try{if(!t.getExtension("OES_standard_derivatives"))throw new Error("Shader derivatives unavailable");this.program=t.createProgram();for(let[s,o]of[[t.VERTEX_SHADER,y],[t.FRAGMENT_SHADER,b]]){let n=t.createShader(s);if(this.shaders.push(n),t.shaderSource(n,o),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(n));t.attachShader(this.program,n)}if(t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(this.program));t.useProgram(this.program),this.buffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.buffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);let a=t.getAttribLocation(this.program,"position");t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0);for(let[s,o]of Object.entries(T))this.float(s,o);t.uniform2f(this.location("u_resolution"),144,112),t.uniform4f(this.location("u_shapeParams"),53,41,.01,0),t.uniform3f(this.location("u_glassTint"),.94,.96,1),t.uniform1i(this.location("activeWaves"),4),t.uniform3fv(this.location("uColors[0]"),k.flatMap(s=>{let o=parseInt(s,16);return[(o>>16&255)/255,(o>>8&255)/255,(o&255)/255]})),this.createEnvironment(),this.resize()}catch(a){throw this.dispose(),a}}location(e){return this.locations.has(e)||this.locations.set(e,this.gl.getUniformLocation(this.program,e)),this.locations.get(e)}float(e,i){this.gl.uniform1f(this.location(e),i)}createEnvironment(){let e=this.gl,i=128,t=new Uint8Array(i*i*4);for(let a=0;a<i;a++)for(let s=0;s<i;s++){let o=s/i,n=a/i,c=15+90*Math.exp(-((o-.65)**2*10+(n-.75)**2*5)),l=(a*i+s)*4;t.set([c*.84,c*.94,c*1.07,255],l)}this.texture=e.createTexture(),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,i,i,0,e.RGBA,e.UNSIGNED_BYTE,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);for(let a of["u_bgTexture","u_bgTextureNext"])e.uniform1i(this.location(a),0);for(let a of["u_bgScale","u_bgNextScale"])e.uniform2f(this.location(a),1,1);for(let a of["u_bgOffset","u_bgNextOffset"])e.uniform2f(this.location(a),0,0)}resize(){let e=Math.min(window.devicePixelRatio||1,2),i=this.canvas.clientWidth||240;this.canvas.width=Math.round(i*e),this.canvas.height=Math.round(i*112/144*e),this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}reset(){this.spring.value=this.spring.velocity=this.fade=this.intro=this.time=this.level=0}render(e,{state:i,level:t,reducedMotion:a=!1}){let s=i!=="idle";this.spring.target=s?1:0;let o=a?Number(s):this.spring.update(e);return this.level+=(t-this.level)*(1-Math.exp(-e*(t>this.level?18:7))),s&&o>.98?(this.fade=Math.min(1,this.fade+e/.3),this.intro=Math.min(1,this.intro+e/.65)):s||(this.fade=Math.max(0,this.fade-e/.16)),this.time-=e*(i==="processing"?1.2:2.7+this.level*1.6),this.float("u_progress",Math.max(0,Math.min(1.07,o))),this.float("u_waveFade",a?Number(s):this.fade),this.float("u_waveIntro",a?1:this.intro),this.float("u_time",a?-1.8:this.time),this.float("yScale",a?.11:i==="processing"?.065:.085+this.level*.13),this.float("glowIntensity",1.15+(a?0:this.level*.25)),this.gl.drawArrays(this.gl.TRIANGLES,0,6),s||o>.002||Math.abs(this.spring.velocity)>.002}dispose(){let e=this.gl;this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(let i of this.shaders)e.deleteShader(i);this.buffer&&e.deleteBuffer(this.buffer),this.texture&&e.deleteTexture(this.texture),this.program&&e.deleteProgram(this.program),e.getExtension("WEBGL_lose_context")?.loseContext()}};var f=Symbol.for("voice-satellite.siri-island"),S={idle:"",connecting:"Connecting",listening:"Listening",processing:"Thinking",speaking:"Speaking",error:"Check Voice Satellite"},p=class{constructor(e,i){this.ui=e,this.bar=i,this.state="idle",this.raf=0,this.lastTime=0,this.lastDraw=0,this.el=document.createElement("div"),this.el.className="siri-island",this.el.dataset.visible="false",this.el.innerHTML='<canvas aria-hidden="true"></canvas><div class="siri-island-fallback" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span class="siri-island-label" role="status" aria-live="polite"></span>',this.canvas=this.el.querySelector("canvas"),this.label=this.el.querySelector(".siri-island-label"),e.append(this.el),e.classList.add("siri-island-enabled"),this.motion=matchMedia("(prefers-reduced-motion: reduce)"),this.change=()=>this.sync(),this.motion.addEventListener("change",this.change),document.addEventListener("visibilitychange",this.change),this.observer=new MutationObserver(this.change),this.observer.observe(i,{attributes:!0,attributeFilter:["class"]}),this.resizeObserver=new ResizeObserver(()=>{this.renderer?.resize(),this.state!=="idle"&&this.start()}),this.resizeObserver.observe(this.canvas),this.sync()}initRenderer(){if(!(this.renderer||this.failed))try{this.renderer=new u(this.canvas,()=>this.fallback()),this.el.dataset.renderer="webgl"}catch(e){console.warn("[Siri Island] Using static fallback:",e.message),this.fallback()}}fallback(){this.failed=!0,this.stop(),this.el.dataset.renderer="fallback"}sync(){let e=x(this.bar),i=this.state==="idle";if(this.state=e,this.el.dataset.state=e,this.label.textContent=S[e],document.hidden){this.stop(),this.el.dataset.visible="false";return}e!=="idle"?(this.initRenderer(),i&&this.renderer?.reset(),this.el.dataset.visible="true",this.start()):this.motion.matches||this.failed?(this.stop(),this.el.dataset.visible="false"):this.renderer&&this.start()}start(){this.raf||this.failed||!this.renderer||document.hidden||(this.lastTime=this.lastDraw=0,this.raf=requestAnimationFrame(e=>this.tick(e)))}tick(e){if(this.raf=0,document.hidden||this.failed)return;if(this.lastDraw&&e-this.lastDraw<30){this.raf=requestAnimationFrame(a=>this.tick(a));return}let i=this.lastTime?Math.min((e-this.lastTime)/1e3,.05):1/30;this.lastDraw=this.lastTime=e,this.renderer.render(i,{state:this.state,level:_(this.bar,this.state),reducedMotion:this.motion.matches})?this.motion.matches||(this.raf=requestAnimationFrame(a=>this.tick(a))):this.el.dataset.visible="false"}stop(){cancelAnimationFrame(this.raf),this.raf=0}dispose(){this.stop(),this.observer.disconnect(),this.resizeObserver.disconnect(),this.motion.removeEventListener("change",this.change),document.removeEventListener("visibilitychange",this.change),this.renderer?.dispose(),this.ui.classList.remove("siri-island-enabled"),this.el.remove()}};function m(){if(window[f])return window[f];let r=document.createElement("style");r.id="siri-island-styles",r.textContent=g,document.head.append(r);let e=null,i=!1,t=!1,a=()=>{if(i=!1,t)return;let l=document.getElementById("voice-satellite-ui"),d=l?.querySelector(".vs-rainbow-bar"),v=l&&getComputedStyle(l).getPropertyValue("--siri-island-enabled").trim()==="1";e&&(!v||e.ui!==l||e.bar!==d)&&(e.dispose(),e=null),v&&d&&!e&&(e=new p(l,d))},s=()=>{i||(i=!0,queueMicrotask(a))},o=new MutationObserver(s);o.observe(document.body,{childList:!0});let n=new MutationObserver(s);n.observe(document.head,{childList:!0,subtree:!0,characterData:!0});let c={version:"0.1.0",refresh:a,dispose(){t=!0,o.disconnect(),n.disconnect(),e?.dispose(),r.remove(),delete window[f]}};return window[f]=c,a(),c}document.body?m():document.addEventListener("DOMContentLoaded",m,{once:!0});

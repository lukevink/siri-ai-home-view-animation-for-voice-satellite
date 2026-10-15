# Third-party notices

## iOS Siri Animation

Author: Neel Dedkawala. Copyright (c) 2026 Neel Dedkawala.

Source: https://github.com/neeldedkawala/ios-siri-animation

Reference revision: `801ac85bc87f1446c25e85ad6258a7af43663797`.

License: MIT. Full notice: [licenses/ios-siri-animation.txt](licenses/ios-siri-animation.txt).

`src/shader.js` adapts the fragment shader from `js/main.js`. `src/lens.js` adapts its Snell-law edge profile for the live backdrop displacement map, with adjusted curvature and strength. `src/state.js` adapts the spring model. `src/renderer.js` retains reference visual parameters and supplies a WebGL renderer, procedural environment texture, cropped viewport, and audio-level modulation. Shader changes include portable smoothstep falloffs and a guard against division by zero at wave tips. The original Three.js demo, phone shell, wallpaper images, and control dock are not shipped.

The original MIT notice is embedded in `dist/siri-island.js` and `upstream/siri-island-runtime.js`.

## Voice Satellite

Source: https://github.com/jxlarrea/voice-satellite-card-integration

Reference revision: `78f0f4b74fec0d5be39de9089915dd1129991096`.

License: GNU Affero General Public License version 3. Full text is included as [LICENSE](LICENSE).

`tests/fixtures/voice-satellite-siri.css` is the upstream `src/skins/siri.css` at that revision. It is used by the local preview and compatibility tests. The optional upstream adapter imports the upstream Siri skin when placed into a Voice Satellite source checkout. This repository's distribution is under AGPL-3.0-only; the original animation retains its MIT notice.

## Fluid-dots visual reference

40973894 — Siri Wave / Fluid Dots: https://21st.dev/@40973894/components/siri-wave/fluid-dots

The reference is listed as MIT on 21st.dev. Our five-dot smooth-union shader is independently implemented from the visual behavior; no source from this component is included. The bezel-drop geometry, transparent compositing and lower caustic are additions in this repository inspired by the supplied interface screenshots.

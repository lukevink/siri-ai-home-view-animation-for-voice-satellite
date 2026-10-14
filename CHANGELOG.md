# Changelog

## 0.2.0

- Renamed to Siri AI Home View Animation for Voice Satellite.
- Liquid top-bezel entrance with a stretching neck, pinch-off and settling motion.
- Circular orb by default; the existing rounded island remains available with `--siri-island-shape: island`.
- Transparent lower glass, white bottom caustic and delicate rim; configurable opacity and glow.
- Live dashboard refraction through a small inline SVG displacement filter where supported; transparent fallback elsewhere.
- Fluid dots during thinking, with a smooth transition back to reactive listening/speaking waves.
- Preview controls for shape, transparency, background contrast and replaying the drop.
- Preserved CSS flags, JavaScript filename, Voice Satellite state bridge, idle/hidden GPU suspension, reduced motion and static fallback.


## 0.1.0

Initial experimental release: the MIT-licensed Neel Dedkawala glass-island animation adapted to Voice Satellite's activity and audio-level signals. Includes a standalone frontend module, opt-in CSS, optional built-in skin adapter, local preview, browser checks, and original-author attribution.

Validation: Chromium and WebKit preview tests. A live Home Assistant and physical-device smoke test is still required.

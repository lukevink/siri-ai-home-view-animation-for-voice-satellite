# Changelog

## 0.2.5

- Contract voice waves into one dot and expand into five spinning dots in 550 ms.
- Grow the orb during its 650 ms descent, with a small position-only bounce.
- Add horizontal position, bezel bulge width, and bulge stretch settings, with preview sliders alongside resting height.


## 0.2.4

- Expand the conversation caption panel across the screen with matching side and bottom margins.

## 0.2.3

- Six thinking dots now follow a circular orbit with equal horizontal and vertical radius.
- The bezel extrudes a smaller teardrop that pinches off before expanding into the full orb; dismissal reverses the same geometry.
- Centered animated README preview over a cropped Home Assistant dashboard background.

## 0.2.2

- Voice curves gather into one white droplet, then split into six smaller, faster liquid dots; the transition reverses when speech resumes.
- White lightweight captions sit in one rounded black panel with a lower glow and backdrop gradient.
- Rename the repository to siri-homeview-hass-animation and add an animated README preview.

## 0.2.1

- Return the orb to the bezel on dismissal, reversing the liquid drop.
- Add wider black shoulders and a curved pool at the screen edge.
- Resume smoothly when a new interaction interrupts the exit.

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

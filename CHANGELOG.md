# Changelog

## 0.2.18

- Refresh both README animations with the current glass refraction and motion.
- Update the manual-installation resource version.

## 0.2.17

- Adapt the original animation’s Snell-law edge optics to the live backdrop, preserving central text with stronger bending confined to the rim.

## 0.2.16

- Use spherical lens refraction to preserve the center and bend detail into the rim.
- Keep the backdrop displacement aligned and proportional when the orb resizes.
- Add a text and grid preview for comparing glass distortion.

## 0.2.15

- Slightly slow the full entrance while preserving its phase timing proportions.
- Add a subtle positional overshoot without bouncing the orb's scale.

## 0.2.14

- Slightly slow the bezel release and shorten the final width expansion.

## 0.2.13

- Stop the drop at its resting height without overshoot, then finish widening after separation.

## 0.2.12

- Recoil the bulge into a shallow shoulder by the 35% entrance frame and reveal the glass during separation.

## 0.2.11

- Round the connected liquid shoulder to remove the pinched neck and angular transition into the droplet.

## 0.2.10

- Recoil the detached bezel bulge rapidly into a wide, shallow shoulder before settling flat.

## 0.2.9

- Concentrate lens distortion around the rim while preserving the center, with stronger default displacement.

- Fully separate the orb from the bulge before beginning bezel retraction.
- Keep the bulge moving through the visible gap, flowing from stretch directly into retraction.
- Spread the retracting bulge back across the bezel as its depth flattens, like a droplet being reabsorbed.

## 0.2.8

- Increase default backdrop refraction, smooth the lens map, and add a strength slider to the preview.

- Simplify the entrance to a rounded drop emerging from one bezel bulge, without a pointed tip or separate neck.
- Add a frame-by-frame entrance preview.
- Default the preview to a light Home Assistant-style sections dashboard.

## 0.2.7

- Complete the coordinated drop entrance in 450 ms.

- Hide status labels unless the UI has the `siri-island-show-status` class.

- Scale the bulge, neck, and default resting gap with the orb diameter.

- Start the orb as a narrow tapered droplet, widening around neck separation.
- Coordinate the droplet tip, neck pinch-off, and immediate bezel retraction.

## 0.2.6

- Increase thinking-dot rotation speed.
- Stretch the bezel bulge from broad and shallow to narrow and tall before it retracts.

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

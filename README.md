# Siri AI Home View Animation for Voice Satellite

A liquid drop from the top bezel that settles into a transparent glass orb or rounded island, with audio-reactive Siri-style waves for [Voice Satellite for Home Assistant](https://github.com/jxlarrea/voice-satellite-card-integration). It opens when Voice Satellite starts a voice interaction, changes with listening / thinking / speaking, and disappears when the interaction ends.

**The original animation is by [Neel Dedkawala](https://github.com/neeldedkawala).** This project adapts the shader and spring animation from his MIT-licensed **[iOS Siri Animation](https://github.com/neeldedkawala/ios-siri-animation)**. Please visit and credit the original project. The Home Assistant bridge, packaging, and audio-reactive adaptation are additions here.

Version 0.2 adds a liquid bezel entrance, a circular orb option, transparent glass with a white lower glow, and fluid thinking dots. Run the local preview below to compare both shapes and light/dark backgrounds.

**Status: experimental 0.2.0.** The existing adapter has been used with Home Assistant and Android Kiosk Satellite. The new visuals are validated in the local preview and browser compatibility checks; physical-device performance of this version still needs verification. This is an independent community extension, not an official Voice Satellite or Apple product.

## What you install

This is a **companion JavaScript frontend resource**, enabled through Voice Satellite's Custom CSS field. Voice Satellite currently bundles its skins; it does not document a public API for registering third-party JavaScript skins. Consequently this extension does **not** add another item to its skin dropdown. Select the existing **Siri** skin and enable the island using the CSS below.

It uses the same activity-bar classes and `--vs-audio-level` value that Voice Satellite's bundled animated skins use. It does not open a microphone, run wake-word detection, connect to Home Assistant, or replace the Assist pipeline. Voice Satellite remains responsible for all of those functions.

- Flows from the top edge, stretches into a liquid neck, detaches, and settles into a circle or rounded island.
- Uses real canvas transparency in the lower hemisphere, a dark upper cap, a thin rim and a white bottom glow.
- Merges and scatters five luminous fluid dots while thinking, then crossfades back to audio-reactive waves.
- Reacts to local microphone and local speech playback levels when **Reactive activity bar** is enabled.
- Uses gentler procedural motion while thinking, or when real audio levels are unavailable.
- Stays attached to Voice Satellite's global UI across dashboard navigation.
- Pauses GPU rendering when idle or when the page is hidden; renders at up to 30 FPS with device pixel ratio capped at 2.
- Respects reduced-motion preferences and provides a static fallback if WebGL is unavailable or the context is lost.
- Makes no runtime network requests and loads no code from a CDN.

## Before installing

Install [Voice Satellite](https://github.com/jxlarrea/voice-satellite-card-integration) and configure a working Assist pipeline and a satellite on the browser/device you want to use. Confirm a normal voice interaction works first. Installing this skin alone does not enable voice control.

The adapter was developed against Voice Satellite commit [`78f0f4b`](https://github.com/jxlarrea/voice-satellite-card-integration/commit/78f0f4b74fec0d5be39de9089915dd1129991096). Its DOM selectors are internal compatibility points, not a guaranteed public API. Future upstream changes may require updating this extension.

## Install with HACS

This repository is designed for **HACS custom repository installation**, not yet included in the default HACS catalog.

1. Open **HACS → ⋮ → Custom repositories**.
2. Add `https://github.com/lukevink/siri-ai-home-view-animation-for-voice-satellite` with category **Dashboard**.
3. Download **Siri AI Home View Animation for Voice Satellite**.
4. Check **Settings → Dashboards → Resources** for a JavaScript module resource pointing to:

   ```text
   /hacsfiles/siri-ai-home-view-animation-for-voice-satellite/siri-island.js
   ```

   HACS may add this automatically. Add it only if it is missing. Advanced mode may be needed to see Resources.

5. In the **Voice Satellite** sidebar, open **Advanced**:
   - Skin: **Siri**
   - Reactive activity bar: **On**
   - Background Opacity: approximately **15–25%** if you want the dashboard visible behind the island.
6. Paste this into **Custom CSS**:

   ```css
   #voice-satellite-ui {
     --siri-island-enabled: 1;
     --siri-island-shape: circle;
     --siri-island-glass-opacity: 0.14;
     --siri-island-bottom-glow: 0.8;
     --siri-island-width: 240px;
     --siri-island-top: 20px;
     --siri-island-backdrop-blur: 2px;
   }
   ```

7. Save and reload the dashboard. Repeat the Voice Satellite appearance settings for each satellite/browser profile that should use the skin.

Dashboard resources load with dashboards. For loading from **every Home Assistant page**, including opening directly on a settings page, also register the same URL as an extra frontend module in `configuration.yaml`:

```yaml
frontend:
  extra_module_url:
    - /hacsfiles/siri-ai-home-view-animation-for-voice-satellite/siri-island.js
```

Merge this into an existing `frontend:` section rather than creating a duplicate key. Restart Home Assistant after changing YAML. The module is a singleton, so loading it through both routes does not create duplicate islands. See [Home Assistant's extra module documentation](https://www.home-assistant.io/integrations/frontend/#loading-extra-javascript).

## Manual installation

1. Copy [`dist/siri-island.js`](dist/siri-island.js) to `/config/www/siri-island.js` on your Home Assistant server.
2. Add `/local/siri-island.js?v=0.2.0` as a JavaScript module under Dashboard Resources, or use that URL under `frontend.extra_module_url` above.
3. Follow steps 5–7 from the HACS instructions.

No Python component, card YAML, or access token is required. Keep the copyright/license banner in the distributed JavaScript file intact.

## Adjusting the appearance

The `--siri-island-*` CSS names and `siri-island.js` filename remain compatible with earlier installations.

| Setting | Default | Effect |
| --- | --- | --- |
| `--siri-island-shape` | `island` | `circle` selects the spherical orb; `island` retains the rounded shape. |
| `--siri-island-width` | `240px` | Width of the animation canvas; the visible orb occupies approximately 60% of it. |
| `--siri-island-top` | `20px` | Gap below the safe-area inset after the drop settles. The entrance always starts at the viewport top. |
| `--siri-island-glass-opacity` | `0.14` | Lower glass opacity from `0` to `1`; the upper cap stays dark. |
| `--siri-island-bottom-glow` | `0.8` | White lower glow strength from `0` to `2`. |
| `--siri-island-refraction` | `18` | Live backdrop displacement strength from `0` to `40` pixels; `0` disables it. |
| `--siri-island-entrance` | `drop` | Set `none` to disable the falling entrance. Reduced-motion users also skip it. |
| `--siri-island-backdrop-blur` | `2px` | Blur applied to Voice Satellite's full-screen backdrop. |

The lower glass is genuinely transparent to the dashboard. A separate SVG backdrop displacement layer bends the actual dashboard behind the settled orb in browsers that support SVG backdrop filters (verified in Chromium). The WebGL shader adds the illuminated rim and subtle studio reflections. Safari and other browsers without SVG backdrop-filter support retain the transparent glass without live distortion. This is a browser approximation, not Apple’s system compositor. No DOM screenshot capture or additional network requests are involved. Fluid dots are an original lightweight smooth-union shader inspired by [40973894's Siri Wave / Fluid Dots](https://21st.dev/@40973894/components/siri-wave/fluid-dots); no React dependency or code from that component is bundled.

### Updating from Siri Island 0.1

The repository was renamed from `lukevink/siriAI-voicesatellite`. GitHub redirects the old repository URL. Existing HACS installations may retain `/hacsfiles/siriAI-voicesatellite/siri-island.js`; keep the resource path actually provided by HACS rather than changing it blindly. New installations use the new repository name shown above. Reload the dashboard after updating, and add `--siri-island-shape: circle` to each browser's Custom CSS to select the new orb. The old shape remains the default for existing configurations.

When TTS is played on a remote speaker, Voice Satellite does not expose that speaker's audio levels to this browser. The skin still animates, but its movement is procedural rather than synchronized with remote audio. A wake chime or delay can also use an upstream synthetic level; the extension displays the signal it receives.

An iPhone can display the skin while the dashboard is active. The skin does not circumvent iOS background microphone restrictions or add screen-off wake-word detection.

## Disable or uninstall

Remove `--siri-island-enabled: 1` from Custom CSS (or set it to `0`). The extension removes its canvas and restores the original skin's activity bar. To uninstall completely, remove its dashboard/frontend resource and delete the HACS download or manual JavaScript file, then reload.

## Development and preview

```sh
npm ci
npm run build
npm run preview
```

Open `http://127.0.0.1:4173`. The preview has simulated listening, thinking, speaking, audio level, and skin controls; it does not connect to your home or record audio. Dashboard content in the preview is illustrative.

```sh
npx playwright install chromium webkit
npm run check
```

The browser tests exercise WebGL shader compilation, state changes, teardown/re-enable, UI replacement, duplicate loading, fallback, context loss, visibility transitions, and reduced motion. The test fixture is Voice Satellite's real Siri stylesheet at the pinned commit. Passing these tests does not establish end-to-end compatibility with every Home Assistant installation.

### Contributing it as a built-in skin

[`upstream/`](upstream/README.md) includes an adapter that adds **Siri Island** as a selectable built-in skin in a source checkout of Voice Satellite. It shares this project's renderer. That route requires rebuilding Voice Satellite and is intended for an upstream contribution or a maintained fork. It has not been accepted by the upstream project.

## Credits and licenses

- **Original animation, shader, and spring model:** [Neel Dedkawala — ios-siri-animation](https://github.com/neeldedkawala/ios-siri-animation), copyright © 2026 Neel Dedkawala, **MIT**. The original permission notice is preserved in [`licenses/ios-siri-animation.txt`](licenses/ios-siri-animation.txt), the built JavaScript, and the generated upstream runtime.
- **Thinking-dots visual inspiration:** [40973894 — Siri Wave / Fluid Dots](https://21st.dev/@40973894/components/siri-wave/fluid-dots). Independently implemented here; no source code copied.
- **Voice engine, overlay conventions, and test stylesheet:** [jxlarrea — Voice Satellite](https://github.com/jxlarrea/voice-satellite-card-integration), **AGPL-3.0**. This extension relies on that project's work and keeps its attribution.
- **This repository:** **AGPL-3.0-only**, with the original shader retaining its MIT notice. See [`LICENSE`](LICENSE) and [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

Siri and the original interface design belong to Apple. This is an independent visual adaptation and is not affiliated with or endorsed by Apple, Neel Dedkawala, Home Assistant, or the Voice Satellite maintainers.

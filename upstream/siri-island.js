// Copy these two files next to Voice Satellite's src/skins/siri.js.
import { siriSkin } from './siri.js';
import { installSiriIsland } from './siri-island-runtime.js';

export function ensureSiriIslandSkinRuntime() {
  if (document.body) installSiriIsland();
  else document.addEventListener('DOMContentLoaded', installSiriIsland, { once: true });
}

export const siriIslandSkin = {
  ...siriSkin,
  id: 'siri-island',
  name: 'Siri Island',
  defaultOpacity: 0.18,
  css: siriSkin.css + '\n#voice-satellite-ui { --siri-island-enabled: 1; }',
  // Editor preview is static; the full animation runs in the live overlay.
  previewCSS: siriSkin.previewCSS + `
    .preview-bar { inset: 12px auto auto 50%; transform: translateX(-50%);
      width: 62px; height: 48px; border: 1px solid #8993a7; border-radius: 40%;
      background: radial-gradient(ellipse at center, #00ffde 0%, #002fff 15%, #fa1f1f 25%, #10131d 55%);
      filter: none; animation: none; }
    .preview-bar::after, .preview-bar::before { display: none; }
  `,
};

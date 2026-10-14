# Optional built-in skin adapter

For a contribution to Voice Satellite, or a source fork, copy `siri-island.js` and `siri-island-runtime.js` from this directory into that project's `src/skins/` directory. Also retain the original animation MIT notice and this repository's license/source attribution in your distribution.

Then edit `src/skins/index.js`:

```js
// Imports:
import { ensureSiriIslandSkinRuntime, siriIslandSkin } from './siri-island.js';

// SKIN_META:
{ value: 'siri-island', label: 'Siri Island' },

// SKINS:
'siri-island': siriIslandSkin,

// SKIN_ACTIVATORS:
'siri-island': ensureSiriIslandSkinRuntime,
```

Rebuild Voice Satellite using its own build instructions. The dropdown will then contain **Siri Island**, with a static editor preview and the live WebGL runtime. Do not also paste the companion's enable CSS when using the native adapter; the adapter's own skin CSS enables and disables it as the skin changes.

The runtime here is generated from `src/runtime.js` by `npm run build`. Make changes in this repository's source and rebuild rather than editing the generated file.

This adapter has not been merged upstream. Installing the standalone companion resource does not modify the upstream dropdown. Home Assistant/HACS updates to an unmodified official Voice Satellite installation would replace manual edits made to its files; the companion installation avoids those edits.

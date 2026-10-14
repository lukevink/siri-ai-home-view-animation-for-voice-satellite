import { installSiriIsland } from './runtime.js';
if (document.body) installSiriIsland();
else document.addEventListener('DOMContentLoaded', installSiriIsland, { once: true });

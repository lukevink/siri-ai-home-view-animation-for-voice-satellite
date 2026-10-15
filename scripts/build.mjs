import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
const notice = await readFile('licenses/ios-siri-animation.txt', 'utf8');
await build({
  entryPoints: ['src/index.js'], outfile: 'dist/siri-island.js', bundle: true,
  format: 'esm', target: ['safari15', 'chrome100', 'firefox100'], minify: true,
  loader: { '.css': 'text' },
  banner: { js: `/*! Siri AI Home View Animation for Voice Satellite 0.2.17 — AGPL-3.0-only.\n * Source: https://github.com/lukevink/siri-homeview-hass-animation\n * Shader adapted from neeldedkawala/ios-siri-animation (MIT).\n${notice}\n*/` },
});
// This native adapter can be copied into an upstream Voice Satellite checkout.
await build({
  entryPoints: ['src/runtime.js'], outfile: 'upstream/siri-island-runtime.js', bundle: true,
  format: 'esm', target: ['safari15', 'chrome100', 'firefox100'], minify: false,
  loader: { '.css': 'text' }, banner: { js: `/*! Shader attribution:\n${notice}\n*/` },
});
await writeFile('dist/enable-siri-island.css', await readFile('enable-siri-island.css'));
console.log('Built companion module and upstream skin runtime.');

import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

// Run while npm run preview is serving the local, simulated demo.
await mkdir('test-results/video', { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  recordVideo: { dir: 'test-results/video', size: { width: 1440, height: 1000 } },
});
const page = await context.newPage();
await page.goto('http://127.0.0.1:4173');
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'Listen', exact: true }).click();
await page.waitForTimeout(3500);
await page.screenshot({ path: 'docs/preview.png' });
await page.getByRole('button', { name: 'Think', exact: true }).click();
await page.waitForTimeout(1600);
await page.getByRole('button', { name: 'Speak', exact: true }).click();
await page.waitForTimeout(2500);
await page.getByRole('button', { name: 'Finish', exact: true }).click();
await page.waitForTimeout(900);
const video = page.video();
await context.close();
await video.saveAs('docs/preview.webm');
await browser.close();
console.log('Saved preview image and video.');

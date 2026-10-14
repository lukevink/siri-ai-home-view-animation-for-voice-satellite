import { test, expect } from '@playwright/test';

test('wake, processing, response and idle use the existing satellite state', async ({ page }, info) => {
  const errors=[]; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const island=page.locator('.siri-island');
  await expect(island).toHaveCount(1);
  await expect(island).toHaveAttribute('data-visible','false');
  await expect(island).not.toHaveAttribute('data-renderer');
  await page.getByRole('button', {name:'Listen',exact:true}).click();
  await expect(island).toHaveAttribute('data-state','listening');
  await expect(island).toHaveAttribute('data-visible','true');
  await expect(island).toHaveAttribute('data-renderer','webgl');
  await page.waitForTimeout(1800);
  await page.screenshot({ path:`test-results/${info.project.name}-listening.png` });
  await page.getByRole('button', {name:'Think',exact:true}).click();
  await expect(island).toHaveAttribute('data-state','processing');
  await page.getByRole('button', {name:'Speak',exact:true}).click();
  await expect(island).toHaveAttribute('data-state','speaking');
  await page.getByRole('button', {name:'Finish',exact:true}).click();
  await expect(island).toHaveAttribute('data-visible','false');
  expect(errors).toEqual([]);
});

test('opt out removes the skin and restores the built-in visual', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', {name:'Listen',exact:true}).click();
  await page.locator('#enabled').uncheck();
  await expect(page.locator('.siri-island')).toHaveCount(0);
  await expect(page.locator('#voice-satellite-ui')).not.toHaveClass(/siri-island-enabled/);
  await page.locator('#enabled').check();
  await expect(page.locator('.siri-island')).toHaveCount(1);
  await expect(page.locator('.siri-island')).toHaveAttribute('data-state','listening');
});

test('module survives navigation, late UI mount, and UI replacement without duplicates', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    const ui=document.getElementById('voice-satellite-ui');
    window.savedUI=ui.cloneNode(true); window.savedUI.querySelector('.siri-island')?.remove();
    ui.remove(); await new Promise(r=>setTimeout(r,50)); document.body.append(window.savedUI);
    await import('/dist/siri-island.js?duplicate-load');
  });
  await expect(page.locator('.siri-island')).toHaveCount(1);
  await page.evaluate(() => { history.pushState({},'', '#another-dashboard'); window.demo.setState('listening'); });
  await expect(page.locator('.siri-island')).toHaveAttribute('data-visible','true');
});

test('no WebGL has a readable fallback', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args) { return type==='webgl' ? null : getContext.call(this,type,...args); };
  });
  await page.goto('/');
  await page.getByRole('button', {name:'Listen',exact:true}).click();
  await expect(page.locator('.siri-island')).toHaveAttribute('data-renderer','fallback');
  await expect(page.locator('.siri-island-fallback')).toBeVisible();
  await expect(page.locator('.siri-island').getByRole('status', { includeHidden: true })).toHaveText('Listening');
});

test('reduced motion draws a still image and idle stops rendering', async ({ page }) => {
  await page.addInitScript(() => {
    window.drawCount=0;
    const getContext=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args) {
      const gl=getContext.call(this,type,...args);
      if(type==='webgl' && gl && !gl.__counted) { const draw=gl.drawArrays.bind(gl); gl.drawArrays=(...params)=>{window.drawCount++; return draw(...params);}; gl.__counted=true; }
      return gl;
    };
  });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/'); await page.getByRole('button',{name:'Listen',exact:true}).click();
  await page.waitForTimeout(400); const before=await page.evaluate(()=>window.drawCount);
  await page.waitForTimeout(300); expect(await page.evaluate(()=>window.drawCount)).toBe(before);
  expect(before).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Finish',exact:true}).click();
  await expect(page.locator('.siri-island')).toHaveAttribute('data-visible','false');
});

test('losing the GPU context keeps a readable status', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button',{name:'Listen',exact:true}).click();
  await expect(page.locator('.siri-island')).toHaveAttribute('data-renderer','webgl');
  await page.locator('.siri-island canvas').evaluate(canvas => canvas.getContext('webgl').getExtension('WEBGL_lose_context').loseContext());
  await expect(page.locator('.siri-island')).toHaveAttribute('data-renderer','fallback');
  await expect(page.locator('.siri-island-fallback')).toBeVisible();
});

test('backgrounding hides the island; returning restores the current phase', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button',{name:'Listen',exact:true}).click();
  await page.evaluate(() => { Object.defineProperty(document,'hidden',{configurable:true,value:true}); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(page.locator('.siri-island')).toHaveAttribute('data-visible','false');
  await page.evaluate(() => { window.demo.setState('speaking'); Object.defineProperty(document,'hidden',{configurable:true,value:false}); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(page.locator('.siri-island')).toHaveAttribute('data-visible','true');
  await expect(page.locator('.siri-island')).toHaveAttribute('data-state','speaking');
});


test('circle, live glass settings and legacy island switch without duplicate renderers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Think', exact: true }).click();
  const island = page.locator('.siri-island');
  await expect(island).toHaveAttribute('data-shape', 'circle');
  await expect(island).toHaveAttribute('data-renderer', 'webgl');
  await expect(page.locator('.siri-island-refraction')).toBeVisible();
  await page.locator('#shape').selectOption('island');
  await expect(island).toHaveAttribute('data-shape', 'island');
  await expect(page.locator('.siri-island canvas')).toHaveCount(1);
  await page.locator('#enabled').uncheck();
  await expect(page.locator('.siri-island-refraction')).toHaveCount(0);
  await page.locator('#enabled').check();
  await expect(page.locator('.siri-island-refraction')).toHaveCount(1);
});

test('long spoken replies stay inside the rounded caption panel and remain scrollable', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Speak', exact: true }).click();
  await page.locator('.vs-chat-msg.assistant').evaluate(el => {
    el.textContent = 'Here is a longer answer that remains readable on a tablet. '.repeat(30);
  });
  const panel = page.locator('.vs-chat-container');
  await expect(panel).toBeVisible();
  const layout = await panel.evaluate(el => {
    const r = el.getBoundingClientRect();
    const message = getComputedStyle(el.querySelector('.assistant'));
    return { left: r.left, right: r.right, bottom: r.bottom, width: innerWidth, height: innerHeight,
      overflow: el.scrollHeight > el.clientHeight, weight: message.fontWeight, color: message.color };
  });
  expect(layout.left).toBeGreaterThanOrEqual(0);
  expect(layout.right).toBeLessThanOrEqual(layout.width);
  expect(layout.bottom).toBeLessThanOrEqual(layout.height);
  expect(layout.overflow).toBe(true);
  expect(layout.weight).toBe('300');
  expect(layout.color).toBe('rgb(255, 255, 255)');
});

test('status labels are hidden unless their opt-in class is present', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Listen', exact: true }).click();
  const label = page.locator('.siri-island-label');
  await expect(label).toBeHidden();
  await page.getByLabel('Show status label').check();
  await expect(label).toBeVisible();
  await expect(label).toHaveText('Listening');
  await page.getByLabel('Show status label').uncheck();
  await expect(label).toBeHidden();
});


test('lens bounds and optical strength track resized orb geometry', async ({ page }) => {
  await page.goto('/demo/glass.html');
  const geometry = () => page.locator('.siri-island-refraction').evaluate(el => {
    const filter = el.parentElement.querySelector('filter');
    const image = filter.querySelector('feImage');
    return { width: el.clientWidth, height: el.clientHeight,
      filterWidth: Number(filter.getAttribute('width')), filterHeight: Number(filter.getAttribute('height')),
      imageWidth: Number(image.getAttribute('width')), imageHeight: Number(image.getAttribute('height')),
      scale: Number(filter.querySelector('feDisplacementMap').getAttribute('scale')) };
  });
  await expect.poll(async () => (await geometry()).filterWidth).toBeGreaterThan(0);
  const before = await geometry();
  expect(before.filterWidth).toBe(before.width);
  expect(before.filterHeight).toBe(before.height);
  await page.evaluate(() => document.getElementById('voice-satellite-ui').style.setProperty('--siri-island-width','240px'));
  await expect.poll(async () => (await geometry()).width).not.toBe(before.width);
  await expect.poll(async () => (await geometry()).filterWidth).toBe((await geometry()).width);
  const after = await geometry();
  expect(after.imageWidth).toBe(after.width);
  expect(after.imageHeight).toBe(after.height);
  expect(after.scale / after.width).toBeCloseTo(before.scale / before.width, 4);
  await page.locator('#strength').focus();
  await page.keyboard.press('Home');
  await expect(page.locator('.siri-island-refraction')).toBeHidden();
});

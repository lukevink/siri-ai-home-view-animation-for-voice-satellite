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
  await expect(page.locator('.siri-island').getByRole('status')).toHaveText('Listening');
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

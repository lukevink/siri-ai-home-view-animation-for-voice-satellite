import css from './island.css';
import { IslandRenderer } from './renderer.js';
import { GlassRefraction } from './refraction.js';
import { readActivity, audioLevel } from './state.js';

const KEY = Symbol.for('voice-satellite.siri-island');
const LABELS = { idle: '', connecting: 'Connecting', listening: 'Listening', processing: 'Thinking', speaking: 'Speaking', error: 'Check Voice Satellite' };

class Island {
  constructor(ui, bar) {
    this.ui = ui;
    this.bar = bar;
    this.state = 'idle';
    this.raf = 0;
    this.lastTime = 0;
    this.lastDraw = 0;
    this.el = document.createElement('div');
    this.el.className = 'siri-island';
    this.el.dataset.visible = 'false';
    this.el.innerHTML = '<canvas aria-hidden="true"></canvas><div class="siri-island-fallback" aria-hidden="true"><i></i><i></i><i></i><i></i></div><span class="siri-island-label" role="status" aria-live="polite"></span>';
    this.glass = new GlassRefraction(this.el);
    this.canvas = this.el.querySelector('canvas');
    this.label = this.el.querySelector('.siri-island-label');
    ui.append(this.el);
    ui.classList.add('siri-island-enabled');
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.change = () => this.sync();
    this.motion.addEventListener('change', this.change);
    document.addEventListener('visibilitychange', this.change);
    this.observer = new MutationObserver(this.change);
    this.observer.observe(bar, { attributes: true, attributeFilter: ['class'] });
    this.resizeObserver = new ResizeObserver(() => {
      this.renderer?.resize();
      if (this.state !== 'idle') this.start();
    });
    this.resizeObserver.observe(this.canvas);
    this.sync();
  }

  initRenderer() {
    if (this.renderer || this.failed) return;
    try {
      this.renderer = new IslandRenderer(this.canvas, () => this.fallback());
      this.el.dataset.renderer = 'webgl';
    } catch (error) {
      console.warn('[Siri Island] Using static fallback:', error.message);
      this.fallback();
    }
  }

  fallback() {
    this.failed = true;
    this.stop();
    this.el.dataset.renderer = 'fallback';
    this.glass.update(0, false);
  }

  sync() {
    const style = getComputedStyle(this.ui);
    const number = (name, fallback, max = 1) => {
      const value = parseFloat(style.getPropertyValue(name));
      return Number.isFinite(value) ? Math.max(0, Math.min(value, max)) : fallback;
    };
    this.appearance = {
      circle: style.getPropertyValue('--siri-island-shape').trim() === 'circle',
      opacity: number('--siri-island-glass-opacity', 0.14),
      bottomGlow: number('--siri-island-bottom-glow', 0.8, 2),
      entrance: style.getPropertyValue('--siri-island-entrance').trim() !== 'none',
    };
    this.refraction = number('--siri-island-refraction', 18, 40);
    this.el.dataset.shape = this.appearance.circle ? 'circle' : 'island';
    const next = readActivity(this.bar);
    const wasIdle = this.state === 'idle';
    this.state = next;
    this.el.dataset.state = next;
    this.label.textContent = LABELS[next];
    if (document.hidden) {
      this.stop();
      this.el.dataset.visible = 'false';
      this.glass.update(0, false);
      return;
    }
    if (next !== 'idle') {
      this.initRenderer();
      if (wasIdle) this.renderer?.reset();
      this.el.dataset.visible = 'true';
      this.start();
    } else if (this.motion.matches || this.failed) {
      this.stop();
      this.el.dataset.visible = 'false';
    } else if (this.renderer) {
      this.start(); // complete the closing spring, then stop all GPU work
    }
  }

  start() {
    if (this.raf || this.failed || !this.renderer || document.hidden) return;
    this.lastTime = this.lastDraw = 0;
    this.raf = requestAnimationFrame(time => this.tick(time));
  }

  tick(time) {
    this.raf = 0;
    if (document.hidden || this.failed) return;
    // 30fps and a capped pixel ratio keep the small overlay practical on tablets.
    if (this.lastDraw && time - this.lastDraw < 30) {
      this.raf = requestAnimationFrame(next => this.tick(next));
      return;
    }
    const delta = this.lastTime ? Math.min((time - this.lastTime) / 1000, .05) : 1 / 30;
    this.lastDraw = this.lastTime = time;
    const running = this.renderer.render(delta, {
      ...this.appearance, state: this.state, level: audioLevel(this.bar, this.state), reducedMotion: this.motion.matches,
    });
    this.glass.update(this.refraction, this.state !== 'idle' &&
      (this.motion.matches || !this.appearance.entrance || this.renderer.drop >= 1));
    if (!running) this.el.dataset.visible = 'false';
    else if (!this.motion.matches) this.raf = requestAnimationFrame(next => this.tick(next));
  }

  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }

  dispose() {
    this.stop();
    this.observer.disconnect();
    this.resizeObserver.disconnect();
    this.motion.removeEventListener('change', this.change);
    document.removeEventListener('visibilitychange', this.change);
    this.renderer?.dispose();
    this.ui.classList.remove('siri-island-enabled');
    this.el.remove();
  }
}

/** The companion and native skin adapter use the same opt-in CSS flag. */
export function installSiriIsland() {
  if (window[KEY]) return window[KEY];
  const style = document.createElement('style');
  style.id = 'siri-island-styles';
  style.textContent = css;
  document.head.append(style);
  let island = null;
  let queued = false;
  let disposed = false;
  const sync = () => {
    queued = false;
    if (disposed) return;
    const ui = document.getElementById('voice-satellite-ui');
    const bar = ui?.querySelector('.vs-rainbow-bar');
    const enabled = ui && getComputedStyle(ui).getPropertyValue('--siri-island-enabled').trim() === '1';
    if (island && (!enabled || island.ui !== ui || island.bar !== bar)) {
      island.dispose();
      island = null;
    }
    if (enabled && bar && !island) island = new Island(ui, bar);
    else island?.sync();
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(sync);
  };
  // Voice Satellite inserts its global UI directly in body and its skin/custom
  // CSS in head. No microphone access, HA credentials, or prototype patching.
  const bodyObserver = new MutationObserver(schedule);
  bodyObserver.observe(document.body, { childList: true });
  const headObserver = new MutationObserver(schedule);
  headObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
  const api = {
    version: '0.2.0',
    refresh: sync,
    dispose() {
      disposed = true;
      bodyObserver.disconnect(); headObserver.disconnect();
      island?.dispose(); style.remove();
      delete window[KEY];
    },
  };
  window[KEY] = api;
  sync();
  return api;
}

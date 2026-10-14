/** Voice Satellite's activity-bar contract, checked against 78f0f4b. */
export function readActivity(bar) {
  if (!bar?.classList.contains('visible')) return 'idle';
  if (bar.classList.contains('error-mode')) return 'error';
  if (bar.classList.contains('processing')) return 'processing';
  if (bar.classList.contains('speaking')) return 'speaking';
  if (bar.classList.contains('listening')) return 'listening';
  return 'connecting';
}

export function audioLevel(bar, state) {
  if (!['listening', 'speaking'].includes(state)) return 0;
  if (!bar?.classList.contains('reactive')) return 0;
  const value = Number.parseFloat(bar.style.getPropertyValue('--vs-audio-level'));
  return Number.isFinite(value) ? Math.max(0, Math.min(value, 1)) : 0;
}

// Same second-order spring model as the reference, with bounded integration.
export class Spring {
  value = 0;
  velocity = 0;
  target = 0;

  update(delta) {
    const step = Math.min(Math.max(delta, 0), 0.033) / 4;
    for (let i = 0; i < 4; i++) {
      this.velocity += (-450 * (this.value - this.target) - 28 * this.velocity) * step;
      this.value += this.velocity * step;
    }
    if (Math.abs(this.velocity) < 0.0001 && Math.abs(this.value - this.target) < 0.0001) {
      this.value = this.target;
      this.velocity = 0;
    }
    return this.value;
  }
}

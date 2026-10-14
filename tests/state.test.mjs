import test from 'node:test';
import assert from 'node:assert/strict';
import { readActivity, audioLevel, Spring } from '../src/state.js';
import { IslandRenderer } from '../src/renderer.js';

const bar = (classes, level = '0') => ({ classList: new Set(classes.split(' ')), style: { getPropertyValue: () => level } });
const makeBar = (...args) => { const b = bar(...args); b.classList.contains = b.classList.has; return b; };

test('passive wake-word listening stays hidden until the activity bar is visible', () => {
  assert.equal(readActivity(null), 'idle');
  assert.equal(readActivity(makeBar('listening')), 'idle');
  assert.equal(readActivity(makeBar('visible listening reactive')), 'listening');
  assert.equal(readActivity(makeBar('visible processing')), 'processing');
  assert.equal(readActivity(makeBar('visible speaking reactive')), 'speaking');
  assert.equal(readActivity(makeBar('visible connecting')), 'connecting');
});

test('audio levels are finite and only used when local reactivity is enabled', () => {
  assert.equal(audioLevel(makeBar('visible speaking reactive','0.65'),'speaking'), .65);
  assert.equal(audioLevel(makeBar('visible speaking','0.65'),'speaking'), 0);
  for (const [input, expected] of [['NaN',0], ['Infinity',0], ['-1',0], ['9',1], ['',0]]) {
    assert.equal(audioLevel(makeBar('reactive', input), 'listening'), expected);
  }
  assert.equal(audioLevel(makeBar('reactive','1'), 'processing'), 0);
});

test('spring settles after opening and closing, even following a suspended tab', () => {
  const spring = new Spring(); spring.target = 1;
  for (let i=0; i<160; i++) spring.update(i === 1 ? 600 : 1/30);
  assert.equal(spring.value, 1);
  spring.target = 0;
  for (let i=0; i<160; i++) spring.update(1/30);
  assert.equal(spring.value, 0); assert.equal(spring.velocity, 0);
});

test('dismissal returns the full orb to the bezel and stops, including slow frames and interrupted exits', () => {
  const renderer = Object.assign(Object.create(IslandRenderer.prototype), {
    spring: new Spring(), time: 0, fade: 0, intro: 0, level: 0, drop: 0, thinking: 0,
    float() {}, gl: { drawArrays() {}, TRIANGLES: 4 },
  });
  const frame = (state, elapsed = 1 / 30) => renderer.render(Math.min(elapsed, .05), {state, level: 0, elapsed});
  for (let i = 0; i < 40; i++) frame('listening');
  assert.equal(renderer.drop, 1);
  assert.equal(frame('idle', .4), true);
  assert.ok(renderer.drop > .4 && renderer.drop < .6);
  assert.equal(renderer.spring.target, 1, 'do not collapse to a pill while returning');
  const halfway = renderer.drop;
  frame('listening');
  assert.ok(renderer.drop > halfway, 'a new interaction reverses without jumping to the top');
  assert.equal(frame('idle', 1), false, 'stop drawing once the surface rejoins the bezel');
  assert.equal(renderer.drop, 0);
});

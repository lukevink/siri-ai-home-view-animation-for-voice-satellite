import test from 'node:test';
import assert from 'node:assert/strict';
import { readActivity, audioLevel, Spring } from '../src/state.js';

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

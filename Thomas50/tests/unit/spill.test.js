import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load spill.js — installs window.ThomasSpill
beforeAll(() => {
  const code = readFileSync(resolve(__dirname, '../../spill.js'), 'utf-8');
  // jsdom provides window; alias for the IIFE that does `window.ThomasSpill = ...`
  globalThis.window = globalThis.window || globalThis;
  // eslint-disable-next-line no-new-func
  new Function(code).call(globalThis);
});

describe('spill.js — ThomasSpill API', () => {
  it('eksponerer init/start/stopp/hopp', () => {
    expect(window.ThomasSpill).toBeDefined();
    expect(typeof window.ThomasSpill.init).toBe('function');
    expect(typeof window.ThomasSpill.start).toBe('function');
    expect(typeof window.ThomasSpill.stopp).toBe('function');
    expect(typeof window.ThomasSpill.hopp).toBe('function');
  });

  it('init kan motta canvas og callback uten å kaste', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 420;
    // jsdom har ikke full canvas-støtte — stub getContext
    canvas.getContext = () => ({
      setTransform: () => {}, fillRect: () => {}, clearRect: () => {},
      beginPath: () => {}, arc: () => {}, fill: () => {}, stroke: () => {},
      moveTo: () => {}, lineTo: () => {}, closePath: () => {},
      fillText: () => {}, save: () => {}, restore: () => {}, scale: () => {},
      strokeRect: () => {}, createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      set fillStyle(v) {}, set strokeStyle(v) {}, set globalAlpha(v) {},
      set font(v) {}, set textBaseline(v) {}, set textAlign(v) {}, set lineWidth(v) {},
    });
    document.body.appendChild(canvas);
    expect(() => window.ThomasSpill.init(canvas, () => {})).not.toThrow();
  });

  it('hopp kan kalles uten kjørende spill (no-op)', () => {
    expect(() => window.ThomasSpill.hopp()).not.toThrow();
  });

  it('stopp kan kalles uten kjørende spill (no-op)', () => {
    expect(() => window.ThomasSpill.stopp()).not.toThrow();
  });
});

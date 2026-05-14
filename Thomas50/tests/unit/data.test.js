import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

let GJESTER, BORD_TEMA;

beforeAll(() => {
  const code = readFileSync(resolve(__dirname, '../../data.js'), 'utf-8');
  // Run in a context that lets `const` declarations leak into `ctx`
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  // Wrap so const becomes properties of ctx via globalThis assignment
  vm.runInContext(
    code +
      '\n;globalThis.__data__ = { GJESTER, BORD_TEMA, SPILL_QUIZ, EVENT_DATO_ISO };',
    ctx
  );
  GJESTER = ctx.__data__.GJESTER;
  BORD_TEMA = ctx.__data__.BORD_TEMA;
});

describe('data.js — GJESTER', () => {
  it('inneholder gjester', () => {
    expect(Array.isArray(GJESTER)).toBe(true);
    expect(GJESTER.length).toBeGreaterThan(0);
  });

  it('alle gjester har navn', () => {
    for (const g of GJESTER) {
      expect(typeof g.navn).toBe('string');
      expect(g.navn.length).toBeGreaterThan(0);
    }
  });

  it('navn er unike', () => {
    const navn = GJESTER.map(g => g.navn);
    const unike = new Set(navn);
    expect(unike.size).toBe(navn.length);
  });

  it('bord-numre er gyldige (1-20)', () => {
    for (const g of GJESTER) {
      if (g.bord != null && !g.avbud) {
        expect(g.bord).toBeGreaterThanOrEqual(1);
        expect(g.bord).toBeLessThanOrEqual(20);
      }
    }
  });
});

describe('data.js — BORD_TEMA', () => {
  it('eksisterer', () => {
    expect(BORD_TEMA).toBeDefined();
  });
  it('hvert tema har farge og fjell', () => {
    for (const [bordnr, tema] of Object.entries(BORD_TEMA)) {
      expect(tema.farge).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(typeof tema.fjell).toBe('string');
      expect(tema.fjell.length).toBeGreaterThan(0);
    }
  });
});

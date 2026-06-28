import { describe, it, expect } from 'vitest';
import { windowState, parseHHMM } from './window';
import type { Settings } from './types';

const S: Settings = { windowStart: '19:00', windowMinutes: 20, firstRunDone: true };
// Build a local-time Date for a given H:M on 2026-06-28.
const at = (h: number, m: number) => new Date(2026, 5, 28, h, m, 0, 0);

describe('parseHHMM', () => {
  it('parses hour and minute', () => {
    expect(parseHHMM('19:05')).toEqual({ h: 19, m: 5 });
    expect(parseHHMM('08:00')).toEqual({ h: 8, m: 0 });
  });
});

describe('windowState', () => {
  it('LOCKED before today window, counts down to today start', () => {
    const r = windowState(S, at(18, 0)); // 1h before 19:00
    expect(r.state).toBe('LOCKED');
    if (r.state === 'LOCKED') expect(r.msToNextWindow).toBe(60 * 60 * 1000);
  });
  it('OPEN inside the window, reports ms remaining', () => {
    const r = windowState(S, at(19, 5)); // 5 min into a 20-min window
    expect(r.state).toBe('OPEN');
    if (r.state === 'OPEN') expect(r.msRemaining).toBe(15 * 60 * 1000);
  });
  it('LOCKED right at window end', () => {
    const r = windowState(S, at(19, 20)); // window is [19:00, 19:20)
    expect(r.state).toBe('LOCKED');
  });
  it('LOCKED after window, counts down to tomorrow start', () => {
    const r = windowState(S, at(20, 0)); // 23h to next 19:00
    expect(r.state).toBe('LOCKED');
    if (r.state === 'LOCKED') expect(r.msToNextWindow).toBe(23 * 60 * 60 * 1000);
  });
});

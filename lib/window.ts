import type { Settings } from './types';

export type WindowState =
  | { state: 'OPEN'; msRemaining: number }
  | { state: 'LOCKED'; msToNextWindow: number };

export function parseHHMM(s: string): { h: number; m: number } {
  const [h, m] = s.split(':').map(Number);
  return { h, m };
}

export function windowState(settings: Settings, now: Date): WindowState {
  const { h, m } = parseHHMM(settings.windowStart);
  const start = new Date(now);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + settings.windowMinutes * 60 * 1000);
  const t = now.getTime();

  if (t >= start.getTime() && t < end.getTime()) {
    return { state: 'OPEN', msRemaining: end.getTime() - t };
  }
  let next = start.getTime();
  if (t >= end.getTime()) next += 24 * 60 * 60 * 1000; // tomorrow's start
  return { state: 'LOCKED', msToNextWindow: next - t };
}

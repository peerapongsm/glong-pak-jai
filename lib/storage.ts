import type { Worry, Settings } from './types';
import { DEFAULT_SETTINGS } from './types';

const WORRIES_KEY = 'gpj.worries';
const SETTINGS_KEY = 'gpj.settings';

// Test seam: defaults to the browser's localStorage when present.
let store: Storage | null =
  typeof localStorage !== 'undefined' ? localStorage : null;

export function __setStorage(s: Storage | null): void {
  store = s;
}

function read(key: string): string | null {
  try { return store ? store.getItem(key) : null; } catch { return null; }
}
function write(key: string, val: string): void {
  try { store?.setItem(key, val); } catch { /* full/unavailable: ignore */ }
}

export function loadWorries(): Worry[] {
  const raw = read(WORRIES_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Worry[]; } catch { return []; }
}
export function saveWorries(list: Worry[]): void {
  write(WORRIES_KEY, JSON.stringify(list));
}
export function loadSettings(): Settings {
  const raw = read(SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as Settings; }
  catch { return { ...DEFAULT_SETTINGS }; }
}
export function saveSettings(s: Settings): void {
  write(SETTINGS_KEY, JSON.stringify(s));
}
export function exportJSON(): string {
  return JSON.stringify({ worries: loadWorries(), settings: loadSettings() }, null, 2);
}
export function clearAll(): void {
  try { store?.removeItem(WORRIES_KEY); store?.removeItem(SETTINGS_KEY); } catch { /* ignore */ }
}

import { describe, it, expect, beforeEach } from 'vitest';
import { __setStorage, loadWorries, saveWorries, loadSettings, saveSettings, exportJSON, clearAll } from './storage';
import { DEFAULT_SETTINGS } from './types';

class MemStorage {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
  key() { return null; }
  get length() { return this.m.size; }
}

beforeEach(() => __setStorage(new MemStorage() as unknown as Storage));

describe('storage', () => {
  it('round-trips worries', () => {
    saveWorries([{ id: '1', text: 'a', createdAt: 1, status: 'pending' }]);
    expect(loadWorries()).toHaveLength(1);
  });
  it('returns defaults when no settings saved', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
  it('round-trips settings', () => {
    saveSettings({ windowStart: '20:30', windowMinutes: 15, firstRunDone: true });
    expect(loadSettings().windowStart).toBe('20:30');
  });
  it('exports both worries and settings as JSON', () => {
    saveWorries([{ id: '1', text: 'a', createdAt: 1, status: 'pending' }]);
    const parsed = JSON.parse(exportJSON());
    expect(parsed.worries).toHaveLength(1);
    expect(parsed.settings).toBeDefined();
  });
  it('clearAll wipes data back to defaults', () => {
    saveWorries([{ id: '1', text: 'a', createdAt: 1, status: 'pending' }]);
    clearAll();
    expect(loadWorries()).toEqual([]);
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
  it('returns empty list when storage is unavailable', () => {
    __setStorage(null);
    expect(loadWorries()).toEqual([]);
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});

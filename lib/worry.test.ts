import { describe, it, expect } from 'vitest';
import { createWorry, resolveWorry, pendingWorries, resolvedWorries, stats } from './worry';

describe('createWorry', () => {
  it('creates a pending worry with trimmed text', () => {
    const w = createWorry('  กลัวพรีเซนต์พรุ่งนี้  ', 1000);
    expect(w).not.toBeNull();
    expect(w!.text).toBe('กลัวพรีเซนต์พรุ่งนี้');
    expect(w!.status).toBe('pending');
    expect(w!.createdAt).toBe(1000);
    expect(typeof w!.id).toBe('string');
  });
  it('returns null for empty/whitespace text', () => {
    expect(createWorry('   ')).toBeNull();
    expect(createWorry('')).toBeNull();
  });
});

describe('resolveWorry', () => {
  it('marks resolved with disposition and resolvedAt', () => {
    const w = createWorry('x', 1)!;
    const r = resolveWorry(w, 'didnt_happen', { now: 50 });
    expect(r.status).toBe('resolved');
    expect(r.disposition).toBe('didnt_happen');
    expect(r.resolvedAt).toBe(50);
  });
  it('stores actionNote for action disposition', () => {
    const w = createWorry('x', 1)!;
    const r = resolveWorry(w, 'action', { actionNote: 'โทรหาหมอ', now: 2 });
    expect(r.disposition).toBe('action');
    expect(r.actionNote).toBe('โทรหาหมอ');
  });
});

describe('pending/resolved filters', () => {
  it('splits by status', () => {
    const a = createWorry('a', 1)!;
    const b = resolveWorry(createWorry('b', 2)!, 'action', { now: 3 });
    expect(pendingWorries([a, b]).map(w => w.text)).toEqual(['a']);
    expect(resolvedWorries([a, b]).map(w => w.text)).toEqual(['b']);
  });
});

describe('stats', () => {
  it('computes didnt-happen percentage over resolved outcome worries', () => {
    const list = [
      resolveWorry(createWorry('1', 1)!, 'didnt_happen', { now: 2 }),
      resolveWorry(createWorry('2', 1)!, 'didnt_happen', { now: 2 }),
      resolveWorry(createWorry('3', 1)!, 'didnt_happen', { now: 2 }),
      resolveWorry(createWorry('4', 1)!, 'happened_coped', { now: 2 }),
      resolveWorry(createWorry('5', 1)!, 'action', { now: 2 }),
      createWorry('6', 1)!,
    ];
    const s = stats(list);
    expect(s.didntHappen).toBe(3);
    expect(s.happenedCoped).toBe(1);
    expect(s.action).toBe(1);
    expect(s.pending).toBe(1);
    expect(s.didntHappenPct).toBe(75); // 3 / (3+1)
  });
  it('returns null pct when no outcome worries', () => {
    const s = stats([createWorry('a', 1)!]);
    expect(s.didntHappenPct).toBeNull();
  });
});

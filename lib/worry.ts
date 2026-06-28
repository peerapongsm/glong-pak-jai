import type { Worry, Disposition } from './types';

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function createWorry(text: string, now: number = Date.now()): Worry | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  return { id: genId(), text: trimmed, createdAt: now, status: 'pending' };
}

export function resolveWorry(
  w: Worry,
  disposition: Disposition,
  opts: { actionNote?: string; now?: number } = {},
): Worry {
  return {
    ...w,
    status: 'resolved',
    disposition,
    actionNote: disposition === 'action' ? opts.actionNote?.trim() || undefined : undefined,
    resolvedAt: opts.now ?? Date.now(),
  };
}

export function pendingWorries(list: Worry[]): Worry[] {
  return list.filter(w => w.status === 'pending');
}

export function resolvedWorries(list: Worry[]): Worry[] {
  return list.filter(w => w.status === 'resolved');
}

export function stats(list: Worry[]) {
  let didntHappen = 0, happenedCoped = 0, action = 0, pending = 0;
  for (const w of list) {
    if (w.status === 'pending') { pending++; continue; }
    if (w.disposition === 'didnt_happen') didntHappen++;
    else if (w.disposition === 'happened_coped') happenedCoped++;
    else if (w.disposition === 'action') action++;
  }
  const denom = didntHappen + happenedCoped;
  const didntHappenPct = denom === 0 ? null : Math.round((didntHappen / denom) * 100);
  return { didntHappen, happenedCoped, action, pending, didntHappenPct };
}

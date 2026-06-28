// Pure geometry for the clock-dial time picker. All angles in degrees measured
// from 12 o'clock (top), increasing clockwise (0..360). No DOM here so it stays
// unit-testable.

export function angleDeg(dx: number, dy: number): number {
  // screen y grows downward; top = (0,-1) should map to 0deg.
  const a = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return (a + 360) % 360;
}

// Clock position 0..11 (0 = top / 12 o'clock).
function clockPos(deg: number): number {
  return Math.round(deg / 30) % 12;
}

// 24h hour from angle + ring. Outer ring carries 1..12, inner carries 13..23 and 00.
export function hourFromPos(deg: number, outer: boolean): number {
  const p = clockPos(deg);
  if (outer) return p === 0 ? 12 : p;
  return p === 0 ? 0 : p + 12;
}

// Minute snapped to the nearest 5 (0..55).
export function minuteFromAngle(deg: number): number {
  return (clockPos(deg) * 5) % 60;
}

// Outer ring if the point is past the midpoint between the two number rings.
export function isOuterRing(dist: number, rInner: number, rOuter: number): boolean {
  return dist >= (rInner + rOuter) / 2;
}

export function fmt(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function parse(v: string): { h: number; m: number } {
  const [h, m] = v.split(':').map(Number);
  return { h: Number.isFinite(h) ? h : 0, m: Number.isFinite(m) ? m : 0 };
}

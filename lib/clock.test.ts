import { describe, it, expect } from 'vitest';
import { angleDeg, hourFromPos, minuteFromAngle, isOuterRing, fmt, parse } from './clock';

describe('angleDeg', () => {
  it('maps the four cardinal directions from 12 o\'clock clockwise', () => {
    expect(angleDeg(0, -10)).toBe(0);   // top
    expect(angleDeg(10, 0)).toBe(90);   // right (3 o'clock)
    expect(angleDeg(0, 10)).toBe(180);  // bottom (6)
    expect(angleDeg(-10, 0)).toBe(270); // left (9)
  });
});

describe('hourFromPos', () => {
  it('outer ring carries 1..12 (top = 12)', () => {
    expect(hourFromPos(0, true)).toBe(12);
    expect(hourFromPos(90, true)).toBe(3);
    expect(hourFromPos(180, true)).toBe(6);
  });
  it('inner ring carries 13..23 and 00 (top = 0)', () => {
    expect(hourFromPos(0, false)).toBe(0);
    expect(hourFromPos(30, false)).toBe(13);
    expect(hourFromPos(90, false)).toBe(15);
  });
});

describe('minuteFromAngle', () => {
  it('snaps to nearest 5', () => {
    expect(minuteFromAngle(0)).toBe(0);
    expect(minuteFromAngle(30)).toBe(5);
    expect(minuteFromAngle(90)).toBe(15);
    expect(minuteFromAngle(180)).toBe(30);
  });
});

describe('isOuterRing', () => {
  it('outer when past the midpoint between inner and outer rings', () => {
    // inner=60, outer=96 → midpoint 78
    expect(isOuterRing(90, 60, 96)).toBe(true);
    expect(isOuterRing(60, 60, 96)).toBe(false); // a tap on the inner ring stays inner
    expect(isOuterRing(78, 60, 96)).toBe(true);  // boundary is inclusive-outer
  });
});

describe('fmt / parse', () => {
  it('formats zero-padded HH:MM', () => {
    expect(fmt(9, 5)).toBe('09:05');
    expect(fmt(19, 20)).toBe('19:20');
  });
  it('parses HH:MM and defaults junk to 0', () => {
    expect(parse('19:20')).toEqual({ h: 19, m: 20 });
    expect(parse('00:00')).toEqual({ h: 0, m: 0 });
    expect(parse('')).toEqual({ h: 0, m: 0 });
  });
});

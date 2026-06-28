import { describe, it, expect } from 'vitest';
import { buildIcs } from './ics';
import type { Settings } from './types';

const S: Settings = { windowStart: '19:00', windowMinutes: 20, firstRunDone: true };

describe('buildIcs', () => {
  const ics = buildIcs(S, new Date(2026, 5, 28));

  it('is a VCALENDAR with one VEVENT', () => {
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
  });
  it('uses floating local DTSTART/DTEND (no Z, no TZID)', () => {
    expect(ics).toContain('DTSTART:20260628T190000');
    expect(ics).toContain('DTEND:20260628T192000');
    expect(ics).not.toContain('TZID');
    expect(ics).not.toMatch(/DTSTART:[0-9T]+Z/);
  });
  it('recurs daily and alarms at start', () => {
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:-PT0M');
  });
  it('uses CRLF line endings', () => {
    expect(ics).toContain('\r\n');
  });
});

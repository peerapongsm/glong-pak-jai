import type { Settings } from './types';
import { parseHHMM } from './window';

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

// Floating local datetime: YYYYMMDDTHHMMSS (no Z, no TZID).
function floating(d: Date): string {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

export function buildIcs(settings: Settings, dtstartDate: Date): string {
  const { h, m } = parseHHMM(settings.windowStart);
  const start = new Date(dtstartDate);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + settings.windowMinutes * 60 * 1000);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//glong-pak-jai//worry-window//TH',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:worry-window@glong-pak-jai',
    `DTSTAMP:${floating(new Date())}`,
    `DTSTART:${floating(start)}`,
    `DTEND:${floating(end)}`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:🪟 เวลาพักใจ (Worry Window)',
    'DESCRIPTION:ถึงเวลาเปิดกล่องพักใจ มาดูเรื่องที่ฝากไว้กัน',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:ถึงเวลาพักใจ',
    'TRIGGER:-PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

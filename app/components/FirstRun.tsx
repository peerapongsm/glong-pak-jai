'use client';
import { useState } from 'react';
import type { Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/types';
import { buildIcs } from '@/lib/ics';
import ClockTimePicker from './ClockTimePicker';

export function downloadIcs(settings: Settings): void {
  const blob = new Blob([buildIcs(settings, new Date())], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'worry-window.ics'; a.click();
  URL.revokeObjectURL(url);
}

export default function FirstRun({ onDone }: { onDone: (s: Settings) => void }) {
  const [start, setStart] = useState(DEFAULT_SETTINGS.windowStart);
  const [mins, setMins] = useState(DEFAULT_SETTINGS.windowMinutes);

  const finish = () => {
    const s: Settings = { windowStart: start, windowMinutes: mins, firstRunDone: true };
    downloadIcs(s);
    onDone(s);
  };

  return (
    <main>
      <h1>กล่องพักใจ</h1>
      <p>พักความกังวลไว้ก่อน ค่อยมาเปิดดูตอน "เวลาพักใจ" ที่คุณตั้งไว้</p>
      <div className="card">
        <p className="muted">
          ข้อมูลทั้งหมดเก็บอยู่บนเครื่องนี้เท่านั้น ไม่ถูกส่งไปไหน
          ถ้าล้างข้อมูลเบราว์เซอร์หรือเปลี่ยนเครื่อง ข้อมูลจะหาย
        </p>
      </div>
      <div className="card">
        <label style={{ display: 'block', marginBottom: 8 }}>เวลาพักใจ (ทุกวัน)</label>
        <ClockTimePicker value={start} onChange={setStart} />
        <label style={{ marginTop: 12, display: 'block' }}>นานกี่นาที</label>
        <input type="number" min={5} max={120} value={mins}
          onChange={(e) => setMins(Number(e.target.value))} />
      </div>
      <button className="full" onClick={finish}>เริ่มใช้งาน + เพิ่มลงปฏิทิน</button>
      <p className="muted" style={{ fontSize: 13 }}>
        แอปนี้ช่วยจัดการความกังวล ไม่ใช่เครื่องมือวินิจฉัยหรือรักษาทางการแพทย์
      </p>
    </main>
  );
}

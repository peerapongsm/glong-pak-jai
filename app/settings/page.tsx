'use client';
import { useEffect, useState } from 'react';
import type { Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/types';
import { loadSettings, saveSettings, exportJSON, clearAll } from '@/lib/storage';
import { downloadIcs } from '../components/FirstRun';
import ClockTimePicker from '../components/ClockTimePicker';

export default function SettingsPage() {
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setS(loadSettings()); }, []);

  const save = () => {
    saveSettings(s);
    downloadIcs(s);
    setSaved(true);
  };
  const doExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'glong-pak-jai-backup.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const wipe = () => {
    if (confirm('ลบข้อมูลทั้งหมดในเครื่องนี้? กู้คืนไม่ได้')) { clearAll(); location.reload(); }
  };

  return (
    <main>
      <h1>ตั้งค่า</h1>
      <div className="card">
        <label style={{ display: 'block', marginBottom: 8 }}>เวลาพักใจ (ทุกวัน)</label>
        <ClockTimePicker value={s.windowStart}
          onChange={(v) => setS({ ...s, windowStart: v })} />
        <label style={{ marginTop: 12, display: 'block' }}>นานกี่นาที</label>
        <input type="number" min={5} max={120} value={s.windowMinutes}
          onChange={(e) => setS({ ...s, windowMinutes: Number(e.target.value) })} />
        <button className="full" style={{ marginTop: 12 }} onClick={save}>
          บันทึก + โหลดปฏิทินใหม่
        </button>
        {saved && (
          <p className="muted">
            อย่าลืมลบกิจกรรม "เวลาพักใจ" อันเดิมในปฏิทินก่อน แล้วเพิ่มไฟล์ใหม่
          </p>
        )}
      </div>
      <div className="card">
        <button className="full secondary" onClick={doExport}>ส่งออกข้อมูล (JSON)</button>
      </div>
      <div className="card">
        <button className="full" style={{ background: 'var(--crisis)' }} onClick={wipe}>
          ลบข้อมูลทั้งหมด
        </button>
      </div>
    </main>
  );
}

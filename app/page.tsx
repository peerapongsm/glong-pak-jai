'use client';
import { useEffect, useState } from 'react';
import type { Worry, Settings, Disposition } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/types';
import { createWorry, resolveWorry, pendingWorries, stats } from '@/lib/worry';
import { windowState } from '@/lib/window';
import { loadWorries, saveWorries, loadSettings, saveSettings } from '@/lib/storage';
import FirstRun from './components/FirstRun';
import ReviewCard from './components/ReviewCard';

function fmtCountdown(ms: number): string {
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return h > 0 ? `${h} ชม. ${m} นาที` : `${m} นาที`;
}

export default function Home() {
  const [worries, setWorries] = useState<Worry[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setWorries(loadWorries());
    setSettings(loadSettings());
    setReady(true);
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const persist = (list: Worry[]) => { setWorries(list); saveWorries(list); };

  if (!ready) return <main />;

  if (!settings.firstRunDone) {
    return <FirstRun onDone={(s) => { saveSettings(s); setSettings(s); }} />;
  }

  const pending = pendingWorries(worries);
  const ws = windowState(settings, now);
  const s = stats(worries);

  const addWorry = () => {
    const w = createWorry(draft);
    if (!w) return;
    persist([...worries, w]);
    setDraft('');
  };
  const resolve = (id: string, d: Disposition, note?: string) =>
    persist(worries.map((w) => (w.id === id ? resolveWorry(w, d, { actionNote: note }) : w)));
  const carry = (_id: string) => { /* no-op: stays pending until a future window */ };

  return (
    <main>
      <h1>กล่องพักใจ</h1>
      {s.didntHappenPct !== null && (
        <div className="card">
          <strong style={{ fontSize: 22 }}>{s.didntHappenPct}%</strong>
          <span className="muted"> ของเรื่องที่เคยกังวล สุดท้ายไม่เกิดขึ้นจริง</span>
        </div>
      )}

      <div className="card">
        <textarea placeholder="กำลังกังวลเรื่องอะไร..." value={draft}
          rows={3} onChange={(e) => setDraft(e.target.value)} />
        <button className="full" onClick={addWorry}>ฝากไว้ในกล่อง</button>
      </div>

      {ws.state === 'LOCKED' ? (
        <div className="card">
          <p>กล่องล็อกอยู่ 🔒</p>
          <p className="muted">อีก {fmtCountdown(ws.msToNextWindow)} ถึงเวลาพักใจ</p>
          <p className="muted">มี {pending.length} เรื่องรออยู่ในกล่อง</p>
        </div>
      ) : (
        <>
          <div className="card">
            <strong>ถึงเวลาพักใจแล้ว</strong>
            <span className="muted"> (เหลือ {fmtCountdown(ws.msRemaining)})</span>
          </div>
          {pending.length === 0 ? (
            <div className="card"><p>ไม่มีเรื่องค้างในกล่อง สบายใจได้ 🌿</p></div>
          ) : (
            pending.map((w) => (
              <ReviewCard key={w.id} worry={w}
                onResolve={(d, note) => resolve(w.id, d, note)}
                onCarry={() => carry(w.id)} />
            ))
          )}
        </>
      )}
    </main>
  );
}

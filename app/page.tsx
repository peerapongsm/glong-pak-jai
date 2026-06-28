'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [worries, setWorries] = useState<Worry[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [draft, setDraft] = useState('');
  const [carried, setCarried] = useState<Set<string>>(new Set());

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
  const visible = pending.filter((w) => !carried.has(w.id));
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
  const carry = (id: string) =>
    setCarried((prev) => { const n = new Set(prev); n.add(id); return n; });

  return (
    <main>
      <h1>กล่องพักใจ</h1>
      <button className="secondary" onClick={() => router.push('/settings')}>ตั้งค่า</button>
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
          {visible.length === 0 ? (
            <div className="card"><p>ไม่มีเรื่องค้างในกล่อง สบายใจได้ 🌿</p></div>
          ) : (
            visible.map((w) => (
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

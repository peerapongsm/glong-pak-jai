'use client';
import { useState } from 'react';
import type { Worry, Disposition } from '@/lib/types';

export default function ReviewCard({
  worry, onResolve, onCarry,
}: {
  worry: Worry;
  onResolve: (d: Disposition, note?: string) => void;
  onCarry: () => void;
}) {
  const [actionMode, setActionMode] = useState(false);
  const [note, setNote] = useState('');
  return (
    <div className="card">
      <p style={{ fontSize: 18 }}>{worry.text}</p>
      {!actionMode ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <button className="full secondary" onClick={() => onResolve('didnt_happen')}>
            ไม่เกิดขึ้นจริง / กังวลเกินไป
          </button>
          <button className="full secondary" onClick={() => onResolve('happened_coped')}>
            เกิดจริง แต่ผ่านมาได้
          </button>
          <button className="full secondary" onClick={onCarry}>
            ยังไม่รู้ผล / ยังกังวล
          </button>
          <button className="full" onClick={() => setActionMode(true)}>
            ต้องทำอะไรสักอย่าง
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <input placeholder="จะทำอะไร (สั้นๆ)" value={note}
            onChange={(e) => setNote(e.target.value)} />
          <button className="full" disabled={!note.trim()} onClick={() => onResolve('action', note)}>บันทึก</button>
          <button className="full secondary" onClick={() => setActionMode(false)}>ยกเลิก</button>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';

export default function CrisisCard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ position: 'fixed', right: 16, bottom: 16, background: 'var(--crisis)' }}
      >
        ต้องการความช่วยเหลือ
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h2>ถ้าตอนนี้รู้สึกหนักเกินไป</h2>
            <p>คุณไม่ได้อยู่คนเดียว การโทรขอความช่วยเหลือคือความเข้มแข็ง</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--crisis)' }}>
              สายด่วนสุขภาพจิต 1323
            </p>
            <p className="muted">ฟรี ตลอด 24 ชั่วโมง</p>
            <button className="full" onClick={() => setOpen(false)}>ปิด</button>
          </div>
        </div>
      )}
    </>
  );
}

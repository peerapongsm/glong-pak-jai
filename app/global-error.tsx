'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F1F6FA',
          color: '#2E3D44',
          fontFamily: 'sans-serif',
          gap: '1.5rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>
          ขออภัย เกิดข้อผิดพลาดบางอย่าง
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#5a6a73' }}>
          {error.digest ? `(${error.digest})` : ''}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '0.6rem 1.4rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2E3D44',
            color: '#F1F6FA',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          ลองใหม่
        </button>
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            backgroundColor: '#fff0ee',
            border: '2px solid #C25444',
          }}
        >
          <p style={{ margin: '0 0 0.25rem', fontWeight: 600, color: '#C25444' }}>
            หากต้องการความช่วยเหลือด้านสุขภาพจิต
          </p>
          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#C25444' }}>
            สายด่วนสุขภาพจิต&nbsp;1323
          </p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#2E3D44' }}>
            พร้อมให้บริการ 24 ชั่วโมง
          </p>
        </div>
      </body>
    </html>
  );
}

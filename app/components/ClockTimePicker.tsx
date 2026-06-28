'use client';
import { useRef, useState } from 'react';
import { angleDeg, hourFromPos, minuteFromAngle, isOuterRing, fmt, parse } from '@/lib/clock';

const SIZE = 240;
const C = SIZE / 2;
const R_OUT = 96;
const R_IN = 60;
const R_MIN = 96;
const NUM_R = 14; // radius of a number's hit/label circle

function pol(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: C + radius * Math.sin(rad), y: C - radius * Math.cos(rad) };
}

export default function ClockTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { h, m } = parse(value);
  const [mode, setMode] = useState<'hour' | 'minute'>('hour');
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const pick = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const dx = (clientX - rect.left) * scale - C;
    const dy = (clientY - rect.top) * scale - C;
    const deg = angleDeg(dx, dy);
    if (mode === 'hour') {
      onChange(fmt(hourFromPos(deg, isOuterRing(Math.hypot(dx, dy), R_IN, R_OUT)), m));
    } else {
      onChange(fmt(h, minuteFromAngle(deg)));
    }
  };

  // Selector hand.
  const handAngle = mode === 'hour' ? (h % 12) * 30 : m * 6;
  const handLen = mode === 'hour' ? (h >= 1 && h <= 12 ? R_OUT : R_IN) : R_MIN;
  const hand = pol(handAngle, handLen);

  // Number rings for the active mode.
  const outerNums = mode === 'hour'
    ? Array.from({ length: 12 }, (_, i) => ({ label: String(i === 0 ? 12 : i), val: i === 0 ? 12 : i, r: R_OUT, pos: i * 30 }))
    : Array.from({ length: 12 }, (_, i) => ({ label: String(i * 5).padStart(2, '0'), val: i * 5, r: R_MIN, pos: i * 30 }));
  const innerNums = mode === 'hour'
    ? Array.from({ length: 12 }, (_, i) => ({ label: i === 0 ? '00' : String(i + 12), val: i === 0 ? 0 : i + 12, r: R_IN, pos: i * 30 }))
    : [];

  const activeVal = mode === 'hour' ? h : m;

  const headBtn = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--primary)' : 'var(--panel)',
    color: active ? '#fff' : 'var(--muted)',
    padding: '6px 14px',
    fontSize: 28,
    fontWeight: 700,
    border: '1px solid #d7e3ea',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button type="button" style={headBtn(mode === 'hour')} onClick={() => setMode('hour')}>
          {String(h).padStart(2, '0')}
        </button>
        <span style={{ fontSize: 28, fontWeight: 700 }}>:</span>
        <button type="button" style={headBtn(mode === 'minute')} onClick={() => setMode('minute')}>
          {String(m).padStart(2, '0')}
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ width: 240, maxWidth: '100%', touchAction: 'none', userSelect: 'none', cursor: 'pointer' }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); pick(e.clientX, e.clientY); }}
        onPointerMove={(e) => { if (dragging) pick(e.clientX, e.clientY); }}
        onPointerUp={() => { setDragging(false); if (mode === 'hour') setMode('minute'); }}
      >
        <circle cx={C} cy={C} r={C - 4} fill="var(--bg)" />
        {/* hand */}
        <line x1={C} y1={C} x2={hand.x} y2={hand.y} stroke="var(--primary)" strokeWidth={2} />
        <circle cx={hand.x} cy={hand.y} r={NUM_R + 2} fill="var(--primary)" />
        <circle cx={C} cy={C} r={4} fill="var(--primary)" />
        {/* numbers */}
        {[...outerNums, ...innerNums].map((n) => {
          const p = pol(n.pos, n.r);
          const selected = n.val === activeVal;
          return (
            <text
              key={`${n.r}-${n.label}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={n.r === R_IN ? 13 : 15}
              fontWeight={600}
              fill={selected ? '#fff' : 'var(--text)'}
            >
              {n.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

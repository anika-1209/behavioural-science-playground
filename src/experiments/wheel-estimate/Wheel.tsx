const SEGS = 20;
const STEP = 360 / SEGS;
const C = 160;
const R = 150;

const pt = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.sin(a), C - r * Math.cos(a)];
};

/** Rotation that brings `value` (a multiple of 5) under the pointer after five full turns. */
export function rotationFor(value: number, jitter = 0) {
  const i = value / 5;
  return 1800 + ((360 - i * STEP) % 360) + jitter;
}

export function Wheel({ rotation }: { rotation: number }) {
  return (
    <svg viewBox="0 0 320 320" role="img" aria-label="A wheel numbered 0 to 95 in steps of 5" className="wheel">
      <g className="wheel-g" style={{ transform: `rotate(${rotation}deg)` }}>
        {Array.from({ length: SEGS }, (_, i) => {
          const [x1, y1] = pt(i * STEP - STEP / 2, R);
          const [x2, y2] = pt(i * STEP + STEP / 2, R);
          const [tx, ty] = pt(i * STEP, R - 22);
          return (
            <g key={i}>
              <path
                className={`seg seg-${i % 4}`}
                d={`M${C} ${C} L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} Z`}
              />
              <text
                className="seg-num"
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${i * STEP} ${tx} ${ty})`}
              >
                {i * 5}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R} fill="none" className="wheel-rim" />
      </g>
      <circle className="hub-dot" cx={C} cy={C} r={16} />
      <path className="pointer" d="M148 2 L172 2 L160 30 Z" />
    </svg>
  );
}

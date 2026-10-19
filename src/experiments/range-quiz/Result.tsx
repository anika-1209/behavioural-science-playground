import type { ResultProps } from '../types';
import { QUESTIONS, TARGET, formatValue, hits, isInside, rangeOf, wasPulled } from '../../../shared/experiments/range-quiz/logic';

// One row per question, each on its own linear scale.
const BX0 = 196;
const BX1 = 388;
const ROW = 46;
const TOP = 4;

export function Result({ answers }: ResultProps) {
  const h = hits(answers);
  const aria = QUESTIONS.map((q) => {
    const [lo, hi] = rangeOf(q, answers);
    return `${q.short}: your range ${lo} to ${hi}, answer ${q.answer}, ${isInside(q, answers) ? 'inside' : 'outside'}`;
  }).join('; ');

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big">
        {h}
        <small> of 10 ranges caught the answer</small>
      </p>
      <p>
        {wasPulled(answers)
          ? `Ranges you were 90% sure of should catch about ${TARGET} answers in 10. Yours caught ${h}.`
          : `Ranges you were 90% sure of should catch about ${TARGET} answers in 10, and yours came close.`}
      </p>
      <div className="legend" aria-hidden="true">
        <span><i className="k-band" />Your range</span>
        <span><i className="k-hit" />Answer inside</span>
        <span><i className="k-miss" />Answer outside</span>
      </div>
      <div className="chart">
        <svg viewBox={`0 0 400 ${TOP + QUESTIONS.length * ROW}`} role="img" aria-label={aria}>
          {QUESTIONS.map((q, i) => {
            const [lo, hi] = rangeOf(q, answers);
            const ok = isInside(q, answers);
            let a = Math.min(lo, q.answer);
            let b = Math.max(hi, q.answer);
            if (a === b) {
              a -= 1;
              b += 1;
            }
            const pad = (b - a) * 0.12;
            a -= pad;
            b += pad;
            const X = (v: number) => BX0 + ((v - a) / (b - a)) * (BX1 - BX0);
            const y = TOP + i * ROW;
            const cy = y + 20;
            const width = Math.max(X(hi) - X(lo), 4);
            const ax = X(q.answer);
            return (
              <g key={q.id}>
                <text x="0" y={y + 15} className="rl">{q.short}</text>
                <text x="0" y={y + 31} className="v">
                  {formatValue(lo, q)}–{formatValue(hi, q)} · <tspan className={ok ? 'hit' : 'miss'}>{formatValue(q.answer, q)}</tspan>
                </text>
                <line className="track" x1={BX0} x2={BX1} y1={cy} y2={cy} />
                <rect className="band" x={width === 4 ? X(lo) - 2 : X(lo)} y={cy - 9} width={width} height="18" rx="4" />
                <path className={ok ? 'target-hit' : 'target-miss'} d={`M${ax} ${cy - 8} l7 8 l-7 8 l-7 -8z`} />
              </g>
            );
          })}
        </svg>
      </div>
      <p className="note">
        Each row has its own scale. If your ranges matched your 90% confidence, about 9 of the 10 would contain the answer.
      </p>
    </div>
  );
}

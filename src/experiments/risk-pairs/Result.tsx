import type { ResultProps } from '../types';
import { PAIRS, lessCommon, moreCommon, optionById, score, wasPulled } from '../../../shared/experiments/risk-pairs/logic';

// Log scale from 1 to 100,000 deaths a year.
const X0 = 22;
const X1 = 382;
const DECADES = 5;
const X = (v: number) => X0 + (Math.log10(Math.max(v, 1)) / DECADES) * (X1 - X0);
const ROW = 62;
const TOP = 6;
const TICKS = [1, 10, 100, 1000, 10000, 100000];
const tickLabel = (v: number) => (v >= 1000 ? `${v / 1000}k` : String(v));

export function Result({ answers }: ResultProps) {
  const gridBottom = TOP + PAIRS.length * ROW;
  const height = gridBottom + 34;
  const aria = PAIRS.map((p) => {
    const m = moreCommon(p);
    const l = lessCommon(p);
    return `${l.label} about ${l.deaths}, ${m.label} about ${m.deaths}, you picked ${optionById(p, answers[p.id])?.label ?? 'nothing'}`;
  }).join('; ');

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big">
        {score(answers)}
        <small> of {PAIRS.length} right</small>
      </p>
      <p>
        {wasPulled(answers)
          ? "In most pairs, the cause you picked kills fewer people than the one you passed over. Here's the size of each gap."
          : "You picked the more common cause in most pairs. Here's the size of each gap."}
      </p>
      <div className="legend" aria-hidden="true">
        <span><i className="k-more" />More common</span>
        <span><i className="k-less" />Less common</span>
        <span><i className="k-you" />Your pick</span>
      </div>
      <div className="chart">
        <svg viewBox={`0 0 400 ${height}`} role="img" aria-label={`Deaths per year for each pair. ${aria}`}>
          {TICKS.map((v) => (
            <line key={v} className="grid" x1={X(v)} x2={X(v)} y1={TOP + 16} y2={gridBottom} />
          ))}
          {PAIRS.map((p, i) => {
            const y = TOP + i * ROW;
            const ty = y + 34;
            const m = moreCommon(p);
            const l = lessCommon(p);
            const pick = optionById(p, answers[p.id]);
            const right = pick?.id === m.id;
            return (
              <g key={p.id}>
                <text x={X0} y={y + 14}>
                  <tspan className={right ? 'ok' : 'no'}>{right ? '✓' : '✗'}</tspan> <tspan className="rl">{l.label}</tspan> vs{' '}
                  <tspan className="rl">{m.label}</tspan>
                </text>
                <line className="track" x1={X(l.deaths)} x2={X(m.deaths)} y1={ty} y2={ty} />
                <circle className="d-less" cx={X(l.deaths)} cy={ty} r="6" />
                <circle className="d-more" cx={X(m.deaths)} cy={ty} r="6" />
                {pick && <circle className="ring" cx={X(pick.deaths)} cy={ty} r="10.5" />}
                <text className="v" x={X(l.deaths)} y={ty + 22} textAnchor="middle">{l.short}</text>
                <text className="v v-more" x={X(m.deaths)} y={ty + 22} textAnchor="middle">{m.short}</text>
              </g>
            );
          })}
          <line className="axis" x1={X0} x2={X1} y1={gridBottom + 4} y2={gridBottom + 4} />
          {TICKS.map((v) => (
            <g key={v}>
              <line className="axis" x1={X(v)} x2={X(v)} y1={gridBottom + 4} y2={gridBottom + 10} />
              <text className="v" x={X(v)} y={gridBottom + 26} textAnchor="middle">{tickLabel(v)}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="note">
        Yearly deaths in the US, rounded. The scale is logarithmic: each gridline is ten times the one before. Pairs
        like these were first used in a 1978 study by Sarah Lichtenstein and colleagues. Sources: CDC, NHTSA, NFPA,
        NWS, ACS and the International Shark Attack File.
      </p>
    </div>
  );
}

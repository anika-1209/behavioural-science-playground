import type { ResultProps } from '../types';
import { STUDY_MEDIAN, TRUE_PCT, anchorFor } from './logic';

const X = (v: number) => 24 + v * 3.52;
const clampX = (x: number) => Math.max(36, Math.min(364, x));

export function Result({ condition, answers }: ResultProps) {
  const anchor = anchorFor(condition);
  const est = Number(answers.estimate);
  const dir = est >= anchor ? 1 : -1;
  const showArrow = Math.abs(X(est) - X(anchor)) > 16;
  const low = STUDY_MEDIAN.low!;
  const high = STUDY_MEDIAN.high!;

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big">
        {est}
        <small>% your guess</small>
      </p>
      <div className="chart">
        <svg
          viewBox="0 0 400 258"
          role="img"
          aria-label={`Number line: your wheel ${anchor}, your guess ${est}%, original study medians ${low}% and ${high}%, real answer ${TRUE_PCT}%`}
        >
          <defs>
            <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0L10 5L0 10z" className="c-acc" />
            </marker>
          </defs>

          <text className="rl" x="24" y="16">Original study, median guess</text>
          <line className="track" x1={X(0)} x2={X(100)} y1="40" y2="40" />
          <circle className="c-study" cx={X(low)} cy="40" r="6" />
          <circle className="c-study" cx={X(high)} cy="40" r="6" />
          <text x={X(low) - 4} y="64" textAnchor="end">
            after 10: <tspan className="v">{low}%</tspan>
          </text>
          <text x={X(high) + 4} y="64">
            after 65: <tspan className="v">{high}%</tspan>
          </text>

          <text className="rl" x="24" y="92">You</text>
          <line className="track" x1={X(0)} x2={X(100)} y1="122" y2="122" />
          {showArrow && (
            <path className="arrow" d={`M${X(anchor) + dir * 9} 122 L${X(est) - dir * 9} 122`} markerEnd="url(#ah)" />
          )}
          <path className="c-hot" d={`M${X(anchor)} 114 l8 8 l-8 8 l-8 -8z`} />
          <circle className="c-acc" cx={X(est)} cy="122" r="7" />
          <text className="t-hot" x={clampX(X(anchor))} y="106" textAnchor="middle">
            wheel <tspan className="v">{anchor}</tspan>
          </text>
          <text className="t-acc" x={clampX(X(est))} y="146" textAnchor="middle">
            your guess <tspan className="v">{est}%</tspan>
          </text>

          <text className="rl" x="24" y="174">Real answer</text>
          <line className="track" x1={X(0)} x2={X(100)} y1="196" y2="196" />
          <rect className="c-true" x={X(TRUE_PCT) - 2} y="186" width="4" height="20" rx="1" />
          <text className="t-true" x={X(TRUE_PCT) + 8} y="214">
            <tspan className="v">{TRUE_PCT}%</tspan> (54 of 193 countries)
          </text>

          <line className="axis" x1={X(0)} x2={X(100)} y1="226" y2="226" />
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line className="axis" x1={X(v)} x2={X(v)} y1="226" y2="232" />
              <text className="v" x={X(v)} y="248" textAnchor="middle">{v}%</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="note">
        Your wheel didn't land by chance. It was set to stop at 10 for half of players and at 65 for the other
        half. The top row shows how people answered after each number in the original 1974 study.
      </p>
    </div>
  );
}

import type { ResultProps } from '../types';
import { PLANS, TARGET, THIRD, choiceOf, otherVersion, planLabel, versionOf, wasPulled, type PlanId } from '../../../shared/experiments/phone-plans/logic';

// Scatter: price across (£8–£24), data up (0–45 GB).
const X = (p: number) => 56 + ((p - 8) / 16) * 320;
const Y = (g: number) => 196 - (g / 45) * 176;

export function Result({ condition, answers }: ResultProps) {
  const v = versionOf(condition);
  const t = TARGET[v];
  const th = THIRD[v];
  const oth = THIRD[otherVersion(v)];
  const choice = choiceOf(answers);
  const tp = PLANS[t];

  const dot = (id: PlanId, cls: string) => {
    const p = PLANS[id];
    const x = X(p.price);
    const y = Y(p.gb);
    // Third plans sit next to a main plan, so their labels go on the other side.
    const right = !id.endsWith('third');
    return (
      <g key={id}>
        <circle className={cls} cx={x} cy={y} r="7" />
        {id === choice && <circle className="ring-you" cx={x} cy={y} r="12" />}
        <text className="pl" x={right ? x + 16 : x - 16} y={y + 4} textAnchor={right ? 'start' : 'end'}>
          {p.gb} GB · £{p.price}
          {id === choice ? ' (you)' : ''}
        </text>
      </g>
    );
  };

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">You chose {planLabel(choice)}</p>
      <p>
        {wasPulled(condition, answers)
          ? "You chose the plan that your third plan made look good. Here's how the three plans compare."
          : "Here's how the plans you saw compare, and what other players saw instead."}
      </p>
      <div className="legend" aria-hidden="true">
        <span><i className="k-main" />The two main plans</span>
        <span><i className="k-third" />Your third plan</span>
        <span><i className="k-other" />Other players' third plan</span>
      </div>
      <div className="chart">
        <svg
          viewBox="0 0 400 224"
          role="img"
          aria-label={`Price against data. Main plans: 10 GB for £10 and 40 GB for £20. Your third plan: ${planLabel(th)}, worse than ${planLabel(t)} in every way. Other players' third plan: ${planLabel(oth)}. You chose ${planLabel(choice)}.`}
        >
          <rect className="zone" x={X(tp.price)} y={Y(tp.gb)} width={X(24) - X(tp.price)} height={Y(0) - Y(tp.gb)} />
          <text
            className="zone-t"
            x={v === 'premium' ? X(24) - 6 : X(tp.price) + 6}
            y={Y(0) - 8}
            textAnchor={v === 'premium' ? 'end' : 'start'}
          >
            worse in every way than {tp.gb} GB for £{tp.price}
          </text>
          {[8, 12, 16, 20, 24].map((p) => (
            <g key={`x${p}`}>
              <line className="gridl" x1={X(p)} x2={X(p)} y1={Y(45)} y2={Y(0)} />
              <text className="v" x={X(p)} y={Y(0) + 18} textAnchor="middle">£{p}</text>
            </g>
          ))}
          {[0, 10, 20, 30, 40].map((g) => (
            <g key={`y${g}`}>
              <line className="gridl" x1={X(8)} x2={X(24)} y1={Y(g)} y2={Y(g)} />
              <text className="v" x={X(8) - 8} y={Y(g) + 4} textAnchor="end">{g} GB</text>
            </g>
          ))}
          {dot(oth, 'p-other')}
          {dot('small', 'p-main')}
          {dot('large', 'p-main')}
          {dot(th, 'p-third')}
        </svg>
      </div>
      <p className="note">
        Every player sees the same two main plans. Half see a third plan that's worse than the 40 GB plan in every way.
        The other half see one that's worse than the 10 GB plan in every way. Plans and prices are made up.
      </p>
    </div>
  );
}

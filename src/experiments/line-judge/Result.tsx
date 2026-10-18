import type { ResultProps } from '../types';
import { CRITICAL_COUNT, ROUNDS, correctOf, picksOf, wentWithGroup } from './logic';

export function Result({ answers }: ResultProps) {
  const picks = picksOf(answers);
  const k = wentWithGroup(answers);

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">
        {k} of {CRITICAL_COUNT}
      </p>
      <p className="reveal">
        <b>The other players weren't real.</b> Their answers were scripted. On {CRITICAL_COUNT} of the {ROUNDS.length} rounds,
        outlined below, all five gave the same wrong answer on purpose.
      </p>
      <p>
        {k > 0
          ? `On ${k} of the ${CRITICAL_COUNT} rounds where the group was wrong, you went with the group.`
          : 'On every round where the group was wrong, you went with your own eyes.'}
      </p>
      <div className="rounds">
        {ROUNDS.map((r, i) => {
          const p = picks[i] ?? '?';
          const ok = p === correctOf(r);
          const cls = ok ? 'ok' : r.critical && p === r.group ? 'went' : 'miss';
          const label = `Round ${i + 1}${r.critical ? ', group wrong' : ''}: you chose ${p}, ${ok ? 'right' : 'wrong'}`;
          return (
            <span key={i} className="rd" title={label}>
              <i className={`${cls}${r.critical ? ' crit' : ''}`} aria-label={label}>
                {p}
              </i>
              {i + 1}
            </span>
          );
        })}
      </div>
      <div className="legend" aria-hidden="true">
        <span><i className="k-ok" />Right answer</span>
        <span><i className="k-went" />Went with the group</span>
        <span><i className="k-miss" />Other wrong answer</span>
      </div>
      <p className="note">In Asch's studies, people almost never chose the wrong line when they answered alone.</p>
    </div>
  );
}

import type { ResultProps } from '../types';
import { STUDY_MEDIAN, money, priceOf, versionOf } from '../../../shared/experiments/mug-price/logic';

const ROWS = [
  { id: 'owner', label: 'Had just been given a mug: lowest price to sell' },
  { id: 'buyer', label: 'Had no mug: most they would pay' },
] as const;
const SCALE_MAX = 8;

export function Result({ condition, answers }: ResultProps) {
  const v = versionOf(condition);

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">{money(priceOf(answers))}</p>
      <p>
        {v === 'owner'
          ? "That's the lowest price you'd accept for a mug you imagined was yours."
          : "That's the most you'd pay for a mug you imagined seeing in a shop."}{' '}
        Other players saw the same mug from the other side: as {v === 'owner' ? 'buyers' : 'owners'}.
      </p>
      <div className="others-group">
        <p className="others-title">Median price in the original study, in US dollars</p>
        <ul className="others-bars">
          {ROWS.map((r) => (
            <li key={r.id} className={r.id === v ? 'mine' : undefined}>
              <span className="ob-label">
                {r.label}
                {r.id === v && <span className="ob-you">Like you</span>}
              </span>
              <span className="ob-track" aria-hidden="true">
                <span className="ob-fill" style={{ width: `${(100 * STUDY_MEDIAN[r.id]) / SCALE_MAX}%` }} />
              </span>
              <span className="ob-val">${STUDY_MEDIAN[r.id].toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="note">
        Both groups in the study were valuing the same mug. The only difference was whether it had been handed to them a
        few minutes before.
      </p>
    </div>
  );
}

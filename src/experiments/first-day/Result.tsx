import type { ResultProps } from '../types';
import {
  DEFAULTS,
  STUDY_JOINED,
  kept,
  otherVersion,
  pensionOf,
  versionOf,
  type Pension,
} from '../../../shared/experiments/first-day/logic';

const pensionText = (p: Pension) => (p === '0' ? '0%' : `${p}%`);
const yesNo = (v: unknown) => (v === 'yes' ? 'Yes' : 'No');

export function Result({ condition, answers }: ResultProps) {
  const v = versionOf(condition);
  const mine = DEFAULTS[v];
  const theirs = DEFAULTS[otherVersion(v)];
  const k = kept(condition, answers);

  const rows: { label: string; start: string; chose: string; other: string; same: boolean }[] = [
    {
      label: 'Pension',
      start: pensionText(mine.pension),
      chose: pensionText(pensionOf(answers)),
      other: pensionText(theirs.pension),
      same: pensionOf(answers) === mine.pension,
    },
    {
      label: 'Newsletter',
      start: yesNo(mine.newsletter),
      chose: yesNo(answers.newsletter),
      other: yesNo(theirs.newsletter),
      same: answers.newsletter === mine.newsletter,
    },
    {
      label: 'Birthday',
      start: yesNo(mine.birthday),
      chose: yesNo(answers.birthday),
      other: yesNo(theirs.birthday),
      same: answers.birthday === mine.birthday,
    },
  ];

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">Kept {k} of 3</p>
      <p>
        Your form arrived with every choice already set. You left {k} of the 3 as they were. Other players got the same
        form, set the opposite way.
      </p>
      <div className="ledger-wrap">
        <table className="ledger">
          <thead>
            <tr>
              <th scope="col">Choice</th>
              <th scope="col">Your form started at</th>
              <th scope="col">You chose</th>
              <th scope="col">Other players' form started at</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={r.same ? 'mine' : undefined}>
                <td>{r.label}</td>
                <td className="n">{r.start}</td>
                <td className="n">{r.chose}</td>
                <td className="n">{r.other}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Highlighted rows are the choices you left as they were.</p>
      <div className="others-group">
        <p className="others-title">New staff saving into the pension, in the original study</p>
        <ul className="others-bars">
          {(['out', 'in'] as const).map((x) => (
            <li key={x} className={x === v ? 'mine' : undefined}>
              <span className="ob-label">
                {x === 'out' ? 'Had to sign up' : 'Signed up automatically'}
                {x === v && <span className="ob-you">Like your form</span>}
              </span>
              <span className="ob-track" aria-hidden="true">
                <span className="ob-fill" style={{ width: `${STUDY_JOINED[x]}%` }} />
              </span>
              <span className="ob-val">{STUDY_JOINED[x]}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

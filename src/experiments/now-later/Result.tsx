import type { ResultProps } from '../types';
import { LATER, otherFlips, pickOf, presentFlips, type Horizon } from '../../../shared/experiments/now-later/logic';

const ROWS: [Horizon, string][] = [
  ['near', 'today'],
  ['far', 'in 52 weeks'],
];

export function Result({ answers }: ResultProps) {
  const f = presentFlips(answers);
  const flips = [...f, ...otherFlips(answers)];

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">{flips.length ? `${flips.length} flip${flips.length === 1 ? '' : 's'}` : 'No flips'}</p>
      <p>
        {f.length
          ? 'On some amounts, you took the money when it was on offer today, but chose to wait when the same choice was a year away.'
          : "Here's how your choices compare when the £100 comes today and when it comes in a year."}
      </p>
      <div className="legend" aria-hidden="true">
        <span><i className="k-now" />Took £100 sooner</span>
        <span><i className="k-wait" />Waited a week for more</span>
        <span><i className="k-flip" />Your answer flipped</span>
      </div>
      <div className="grid-wrap">
        <table className="choices">
          <caption className="note">“£100” means you took the earlier payment; “Wait” means you chose the larger one.</caption>
          <thead>
            <tr>
              <th scope="col">£100…</th>
              {LATER.map((a) => (
                <th key={a} scope="col" className="amt">
                  or £{a}
                  <br />a week later
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([h, label]) => (
              <tr key={h}>
                <th scope="row" className="rowlab">{label}</th>
                {LATER.map((a) => {
                  const soon = pickOf(answers, h, a) === 'soon';
                  return (
                    <td key={a} className={`${soon ? 'now' : 'wait'}${flips.includes(a) ? ' flip' : ''}`}>
                      {soon ? '£100' : 'Wait'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">
        Each column is the same trade: £100, or a larger amount one week later. The only difference between the rows is
        whether the £100 comes today or in a year.
      </p>
    </div>
  );
}

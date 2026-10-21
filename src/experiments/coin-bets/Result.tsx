import type { ResultProps } from '../types';
import { STAKE, STUDY_RATIO, WINS, accepted, money, threshold } from '../../../shared/experiments/coin-bets/logic';

export function Result({ answers }: ResultProps) {
  const t = threshold(answers);
  const typical = STAKE * STUDY_RATIO;
  const tookAny = WINS.some((w) => accepted(answers, w));

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">
        {t !== null ? `£${t} to risk £${STAKE}` : tookAny ? 'Mixed answers' : 'No bet was enough'}
      </p>
      <p>
        {t !== null
          ? `Once the win was £${t} or more, you took every bet.`
          : tookAny
            ? 'You took some bets but turned down the best one, a 50/50 chance to win £30.'
            : `Even a 50/50 chance to win £30 wasn't enough for you to risk losing £${STAKE}.`}{' '}
        Here's what each bet was worth on average.
      </p>
      <div className="grid-wrap">
        <table className="ledger">
          <thead>
            <tr>
              <th scope="col">Heads: win</th>
              <th scope="col">Tails: lose</th>
              <th scope="col">Average per bet</th>
              <th scope="col">You</th>
            </tr>
          </thead>
          <tbody>
            {WINS.map((w) => {
              const ev = (w - STAKE) / 2;
              const took = accepted(answers, w);
              return (
                <tr key={w} className={w === typical ? 'typical' : undefined}>
                  <td className="n">£{w}</td>
                  <td className="n gone">£{STAKE}</td>
                  <td className={`n${ev > 0 ? ' good' : ''}`}>{ev > 0 ? `+${money(ev)}` : '£0'}</td>
                  <td>{took ? 'Took it' : 'Turned it down'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="note">
        Every bet except the first would leave you better off on average. The highlighted row is the point where people
        in studies of bets like these typically start to say yes: a win of about twice the possible loss.
      </p>
    </div>
  );
}

import type { ResultProps } from '../types';
import {
  BELIEFS,
  ROUNDS,
  STREAK_ROUNDS,
  againstStreak,
  beliefOf,
  betOf,
  runLength,
  sideName,
  streakOf,
} from '../../../shared/experiments/next-flip/logic';
import { Coins } from './Coins';

export function Result({ answers }: ResultProps) {
  const against = againstStreak(answers);
  const belief = BELIEFS.find((b) => b.id === beliefOf(answers))!;

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">
        {against} of {STREAK_ROUNDS.length}
      </p>
      <p>
        On {against} of the {STREAK_ROUNDS.length} rounds that ended in a streak, you bet the streak would end. Asked
        directly after six heads, you answered <b>{belief.label.toLowerCase()}</b>.
      </p>
      <div className="grid-wrap">
        <table className="flips">
          <thead>
            <tr>
              <th scope="col">Tosses so far</th>
              <th scope="col">Your bet</th>
            </tr>
          </thead>
          <tbody>
            {ROUNDS.map((r) => {
              const s = streakOf(r);
              const bet = betOf(answers, r);
              return (
                <tr key={r.id}>
                  <td>
                    <Coins tosses={r.tosses} />
                  </td>
                  <td>
                    <b className="bet-word">{sideName(bet)}</b>
                    {s && (
                      <span className="note">
                        {' '}
                        after {runLength(r.tosses)} {sideName(s)}: {bet === s ? 'streak goes on' : 'streak ends'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="note">
        A fair coin has no memory: every toss is 50/50, whatever came before. In every round, heads and tails were
        equally good bets.
      </p>
    </div>
  );
}

import type { ResultProps } from '../types';
import { choiceOf, wasPulled } from '../../../shared/experiments/two-trips/logic';

export function Result({ answers }: ResultProps) {
  const choice = choiceOf(answers);

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">{choice === 'city' ? 'You chose Edinburgh' : 'You chose the cabin'}</p>
      <p>
        {wasPulled(answers)
          ? "You picked the trip that cost more. Here's what your choice actually changed."
          : "You picked the trip you expected to enjoy more. Here's what your choice actually changed."}
      </p>
      <div className="ledger-wrap">
        <table className="ledger">
          <thead>
            <tr>
              <th>If you go to</th>
              <th>Already spent</th>
              <th>Money back</th>
              <th>Your weekend</th>
            </tr>
          </thead>
          <tbody>
            <tr className={choice === 'city' ? 'mine' : undefined}>
              <td>Edinburgh</td>
              <td className="n gone">£300</td>
              <td className="n">£0</td>
              <td>The trip you expected to enjoy less</td>
            </tr>
            <tr className={choice === 'cabin' ? 'mine' : undefined}>
              <td>The cabin</td>
              <td className="n gone">£300</td>
              <td className="n">£0</td>
              <td className="good">The trip you expected to enjoy more</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="note">
        Both trips were paid for before you chose, so £300 is spent either way. The only thing your choice changes is
        the weekend you get. In the original 1985 study, more than half of students chose the more expensive trip.
      </p>
    </div>
  );
}

import type { ResultProps } from '../types';
import { QUESTIONS, count, driftOf, firstOf, recallOf } from '../../../shared/experiments/before-after/logic';

const LABEL = { toward: 'Closer', away: 'Further', same: 'Exact' } as const;
const fmt = (n: number) => n.toLocaleString('en-GB', { useGrouping: n >= 10000 });

export function Result({ answers }: ResultProps) {
  const toward = count(answers, 'toward');

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">
        {toward} of {QUESTIONS.length}
      </p>
      <p>
        {toward
          ? `On ${toward} of the ${QUESTIONS.length} questions, the answer you remembered giving was closer to the real one than what you actually wrote.`
          : "Here's how your memory of your first answers compares with what you actually wrote."}
      </p>
      <div className="ledger-wrap">
        <table className="ledger">
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">You wrote</th>
              <th scope="col">You remembered</th>
              <th scope="col">Real answer</th>
            </tr>
          </thead>
          <tbody>
            {QUESTIONS.map((q) => {
              const d = driftOf(q, answers);
              return (
                <tr key={q.id}>
                  <td>{q.short}</td>
                  <td className="n">{fmt(firstOf(q, answers))}</td>
                  <td className="n">
                    {fmt(recallOf(q, answers))}
                    <span className={`drift ${d}`}>{LABEL[d]}</span>
                  </td>
                  <td className="n">{fmt(q.answer)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="note">
        "Closer" means the answer you remembered was nearer the real one than what you wrote. Your first answers were saved before you saw the real ones, so the "You wrote" column is exactly what you typed.
      </p>
    </div>
  );
}

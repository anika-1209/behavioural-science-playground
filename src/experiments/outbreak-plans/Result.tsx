import type { ResultProps } from '../types';
import { PLAN_TEXT, STUDY_SURE, choiceOf, frameOf, otherFrame, planName, wasPulled, type Frame } from '../../../shared/experiments/outbreak-plans/logic';

const X0 = 140;
const X1 = 392;
const W = X1 - X0;
const ROWS: Frame[] = ['gain', 'loss'];

export function Result({ condition, answers }: ResultProps) {
  const frame = frameOf(condition);
  const other = otherFrame(frame);
  const choice = choiceOf(answers);

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">You chose {choice === 'sure' ? 'Plan A' : 'Plan B'}</p>
      <p>
        {wasPulled(condition, answers)
          ? "You made the same choice as most people who read your version. Here's the version other players saw."
          : "You went against most people who read your version. Here's the version other players saw."}
      </p>
      <div className="frames">
        <div className="frame mine">
          <p className="eyebrow">Your version</p>
          <p>{PLAN_TEXT[frame].sure}</p>
          <p>{PLAN_TEXT[frame].gamble}</p>
          <p className="picked">You chose {planName(choice)}.</p>
        </div>
        <div className="frame">
          <p className="eyebrow">The other version</p>
          <p>{PLAN_TEXT[other].sure}</p>
          <p>{PLAN_TEXT[other].gamble}</p>
        </div>
      </div>
      <p className="note">
        The two versions describe exactly the same outcomes. 200 saved out of 600 is the same as 400 dying. A
        one-in-three chance that all 600 are saved is the same as a one-in-three chance that nobody dies.
      </p>
      <h3>How people chose in the original study</h3>
      <div className="legend" aria-hidden="true">
        <span><i className="k-sure" />Plan A (the sure option)</span>
        <span><i className="k-gamble" />Plan B (the gamble)</span>
      </div>
      <div className="chart">
        <svg
          viewBox="0 0 400 124"
          role="img"
          aria-label={`Original study: described as lives saved, ${STUDY_SURE.gain}% chose Plan A and ${100 - STUDY_SURE.gain}% Plan B. Described as lives lost, ${STUDY_SURE.loss}% chose Plan A and ${100 - STUDY_SURE.loss}% Plan B. You saw the lives ${frame === 'gain' ? 'saved' : 'lost'} version.`}
        >
          {ROWS.map((f, i) => {
            const y = 8 + i * 58;
            const sure = STUDY_SURE[f];
            const w1 = (W * sure) / 100;
            const mine = f === frame;
            return (
              <g key={f}>
                {mine && <rect className="mine-row" x="0" y={y - 6} width="400" height="50" rx="8" />}
                <text className="rl" x="8" y={y + 16}>{f === 'gain' ? 'Lives saved' : 'Lives lost'}</text>
                <text x="8" y={y + 32} className={mine ? 'you' : undefined}>{mine ? 'your version' : 'other version'}</text>
                <rect className="seg-sure" x={X0} y={y + 4} width={w1} height="30" rx="4" />
                <rect className="seg-gamble" x={X0 + w1} y={y + 4} width={W - w1} height="30" rx="4" />
                <text className="in" x={X0 + 8} y={y + 24}>A {sure}%</text>
                <text className="in" x={X1 - 8} y={y + 24} textAnchor="end">B {100 - sure}%</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

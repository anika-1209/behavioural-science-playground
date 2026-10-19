import type { ResultProps } from '../types';
import { GLASS_YES, VERB_TEXT, sawGlass, verbOf, type Verb } from '../../../shared/experiments/crash-clip/logic';

const X0 = 150;
const X1 = 392;
const W = X1 - X0;
const ROWS: Verb[] = ['smashed', 'hit'];

export function Result({ condition, answers }: ResultProps) {
  const verb = verbOf(condition);
  const saw = sawGlass(answers);

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">{saw ? 'You saw glass' : 'No glass'}</p>
      <p>
        {saw
          ? `You remember broken glass. There wasn't any. Your question said the cars "${VERB_TEXT[verb]}" each other.`
          : `You correctly remembered no broken glass. Your question said the cars "${VERB_TEXT[verb]}" each other.`}
      </p>
      <div className="facts">
        <div className="fact">
          <span className="eyebrow">You estimated</span>
          <span className="val">{answers.speed} mph</span>
          <span className="note">when the cars "{VERB_TEXT[verb]}" each other</span>
        </div>
        <div className="fact">
          <span className="eyebrow">Broken glass?</span>
          <span className={`val ${saw ? 'bad' : 'good'}`}>{saw ? 'Yes' : 'No'}</span>
          <span className="note">There was no broken glass in the clip.</span>
        </div>
      </div>
      <h3>Who said they saw broken glass in the original study</h3>
      <div className="chart">
        <svg
          viewBox="0 0 400 124"
          role="img"
          aria-label={`Original study: ${GLASS_YES.smashed}% of people asked "smashed into" said they saw broken glass, against ${GLASS_YES.hit}% of people asked "hit". You were asked "${VERB_TEXT[verb]}".`}
        >
          {ROWS.map((v, i) => {
            const y = 8 + i * 58;
            const mine = v === verb;
            const w = (W * GLASS_YES[v]) / 100;
            return (
              <g key={v}>
                {mine && <rect className="mine-row" x="0" y={y - 6} width="400" height="50" rx="8" />}
                <text className="rl" x="8" y={y + 16}>Asked "{VERB_TEXT[v]}"</text>
                <text x="8" y={y + 32} className={mine ? 'you' : undefined}>{mine ? 'your version' : 'other version'}</text>
                <rect className="bar-track" x={X0} y={y + 4} width={W} height="30" rx="4" />
                <rect className="bar" x={X0} y={y + 4} width={w} height="30" rx="4" />
                <text className="in" x={X0 + w + 8} y={y + 24}>{GLASS_YES[v]}% said yes</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="note">
        Half of players are asked how fast the cars were going when they "smashed into" each other. The other half are
        asked about cars that "hit" each other. In the original study, the glass question came a week later.
      </p>
    </div>
  );
}

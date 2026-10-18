import type { ResultProps } from '../types';
import { CORRECT, noCount, ruleOf, testsOf } from './logic';
import { TestLog } from './TestLog';

export function Result({ answers }: ResultProps) {
  const tests = testsOf(answers);
  const rule = ruleOf(answers);
  const right = rule.id === CORRECT;
  const no = noCount(tests);

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">{right ? 'You cracked it' : 'Not quite'}</p>
      <p className="answer">
        The rule was: <b>any three numbers that go up</b>.
      </p>
      <p>{right ? 'Here are the tests you ran on the way.' : `You picked "${rule.text.toLowerCase()}". Here are the tests you ran.`}</p>
      <div className="tally">
        <span>
          <b>{tests.length - no}</b> followed the rule
        </span>
        <span>
          <b>{no}</b> didn't
        </span>
      </div>
      <TestLog tests={tests} />
    </div>
  );
}

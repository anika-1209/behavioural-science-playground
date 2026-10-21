import type { ResultProps } from '../types';
import { INFLUENCE, TRAIT_WORDS, influenceOf, versionOf, writingScore } from '../../../shared/experiments/first-impressions/logic';

export function Result({ condition, answers }: ResultProps) {
  const v = versionOf(condition);
  const other = v === 'warm' ? 'cold' : 'warm';
  const said = INFLUENCE.find((i) => i.id === influenceOf(answers))!.label;

  return (
    <div className="stack">
      <p className="eyebrow">Your result</p>
      <p className="big big-text">
        {writingScore(answers)} <small>out of 7</small>
      </p>
      <p>That's your average rating of how clearly and how well organised Sam's note was.</p>
      <div className="ledger-wrap">
        <table className="ledger">
          <tbody>
            <tr className="mine">
              <th scope="row">What you read about Sam</th>
              <td>Sam is {TRAIT_WORDS[v]}</td>
            </tr>
            <tr>
              <th scope="row">What other players read</th>
              <td>Sam is {TRAIT_WORDS[other]}</td>
            </tr>
            <tr>
              <th scope="row">Sam's note</th>
              <td>The same for everyone, word for word</td>
            </tr>
            <tr>
              <th scope="row">Did the description affect your rating?</th>
              <td>You said: {said.toLowerCase()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="note">
        The description was about Sam's personality, not their writing. If it made no difference, both groups should rate
        the note about the same.
      </p>
    </div>
  );
}

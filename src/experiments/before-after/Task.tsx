import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Answers } from '../../lib/progress';
import type { TaskProps } from '../types';
import { QUESTIONS, parseNumber, type Question } from '../../../shared/experiments/before-after/logic';

type Phase = 'first' | 'reveal' | 'recall';

const unitHint = (q: Question) => (q.unit === 'year' ? 'Answer as a year, for example 1900.' : `Answer in ${q.unit}.`);
const withUnit = (q: Question) => (q.unit === 'year' ? String(q.answer) : `${q.answer.toLocaleString('en-GB')} ${q.unit}`);

export function Task({ onComplete }: TaskProps) {
  const [phase, setPhase] = useState<Phase>('first');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (phase === 'reveal' ? nextRef : inputRef).current?.focus();
  }, [phase, index]);

  if (phase === 'reveal') {
    return (
      <div className="stack">
        <p className="eyebrow">The real answers</p>
        <p>Here are the answers to the six questions. Take a moment to look at them.</p>
        <div className="ledger-wrap">
          <table className="ledger">
            <tbody>
              {QUESTIONS.map((q) => (
                <tr key={q.id}>
                  <td>{q.text}</td>
                  <td className="n">{withUnit(q)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Next, we'll show each question again. This time, type the answer <b>you gave the first time</b>, as best you
          can remember it.
        </p>
        <button className="btn" ref={nextRef} onClick={() => setPhase('recall')}>
          Continue
        </button>
      </div>
    );
  }

  const q = QUESTIONS[index]!;
  const last = index === QUESTIONS.length - 1;
  const key = `${q.id}_${phase}`;

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = parseNumber(value);
    if (n === null) {
      setError('Enter a number. Digits only, commas are fine.');
      inputRef.current?.focus();
      return;
    }
    const next = { ...answers, [key]: n };
    setAnswers(next);
    setValue('');
    setError('');
    if (!last) {
      setIndex(index + 1);
    } else if (phase === 'first') {
      setIndex(0);
      setPhase('reveal');
    } else {
      onComplete(next);
    }
  }

  // An empty box rather than a slider or placeholder: any preset number would act as an anchor.
  return (
    <form className="stack" onSubmit={submit} noValidate key={key}>
      <div className="pair-top">
        <p className="eyebrow">
          {phase === 'first' ? 'Question' : 'Remember your answer'} {index + 1} of {QUESTIONS.length}
        </p>
        <div className="pips" aria-hidden="true">
          {QUESTIONS.map((x, i) => (
            <span key={x.id} className={i < index ? 'on' : undefined} />
          ))}
        </div>
      </div>
      <p className="q">{q.text}</p>
      {phase === 'recall' && (
        <p className="truth">
          Real answer: <b>{withUnit(q)}</b>
        </p>
      )}
      <div className="field">
        <label htmlFor="ba-value">{phase === 'first' ? 'Your best guess' : 'What you answered the first time'}</label>
        <input
          id="ba-value"
          ref={inputRef}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          aria-describedby="ba-unit ba-err"
          aria-invalid={error ? true : undefined}
        />
      </div>
      <p className="unit" id="ba-unit">
        {unitHint(q)}
      </p>
      <p className="err" id="ba-err" aria-live="assertive">
        {error}
      </p>
      <button className="btn" type="submit">
        {!last ? 'Next question' : phase === 'first' ? 'See the answers' : 'Submit'}
      </button>
    </form>
  );
}

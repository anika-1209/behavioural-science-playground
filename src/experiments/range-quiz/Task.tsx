import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Answers } from '../../lib/progress';
import type { TaskProps } from '../types';
import { QUESTIONS, parseNumber } from '../../../shared/experiments/range-quiz/logic';

export function Task({ onComplete }: TaskProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [lo, setLo] = useState('');
  const [hi, setHi] = useState('');
  const [error, setError] = useState('');
  const loRef = useRef<HTMLInputElement>(null);
  const hiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loRef.current?.focus();
  }, [index]);

  const q = QUESTIONS[index]!;
  const last = index === QUESTIONS.length - 1;

  function submit(e: FormEvent) {
    e.preventDefault();
    const low = parseNumber(lo);
    const high = parseNumber(hi);
    if (low === null || high === null) {
      setError('Enter a number in both boxes. Digits only, commas are fine.');
      (low === null ? loRef : hiRef).current?.focus();
      return;
    }
    if (low > high) {
      setError('The low number must not be bigger than the high number.');
      loRef.current?.focus();
      return;
    }
    const next = { ...answers, [`${q.id}_lo`]: low, [`${q.id}_hi`]: high };
    if (last) {
      onComplete(next);
      return;
    }
    setAnswers(next);
    setLo('');
    setHi('');
    setError('');
    setIndex(index + 1);
  }

  // Empty boxes rather than sliders or placeholders: any preset number would act as an anchor.
  return (
    <form className="stack" onSubmit={submit} noValidate key={q.id}>
      <div className="pair-top">
        <p className="eyebrow">
          Question {index + 1} of {QUESTIONS.length}
        </p>
        <div className="pips" aria-hidden="true">
          {QUESTIONS.map((x, i) => (
            <span key={x.id} className={i < index ? 'on' : undefined} />
          ))}
        </div>
      </div>
      <p className="q">{q.text}</p>
      <p className="how">Pick a low and a high number so you're 90% sure the answer is in between.</p>
      <div className="range">
        <div className="field">
          <label htmlFor="range-lo">Low</label>
          <input
            id="range-lo"
            ref={loRef}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={lo}
            onChange={(e) => {
              setLo(e.target.value);
              setError('');
            }}
            aria-describedby="range-unit range-err"
            aria-invalid={error ? true : undefined}
          />
        </div>
        <span className="to" aria-hidden="true">
          to
        </span>
        <div className="field">
          <label htmlFor="range-hi">High</label>
          <input
            id="range-hi"
            ref={hiRef}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={hi}
            onChange={(e) => {
              setHi(e.target.value);
              setError('');
            }}
            aria-describedby="range-unit range-err"
            aria-invalid={error ? true : undefined}
          />
        </div>
      </div>
      <p className="unit" id="range-unit">
        {q.unit === 'year' ? 'Answer as years, for example 1700 to 1800.' : `Answer in ${q.unit}.`}
      </p>
      <p className="err" id="range-err" aria-live="assertive">
        {error}
      </p>
      <button className="btn" type="submit">
        {last ? 'Submit my ranges' : 'Next question'}
      </button>
    </form>
  );
}

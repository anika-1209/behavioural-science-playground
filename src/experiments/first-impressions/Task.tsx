import { useEffect, useRef, useState } from 'react';
import type { Answers } from '../../lib/progress';
import type { TaskProps } from '../types';
import { INFLUENCE, NOTE, RATINGS, SCALE, TRAITS, versionOf, type Influence } from '../../../shared/experiments/first-impressions/logic';

type Step = 'read' | 'note' | 'sam' | 'influence';
const STEPS: Step[] = ['read', 'note', 'sam', 'influence'];

function Note() {
  return (
    <div className="note-paper" aria-label="Sam's note">
      {NOTE.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

function Scale({ id, question, low, high, value, onChange }: {
  id: string;
  question: string;
  low: string;
  high: string;
  value: number | undefined;
  onChange: (n: number) => void;
}) {
  return (
    <fieldset className="scale-field">
      <legend>{question}</legend>
      <div className="scale">
        {SCALE.map((n) => (
          <label key={n} className="scale-pt">
            <input type="radio" name={id} value={n} checked={value === n} onChange={() => onChange(n)} />
            <span>{n}</span>
          </label>
        ))}
      </div>
      <div className="scale-ends" aria-hidden="true">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      <p className="sr-only">1 means {low.toLowerCase()}, 7 means {high.toLowerCase()}.</p>
    </fieldset>
  );
}

export function Task({ condition, onComplete }: TaskProps) {
  const [step, setStep] = useState<Step>('read');
  const [answers, setAnswers] = useState<Answers>({});
  const headRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    headRef.current?.focus();
  }, [step]);

  const set = (key: string, v: number | string) => setAnswers({ ...answers, [key]: v });
  const next = () => setStep(STEPS[STEPS.indexOf(step) + 1]!);
  const rating = (r: (typeof RATINGS)[number]) => (
    <Scale key={r.id} {...r} value={answers[r.id] as number | undefined} onChange={(n) => set(r.id, n)} />
  );
  const progress = (
    <div className="pair-top">
      <p className="eyebrow">
        Step {STEPS.indexOf(step) + 1} of {STEPS.length}
      </p>
      <div className="pips" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s} className={i < STEPS.indexOf(step) ? 'on' : undefined} />
        ))}
      </div>
    </div>
  );

  if (step === 'read') {
    return (
      <div className="stack" key={step}>
        {progress}
        <p className="q" ref={headRef} tabIndex={-1}>
          Meet Sam
        </p>
        <div className="stack story">
          <p>Sam is 28 and has just finished training as a secondary school teacher.</p>
          <p>{TRAITS[versionOf(condition)]}</p>
          <p>Sam enjoys hiking and plays bass in a local band.</p>
        </div>
        <p>Here is a note Sam wrote to parents about a school trip.</p>
        <Note />
        <button className="btn" onClick={next}>
          Rate the note
        </button>
      </div>
    );
  }

  if (step === 'note') {
    const done = answers.clarity !== undefined && answers.organised !== undefined;
    return (
      <div className="stack" key={step}>
        {progress}
        <p className="q" ref={headRef} tabIndex={-1}>
          Rate Sam's note
        </p>
        <Note />
        {RATINGS.filter((r) => r.id !== 'smart').map(rating)}
        <button className="btn" disabled={!done} onClick={next}>
          Next
        </button>
      </div>
    );
  }

  if (step === 'sam') {
    return (
      <div className="stack" key={step}>
        {progress}
        <p className="q" ref={headRef} tabIndex={-1}>
          Your impression of Sam
        </p>
        {RATINGS.filter((r) => r.id === 'smart').map(rating)}
        <button className="btn" disabled={answers.smart === undefined} onClick={next}>
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="stack" key={step}>
      {progress}
      <p className="q" ref={headRef} tabIndex={-1} id="influence-q">
        Did what you read about Sam's personality affect how you rated the note?
      </p>
      <div className="choice3" role="group" aria-labelledby="influence-q">
        {INFLUENCE.map((i) => (
          <button key={i.id} className="btn ghost" onClick={() => onComplete({ ...answers, influence: i.id satisfies Influence })}>
            {i.label}
          </button>
        ))}
      </div>
    </div>
  );
}

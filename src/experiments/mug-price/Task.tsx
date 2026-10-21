import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { TaskProps } from '../types';
import { MAX_PRICE, parsePrice, versionOf } from '../../../shared/experiments/mug-price/logic';
import { Mug } from './Mug';

const TEXT = {
  owner: {
    story: [
      'You have just been given this mug for free, as a thank-you for filling in a short survey. It is a good-quality ceramic mug with a hand-painted zigzag pattern, and it is yours to keep.',
      'A stranger likes it and asks if you would sell it to them.',
    ],
    question: 'What is the lowest price you would sell it for?',
    label: 'Lowest price you would accept',
    submit: 'Name my price',
  },
  buyer: {
    story: [
      'You see this mug for sale in a shop. It is a good-quality ceramic mug with a hand-painted zigzag pattern.',
      'There is no price on it, and the shopkeeper asks what you would be willing to pay.',
    ],
    question: 'What is the most you would pay for it?',
    label: 'Most you would pay',
    submit: 'Name my price',
  },
};

export function Task({ condition, onComplete }: TaskProps) {
  const t = TEXT[versionOf(condition)];
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const price = parsePrice(value);
    if (price === null) {
      setError(`Enter an amount in pounds between £0 and £${MAX_PRICE}, for example 4 or 4.50.`);
      inputRef.current?.focus();
      return;
    }
    onComplete({ price });
  }

  // An empty box rather than a slider or placeholder: any preset number would act as an anchor.
  return (
    <form className="stack" onSubmit={submit} noValidate>
      <div className="mug-scene">
        <Mug />
        <div className="stack story">
          {t.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <p className="q">{t.question}</p>
      <div className="field money">
        <label htmlFor="mug-price">{t.label}</label>
        <div className="money-input">
          <span aria-hidden="true">£</span>
          <input
            id="mug-price"
            ref={inputRef}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError('');
            }}
            aria-describedby="mug-err"
            aria-invalid={error ? true : undefined}
          />
        </div>
      </div>
      <p className="err" id="mug-err" aria-live="assertive">
        {error}
      </p>
      <button className="btn" type="submit">
        {t.submit}
      </button>
    </form>
  );
}

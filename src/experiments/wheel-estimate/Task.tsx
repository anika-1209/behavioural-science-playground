import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { TaskProps } from '../types';
import { Wheel, rotationFor } from './Wheel';
import { anchorFor, parseEstimate } from './logic';

type Step = 'spin' | 'higher-lower' | 'estimate';

const SPIN_MS = 3900;
const SPIN_MS_REDUCED = 700;

export function Task({ condition, onComplete }: TaskProps) {
  const anchor = anchorFor(condition);
  const [step, setStep] = useState<Step>('spin');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);
  const [higherLower, setHigherLower] = useState<string>('');
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const focusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    focusRef.current?.focus();
  }, [step, landed]);

  function spin() {
    setSpinning(true);
    setRotation(rotationFor(anchor, (Math.random() * 2 - 1) * 4));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      setSpinning(false);
      setLanded(true);
    }, reduce ? SPIN_MS_REDUCED : SPIN_MS);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = parseEstimate(raw);
    if (n === null) {
      setError('Enter a whole number from 0 to 100.');
      return;
    }
    onComplete({ anchor, higherLower, estimate: n });
  }

  if (step === 'spin') {
    return (
      <div className="stack">
        <p className="eyebrow">Step 1 of 3</p>
        <p className="q">First, spin the wheel.</p>
        <div className="wheel-box">
          <Wheel rotation={rotation} />
        </div>
        <p className="landed" aria-live="polite">
          {landed && (
            <>
              The wheel landed on <b>{anchor}</b>
            </>
          )}
        </p>
        {landed ? (
          <button className="btn" ref={(el) => { focusRef.current = el; }} onClick={() => setStep('higher-lower')}>
            Next
          </button>
        ) : (
          <button className="btn" onClick={spin} disabled={spinning}>
            Spin the wheel
          </button>
        )}
      </div>
    );
  }

  if (step === 'higher-lower') {
    return (
      <div className="stack">
        <p className="eyebrow">Step 2 of 3</p>
        <p className="q">
          Is the percentage of United Nations member countries that are in Africa higher or lower than{' '}
          <span className="num">{anchor}%</span>?
        </p>
        <div className="choice">
          {['higher', 'lower'].map((v, i) => (
            <button
              key={v}
              className="btn ghost"
              ref={i === 0 ? (el) => { focusRef.current = el; } : undefined}
              onClick={() => {
                setHigherLower(v);
                setStep('estimate');
              }}
            >
              {v === 'higher' ? 'Higher' : 'Lower'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Empty text box rather than a slider: a slider's starting position would act as a second anchor.
  return (
    <form className="stack" onSubmit={submit} noValidate>
      <p className="eyebrow">Step 3 of 3</p>
      <label className="q" htmlFor="est-input">
        What's your best guess for the percentage of UN member countries that are in Africa?
      </label>
      <div className="est">
        <input
          id="est-input"
          ref={(el) => { focusRef.current = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={3}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setError('');
          }}
          aria-describedby="est-hint est-err"
          aria-invalid={error ? true : undefined}
        />
        <span>%</span>
      </div>
      <p className="note" id="est-hint">A whole number from 0 to 100.</p>
      <p className="err" id="est-err" aria-live="assertive">{error}</p>
      <button className="btn" type="submit">Submit my guess</button>
    </form>
  );
}

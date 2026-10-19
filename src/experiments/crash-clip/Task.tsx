import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Answers } from '../../lib/progress';
import type { TaskProps } from '../types';
import { Clip } from './Clip';
import { CLIP_MS, VERB_TEXT, parseSpeed, verbOf } from '../../../shared/experiments/crash-clip/logic';

type Step = 'clip' | 'colour' | 'speed' | 'light' | 'glass';

const COLOURS = ['blue', 'red', 'green', 'white'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Task({ condition, onComplete }: TaskProps) {
  const verb = verbOf(condition);
  const [step, setStep] = useState<Step>('clip');
  const [clip, setClip] = useState<'ready' | 'playing' | 'done'>('ready');
  const [answers, setAnswers] = useState<Answers>({});
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const focusRef = useRef<HTMLElement | null>(null);
  const setFocus = (el: HTMLElement | null) => {
    focusRef.current = el;
  };

  useEffect(() => {
    focusRef.current?.focus();
  }, [step, clip]);

  useEffect(() => {
    if (clip !== 'playing') return;
    const t = window.setTimeout(() => setClip('done'), CLIP_MS);
    return () => window.clearTimeout(t);
  }, [clip]);

  const answer = (patch: Answers, next: Step | null) => {
    const all = { ...answers, ...patch };
    if (next) {
      setAnswers(all);
      setStep(next);
    } else {
      onComplete(all);
    }
  };

  function submitSpeed(e: FormEvent) {
    e.preventDefault();
    const n = parseSpeed(raw);
    if (n === null) {
      setError('Enter a whole number, for example 25.');
      focusRef.current?.focus();
      return;
    }
    answer({ speed: n }, 'light');
  }

  if (step === 'clip') {
    return (
      <div className="stack">
        <p className="eyebrow">The clip</p>
        <Clip playing={clip !== 'ready'} />
        <div className="clip-bar">
          <p className="note" aria-live="polite">
            {clip === 'ready' && "Press play when you're ready. The clip lasts about four seconds."}
            {clip === 'playing' && 'Playing…'}
            {clip === 'done' && "That's the whole clip."}
          </p>
          {clip === 'done' ? (
            <button className="btn" ref={setFocus} onClick={() => setStep('colour')}>
              Answer the questions
            </button>
          ) : (
            <button className="btn" ref={setFocus} disabled={clip === 'playing'} onClick={() => setClip('playing')}>
              Play the clip
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'colour') {
    return (
      <div className="stack">
        <p className="eyebrow">Question 1 of 4</p>
        <p className="q" id="q-colour">What colour was the car that came from the left?</p>
        <div className="choice4" role="group" aria-labelledby="q-colour">
          {COLOURS.map((c, i) => (
            <button key={c} className="btn ghost" ref={i === 0 ? setFocus : undefined} onClick={() => answer({ colour: c }, 'speed')}>
              {cap(c)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'speed') {
    return (
      <form className="stack" onSubmit={submitSpeed} noValidate>
        <p className="eyebrow">Question 2 of 4</p>
        <label className="q" htmlFor="speed-input">
          About how fast were the cars going when they {VERB_TEXT[verb]} each other?
        </label>
        <div className="est">
          <input
            id="speed-input"
            ref={setFocus}
            inputMode="numeric"
            autoComplete="off"
            maxLength={3}
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setError('');
            }}
            aria-describedby="speed-hint speed-err"
            aria-invalid={error ? true : undefined}
          />
          <span>mph</span>
        </div>
        <p className="note" id="speed-hint">Your best guess, as a whole number.</p>
        <p className="err" id="speed-err" aria-live="assertive">{error}</p>
        <button className="btn" type="submit">Next question</button>
      </form>
    );
  }

  const yesNo = (key: 'light' | 'glass', id: string, text: string, n: number, next: Step | null) => (
    <div className="stack">
      <p className="eyebrow">Question {n} of 4</p>
      <p className="q" id={id}>{text}</p>
      <div className="choice" role="group" aria-labelledby={id}>
        {['yes', 'no'].map((v, i) => (
          <button key={v} className="btn ghost" ref={i === 0 ? setFocus : undefined} onClick={() => answer({ [key]: v }, next)}>
            {cap(v)}
          </button>
        ))}
      </div>
    </div>
  );

  return step === 'light'
    ? yesNo('light', 'q-light', 'Were there traffic lights at the junction?', 3, 'glass')
    : yesNo('glass', 'q-glass', 'Did you see any broken glass?', 4, null);
}

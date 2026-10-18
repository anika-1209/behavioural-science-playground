import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { TaskProps } from '../types';
import { MAX_TESTS, RULES, SEED, encodeTests, parseWhole, type Triple } from './logic';
import { TestLog } from './TestLog';

const FIELDS = ['First', 'Second', 'Third'] as const;

export function Task({ onComplete }: TaskProps) {
  const [step, setStep] = useState<'test' | 'guess'>('test');
  const [tests, setTests] = useState<Triple[]>([]);
  const [raw, setRaw] = useState(['', '', '']);
  const [error, setError] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const guessRef = useRef<HTMLInputElement>(null);

  const full = tests.length >= MAX_TESTS;

  useEffect(() => {
    if (step === 'test') inputRefs.current[0]?.focus();
    else guessRef.current?.focus();
  }, [step]);

  function runTest(e: FormEvent) {
    e.preventDefault();
    const vals = raw.map(parseWhole);
    const bad = vals.findIndex((v) => v === null);
    if (bad >= 0) {
      setError('Enter a whole number in each box, for example 3, 9, 27.');
      inputRefs.current[bad]?.focus();
      return;
    }
    setError('');
    setTests([...tests, vals as Triple]);
    setRaw(['', '', '']);
    inputRefs.current[0]?.focus();
  }

  if (step === 'guess') {
    return (
      <div className="stack">
        <p className="eyebrow">Your answer</p>
        <fieldset className="rules-list">
          <legend className="q">Which is the rule?</legend>
          {RULES.map((r, i) => (
            <label key={r.id} className="opt">
              <input
                type="radio"
                name="rule"
                id={`rule-${r.id}`}
                value={r.id}
                ref={i === 0 ? guessRef : undefined}
                checked={picked === r.id}
                onChange={() => setPicked(r.id)}
              />
              {r.text}
            </label>
          ))}
        </fieldset>
        <div className="row">
          <button className="btn" disabled={!picked} onClick={() => picked && onComplete({ tests: encodeTests(tests), rule: picked })}>
            Submit my answer
          </button>
          <button className="btn ghost" onClick={() => setStep('test')}>
            Run more tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="seed">
        <span className="eyebrow">Follows the rule</span>
        <span className="nums">{SEED.join(' · ')}</span>
      </div>
      <form className="stack" onSubmit={runTest} noValidate>
        <p className="q">Test a set of three numbers</p>
        <div className="triple">
          {FIELDS.map((label, i) => (
            <div className="field" key={label}>
              <label htmlFor={`triple-${i}`}>{label}</label>
              <input
                id={`triple-${i}`}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                inputMode="numeric"
                autoComplete="off"
                maxLength={5}
                disabled={full}
                value={raw[i]}
                onChange={(e) => {
                  const next = [...raw];
                  next[i] = e.target.value;
                  setRaw(next);
                  setError('');
                }}
                aria-describedby="triple-err"
                aria-invalid={error ? true : undefined}
              />
            </div>
          ))}
          <button className="btn" type="submit" disabled={full}>
            Test
          </button>
        </div>
        <p className="err" id="triple-err" aria-live="assertive">
          {full ? "That's the most tests you can run. Pick the rule when you're ready." : error}
        </p>
      </form>
      <div className="log-head">
        <h3>Your tests</h3>
        <span className="note">
          {tests.length} of {MAX_TESTS}
        </span>
      </div>
      {tests.length === 0 ? (
        <p className="note">No tests yet. Whole numbers only.</p>
      ) : (
        <TestLog tests={[...tests].reverse()} live />
      )}
      <button className="btn ghost" disabled={tests.length === 0} onClick={() => setStep('guess')}>
        I know the rule
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { TaskProps } from '../types';
import { LETTERS, PLAYERS, REVEAL_MS, ROUNDS, type Letter } from './logic';

// Lines stand vertically, bottom-aligned at y = 180.
const VLine = ({ x, len }: { x: number; len: number }) => <line className="line" x1={x} x2={x} y1="180" y2={180 - len} />;

export function Task({ onComplete }: TaskProps) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState('');
  const [shown, setShown] = useState(0);
  const firstRef = useRef<HTMLButtonElement>(null);

  const round = ROUNDS[index]!;
  const ready = shown > PLAYERS.length;

  // The group's answers appear one by one, then the player can answer.
  useEffect(() => {
    setShown(0);
    const timers = Array.from({ length: PLAYERS.length + 1 }, (_, i) =>
      window.setTimeout(() => setShown(i + 1), REVEAL_MS * (i + 1)),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [index]);

  useEffect(() => {
    if (ready) firstRef.current?.focus();
  }, [ready]);

  function choose(letter: Letter) {
    const next = picks + letter;
    if (index + 1 < ROUNDS.length) {
      setPicks(next);
      setIndex(index + 1);
    } else {
      onComplete({ picks: next });
    }
  }

  return (
    <div className="stack" key={index}>
      <div className="pair-top">
        <p className="eyebrow">
          Round {index + 1} of {ROUNDS.length}
        </p>
        <div className="pips" aria-hidden="true">
          {ROUNDS.map((_, i) => (
            <span key={i} className={i < index ? 'on' : undefined} />
          ))}
        </div>
      </div>
      <div className="cards">
        <div className="lcard">
          <span className="eyebrow">This line</span>
          <svg viewBox="0 0 80 200" aria-hidden="true">
            <VLine x={40} len={round.ref} />
          </svg>
        </div>
        <div className="lcard">
          <span className="eyebrow">Which is the same length?</span>
          <svg viewBox="0 0 240 200" aria-hidden="true">
            {round.opts.map((len, i) => (
              <g key={i}>
                <VLine x={40 + i * 80} len={len} />
                <text className="lab" x={40 + i * 80} y="198" textAnchor="middle">{LETTERS[i]}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="crowd">
        <span className="eyebrow">Previous players' answers</span>
        <ol aria-live="polite">
          {PLAYERS.map((p, i) => {
            const done = i < shown;
            return (
              <li key={p} className={done ? undefined : 'pending'} aria-label={done ? `Player ${p} answered ${round.group}` : undefined}>
                <span className={`av av-${i}`}>{p}</span>
                <span className="pick">{done ? round.group : '…'}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="q" id="round-q">
        Which line is the same length?
      </p>
      <div className="abc" role="group" aria-labelledby="round-q">
        {LETTERS.map((l, i) => (
          <button key={l} className="btn ghost" ref={i === 0 ? firstRef : undefined} disabled={!ready} onClick={() => choose(l)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

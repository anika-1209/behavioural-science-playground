import { useEffect, useRef, useState } from 'react';
import type { Answers } from '../../lib/progress';
import type { TaskProps } from '../types';
import { BELIEFS, ROUNDS, type Belief, type Side } from '../../../shared/experiments/next-flip/logic';
import { Coins } from './Coins';

const SIXES: Side[] = ['H', 'H', 'H', 'H', 'H', 'H'];

export function Task({ onComplete }: TaskProps) {
  const [index, setIndex] = useState(0);
  const [bets, setBets] = useState<Answers>({});
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, [index]);

  // After the six bets, one direct question.
  if (index === ROUNDS.length) {
    return (
      <div className="stack" key="belief">
        <p className="eyebrow">Last question</p>
        <p>A fair coin has just landed heads six times in a row.</p>
        <Coins tosses={SIXES} />
        <p className="q" id="belief-q">
          On the next toss, which is more likely?
        </p>
        <div className="choice3" role="group" aria-labelledby="belief-q">
          {BELIEFS.map((b, i) => (
            <button
              key={b.id}
              className="btn ghost"
              ref={i === 0 ? firstRef : undefined}
              onClick={() => onComplete({ ...bets, belief: b.id satisfies Belief })}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const round = ROUNDS[index]!;

  function bet(side: Side) {
    setBets({ ...bets, [round.id]: side });
    setIndex(index + 1);
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
      <p>The coin has landed like this so far, oldest first:</p>
      <Coins tosses={round.tosses} />
      <p className="q" id="bet-q">
        Bet £10 on the next toss.
      </p>
      <div className="choice" role="group" aria-labelledby="bet-q">
        <button className="btn ghost" ref={firstRef} onClick={() => bet('H')}>
          Heads
        </button>
        <button className="btn ghost" onClick={() => bet('T')}>
          Tails
        </button>
      </div>
    </div>
  );
}

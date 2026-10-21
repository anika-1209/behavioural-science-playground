import { useEffect, useRef, useState } from 'react';
import type { Answers } from '../../lib/progress';
import type { TaskProps } from '../types';
import { ORDER, STAKE, keyOf, type Pick } from '../../../shared/experiments/coin-bets/logic';

export function Task({ onComplete }: TaskProps) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Answers>({});
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, [index]);

  const win = ORDER[index]!;

  function choose(pick: Pick) {
    const next = { ...picks, [keyOf(win)]: pick };
    if (index + 1 < ORDER.length) {
      setPicks(next);
      setIndex(index + 1);
    } else {
      onComplete(next);
    }
  }

  return (
    <div className="stack" key={index}>
      <div className="pair-top">
        <p className="eyebrow">
          Bet {index + 1} of {ORDER.length}
        </p>
        <div className="pips" aria-hidden="true">
          {ORDER.map((_, i) => (
            <span key={i} className={i < index ? 'on' : undefined} />
          ))}
        </div>
      </div>
      <div className="bet" aria-label={`One toss of a fair coin. Heads, you win £${win}. Tails, you lose £${STAKE}.`}>
        <p className="eyebrow">One toss of a fair coin</p>
        <div className="bet-sides">
          <div className="bet-side win">
            <span className="when">Heads</span>
            <span className="amt">+£{win}</span>
          </div>
          <div className="bet-side lose">
            <span className="when">Tails</span>
            <span className="amt">−£{STAKE}</span>
          </div>
        </div>
      </div>
      <p className="q" id="bet-q">
        Would you take this bet?
      </p>
      <div className="choice" role="group" aria-labelledby="bet-q">
        <button className="btn ghost" ref={firstRef} onClick={() => choose('accept')}>
          Take the bet
        </button>
        <button className="btn ghost" onClick={() => choose('reject')}>
          Turn it down
        </button>
      </div>
    </div>
  );
}

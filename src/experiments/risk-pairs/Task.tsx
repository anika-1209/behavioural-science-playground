import { useEffect, useRef, useState } from 'react';
import type { Answers } from '../../lib/progress';
import type { TaskProps } from '../types';
import { PAIRS } from '../../../shared/experiments/risk-pairs/logic';

export function Task({ onComplete }: TaskProps) {
  // Left/right order is randomised per pair so position can't drive the pick.
  const [sides] = useState(() => PAIRS.map(() => (Math.random() < 0.5 ? [0, 1] : [1, 0])));
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Answers>({});
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, [index]);

  const pair = PAIRS[index]!;

  function choose(optionId: string) {
    const next = { ...picks, [pair.id]: optionId };
    if (index + 1 < PAIRS.length) {
      setPicks(next);
      setIndex(index + 1);
    } else {
      onComplete(next);
    }
  }

  return (
    <div className="stack" key={pair.id}>
      <div className="pair-top">
        <p className="eyebrow">
          Pair {index + 1} of {PAIRS.length}
        </p>
        <div className="pips" aria-hidden="true">
          {PAIRS.map((p, i) => (
            <span key={p.id} className={i < index ? 'on' : undefined} />
          ))}
        </div>
      </div>
      <p className="q" id="pair-q">
        In the US, which kills more people each year?
      </p>
      <div className="pick" role="group" aria-labelledby="pair-q">
        {sides[index]!.map((optIndex, side) => {
          const o = pair.options[optIndex]!;
          return [
            side === 1 && (
              <span key="vs" className="vs" aria-hidden="true">
                or
              </span>
            ),
            <button
              key={o.id}
              className="opt-btn"
              data-side={side}
              ref={side === 0 ? firstRef : undefined}
              onClick={() => choose(o.id)}
            >
              {o.label}
            </button>,
          ];
        })}
      </div>
    </div>
  );
}

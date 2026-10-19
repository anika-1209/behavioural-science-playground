import { useEffect, useRef, useState } from 'react';
import type { Answers } from '../../lib/progress';
import type { TaskProps } from '../types';
import { BASE, ORDER, WHEN, keyOf, type Pick } from '../../../shared/experiments/now-later/logic';

export function Task({ onComplete }: TaskProps) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Answers>({});
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, [index]);

  const [h, amount] = ORDER[index]!;

  function choose(pick: Pick) {
    const next = { ...picks, [keyOf(h, amount)]: pick };
    if (index + 1 < ORDER.length) {
      setPicks(next);
      setIndex(index + 1);
    } else {
      onComplete(next);
    }
  }

  const options: { pick: Pick; when: string; amt: number; cls: string }[] = [
    { pick: 'soon', when: WHEN[h].soon, amt: BASE, cls: 'cheque' },
    { pick: 'late', when: WHEN[h].late, amt: amount, cls: 'cheque later' },
  ];

  return (
    <div className="stack" key={index}>
      <div className="pair-top">
        <p className="eyebrow">
          Choice {index + 1} of {ORDER.length}
        </p>
        <div className="pips" aria-hidden="true">
          {ORDER.map((_, i) => (
            <span key={i} className={i < index ? 'on' : undefined} />
          ))}
        </div>
      </div>
      <p className="q" id="payout-q">
        Which would you rather have?
      </p>
      <div className="payouts" role="group" aria-labelledby="payout-q">
        {options.map((o, i) => [
          i === 1 && (
            <span key="vs" className="vs" aria-hidden="true">
              or
            </span>
          ),
          <button
            key={o.pick}
            className={o.cls}
            ref={i === 0 ? firstRef : undefined}
            aria-label={`£${o.amt} ${o.when.toLowerCase()}`}
            onClick={() => choose(o.pick)}
          >
            <span className="when">{o.when}</span>
            <span className="amt">£{o.amt}</span>
            <span className="cta">Choose this</span>
          </button>,
        ])}
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import type { TaskProps } from '../types';
import { MENU, PLANS, versionOf } from './logic';

export function Task({ condition, onComplete }: TaskProps) {
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  return (
    <div className="stack">
      <div className="masthead">
        <span className="eyebrow">SIM-only plans</span>
        <span className="title">Choose your plan</span>
        <span className="note">12-month contract. Unlimited calls and texts on every plan.</span>
      </div>
      <p className="q" id="plans-q">
        Imagine you need a new phone plan. Which would you choose?
      </p>
      <div className="plans" role="group" aria-labelledby="plans-q">
        {MENU[versionOf(condition)].map((id, i) => {
          const p = PLANS[id];
          return (
            <button
              key={id}
              className="plan"
              ref={i === 0 ? firstRef : undefined}
              aria-label={`${p.gb} GB data, £${p.price} a month`}
              onClick={() => onComplete({ choice: id })}
            >
              <span className="name">{p.gb} GB data</span>
              <span className="price">
                £{p.price}
                <small> a month</small>
              </span>
              <span>Unlimited calls and texts</span>
              <span className="cta">Choose this plan</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

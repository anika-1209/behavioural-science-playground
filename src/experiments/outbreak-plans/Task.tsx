import { useEffect, useRef } from 'react';
import type { TaskProps } from '../types';
import { PLAN_TEXT, SCENARIO, frameOf, type Choice } from '../../../shared/experiments/outbreak-plans/logic';

export function Task({ condition, onComplete }: TaskProps) {
  const frame = frameOf(condition);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const plans: [Choice, string][] = [
    ['sure', 'Plan A'],
    ['gamble', 'Plan B'],
  ];

  return (
    <div className="stack">
      <p className="eyebrow">The scenario</p>
      <div className="brief">
        <span className="stamp">Public health briefing</span>
        <p>{SCENARIO}</p>
      </div>
      <p className="q" id="plan-q">
        Which plan do you choose?
      </p>
      <div className="programmes" role="group" aria-labelledby="plan-q">
        {plans.map(([choice, name], i) => (
          <button
            key={choice}
            className="prog"
            ref={i === 0 ? firstRef : undefined}
            onClick={() => onComplete({ choice })}
          >
            <b>{name}</b>
            <span>{PLAN_TEXT[frame][choice]}</span>
            <span className="cta">Choose {name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

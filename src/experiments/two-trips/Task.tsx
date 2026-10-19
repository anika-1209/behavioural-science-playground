import { useEffect, useRef } from 'react';
import type { TaskProps } from '../types';
import type { Trip } from '../../../shared/experiments/two-trips/logic';

const TICKETS: { trip: Trip; kind: string; place: string; paid: number; cta: string }[] = [
  { trip: 'city', kind: 'City break', place: 'Edinburgh', paid: 200, cta: 'Go to Edinburgh' },
  { trip: 'cabin', kind: 'Lakeside cabin', place: 'With friends', paid: 100, cta: 'Go to the cabin' },
];

export function Task({ onComplete }: TaskProps) {
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  return (
    <div className="stack">
      <div className="stack story">
        <p>
          Three months ago you booked a weekend city break in Edinburgh for <b>£200</b>.
        </p>
        <p>
          Last week you booked a weekend in a lakeside cabin with friends for <b>£100</b>. You think you'll enjoy the
          cabin more than Edinburgh.
        </p>
        <p>
          You've just noticed that both trips are on the <b>same weekend</b>.
        </p>
      </div>
      <p className="rules">Neither booking can be refunded, moved or sold on.</p>
      <p className="q" id="trip-q">
        Which trip do you go on?
      </p>
      <div className="tickets" role="group" aria-labelledby="trip-q">
        {TICKETS.map((t, i) => (
          <button
            key={t.trip}
            className="ticket"
            data-trip={t.trip}
            ref={i === 0 ? firstRef : undefined}
            onClick={() => onComplete({ choice: t.trip })}
          >
            <span className="kind">{t.kind}</span>
            <span className="place">{t.place}</span>
            <span className="paid">
              £{t.paid}
              <small> paid</small>
            </span>
            <span className="cta">{t.cta}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

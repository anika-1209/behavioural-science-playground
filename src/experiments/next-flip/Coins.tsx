import { sideName, type Side } from '../../../shared/experiments/next-flip/logic';

/** A row of tosses, oldest first, read out as words for screen readers. */
export function Coins({ tosses, label = 'Tosses so far' }: { tosses: Side[]; label?: string }) {
  return (
    <ol className="coins" aria-label={`${label}: ${tosses.map(sideName).join(', ')}`}>
      {tosses.map((s, i) => (
        <li key={i} className={`coin ${s === 'H' ? 'h' : 't'}`} aria-hidden="true">
          {s}
        </li>
      ))}
    </ol>
  );
}

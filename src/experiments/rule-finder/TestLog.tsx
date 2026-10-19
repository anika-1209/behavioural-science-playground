import { fitsRule, formatTriple, type Triple } from '../../../shared/experiments/rule-finder/logic';

export function TestLog({ tests, live }: { tests: Triple[]; live?: boolean }) {
  return (
    <ol className="log" aria-live={live ? 'polite' : undefined}>
      {tests.map((t, i) => {
        const yes = fitsRule(t);
        return (
          <li key={`${i}-${t.join(',')}`}>
            <span>{formatTriple(t)}</span>
            <span className={`badge ${yes ? 'yes' : 'no'}`}>{yes ? 'Follows the rule' : "Doesn't follow"}</span>
          </li>
        );
      })}
    </ol>
  );
}

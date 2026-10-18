import { Link } from 'react-router';
import type { BiasModule } from '../content/types';
import { categoryLabel } from '../content/categories';
import { hasDebrief } from '../content/debriefs';
import { useDebrief } from '../lib/hooks';

interface Props {
  module: BiasModule;
  completed: boolean;
  showBiasNames: boolean;
}

// Before completion the card shows only the teaser; after completion it reveals
// the bias name and definition (Feature 2). The "Show bias names" setting
// reveals names early for educators (P2-3).
export function BiasCard({ module: m, completed, showBiasNames }: Props) {
  const reveal = (completed || showBiasNames) && hasDebrief(m.id);
  const { debrief } = useDebrief(m.id, reveal);
  const ready = m.status === 'ready';

  return (
    <article
      className={`bias-card${completed ? ' is-done' : ''}${ready ? '' : ' is-soon'}`}
      data-cat={m.category}
    >
      <div className="bias-card-meta">
        <span>{categoryLabel(m.category)}</span>
        <span>{m.estMinutes} min</span>
      </div>
      <h3>{m.teaserTitle}</h3>
      <p className="hook">{m.teaserHook}</p>
      {debrief && (
        <div className="revealed">
          <p className="revealed-name">{debrief.biasName}</p>
          <p className="note">{debrief.definition}</p>
        </div>
      )}
      <div className="bias-card-foot">
        {!ready ? (
          <span className="pill">Coming soon</span>
        ) : completed ? (
          <>
            <span className="pill pill-done">Completed</span>
            <Link to={`/play/${m.id}?view=debrief`}>Revisit debrief</Link>
          </>
        ) : (
          <Link className="btn btn-sm" to={`/play/${m.id}`}>
            Start
          </Link>
        )}
      </div>
    </article>
  );
}

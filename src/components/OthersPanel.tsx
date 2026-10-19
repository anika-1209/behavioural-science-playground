import type { StatsResponse } from '../../shared/api';
import type { ExperimentDefinition } from '../experiments/types';

interface Props {
  stats: StatsResponse | null;
  live: ExperimentDefinition['live'];
  condition: string | null;
}

// "How players here answered" (spec, "Backend"): shown on the result and debrief
// screens once every version has enough plays. Until then the screens show
// study figures only, so this renders nothing.
export function OthersPanel({ stats, live, condition }: Props) {
  if (!stats?.live) return null;
  const total = Object.values(stats.versions).reduce((sum, v) => sum + v.n, 0);
  const pct = (value: number | null, max: number) => (value === null ? 0 : Math.min(100, Math.max(0, (value / max) * 100)));

  return (
    <section className="db-block others" aria-labelledby="others-h">
      <h3 id="others-h">How players here answered</h3>
      <p className="note">
        From {total.toLocaleString('en-GB')} players' first tries in the last 12 months, shared anonymously.
      </p>
      {live(stats.versions, condition).map((g) => (
        <div key={g.title} className="others-group">
          <p className="others-title">{g.title}</p>
          <ul className="others-bars">
            {g.bars.map((b) => (
              <li key={b.label} className={b.mine ? 'mine' : undefined}>
                <span className="ob-label">
                  {b.label}
                  {b.mine && <span className="ob-you">your version</span>}
                  {b.note && <span className="ob-note">{b.note}</span>}
                </span>
                <span className="ob-track" aria-hidden="true">
                  <span className="ob-fill" style={{ width: `${pct(b.value, b.max)}%` }} />
                </span>
                <span className="ob-val">{b.display}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

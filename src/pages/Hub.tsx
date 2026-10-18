import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { MODULES } from '../content/modules';
import { CATEGORIES } from '../content/categories';
import { BiasCard } from '../components/BiasCard';
import { useProgress, useTitle } from '../lib/hooks';
import { pickSurprise, visibleModules, type CategoryFilter, type SortKey } from '../lib/hub';

// Feature 2: start any bias in any order (P2-1).
export function Hub() {
  useTitle('Experiments');
  const state = useProgress();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortKey>('recommended');

  const completedIds = useMemo(() => new Set(Object.keys(state.completed)), [state.completed]);
  const list = visibleModules(MODULES, filter, sort);
  const doneCount = MODULES.filter((m) => completedIds.has(m.id)).length;
  const surprise = () => {
    const m = pickSurprise(MODULES, filter, completedIds);
    if (m) navigate(`/play/${m.id}`);
  };
  const canSurprise = pickSurprise(MODULES, filter, completedIds, () => 0) !== null;

  return (
    <div className="stack">
      <div className="hub-head">
        <div>
          <h1>Pick an experiment</h1>
          <p className="lede">Try it first. We'll explain what happened afterwards.</p>
        </div>
        <p className="progress-count" aria-live="polite">
          <b>{doneCount}</b> of {MODULES.length} biases explored
        </p>
      </div>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filter by category">
          {[{ id: 'all' as const, label: 'All' }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              className={`chip${filter === c.id ? ' on' : ''}`}
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="row">
          <label className="sort">
            Sort
            <select id="hub-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="recommended">Recommended for beginners</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </label>
          <button className="btn ghost btn-sm" onClick={surprise} disabled={!canSurprise}>
            Surprise me
          </button>
        </div>
      </div>

      <div className="grid">
        {list.map((m) => (
          <BiasCard
            key={m.id}
            module={m}
            completed={completedIds.has(m.id)}
            showBiasNames={state.settings.showBiasNames}
          />
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { PRIMER_CARDS } from '../content/primer';
import { progress } from '../lib/progress';
import { useTitle } from '../lib/hooks';

// Feature 1: five short cards, skippable from any card (P1-1), ending in a
// single call to action that leads to the hub (P1-5).
export function Primer() {
  useTitle('About biases');
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const card = PRIMER_CARDS[i]!;
  const last = i === PRIMER_CARDS.length - 1;

  const toHub = () => {
    progress.markPrimerSeen();
    navigate('/hub');
  };

  return (
    <div className="card stack">
      <div className="primer-top">
        <p className="eyebrow">
          {i + 1} of {PRIMER_CARDS.length}
        </p>
        {!last && (
          <button className="link" onClick={toHub}>
            Skip to experiments
          </button>
        )}
      </div>
      <h1>{card.title}</h1>
      {card.body.map((p, k) => (
        <p key={k} className={k === 0 ? 'lede' : undefined}>
          {p}
        </p>
      ))}
      {card.link && (
        <p className="note">
          <Link to={card.link.to}>{card.link.label}</Link>
        </p>
      )}
      <div className="row">
        {i > 0 && (
          <button className="btn ghost" onClick={() => setI(i - 1)}>
            Back
          </button>
        )}
        {last ? (
          <button className="btn" onClick={toHub}>
            Choose your first bias
          </button>
        ) : (
          <button className="btn" onClick={() => setI(i + 1)}>
            Next
          </button>
        )}
      </div>
      <div className="dots" aria-hidden="true">
        {PRIMER_CARDS.map((_, k) => (
          <span key={k} className={k === i ? 'on' : undefined} />
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router';
import { progress } from '../lib/progress';

// Spec "Backend: Consent": asked once, on the first result screen, below the
// result so it can't affect the answers already given.
export function ConsentPrompt({ moduleId }: { moduleId: string }) {
  const [answered, setAnswered] = useState<'yes' | 'no' | null>(null);

  if (answered) {
    return (
      <p className="note" aria-live="polite">
        {answered === 'yes'
          ? 'Thanks. Your answers will be added to the totals.'
          : 'OK. Nothing will be sent.'}{' '}
        You can change this in <Link to="/settings">Settings</Link>.
      </p>
    );
  }

  const answer = (a: 'yes' | 'no') => {
    progress.setConsent(a, moduleId);
    setAnswered(a);
  };

  return (
    <div className="db-block stack" role="group" aria-labelledby="consent-q">
      <h3 id="consent-q">Add your anonymous answers to the totals?</h3>
      <p className="note">
        Your answers would join other players' in the "how others answered" numbers. Nothing that identifies you is
        sent, and you can change your mind in Settings. <Link to="/privacy">What's sent</Link>
      </p>
      <div className="row">
        <button className="btn ghost" onClick={() => answer('yes')}>
          Yes, add them
        </button>
        <button className="btn ghost" onClick={() => answer('no')}>
          No thanks
        </button>
      </div>
    </div>
  );
}

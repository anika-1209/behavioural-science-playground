import { useState } from 'react';
import { Link } from 'react-router';
import { progress } from '../lib/progress';
import { useProgress, useTitle } from '../lib/hooks';

export function Settings() {
  useTitle('Settings');
  const { settings, completed, consent } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const count = Object.keys(completed).length;

  return (
    <div className="card stack">
      <h1>Settings</h1>

      <label className="toggle">
        <input
          type="checkbox"
          id="set-names"
          checked={settings.showBiasNames}
          onChange={(e) => progress.updateSettings({ showBiasNames: e.target.checked })}
        />
        <span>
          <b>Show bias names</b>
          <span className="note">
            Shows each bias's name on its card before you try it. Useful for teaching or revision, but it gives
            away the surprise.
          </span>
        </span>
      </label>

      <label className="toggle">
        <input
          type="checkbox"
          id="set-time"
          checked={settings.extendTime}
          onChange={(e) => progress.updateSettings({ extendTime: e.target.checked })}
        />
        <span>
          <b>Extend time</b>
          <span className="note">Gives you more time in experiments that use a timer.</span>
        </span>
      </label>

      <label className="toggle">
        <input
          type="checkbox"
          id="set-share"
          checked={consent === 'yes'}
          onChange={(e) => progress.setConsent(e.target.checked ? 'yes' : 'no')}
        />
        <span>
          <b>Add my anonymous answers to the totals</b>
          <span className="note">
            The first time you finish each experiment from now on, your answers join the "how others answered"
            numbers. Nothing that identifies you is sent. <Link to="/privacy">What's sent</Link>
          </span>
        </span>
      </label>

      <div className="db-block stack">
        <h3>Reset progress</h3>
        <p className="note">
          Clears your answers and completed experiments in this browser. {count} completed right now. Experiments
          you replay after a reset still aren't added to the totals.
        </p>
        {resetDone && <p aria-live="polite">Progress cleared.</p>}
        {confirming ? (
          <div className="row">
            <button
              className="btn danger"
              onClick={() => {
                progress.reset();
                setConfirming(false);
                setResetDone(true);
              }}
            >
              Clear my progress
            </button>
            <button className="btn ghost" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn ghost"
            onClick={() => {
              setConfirming(true);
              setResetDone(false);
            }}
          >
            Reset progress
          </button>
        )}
      </div>
    </div>
  );
}

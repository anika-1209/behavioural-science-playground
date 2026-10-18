import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { getModule } from '../content/modules';
import { getExperiment } from '../experiments/registry';
import { ProgressRail, type Stage } from '../components/ProgressRail';
import { DebriefView } from '../components/DebriefView';
import { progress } from '../lib/progress';
import { useDebrief, useProgress, useTitle } from '../lib/hooks';

// Feature 3: intro → experiment → result → debrief. The tab title and URL use
// the teaser title and opaque id only, so neither leaks the bias (P3-1).
export function ModulePage() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const state = useProgress();
  const module = getModule(id);
  const experiment = getExperiment(id);
  const record = state.completed[id];

  const [stage, setStage] = useState<Stage>(() =>
    params.get('view') === 'debrief' && record ? 'debrief' : 'intro',
  );
  const [condition, setCondition] = useState<string | null>(record?.condition ?? null);
  const { debrief, error } = useDebrief(id, stage === 'debrief' && Boolean(record));
  useTitle(module?.teaserTitle ?? 'Not found');

  if (!module || !experiment || module.status !== 'ready') {
    return (
      <div className="card stack">
        <h1>This experiment isn't available yet</h1>
        <Link className="btn" to="/hub">Back to all experiments</Link>
      </div>
    );
  }

  const { Task, Result } = experiment;
  const go = (s: Stage) => {
    setStage(s);
    window.scrollTo(0, 0);
  };

  return (
    <div className="stack">
      <ProgressRail stage={stage} />
      <div className="card">
        {stage === 'intro' && (
          <div className="stack">
            <p className="eyebrow">About {module.estMinutes} minutes</p>
            <h1>{module.teaserTitle}</h1>
            <p className="lede">{module.teaserHook}</p>
            <p>{module.introText}</p>
            <p className="note">Your answers stay in this browser. Nothing is sent anywhere.</p>
            <button
              className="btn"
              onClick={() => {
                setCondition(progress.conditionFor(module.id, module.conditions));
                go('experiment');
              }}
            >
              Start
            </button>
          </div>
        )}

        {stage === 'experiment' && (
          <Task
            condition={condition}
            extendTime={state.settings.extendTime}
            onComplete={(answers) => {
              progress.complete(module.id, condition, answers);
              go('result');
            }}
          />
        )}

        {stage === 'result' && record && (
          <div className="stack">
            <Result condition={record.condition} answers={record.answers} />
            <button className="btn" onClick={() => go('debrief')}>
              See what happened
            </button>
          </div>
        )}

        {stage === 'debrief' && record && (
          <>
            {error && <p className="err">The explanation didn't load. Check your connection and reload the page.</p>}
            {!debrief && !error && <p className="note">Loading…</p>}
            {debrief && (
              <DebriefView
                moduleId={module.id}
                debrief={debrief}
                whatHappened={experiment.whatHappened(record.condition, record.answers)}
                quizAnswer={record.quiz?.answerId}
                onQuizAnswer={(answerId, correct) => progress.recordQuiz(module.id, answerId, correct)}
              />
            )}
          </>
        )}
      </div>

      {(stage === 'intro' || stage === 'experiment') && (
        <p className="quit">
          {/* P3-5: leaving before submitting doesn't count as completed. */}
          <Link to="/hub">Quit to all experiments</Link>
        </p>
      )}
    </div>
  );
}

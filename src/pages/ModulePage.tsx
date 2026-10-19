import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { getModule } from '../content/modules';
import { getExperiment } from '../experiments/registry';
import { ProgressRail, type Stage } from '../components/ProgressRail';
import { DebriefView } from '../components/DebriefView';
import { ConsentPrompt } from '../components/ConsentPrompt';
import { OthersPanel } from '../components/OthersPanel';
import { progress } from '../lib/progress';
import { sharer } from '../lib/share';
import { useDebrief, useProgress, useStats, useTitle } from '../lib/hooks';

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
  // Decided on submit, so the prompt stays to show its confirmation once answered.
  const [askConsent, setAskConsent] = useState(false);
  const { debrief, error } = useDebrief(id, stage === 'debrief' && Boolean(record));
  const stats = useStats(id, (stage === 'result' || stage === 'debrief') && Boolean(record));
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
            <p className="note">
              {state.consent === 'yes'
                ? 'If this is your first time, your answers are added to the anonymous totals. You can change this in Settings.'
                : 'Your answers stay in this browser.'}
            </p>
            <button
              className="btn"
              onClick={() => {
                setCondition(progress.conditionFor(module.id, module.conditions));
                sharer.started(module.id);
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
              setAskConsent(progress.getState().consent === null);
              progress.complete(module.id, condition, answers);
              sharer.finished(module.id);
              void sharer.flushAnswers();
              go('result');
            }}
          />
        )}

        {stage === 'result' && record && (
          <div className="stack">
            <Result condition={record.condition} answers={record.answers} />
            <OthersPanel stats={stats} live={experiment.live} condition={record.condition} />
            {askConsent && <ConsentPrompt moduleId={module.id} />}
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
                others={<OthersPanel stats={stats} live={experiment.live} condition={record.condition} />}
                quizAnswer={record.quiz?.answerId}
                onQuizAnswer={(answerId, correct) => {
                  progress.recordQuiz(module.id, answerId, correct);
                  sharer.quizAnswered(module.id, correct);
                }}
                onOpened={() => sharer.debriefOpened(module.id)}
                onReadThrough={() => sharer.debriefRead(module.id)}
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

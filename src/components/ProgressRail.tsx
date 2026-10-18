export const STAGES = ['intro', 'experiment', 'result', 'debrief'] as const;
export type Stage = (typeof STAGES)[number];

const LABELS: Record<Stage, string> = {
  intro: 'Intro',
  experiment: 'Experiment',
  result: 'Result',
  debrief: 'Debrief',
};

export function ProgressRail({ stage }: { stage: Stage }) {
  const now = STAGES.indexOf(stage);
  return (
    <ol className="rail" aria-label="Progress">
      {STAGES.map((s, i) => (
        <li key={s} className={i < now ? 'done' : i === now ? 'now' : undefined} aria-current={i === now ? 'step' : undefined}>
          {LABELS[s]}
        </li>
      ))}
    </ol>
  );
}

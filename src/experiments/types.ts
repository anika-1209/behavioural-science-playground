import type { ComponentType } from 'react';
import type { Answers } from '../lib/progress';

export interface TaskProps {
  condition: string | null;
  /** Spec accessibility: timed tasks must honour this. */
  extendTime: boolean;
  /** Call once, when the user submits. Marks the module complete and unlocks the debrief. */
  onComplete: (answers: Answers) => void;
}

export interface ResultProps {
  condition: string | null;
  answers: Answers;
}

/**
 * One experiment = the interactive task, the result reveal, and the
 * "What just happened" text for the debrief. The spec's experimentConfig and
 * resultLogic live inside each implementation.
 *
 * None of these may mention the bias name: they ship before the debrief (P3-1).
 */
export interface ExperimentDefinition {
  Task: ComponentType<TaskProps>;
  Result: ComponentType<ResultProps>;
  /** P3-4: must describe the user's actual result, including when they resisted the effect. */
  whatHappened: (condition: string | null, answers: Answers) => string;
}

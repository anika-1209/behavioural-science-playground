// Content model from docs/spec.md ("Content model").
//
// A bias module is split in two so the bias name never ships before the
// debrief (P3-1):
//   - BiasModule: teaser-level data, bundled with the app and safe to show on the hub.
//   - Debrief: the reveal. Each one lives in its own file under content/debriefs/
//     and is loaded with a dynamic import, so it lands in a separate chunk that is
//     only fetched when the user reaches the debrief.
//
// The spec's experimentConfig and resultLogic live with each experiment's code
// under src/experiments/, because they are behaviour as much as data.

export type CategoryId = 'judgement' | 'choices' | 'memory' | 'social' | 'self';

export type ExperimentType =
  | 'estimate'
  | 'choice'
  | 'recall'
  | 'sort'
  | 'slider'
  | 'timed-response';

/** `planned` modules appear on the hub as "Coming soon" until their experiment and debrief exist. */
export type ModuleStatus = 'ready' | 'planned';

export interface BiasModule {
  /** Opaque slug such as `exp-01`. Must not contain the bias name (P3-1). */
  id: string;
  teaserTitle: string;
  teaserHook: string;
  category: CategoryId;
  /** 2–4 (P3-2). */
  estMinutes: number;
  experimentType: ExperimentType;
  /** Variants for random assignment, e.g. ['low', 'high']. Empty if none. */
  conditions: string[];
  /** One neutral sentence shown before the task. Must not hint at the bias. */
  introText: string;
  /** Lower = shown earlier under "Recommended for beginners". */
  beginnerRank: number;
  relatedBiasIds: string[];
  status: ModuleStatus;
}

export interface ClassicStudy {
  authors: string;
  year: number;
  title: string;
  /** One or two sentences on what the study did and found. */
  summary: string;
  citationUrl: string;
}

export interface QuizOption {
  id: string;
  text: string;
  feedback: string;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  answerId: string;
}

export interface RealWorldExample {
  label: string;
  text: string;
}

/** Everything revealed after the experiment. "What just happened" is computed by the experiment. */
export interface Debrief {
  biasName: string;
  /** One plain-language sentence. */
  definition: string;
  /** Paragraphs on the mechanism. */
  whyItHappens: string[];
  classicStudy: ClassicStudy;
  /** 2–3 items. */
  realWorldExamples: RealWorldExample[];
  /** 1–2 items, plus how designers use or mitigate it. */
  counterStrategies: string[];
  quiz?: Quiz;
}

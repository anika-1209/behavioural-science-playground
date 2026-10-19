import type { Answers } from '../../types';

// experimentConfig + resultLogic for exp-02.
// Yearly US deaths, rounded. Sources: CDC (2022 final data; stings averaged
// 2011–2021), NHTSA, NFPA, NWS, ACS, International Shark Attack File.
// Figures still need expert review (P3-6).

export interface RiskOption {
  id: string;
  label: string;
  deaths: number;
  /** Compact label for the result chart. */
  short: string;
}

export interface RiskPair {
  id: string;
  /** The option that gets far more news coverage. */
  news: string;
  /** In the control pair the newsworthy cause really is the more common one. */
  control?: boolean;
  options: [RiskOption, RiskOption];
  /** Used in "What just happened" when the user picked the newsworthy cause. */
  fact?: string;
}

// Critical pairs are ordered from the largest gap to the smallest.
export const PAIRS: RiskPair[] = [
  {
    id: 'p1',
    news: 'shark',
    options: [
      { id: 'shark', label: 'Shark attacks', deaths: 1, short: '~1' },
      { id: 'stings', label: 'Bee, wasp and hornet stings', deaths: 72, short: '~70' },
    ],
    fact: 'bee, wasp and hornet stings kill about 70 times as many Americans as shark attacks',
  },
  {
    id: 'p2',
    news: 'tornado',
    options: [
      { id: 'tornado', label: 'Tornadoes', deaths: 70, short: '~70' },
      { id: 'asthma', label: 'Asthma', deaths: 3500, short: '3.5k' },
    ],
    fact: 'asthma kills about 50 times as many as tornadoes',
  },
  {
    id: 'p3',
    news: 'fire',
    options: [
      { id: 'fire', label: 'Fires', deaths: 3800, short: '3.8k' },
      { id: 'falls', label: 'Accidental falls', deaths: 46000, short: '46k' },
    ],
    fact: 'accidental falls kill about 12 times as many as fires',
  },
  {
    id: 'p4',
    news: 'car',
    control: true,
    options: [
      { id: 'car', label: 'Car crashes', deaths: 43000, short: '43k' },
      { id: 'stomach', label: 'Stomach cancer', deaths: 11000, short: '11k' },
    ],
  },
  {
    id: 'p5',
    news: 'murder',
    options: [
      { id: 'murder', label: 'Murder', deaths: 25000, short: '25k' },
      { id: 'diabetes', label: 'Diabetes', deaths: 95000, short: '95k' },
    ],
    fact: 'diabetes kills almost 4 times as many as murder',
  },
];

const CRITICAL = PAIRS.filter((p) => !p.control);
const CONTROL = PAIRS.find((p) => p.control)!;

export const moreCommon = (p: RiskPair) => (p.options[0].deaths > p.options[1].deaths ? p.options[0] : p.options[1]);
export const lessCommon = (p: RiskPair) => (moreCommon(p) === p.options[0] ? p.options[1] : p.options[0]);
export const optionById = (p: RiskPair, id: unknown) => p.options.find((o) => o.id === id);

export const score = (answers: Answers) => PAIRS.filter((p) => answers[p.id] === moreCommon(p).id).length;

/** Critical pairs where the user picked the newsworthy (rarer) cause. */
export const newsPicks = (answers: Answers) => CRITICAL.filter((p) => answers[p.id] === p.news);

/** Two or more newsworthy picks out of four counts as showing the effect. */
export const wasPulled = (answers: Answers) => newsPicks(answers).length >= 2;

export function whatHappened(_condition: string | null, answers: Answers): string {
  const picked = newsPicks(answers);
  const k = picked.length;
  const total = CRITICAL.length;
  const ctrlLine =
    answers[CONTROL.id] === moreCommon(CONTROL).id
      ? " You also picked car crashes over stomach cancer, which was right: there the dramatic cause really is more common. So you weren't simply choosing the scarier option."
      : " On car crashes against stomach cancer, the dramatic cause really is more common, so the quiet option isn't always the answer.";

  if (k >= 2) {
    return (
      `In ${k} of the ${total} pairs where one cause makes the news far more often, you picked the one that makes the news. ` +
      `Each time, the quieter cause kills more people. For example, ${picked[0]!.fact}.` +
      ctrlLine
    );
  }
  const intro =
    k === 0
      ? `In all ${total} pairs where one cause makes the news far more often, you picked the quieter cause, which was the right answer each time.`
      : `In ${total - k} of the ${total} pairs where one cause makes the news far more often, you picked the quieter cause, which was the right answer.`;
  return (
    `${intro} You resisted the pull this time. Most people don't: in studies of pairs like these, ` +
    'people overestimate dramatic causes of death and underestimate common, quiet ones.' +
    ctrlLine
  );
}

import type { BiasModule } from './types';

// The launch modules from the spec's "Launch bias catalogue", plus the v1.5 additions.
// Teaser text only: bias names live in content/debriefs/ (P3-1).
// All ten are built; the rest show as "Coming soon" until their
// experiment and debrief are added (see README "Adding a bias").

const NEUTRAL_INTRO = 'Answer quickly and go with your gut.';

export const MODULES: BiasModule[] = [
  {
    id: 'exp-01',
    teaserTitle: 'Guess the number',
    teaserHook: 'How good are your estimates?',
    category: 'judgement',
    estMinutes: 3,
    experimentType: 'estimate',
    conditions: ['low', 'high'],
    introText: "You'll spin a wheel, then answer two quick questions. " + NEUTRAL_INTRO,
    beginnerRank: 1,
    relatedBiasIds: ['exp-04'],
    status: 'ready',
  },
  {
    id: 'exp-02',
    teaserTitle: 'Which is more common?',
    teaserHook: 'Pick the bigger risk.',
    category: 'judgement',
    estMinutes: 2,
    experimentType: 'choice',
    conditions: [],
    introText:
      "You'll see five pairs of causes of death. For each pair, pick the one that kills more people in the United States each year. " +
      NEUTRAL_INTRO,
    beginnerRank: 3,
    relatedBiasIds: ['exp-03'],
    status: 'ready',
  },
  {
    id: 'exp-03',
    teaserTitle: 'Ninety percent sure',
    teaserHook: 'How well do you know what you know?',
    category: 'judgement',
    estMinutes: 4,
    experimentType: 'estimate',
    conditions: [],
    introText:
      "You'll answer ten general-knowledge questions. For each one, give a low and a high number so that you're 90% sure the true answer is between them. Don't look anything up.",
    beginnerRank: 6,
    relatedBiasIds: ['exp-02'],
    status: 'ready',
  },
  {
    id: 'exp-04',
    teaserTitle: 'The outbreak',
    teaserHook: 'Choose a response plan.',
    category: 'choices',
    estMinutes: 2,
    experimentType: 'choice',
    conditions: ['gain', 'loss'],
    introText:
      "You'll read a short scenario and choose between two plans. There's no right answer. " + NEUTRAL_INTRO,
    beginnerRank: 2,
    relatedBiasIds: ['exp-05'],
    status: 'ready',
  },
  {
    id: 'exp-05',
    teaserTitle: 'Pick a plan',
    teaserHook: 'Which subscription would you buy?',
    category: 'choices',
    estMinutes: 2,
    experimentType: 'choice',
    conditions: ['premium', 'budget'],
    introText: "You'll see three phone plans and choose one. There's no right answer. " + NEUTRAL_INTRO,
    beginnerRank: 4,
    relatedBiasIds: ['exp-04'],
    status: 'ready',
  },
  {
    id: 'exp-06',
    teaserTitle: 'The weekend away',
    teaserHook: 'Stay or go?',
    category: 'choices',
    estMinutes: 2,
    experimentType: 'choice',
    conditions: [],
    introText: "You'll read a short situation and make one choice. There's no right answer. " + NEUTRAL_INTRO,
    beginnerRank: 5,
    relatedBiasIds: ['exp-10'],
    status: 'ready',
  },
  {
    id: 'exp-07',
    teaserTitle: 'Crack the rule',
    teaserHook: 'Can you find the hidden pattern?',
    category: 'memory',
    estMinutes: 4,
    experimentType: 'sort',
    conditions: [],
    introText:
      "We have a rule for sets of three numbers. 2, 4, 6 follows it. Test your own sets of three numbers, and we'll tell you whether each one follows the rule. When you think you know the rule, pick it from a list. Take your time.",
    beginnerRank: 7,
    relatedBiasIds: ['exp-08'],
    status: 'ready',
  },
  {
    id: 'exp-08',
    teaserTitle: 'Eyewitness',
    teaserHook: 'How good is your memory?',
    category: 'memory',
    estMinutes: 3,
    experimentType: 'recall',
    conditions: ['smashed', 'hit'],
    introText:
      "You'll watch a short clip of a traffic accident, seen from above. You can watch it once. Then you'll answer four questions about what you saw. " +
      NEUTRAL_INTRO,
    beginnerRank: 8,
    relatedBiasIds: ['exp-07'],
    status: 'ready',
  },
  {
    id: 'exp-09',
    teaserTitle: 'Line up',
    teaserHook: 'A simple test of your eyes.',
    category: 'social',
    estMinutes: 3,
    experimentType: 'timed-response',
    conditions: [],
    introText:
      "In each of 10 rounds you'll see a line on the left and three lines on the right. Pick the one that's the same length. You'll see how the previous five players answered before you choose. " +
      NEUTRAL_INTRO,
    beginnerRank: 9,
    relatedBiasIds: ['exp-04'],
    status: 'ready',
  },
  {
    id: 'exp-10',
    teaserTitle: 'Now or later',
    teaserHook: 'Would you rather wait?',
    category: 'self',
    estMinutes: 2,
    experimentType: 'choice',
    conditions: [],
    introText:
      "Imagine you've won a prize, and you can choose when it's paid. You'll make 10 quick choices between a smaller amount sooner and a larger amount later. There's no right answer. " +
      NEUTRAL_INTRO,
    beginnerRank: 10,
    relatedBiasIds: ['exp-06'],
    status: 'ready',
  },
  {
    id: 'exp-11',
    teaserTitle: 'Next flip',
    teaserHook: 'Call the coin.',
    category: 'judgement',
    estMinutes: 2,
    experimentType: 'choice',
    conditions: [],
    introText:
      "Imagine a friend is tossing a fair coin. In each of six rounds you'll see the tosses so far, then bet on the next one. At the end there's one quick question. " +
      NEUTRAL_INTRO,
    beginnerRank: 11,
    relatedBiasIds: ['exp-12'],
    status: 'ready',
  },
  {
    id: 'exp-12',
    teaserTitle: 'Coin toss bets',
    teaserHook: 'Would you take the bet?',
    category: 'choices',
    estMinutes: 2,
    experimentType: 'choice',
    conditions: [],
    introText:
      "Imagine you're offered six bets with your own money. Each one is a single toss of a fair coin, and you can take it or turn it down. There's no right answer. " +
      NEUTRAL_INTRO,
    beginnerRank: 12,
    relatedBiasIds: ['exp-04'],
    status: 'ready',
  },
  {
    id: 'exp-13',
    teaserTitle: 'Before and after',
    teaserHook: 'Six quick guesses.',
    category: 'memory',
    estMinutes: 4,
    experimentType: 'recall',
    conditions: [],
    introText:
      "You'll answer six general-knowledge questions with your best guess. Then you'll see the real answers and answer a few more questions. Don't look anything up.",
    beginnerRank: 13,
    relatedBiasIds: ['exp-08'],
    status: 'ready',
  },
  {
    id: 'exp-14',
    teaserTitle: 'First day forms',
    teaserHook: 'Start a new job.',
    category: 'self',
    estMinutes: 2,
    experimentType: 'choice',
    conditions: ['out', 'in'],
    introText:
      "Imagine you've just started a new job. You'll fill in a short form for your first day. There's no right answer. " +
      NEUTRAL_INTRO,
    beginnerRank: 14,
    relatedBiasIds: ['exp-10'],
    status: 'ready',
  },
];

export const getModule = (id: string) => MODULES.find((m) => m.id === id);

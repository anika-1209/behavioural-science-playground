// Feature 1: the five primer cards. Each card stays under ~80 words (P1-3) and
// must not name any bias that appears in an experiment (P1-4).

export interface PrimerCard {
  title: string;
  body: string[];
}

export const PRIMER_CARDS: PrimerCard[] = [
  {
    title: 'What is behavioural science?',
    body: [
      'Behavioural science studies how people actually make decisions. It draws on psychology and economics.',
      'Classic economics assumes a perfectly rational person who weighs every option. Real people take shortcuts, get swayed by context, and still mostly get by.',
    ],
  },
  {
    title: 'Two systems of thinking',
    body: [
      'System 1 is fast, automatic and intuitive. It reads a face or finishes "bread and…" without effort.',
      'System 2 is slow, effortful and deliberate. It does long division and checks the small print. It is also lazy, and often lets System 1 answer.',
    ],
  },
  {
    title: 'Heuristics',
    body: [
      'Heuristics are mental shortcuts. They let you decide quickly without working everything out from scratch.',
      'Most of the time they work well. Without them, choosing breakfast would take an hour.',
    ],
  },
  {
    title: 'Biases',
    body: [
      'A bias is a systematic, predictable error that happens when a shortcut misfires.',
      'Everyone has them. Being clever or well informed does not protect you, and knowing about a bias only helps a little.',
    ],
  },
  {
    title: 'How the playground works',
    body: [
      "You'll try an experiment first. Answer honestly and quickly, and go with your gut.",
      "We'll explain what happened afterwards. Your answers stay in this browser and are never sent anywhere.",
    ],
  },
];

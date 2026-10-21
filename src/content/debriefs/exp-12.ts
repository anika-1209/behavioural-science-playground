import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
// The size of the effect for small stakes is debated; the debrief says so.
const debrief: Debrief = {
  biasName: 'Loss aversion',
  definition: 'Feeling a loss more strongly than a gain of the same size.',
  whyItHappens: [
    'The pain of losing £10 tends to outweigh the pleasure of winning £10, or even £15. So a bet that would leave you better off on average can still feel like a bad idea, and people turn it down.',
    'Gains and losses are judged from where you stand now, not against everything you own. £10 is small next to your savings, but measured from "now" it registers as a loss, and losses are felt more.',
    'How big the effect is remains debated. For small amounts like these, some researchers find people weigh losses barely more than gains, and argue that turning down small bets can reflect caution or plain dislike of gambling (Gal & Rucker, 2018). Others find clear loss aversion, especially as the stakes grow. Most agree it is real in many situations, but smaller and less universal than once claimed.',
  ],
  classicStudy: {
    authors: 'Tversky, A. & Kahneman, D.',
    year: 1992,
    title: 'Advances in prospect theory: Cumulative representation of uncertainty. Journal of Risk and Uncertainty, 5(4), 297–323.',
    summary:
      'Participants put a value on a series of gambles, some mixing possible gains and possible losses. From their answers, Tversky and Kahneman estimated that a loss weighed about 2.25 times as much as a gain of the same size. For a 50/50 bet, that means wanting a win of over £20 before risking £10. That figure came from a model fitted to hypothetical choices, and later studies have often found smaller values, especially for small stakes.',
    citationUrl: 'https://doi.org/10.1007/BF00122574',
  },
  realWorldExamples: [
    { label: 'Investing', text: 'Investors tend to sell shares that have gone up and hold on to ones that have fallen, to avoid locking in a loss.' },
    { label: 'Housing', text: 'After prices fall, homeowners often ask more than the market will pay, rather than sell for less than they paid.' },
    { label: 'Free trials', text: 'Once you have something, cancelling it feels like losing it, so many people keep subscriptions they signed up for "just to try".' },
  ],
  counterStrategies: [
    "If you'd face a choice like this many times, judge it by what happens on average, not by how losing once would feel.",
    "Put the amount in context: would you notice £10 in a month's spending? If not, let the average decide.",
    'For designers: "Don\'t lose your discount" messages use this pull. Use them only for things people actually value, and make leaving as easy as joining.',
  ],
  quiz: {
    question:
      'An investor owns two shares: one is up 20% and one is down 20%. They need cash, so they sell the one that\'s up and keep the other "until it recovers". What\'s going on?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'Selling the fallen share would make the loss real, and losses hurt more than equal gains feel good.',
        feedback: "Right. Holding on keeps the loss on paper. That's loss aversion at work.",
      },
      {
        id: 'b',
        text: "They're doing what other investors around them are doing.",
        feedback: 'Not quite. Copying others is social proof. Here the investor is avoiding the feeling of locking in a loss.',
      },
      {
        id: 'c',
        text: "They think the fallen share is due to go up because it's been going down.",
        feedback:
          'Close, but expecting a run to reverse is the gambler\'s fallacy. Here the main pull is avoiding the feeling of locking in a loss.',
      },
    ],
  },
};

export default debrief;

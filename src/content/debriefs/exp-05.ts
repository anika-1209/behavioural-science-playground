import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
// Project rule: no studies or figures from Dan Ariely's work.
const debrief: Debrief = {
  biasName: 'Decoy effect',
  definition: 'Liking an option more because a clearly worse version of it sits next to it.',
  whyItHappens: [
    "It's hard to say what a phone plan is worth on its own. It's easy to compare two plans when one beats the other on everything. The third plan was beaten in every way by one of the two main plans, so that plan got an easy win and started to look like the smart choice.",
    "The third plan isn't there to be chosen. Its job is to make one plan look good next to it. The effect is real but smaller than often claimed: it works best when options are compared on clear numbers, like price and data here, and often disappears when choices are shown as pictures (Frederick, Lee & Baskin, 2014).",
  ],
  classicStudy: {
    authors: 'Huber, J., Payne, J. W. & Puto, C.',
    year: 1982,
    title:
      'Adding asymmetrically dominated alternatives: Violations of regularity and the similarity hypothesis. Journal of Consumer Research, 9(1), 90–98.',
    summary:
      'People chose between pairs of products such as cars and restaurants. Adding a third option that was worse than one of the pair in every way, but not worse than the other, raised the share choosing the option it was worse than. Adding an option should never make an existing one more popular, yet it did.',
    citationUrl: 'https://doi.org/10.1086/208899',
  },
  realWorldExamples: [
    { label: 'Cinemas', text: 'Small popcorn £3, medium £6.50, large £7. The medium is there to make the large look like a steal.' },
    { label: 'Phone and broadband', text: 'A plan with less data for nearly the same price as a bigger one nudges buyers to the bigger plan.' },
    { label: 'Hotels', text: 'A room without breakfast for almost the price of a room with it makes the breakfast room look like the deal.' },
  ],
  counterStrategies: [
    "Cross out any option you would never choose, then decide again between what's left. If your choice changes, the decoy was doing the work.",
    'For designers: a decoy steers people without telling them anything useful. Make every plan one a real customer might want.',
  ],
  quiz: {
    question: 'A cinema sells popcorn: small £3, medium £6.50, large £7. Most people buy the large. Why?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'Next to the medium, the large looks like a bargain.',
        feedback: "Right. Few people want the medium, but it makes 50p for a large feel like a steal. That's the decoy effect.",
      },
      {
        id: 'b',
        text: 'People remember enjoying a large popcorn last time.',
        feedback: "Not quite. That's about memory. The decoy effect is about the medium making the large look like a bargain.",
      },
      {
        id: 'c',
        text: 'People keep buying the large because they always have.',
        feedback: "Not quite. That's habit. The decoy effect is about the medium making the large look like a bargain.",
      },
    ],
  },
};

export default debrief;

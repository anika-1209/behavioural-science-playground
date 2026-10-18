import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Anchoring',
  definition:
    'The tendency to lean too heavily on the first number you see, even an irrelevant one, when you make an estimate.',
  whyItHappens: [
    "When you don't know an answer, you start from whatever number is at hand and adjust away from it. The adjustment usually stops too early, so the estimate stays close to where it started.",
    'Seeing a number also brings to mind reasons it might be right. Answers near it start to feel more plausible, even when you know the number came from a wheel.',
  ],
  classicStudy: {
    authors: 'Tversky, A. & Kahneman, D.',
    year: 1974,
    title: 'Judgment under uncertainty: Heuristics and biases. Science, 185(4157), 1124–1131.',
    summary:
      'Participants watched a wheel numbered 0 to 100 that was set to stop at 10 or 65, then estimated the percentage of African countries in the United Nations. The median guess was 25% after seeing 10 and 45% after seeing 65.',
    citationUrl: 'https://doi.org/10.1126/science.185.4157.1124',
  },
  realWorldExamples: [
    { label: 'Shopping', text: 'A "Was £200, now £120" tag makes £120 feel cheap, whatever the jacket is worth.' },
    { label: 'Work', text: 'In a salary negotiation, the first figure on the table shapes where the final number lands.' },
    { label: 'Checkout screens', text: 'Suggested tip buttons of 15%, 20% and 25% set the range most people pick from.' },
  ],
  counterStrategies: [
    "Write down your own estimate before you look at anyone else's number.",
    "Ask what you'd answer if the starting number had been very different, then argue for that answer.",
    'For designers: reference prices and default options work as anchors. Choose them on purpose, and keep them honest.',
  ],
  quiz: {
    question: 'A shop lists a jacket as "Was £200, now £120." Which reaction is anchoring?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: '£120 feels like a bargain because you judge it against £200.',
        feedback: 'Right. The crossed-out £200 is the first number you see, and it sets the scale for judging £120.',
      },
      {
        id: 'b',
        text: 'You buy it because lots of other people are buying it.',
        feedback: 'Not quite. Copying what others do is social proof. Anchoring is about the first number setting your scale: here, the £200.',
      },
      {
        id: 'c',
        text: 'You keep wearing it because you already paid for it.',
        feedback: 'Not quite. Sticking with something because you paid for it is the sunk cost fallacy. Anchoring is about the £200 setting your scale for £120.',
      },
    ],
  },
};

export default debrief;

import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Default effect',
  definition: 'Tending to stick with whatever option is already selected for you.',
  whyItHappens: [
    'Changing a pre-selected option takes effort: reading, deciding, clicking. Leaving it takes none. When a choice is hard, like how much to put into a pension, that small effort is often enough to keep people where they started.',
    'A pre-selected option can also look like advice. People assume whoever set up the form chose it for a reason, so it feels like the normal or recommended choice. And moving away from it can feel like giving something up.',
  ],
  classicStudy: {
    authors: 'Madrian, B. C. & Shea, D. F.',
    year: 2001,
    title:
      'The power of suggestion: Inertia in 401(k) participation and savings behavior. Quarterly Journal of Economics, 116(4), 1149–1187.',
    summary:
      'A large US company changed its pension plan so new staff were signed up automatically, saving 3% of their pay, unless they chose to leave. The share of new staff saving rose from about 37% to 86%. Most of those signed up automatically stayed at 3%, a rate few had picked when they had to sign up themselves.',
    citationUrl: 'https://doi.org/10.1162/003355301753265543',
  },
  realWorldExamples: [
    {
      label: 'Organ donation',
      text: 'Countries where everyone is a donor unless they opt out have far higher sign-up rates than countries where people must opt in, though the effect on actual donations is smaller.',
    },
    { label: 'Phones', text: 'Most people never change their phone\'s pre-set apps, notifications or privacy settings.' },
    { label: 'Checkouts', text: 'Pre-ticked boxes for extra paid items at checkout are banned in the UK and EU, because so many people left them ticked.' },
  ],
  counterStrategies: [
    'When a form arrives filled in, treat each choice as a question: what would I pick if nothing were selected?',
    'For designers: whatever you pre-select, most people will keep. Choose pre-sets that serve the person filling in the form, and make changing them easy.',
  ],
  quiz: {
    question:
      'A new phone comes with location sharing switched on for every app. A year later, most owners still have it on for all of them. What is the most likely reason?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'They kept what was already selected for them.',
        feedback: "Right. Changing settings takes effort, and the pre-set looks like the normal choice. That's the default effect.",
      },
      {
        id: 'b',
        text: 'They saw their friends sharing their location too.',
        feedback: 'Not quite. Copying others is social proof. Here people simply left the setting as it came.',
      },
      {
        id: 'c',
        text: 'They paid a lot for the phone, so they want to use every feature.',
        feedback: 'Not quite. Using something because you paid for it is the sunk cost fallacy. Here people simply left the setting as it came.',
      },
    ],
  },
};

export default debrief;

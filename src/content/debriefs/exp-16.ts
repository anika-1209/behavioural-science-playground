import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Halo effect',
  definition: "Letting one good or bad quality colour how you judge someone's other, unrelated qualities.",
  whyItHappens: [
    'People form an overall impression of someone quickly, then read everything else about them through it. If Sam seems warm, a plain note can look clear and well put together. If Sam seems cold, the same note can look curt.',
    "It mostly happens without people noticing. In the classic study, people insisted that a lecturer's manner hadn't affected how they rated his other qualities, even though it clearly had.",
  ],
  classicStudy: {
    authors: 'Nisbett, R. E. & Wilson, T. D.',
    year: 1977,
    title: 'The halo effect: Evidence for unconscious alteration of judgments. Journal of Personality and Social Psychology, 35(4), 250–256.',
    summary:
      'Students watched a video interview with a college lecturer who spoke with a European accent. Half saw him answer in a warm, friendly way; half saw him answer coldly. The warm group rated his appearance, mannerisms and accent as appealing; the cold group rated the same features as irritating. Most said his warmth had not affected those ratings.',
    citationUrl: 'https://doi.org/10.1037/0022-3514.35.4.250',
  },
  realWorldExamples: [
    { label: 'Hiring', text: 'Confident or good-looking candidates are often rated as more competent, whatever their actual skills.' },
    { label: 'Advertising', text: "A celebrity's likeability rubs off on the products they promote." },
    { label: 'Marking', text: "Teachers' marks can be swayed by a pupil's neat handwriting or good behaviour, not just the content of the work." },
  ],
  counterStrategies: [
    'Judge one quality at a time, against specific criteria, before you form an overall view.',
    'For hiring and marking: score the work before you know who did it, and have different people judge different qualities.',
    'For designers: a polished look makes a product seem more trustworthy and capable. Make sure what it actually does lives up to that.',
  ],
  quiz: {
    question:
      "A manager rates a friendly, outgoing employee highly for attention to detail, though their reports often contain mistakes. What's going on?",
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: "The employee's likeable personality is colouring the manager's view of their work.",
        feedback: "Right. Friendliness has nothing to do with attention to detail, but the good impression spills over. That's the halo effect.",
      },
      {
        id: 'b',
        text: 'The manager remembers the most recent report best.',
        feedback: "Not quite. Judging by what's easiest to remember is the availability heuristic. Here one good quality is colouring the judgement of another.",
      },
      {
        id: 'c',
        text: 'The first rating the manager gave set the scale for the rest.',
        feedback: 'Not quite. A first number setting the scale is anchoring. Here one good quality is colouring the judgement of another.',
      },
    ],
  },
};

export default debrief;

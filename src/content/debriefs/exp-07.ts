import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Confirmation bias',
  definition: 'Looking for evidence that fits what you already think, instead of evidence that could prove you wrong.',
  whyItHappens: [
    'Once 2, 4, 6 suggests an idea, such as "up by 2", the natural move is to test triples that fit it: 8, 10, 12 or 20, 22, 24. Each "yes" feels like progress. But a "yes" can\'t tell your idea apart from a broader rule that also says yes. Only a test your idea predicts will fail, like 1, 2, 3, can show you\'re wrong.',
    "Testing what you expect to be true isn't always a mistake. It works well when your idea is broader than the truth. It fails when the truth is broader than your idea, as it was here, because then every test you run comes back \"yes\".",
  ],
  classicStudy: {
    authors: 'Wason, P. C.',
    year: 1960,
    title: 'On the failure to eliminate hypotheses in a conceptual task. Quarterly Journal of Experimental Psychology, 12(3), 129–140.',
    summary:
      'Students were told that 2, 4, 6 followed a rule and could test as many triples as they liked before announcing it. Most tested triples that fitted their own idea and announced a rule that was too narrow. Only about one in five found the real rule, "any three numbers in increasing order", at their first attempt.',
    citationUrl: 'https://doi.org/10.1080/17470216008416717',
  },
  realWorldExamples: [
    { label: 'News and social media', text: 'People follow and click on sources that agree with them, so their feed keeps confirming what they already believe.' },
    { label: 'Hiring', text: 'An interviewer with a good first impression asks questions that let the candidate shine, and one with a bad impression asks questions that expose weaknesses.' },
    { label: 'Product research', text: 'Teams ask users "Would you use this feature?" and hear yes, instead of testing whether people actually would.' },
  ],
  counterStrategies: [
    'Before you test an idea, ask: what result would prove me wrong? Then go looking for that result.',
    'For designers and researchers: write down what would count as failure before a study starts, and ask open questions instead of ones that invite a yes.',
  ],
  quiz: {
    question:
      "A manager believes a new team member is careless. They notice every typo in that person's work, but not the typos in anyone else's. What's going on?",
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: "They're noticing evidence that fits what they already believe.",
        feedback: "Right. They look for, and notice, what confirms their belief. That's confirmation bias.",
      },
      {
        id: 'b',
        text: "They've invested too much in hiring the person to change their view.",
        feedback: 'Not quite. Holding on because of past investment is the sunk cost fallacy. Here the manager notices only the evidence that fits their belief.',
      },
      {
        id: 'c',
        text: 'The first typo they saw set the scale for judging everything else.',
        feedback: 'Not quite. A first value setting the scale is anchoring. Here the manager notices only the evidence that fits their belief.',
      },
    ],
  },
};

export default debrief;

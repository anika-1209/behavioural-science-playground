import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Framing effect',
  definition:
    'Making a different choice when the same facts are described differently, for example as gains instead of losses.',
  whyItHappens: [
    '"200 people will be saved" and "400 people will die" describe the same outcome, but they point your attention at different things. One counts the people you rescue; the other counts the people you lose.',
    'People treat gains and losses differently. When the options are described as gains, a sure thing feels good and a gamble feels like risking it, so most people play safe. When the same options are described as losses, a sure loss feels unbearable, so most people take the gamble to avoid it.',
  ],
  classicStudy: {
    authors: 'Tversky, A. & Kahneman, D.',
    year: 1981,
    title: 'The framing of decisions and the psychology of choice. Science, 211(4481), 453–458.',
    summary:
      'Students chose between two programmes to fight a disease expected to kill 600 people. When the programmes were described by lives saved, 72% chose the sure option. When the same programmes were described by deaths, 78% chose the gamble.',
    citationUrl: 'https://doi.org/10.1126/science.7455683',
  },
  realWorldExamples: [
    { label: 'Health', text: 'Patients and doctors are more willing to choose surgery when told "90 out of 100 survive" than when told "10 out of 100 die".' },
    { label: 'Food', text: 'Beef labelled "75% lean" is rated better than the same beef labelled "25% fat".' },
    { label: 'Pricing', text: 'Shops call the gap between card and cash prices a "cash discount" rather than a "card surcharge", because a missed discount hurts less than an added fee.' },
  ],
  counterStrategies: [
    'Before an important decision, restate the options the other way round: lives lost instead of saved, fail rate instead of success rate. If your choice changes, the wording was doing the work.',
    'For designers: for high-stakes choices such as medical consent, show both frames side by side, or use neutral counts ("90 survive, 10 die").',
  ],
  quiz: {
    question:
      'One patient hears "90 out of 100 people survive this operation". Another hears "10 out of 100 people die from it". The first patient is more likely to agree to it. Why?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'The same odds feel safer when described as survival than as death.',
        feedback: "Right. The facts are identical; only the frame changed. That's the framing effect.",
      },
      {
        id: 'b',
        text: 'The first number they hear sets the scale for their judgement.',
        feedback: 'Not quite. A first number setting the scale is anchoring. Here both patients get the same odds, described in a different way.',
      },
      {
        id: 'c',
        text: 'They can easily recall stories of operations that went wrong.',
        feedback: 'Not quite. Judging by easily recalled stories is the availability heuristic. Here both patients get the same odds, described in a different way.',
      },
    ],
  },
};

export default debrief;

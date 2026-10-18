import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
// The cause-of-death pairs follow Lichtenstein et al. (1978); the classic study
// is the one listed in the spec's launch catalogue.
const debrief: Debrief = {
  biasName: 'Availability heuristic',
  definition: 'Judging how common or likely something is by how easily examples come to mind.',
  whyItHappens: [
    "Nobody keeps a running count of how people die. So when you're asked which cause is more common, you check how quickly examples come to mind. Most of the time that's a good shortcut, because things that happen often are usually easier to remember.",
    'The shortcut breaks when something is memorable for reasons other than how often it happens. Shark attacks, tornadoes and murders are sudden, frightening and covered by the news. Asthma, falls and diabetes kill quietly, one person at a time. The dramatic causes come to mind faster, so they feel more common than they are.',
  ],
  classicStudy: {
    authors: 'Tversky, A. & Kahneman, D.',
    year: 1973,
    title: 'Availability: A heuristic for judging frequency and probability. Cognitive Psychology, 5(2), 207–232.',
    summary:
      'People were asked whether letters such as K and R appear more often as the first letter of English words or as the third. Most said first, although these letters appear more often in third place. Words that start with a letter are much easier to call to mind, so they seemed more common.',
    citationUrl: 'https://doi.org/10.1016/0010-0285(73)90033-9',
  },
  realWorldExamples: [
    { label: 'Travel', text: 'After a plane crash is in the news, some people drive instead of flying, even though driving is far riskier per mile.' },
    { label: 'Insurance', text: 'People are more likely to buy flood insurance just after a flood near them, and many let it lapse once the memory fades.' },
    { label: 'Work', text: 'Performance reviews lean on the few events a manager remembers best, which are often the most recent or the most dramatic.' },
  ],
  counterStrategies: [
    "When you judge a risk, ask whether examples come to mind because the thing is common or because it's memorable. Then look up the actual numbers.",
    'For designers: one vivid story outweighs a page of statistics. Use real stories with care, and put them next to the numbers so people can judge the scale.',
  ],
  quiz: {
    question:
      'After a week of news stories about a plane crash, a friend decides to drive 800 km to a wedding instead of flying. Which explanation fits the availability heuristic?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'The crash is easy to picture, so flying feels riskier than it is.',
        feedback: 'Right. The crash comes to mind easily, so it feels likely. Driving 800 km is the more dangerous choice.',
      },
      {
        id: 'b',
        text: 'Everyone else they know is driving, so they do too.',
        feedback: 'Not quite. Copying what others do is social proof. The availability heuristic is about how easily the crash comes to mind.',
      },
      {
        id: 'c',
        text: 'The first price they saw for flights set the scale for what felt expensive.',
        feedback: 'Not quite. A first price setting the scale is anchoring. The availability heuristic is about how easily the crash comes to mind.',
      },
    ],
  },
};

export default debrief;

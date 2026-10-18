import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
// Asch's 1956 monograph is cited because it has a DOI; the spec lists his 1951 report.
const debrief: Debrief = {
  biasName: 'Conformity',
  definition: 'Changing what you say or do to match a group, even when you think the group is wrong.',
  whyItHappens: [
    "There are two pulls. The first is information: if everyone else sees it differently, maybe they know something you don't. The second is belonging: disagreeing with everyone feels awkward, even with strangers you'll never meet.",
    "Following the crowd is often sensible. When you're unsure, other people's choices are useful evidence. The problem comes when the group's view overrides what you can plainly see for yourself.",
  ],
  classicStudy: {
    authors: 'Asch, S. E.',
    year: 1956,
    title:
      'Studies of independence and conformity: I. A minority of one against a unanimous majority. Psychological Monographs: General and Applied, 70(9), 1–70.',
    summary:
      'Students sat in a group and said aloud which of three lines matched a reference line. Everyone else in the room was working for the experimenter and, on some rounds, all gave the same wrong answer. People went along with the wrong answer on about a third of those rounds, and about three in four went along at least once. Alone, people almost never made a mistake. Asch first reported this work in 1951.',
    citationUrl: 'https://doi.org/10.1037/h0093718',
  },
  realWorldExamples: [
    { label: 'Meetings', text: 'Once the first few people back an idea, others who had doubts tend to agree or stay quiet.' },
    { label: 'Ratings and reviews', text: 'A product or post that starts with a few good ratings tends to attract more, partly because people follow the early ratings.' },
    { label: 'Energy and hotels', text: 'Messages such as "Most guests in this room reuse their towels" make people more likely to do the same.' },
  ],
  counterStrategies: [
    'Decide what you think before you hear what others think, and write it down if it matters.',
    'In meetings, collect everyone\'s view privately before discussion, for example with a silent vote.',
    'For designers: "what other people did" messages are powerful. Only use ones that are true, and never invent crowds.',
  ],
  quiz: {
    question:
      "In a meeting, everyone who speaks before you prefers design A. You preferred design B, but when it's your turn you say A. What's going on?",
    answerId: 'a',
    options: [
      { id: 'a', text: 'You changed your answer to match the group.', feedback: "Right. You set aside your own view to match everyone else. That's conformity." },
      {
        id: 'b',
        text: 'You looked only for evidence that design A was better.',
        feedback: "Not quite. That's confirmation bias. Here, you changed your answer because of what the group said.",
      },
      {
        id: 'c',
        text: 'You stuck with A because the team had already spent time on it.',
        feedback: "Not quite. That's the sunk cost fallacy. Here, you changed your answer because of what the group said.",
      },
    ],
  },
};

export default debrief;

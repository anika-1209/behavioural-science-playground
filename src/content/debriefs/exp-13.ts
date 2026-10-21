import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Hindsight bias',
  definition: 'Believing, once you know how something turned out, that you knew it all along.',
  whyItHappens: [
    "When you learn an answer, it doesn't sit neatly beside your old guess. It updates what you know, and your memory of what you thought before gets rebuilt using the new information. So your old guess seems closer to the truth than it was.",
    "It also makes outcomes look obvious. Once you know how something turned out, the reasons for it come to mind easily, and the ways it could have gone differently fade. That's why events look predictable afterwards, even when they surprised almost everyone at the time.",
  ],
  classicStudy: {
    authors: 'Fischhoff, B. & Beyth, R.',
    year: 1975,
    title:
      '"I knew it would happen": Remembered probabilities of once-future things. Organizational Behavior and Human Performance, 13(1), 1–16.',
    summary:
      "Before President Nixon's 1972 visits to China and the Soviet Union, students estimated how likely various outcomes were. Weeks or months later, they were asked to recall their estimates. They remembered giving higher chances to things that had happened, and lower chances to things that hadn't, than they really had.",
    citationUrl: 'https://doi.org/10.1016/0030-5073(75)90002-1',
  },
  realWorldExamples: [
    { label: 'Investing', text: 'After a market crash, many people feel the warning signs were obvious, though few acted on them beforehand.' },
    { label: 'Medicine', text: 'Doctors who are told the final diagnosis judge it as easier to spot than doctors given the same case without the answer.' },
    { label: 'Work', text: 'After a project fails, reviewers judge the decisions behind it more harshly than the information at the time justified.' },
  ],
  counterStrategies: [
    'Write down your predictions and your reasons before you find out what happens, then compare afterwards.',
    'When you review a past decision, ask what was knowable at the time, and list the ways it could have turned out differently.',
    'For designers and researchers: in project reviews, rebuild a timeline of what was known when, so decisions are judged by the information people had.',
  ],
  quiz: {
    question:
      'After their team loses the final, a fan says, "I always knew they\'d lose. The signs were there all season." The week before, they bet on the team to win. What\'s going on?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'Knowing the result has changed what they remember thinking before it.',
        feedback: "Right. The bet shows what they really expected. Knowing the outcome rewrote their memory of it. That's hindsight bias.",
      },
      {
        id: 'b',
        text: "They're repeating what other fans are saying after the match.",
        feedback: 'Not quite. Going along with others is social proof. Here the fan genuinely remembers having expected the loss.',
      },
      {
        id: 'c',
        text: 'They judge the whole season by the last match, because it comes to mind most easily.',
        feedback: 'Not quite. Judging by what comes to mind easily is the availability heuristic. Here the fan misremembers what they expected before the match.',
      },
    ],
  },
};

export default debrief;

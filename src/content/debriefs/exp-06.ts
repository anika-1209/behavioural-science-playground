import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Sunk cost fallacy',
  definition:
    "Sticking with something because of what you've already put into it, even when switching would leave you better off.",
  whyItHappens: [
    "Once both trips were booked, the £300 was gone whichever weekend you chose. The only thing still up to you was how you'd spend the weekend. A purely forward-looking choice picks the trip you'd enjoy more.",
    'But skipping the £200 trip feels like wasting £200, and nobody likes to feel wasteful. Walking away also feels like admitting the first booking was a mistake. So the bigger past cost pulls on the choice, even though it can\'t be recovered.',
  ],
  classicStudy: {
    authors: 'Arkes, H. R. & Blumer, C.',
    year: 1985,
    title: 'The psychology of sunk cost. Organizational Behavior and Human Decision Processes, 35(1), 124–140.',
    summary:
      'Students imagined they had paid $100 for a ski trip and $50 for a second one they expected to enjoy more, only to find both fell on the same weekend. More than half chose the $100 trip. In a field study in the same paper, theatre-goers who had paid full price for season tickets went to more plays than those who had been given a discount.',
    citationUrl: 'https://doi.org/10.1016/0749-5978(85)90049-4',
  },
  realWorldExamples: [
    { label: 'Food', text: "Finishing a meal you don't want because you paid for it." },
    { label: 'Work', text: 'Teams keep funding a failing project because of how much has already been spent on it.' },
    { label: 'Subscriptions', text: 'Keeping a gym membership you never use because cancelling would mean admitting the money was wasted.' },
  ],
  counterStrategies: [
    "Ask yourself: if I hadn't spent anything yet, which option would I choose now? Then choose that.",
    "For big commitments, decide in advance when you'd stop: a budget, a deadline or a result you need to see.",
    'For designers: messages like "You\'re 80% of the way there" use past effort to keep people going. Use them to help people finish things they want, not to keep them in things they don\'t.',
  ],
  quiz: {
    question:
      "You're halfway through a dull film at the cinema. You'd rather leave, but you stay because the ticket cost £15. What's going on?",
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'The money is spent either way, but it still feels like a reason to stay.',
        feedback: 'Right. The £15 is gone whether you stay or leave. Staying for its sake is the sunk cost fallacy.',
      },
      {
        id: 'b',
        text: 'The price was described as a loss rather than a gain.',
        feedback: "Not quite. That's the framing effect. Here the point is that the £15 is gone either way, yet it keeps you in your seat.",
      },
      {
        id: 'c',
        text: 'A more expensive film nearby made this one look like good value.',
        feedback: "Not quite. That's the decoy effect. Here the point is that the £15 is gone either way, yet it keeps you in your seat.",
      },
    ],
  },
};

export default debrief;

import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Present bias',
  definition: 'Giving extra weight to what you can have right now, compared with the same trade-off further in the future.',
  whyItHappens: [
    'A week\'s wait means the same thing whether it starts today or a year from now. But money today is real and vivid, while the difference between week 52 and week 53 is abstract. So people demand much more to wait when the earlier option is "now".',
    'Your future self also feels a little like someone else. It\'s easy to promise that future-you will be patient, save more or start the diet. When the future arrives and becomes "now", the same pull wins again.',
  ],
  classicStudy: {
    authors: 'Thaler, R.',
    year: 1981,
    title: 'Some empirical evidence on dynamic inconsistency. Economics Letters, 8(3), 201–207.',
    summary:
      'People said how much money they would need later to be as happy as getting $15 now. The typical answers were $30 in three months, $60 in a year and $100 in three years. Spread over a year, that means people demanded far more for short waits than for long ones: impatience is strongest close to the present.',
    citationUrl: 'https://doi.org/10.1016/0165-1765(81)90067-7',
  },
  realWorldExamples: [
    {
      label: 'Saving',
      text: 'People plan to save "from next month", then spend when next month comes. Schemes that commit future pay rises to savings work because the sacrifice is always in the future.',
    },
    { label: 'Health', text: "Diets and gym habits start on Monday. On Monday, today's comfort wins again." },
    {
      label: 'Buy now, pay later',
      text: 'Splitting a price into future instalments makes it feel cheaper today, because the cost lands on future-you.',
    },
  ],
  counterStrategies: [
    "Decide in advance and lock it in: automatic transfers to savings, a gym class you've paid for, a deadline someone else holds you to.",
    'For designers: defaults and "start later" options can help people do what they intend, such as pensions that enrol people automatically. The same pull can also be used against people, so make costs as visible as the benefits.',
  ],
  quiz: {
    question:
      "In January, you sign up to start saving 5% of your pay from next January. When next January comes, you postpone it again. What's going on?",
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'Saving is easy to choose for the future, but hard when it means less money now.',
        feedback: "Right. The plan was easy while the cost was a year away. Once the cost arrived in the present, it won. That's present bias.",
      },
      {
        id: 'b',
        text: 'You keep your plan because you already signed up for it.',
        feedback: "Not quite. You didn't keep the plan. The problem is that the cost felt bigger once it arrived in the present.",
      },
      {
        id: 'c',
        text: "Most of your friends aren't saving either.",
        feedback: "Not quite. That's conformity. Here the problem is that the cost felt bigger once it arrived in the present.",
      },
    ],
  },
};

export default debrief;

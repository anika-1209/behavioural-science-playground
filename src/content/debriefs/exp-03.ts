import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
// The ~40% figure is the commonly reported result; check it against the chapter.
const debrief: Debrief = {
  biasName: 'Overconfidence',
  definition: 'Being more sure of what you know than your track record justifies.',
  whyItHappens: [
    'When you set a range, you start from your best guess and move out a little in each direction. Like any estimate that starts from a fixed point, the adjustment stops too early, so the range ends up narrower than your real uncertainty.',
    "A narrow range also feels better. It sounds like knowledge, while a wide one sounds like admitting you don't know. And in daily life you rarely find out how often your confident answers were wrong, so the feeling never gets corrected.",
  ],
  classicStudy: {
    authors: 'Alpert, M. & Raiffa, H.',
    year: 1982,
    title:
      'A progress report on the training of probability assessors. In D. Kahneman, P. Slovic & A. Tversky (Eds.), Judgment under uncertainty: Heuristics and biases (pp. 294–305). Cambridge University Press.',
    summary:
      'Business students gave ranges they were 98% sure contained the answers to questions about quantities. The true answer should have fallen outside only 2% of the time. It fell outside about 40% of the time.',
    citationUrl: 'https://doi.org/10.1017/CBO9780511809477',
  },
  realWorldExamples: [
    { label: 'Projects', text: 'A team is "90% sure" a launch will be ready by March. Projects estimated this way miss their dates far more often than one time in ten.' },
    { label: 'Investing', text: 'People who are sure they can pick winners trade more often, and on average frequent traders earn less after costs.' },
    { label: 'Hiring', text: 'Interviewers often feel certain about a candidate after a short conversation, though interview impressions predict job performance only modestly.' },
  ],
  counterStrategies: [
    "Before you settle on a range, imagine being told the answer is outside it. If that wouldn't shock you, widen the range.",
    "Write down your forecasts and check later how often you were right. It's the only way to learn how sure you should be.",
    'For designers: show estimates as ranges, not single numbers, so people see the uncertainty instead of a false precision.',
  ],
  quiz: {
    question:
      "A friend says they're 90% sure their drive to work will take 25 to 35 minutes. Over a month of trips, they arrive within that window about half the time. What does this show?",
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'Their range is too narrow for how uncertain the drive really is.',
        feedback: "Right. A 90% range that holds half the time is far too narrow. That's overconfidence.",
      },
      {
        id: 'b',
        text: 'They remember the most dramatic traffic jams best.',
        feedback: 'Not quite. Judging by what comes to mind easily is the availability heuristic. Here the problem is a range that\'s too narrow.',
      },
      {
        id: 'c',
        text: "They keep the same route because they've used it for years.",
        feedback: "Not quite. Sticking with a habit is about inertia. Here the problem is a 90% range that's right only half the time.",
      },
    ],
  },
};

export default debrief;

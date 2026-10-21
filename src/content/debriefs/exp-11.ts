import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: "Gambler's fallacy",
  definition:
    'Believing a random event is less likely because it has happened a lot recently, or more likely because it hasn\'t.',
  whyItHappens: [
    'People expect even a short run of random events to look like the long-run average: about half heads, half tails. Six heads in a row doesn\'t look random, so tails starts to feel "due" to even things out. But a coin has no memory. Each toss is 50/50, and a streak is never cancelled out by what comes next. Over many tosses it just gets lost among all the others.',
    'The feeling is strong even in people who know the maths. That\'s why many players say heads and tails are equally likely, then bet against the streak anyway. It shows up with real money too: in a study of roulette bets in a casino, the longer one colour had been winning, the more players bet on the other one (Croson & Sundali, 2005).',
  ],
  classicStudy: {
    authors: 'Tversky, A. & Kahneman, D.',
    year: 1971,
    title: 'Belief in the law of small numbers. Psychological Bulletin, 76(2), 105–110.',
    summary:
      'Tversky and Kahneman asked research psychologists about small samples and found that even experts expected a small sample to look like the population it came from. They called this "the law of small numbers", and gave the gambler who expects black after a run of red as an everyday case of the same mistake.',
    citationUrl: 'https://doi.org/10.1037/h0031322',
  },
  realWorldExamples: [
    { label: 'Lotteries', text: 'Some players pick numbers that are "overdue" or avoid last week\'s winners. Every draw is independent of the last.' },
    { label: 'Families', text: 'Parents with three boys may feel a girl is "due", though the chance for each birth is close to 50/50 whatever came before.' },
    { label: 'Work', text: 'Studies of asylum judges and loan officers found they were slightly less likely to approve a case after approving the one before.' },
  ],
  counterStrategies: [
    'Before you act on a streak, ask: does this thing have a memory? Coins, dice, lottery balls and roulette wheels don\'t.',
    'When you make many similar decisions in a row, judge each one on its own facts, not on what you decided last time.',
    'For designers: showing recent random results, like the boards above roulette tables, invites people to bet on streaks. Don\'t present past random outcomes as if they predicted the next one.',
  ],
  quiz: {
    question: 'A roulette wheel has landed on red eight times in a row. A player puts a big bet on black because it\'s "due". What\'s going on?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'They think a run of red makes black more likely, but each spin is independent.',
        feedback: "Right. The wheel doesn't remember the last eight spins. Black is no more likely than before. That's the gambler's fallacy.",
      },
      {
        id: 'b',
        text: 'Everyone else at the table is betting on black, so they do too.',
        feedback: "Not quite. Copying what others do is social proof. Here the player believes black is due because of the run of red.",
      },
      {
        id: 'c',
        text: "They've lost a lot tonight and want to win it back.",
        feedback: 'Not quite. Chasing losses is a different pattern. Here the player believes black is due because of the run of red.',
      },
    ],
  },
};

export default debrief;

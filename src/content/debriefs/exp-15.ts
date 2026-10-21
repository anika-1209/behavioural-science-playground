import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
// The size of the gap depends on how prices are asked for; the debrief says so.
const debrief: Debrief = {
  biasName: 'Endowment effect',
  definition: "Valuing something more just because it's yours.",
  whyItHappens: [
    "Once something is yours, giving it up feels like losing it. So owners tend to ask for more to part with a thing than other people would pay to get it, even when it's the same thing and they've only owned it for a few minutes.",
    'Owning something also changes what you think about. Owners focus on what they would give up; buyers focus on what they would spend. The gap is biggest for things without an obvious market price, like a mug, and much smaller for things bought to sell on, or for money itself.',
    "How big the gap is depends on how the question is asked. Some researchers found it shrank or disappeared when people were carefully taught how selling prices work and given practice first (Plott & Zeiler, 2005). The effect shows up in many studies, but it isn't the same size everywhere.",
  ],
  classicStudy: {
    authors: 'Kahneman, D., Knetsch, J. L. & Thaler, R. H.',
    year: 1990,
    title: 'Experimental tests of the endowment effect and the Coase theorem. Journal of Political Economy, 98(6), 1325–1348.',
    summary:
      'Students were handed coffee mugs from their university bookshop and offered the chance to sell them. Other students, without mugs, said what they would pay. Owners asked a median of about $7.12; buyers offered about $2.87 for the same mug. Far fewer mugs changed hands than economic theory predicted.',
    citationUrl: 'https://doi.org/10.1086/261737',
  },
  realWorldExamples: [
    { label: 'Housing', text: 'Sellers often value their home well above what buyers will pay, and it can sit unsold for months.' },
    { label: 'Clutter', text: "People keep clothes and gadgets they would never buy today, because getting rid of them feels like a loss." },
    { label: 'Try at home', text: 'Glasses, mattresses and furniture you can try at home are harder to send back once they feel like yours.' },
  ],
  counterStrategies: [
    "Ask yourself: if I didn't own this, how much would I pay for it? If that's far below your selling price, ownership is doing the talking.",
    'For designers: free trials and try-at-home offers create a feeling of ownership before anyone pays. Make returns and cancelling as easy as starting.',
  ],
  quiz: {
    question:
      "Jo bought a concert ticket for £40. A week before the show, someone offers Jo £150 for it. Jo would never pay £150 for a ticket, but still won't sell. What's going on?",
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'Owning the ticket has made it worth more to Jo than Jo would pay for it.',
        feedback: "Right. Jo wouldn't buy it at £150, but won't sell it at £150 either. That gap is the endowment effect.",
      },
      {
        id: 'b',
        text: "Jo paid £40 and doesn't want to waste that money.",
        feedback: 'Not quite. Selling for £150 would more than cover the £40, so nothing would be wasted. The pull here is from owning the ticket.',
      },
      {
        id: 'c',
        text: "All of Jo's friends are going to the concert.",
        feedback: "Not quite. Following friends is social proof. The puzzle here is that Jo values the ticket more as its owner than as a buyer.",
      },
    ],
  },
};

export default debrief;

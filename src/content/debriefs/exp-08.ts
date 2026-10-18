import type { Debrief } from '../types';

// Study details are from general knowledge and still need expert review (P3-6).
const debrief: Debrief = {
  biasName: 'Misinformation effect',
  definition: 'When something you hear after an event changes how you remember the event itself.',
  whyItHappens: [
    "Memory isn't a recording. Each time you recall an event, you rebuild it from fragments, and whatever you've learned since gets built in too. A question is one of those things you learn.",
    '"Smashed" suggests a violent crash. When you later try to picture the scene, you fill the gaps with details that fit a violent crash, such as broken glass. Afterwards it\'s hard to tell which details you saw and which ones the question supplied.',
  ],
  classicStudy: {
    authors: 'Loftus, E. F. & Palmer, J. C.',
    year: 1974,
    title:
      'Reconstruction of automobile destruction: An example of the interaction between language and memory. Journal of Verbal Learning and Verbal Behavior, 13(5), 585–589.',
    summary:
      'Students watched films of car crashes and estimated how fast the cars were going. Those asked about cars that "smashed into" each other gave higher speeds than those asked about cars that "hit" each other: about 41 mph against 34 mph. A week later, 32% of the "smashed" group said they had seen broken glass, compared with 14% of the "hit" group. There was no broken glass in the film.',
    citationUrl: 'https://doi.org/10.1016/S0022-5371(74)80011-3',
  },
  realWorldExamples: [
    {
      label: 'Police interviews',
      text: 'Leading questions can change what a witness remembers. Many police forces now train officers to start with open questions such as "Tell me what you saw."',
    },
    { label: 'Talking it over', text: "When witnesses discuss an event, details one person mentions can end up in another person's memory." },
    { label: 'News coverage', text: 'Reports and photos seen after an event can blend with what you saw yourself.' },
  ],
  counterStrategies: [
    'Write down what you remember as soon as you can, before you talk to anyone or read anything about it.',
    'For designers and researchers: word questions neutrally. "What happened?" gets a cleaner answer than "How bad was the crash?"',
  ],
  quiz: {
    question:
      'After a robbery, a witness is asked, "What colour was the gunman\'s jacket?" There was no gun, but the witness later remembers seeing one. What happened?',
    answerId: 'a',
    options: [
      {
        id: 'a',
        text: 'The question slipped a detail into their memory of the event.',
        feedback: 'Right. "The gunman" assumed a gun, and the assumption became part of the memory. That\'s the misinformation effect.',
      },
      {
        id: 'b',
        text: 'They only noticed the facts that fitted what they already believed.',
        feedback: "Not quite. That's confirmation bias. Here, information that came after the event changed the memory itself.",
      },
      {
        id: 'c',
        text: 'They judged how likely a gun was by how easily one came to mind.',
        feedback: "Not quite. That's the availability heuristic. Here, information that came after the event changed the memory itself.",
      },
    ],
  },
};

export default debrief;

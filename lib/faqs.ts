// Every question on the site in one list. General questions sit on the home page; each contest's own
// come from its page content (lib/eventPages). The home FAQ shows them all under topic chips; a
// contest page shows its own questions first, then the general ones.
import { eventPages } from "./eventPages";
import { events, PRIZES_ANNOUNCED, SHOW_PRIZES } from "./fest";

export type Faq = { q: string; a: string; topic: string };

export const GENERAL = "General";

const general: { q: string; a: string }[] = [
  {
    q: "Who can take part?",
    a: "University students from across Bangladesh, and school students in the ICT Olympiad. Some contests are individual (the two online AI competitions and the ICT Olympiad); teams run from two members (Three-Minute Thesis) to four (Soccer Bot and Capture the Flag). IUPC teams of three bring a coach, and esports entries go from solo FIFA and Clash Royale players to Valorant teams of five.",
  },
  {
    q: "When and where is it?",
    a: "The onsite finals are on Friday 5 and Saturday 6 February 2027 on the KUET campus in Khulna, and CSE Night closes the festival on the evening of the 6th. Online rounds run before that, from 20 to 29 January.",
  },
  {
    q: "How do I register?",
    a: "Registration opens on 7 December 2026 and closes on 19 January 2027. Fees are per team or per person: BDT 350 to 500 per person for the individual contests, BDT 1,000 to 2,000 per team for most others and BDT 5,500 for IUPC. The AI Hackathon and Capture the Flag preliminaries are free to enter.",
  },
  {
    q: "How do the online rounds work?",
    a: "From 20 to 29 January, the AI Hackathon, Datathon and Capture the Flag run online preliminaries and the Tech Business Case Competition a written round. The top 40, 30, 40 and 10 teams come to KUET for the finals, announced on 31 January. AI-Driven Solutions for Bangladesh's Needs and Imagine the Future with AI are online only: entries are due on 25 January.",
  },
  {
    q: "Are any competitions online only?",
    a: "Yes, two. AI-Driven Solutions for Bangladesh's Needs (a poster) and Imagine the Future with AI (a written piece) are individual online competitions with entries due on 25 January 2027. Their winners are announced at the closing ceremony on 6 February.",
  },
  ...(SHOW_PRIZES
    ? [{
        q: "What can we win?",
        a: PRIZES_ANNOUNCED
          ? "BDT 8,10,000 in cash prizes across the 13 competitions, from BDT 10,000 for Imagine the Future with AI to BDT 1,70,000 for IUPC."
          : "BDT 8,10,000 in cash prizes across the 13 competitions. Each contest's split is announced with its rulebook.",
      }]
    : []),
  {
    q: "Who organises BitFest?",
    a: "The Department of Computer Science and Engineering at KUET. Each competition is run by a student club or society under faculty supervision: SGIPC runs IUPC; IEEE Computer Society AI-Driven Solutions and the ICT Olympiad; Bit2Byte the AI Hackathon; KMiNDS Three-Minute Thesis and the Datathon; HACK the Project Showcase, Line-Following Robot and Soccer Bot; KCSC Capture the Flag; and the BitFest team Imagine the Future with AI, the Tech Business Case Competition and Esports Gaming. Write to csefest@kuet.ac.bd.",
  },
];

export const generalFaqs: Faq[] = general.map((x) => ({ ...x, topic: GENERAL }));

/** Every question, general first, then each contest in programme order. */
export const allFaqs: Faq[] = [
  ...generalFaqs,
  ...events.flatMap((e) => (eventPages[e.slug]?.faqs ?? []).map((f) => ({ ...f, topic: e.name }))),
];

export const allTopics = [GENERAL, ...events.map((e) => e.name)];

/** A contest page's questions: its own (under its name), then the general ones. */
export const contestFaqs = (name: string, faqs: { q: string; a: string }[]): Faq[] => [
  ...faqs.map((f) => ({ ...f, topic: name })),
  ...generalFaqs,
];

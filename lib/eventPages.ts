// Content for each contest's own page, from the BitFest 4.0 sponsorship proposal (final): formats, dates,
// team sizes, fees, capacities, prize totals and judging. Prize totals are kept but hidden on the site
// (SHOW_PRIZES in lib/fest). Anything in [BRACKETS] is still a placeholder for the organizers.
import { about } from "./content";

export type EventPage = {
  slug: string;
  /** For search results and link previews. */
  description: string;
  lead: string;
  /** The About section's paragraph (the hero carries `lead`). */
  about: string;
  points: { t: string; d: string }[];
  facts: { k: string; v: string }[];
  timeline: { when: string; t: string; d: string }[];
  /** Thousands of BDT. `places` (champion, 1st and 2nd runner-up) once the rulebook gives the split. */
  prizes: { total: number; places?: [number, number, number]; note: string };
  faqs: { q: string; a: string }[];
  registerHref: string;
  rulebookHref: string;
};

export const eventPages: Record<string, EventPage> = {
  "ai-solutions": {
    slug: "ai-solutions",
    description: "AI-Driven Solutions for Bangladesh's Needs at BitFest 4.0: an individual online poster competition. Posters are due on 25 January 2027; winners are announced on 6 February.",
    lead: "Find a real problem in Bangladesh and propose a practical AI solution to it. An individual online poster competition: posters are due on 25 January, and the winners are announced at the closing ceremony on 6 February.",
    about: "Participants identify real-life problems, unmet needs or opportunities for improvement in Bangladesh and propose practical AI-driven solutions. Working prototypes are not required. It runs online as an individual poster presentation, organised by the IEEE Computer Society: posters are due by 25 January 2027, and the winners are announced at the closing ceremony on Saturday, 6 February.",
    points: [
      { t: "Notice", d: "A real problem, unmet need or opportunity in Bangladesh." },
      { t: "Propose", d: "A practical, AI-driven way to solve it." },
      { t: "Present", d: "One poster that makes the case." },
    ],
    facts: [
      { k: "Format", v: "Online, individual" },
      { k: "Posters due", v: "Mon 25 Jan 2027" },
      { k: "Registration", v: "BDT 500 per person" },
      { k: "Entry", v: "Open" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register online as an individual." },
      { when: "19 Jan", t: "Registration closes", d: "The entry list is locked." },
      { when: "25 Jan", t: "Posters due", d: "Submit your poster online." },
      { when: "6 Feb", t: "Winners announced", d: "At the festival's closing ceremony." },
    ],
    prizes: { total: 20, note: "Judged on relevance to Bangladesh, feasibility of the AI approach, expected impact and poster clarity." },
    faqs: [
      { q: "Who can take part?", a: "Anyone eligible for BitFest, as an individual. [ELIGIBILITY]" },
      { q: "Is there a registration fee?", a: "BDT 500 per person. [PAYMENT METHOD]" },
      { q: "Do I need a working prototype?", a: "No. A practical proposal on a poster is enough; prototypes are not required." },
      { q: "How do I submit?", a: "Online, by 25 January 2027. [SUBMISSION LINK AND POSTER FORMAT]" },
      { q: "How is it judged?", a: "On relevance to Bangladesh, feasibility of the AI approach, expected impact and poster clarity." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  "ai-hackathon": {
    slug: "ai-hackathon",
    description: "The AI Hackathon at BitFest 4.0: a free online preliminary, then 40 teams build working AI solutions at KUET on 5 February.",
    lead: "Build a working AI solution in a day. A free online preliminary shortlists 40 teams for the onsite final on Friday, 5 February.",
    about: "Participants develop functional AI-based solutions to specified problems within a limited time, showing creativity, technical skill and practical implementation. Organised by Bit2Byte, the online preliminary runs from 20 to 29 January and is free to enter; 40 teams of three come to KUET for the onsite final on Friday, 5 February, from 10 am to 7 pm, with a prayer break from 1 to 2 pm.",
    points: [
      { t: "Frame", d: "Take on the problem you are given." },
      { t: "Build", d: "A day on campus to make it work." },
      { t: "Demo", d: "Show it working, then pitch it to the judges." },
    ],
    facts: [
      { k: "Final", v: "Fri 5 Feb 2027" },
      { k: "Team size", v: "3 members" },
      { k: "Registration", v: "Free prelim · BDT 2,500 onsite" },
      { k: "Onsite teams", v: "40" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register a team of three online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked." },
      { when: "20–29 Jan", t: "Online preliminary", d: "Free to enter." },
      { when: "31 Jan", t: "Finalists announced", d: "40 teams are invited to KUET; BDT 2,500 per selected team." },
      { when: "5 Feb", t: "Onsite final", d: "10 am to 7 pm, with a prayer break from 1 to 2 pm." },
    ],
    prizes: { total: 100, note: "Judged on problem fit, technical depth, a working demo and the pitch." },
    faqs: [
      { q: "Who can take part?", a: "University students from across Bangladesh, in teams of three." },
      { q: "Is there a registration fee?", a: "The online preliminary is free. Teams selected for the final pay BDT 2,500. [PAYMENT METHOD]" },
      { q: "What happens in the preliminary?", a: "[PRELIMINARY FORMAT]" },
      { q: "How long is the final?", a: "From 10 am to 7 pm on Friday, 5 February, with a prayer break from 1 to 2 pm." },
      { q: "How is it judged?", a: "On problem fit, technical depth, a working demo and the pitch." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  "imagine-ai": {
    slug: "imagine-ai",
    description: "Imagine the Future with AI at BitFest 4.0: an individual online writing competition. Entries are due on 25 January 2027; winners are announced on 6 February.",
    lead: "Imagine what AI could do beyond today and write it down. An individual online writing competition: entries are due on 25 January, and the winners are announced at the closing ceremony on 6 February.",
    about: "Participants envision futuristic AI applications and present creative ideas on how artificial intelligence could transform human life, society and the world beyond today's technological capabilities. It runs online as an individual writing competition, organised by the BitFest team: entries are due by 25 January 2027, and the winners are announced at the closing ceremony on Saturday, 6 February.",
    points: [
      { t: "Imagine", d: "An AI future beyond what exists today." },
      { t: "Reason", d: "How it could change life, society and the world." },
      { t: "Write", d: "Make the idea clear and convincing." },
    ],
    facts: [
      { k: "Format", v: "Online, individual" },
      { k: "Entries due", v: "Mon 25 Jan 2027" },
      { k: "Registration", v: "BDT 500 per person" },
      { k: "Entry", v: "Open" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register online as an individual." },
      { when: "19 Jan", t: "Registration closes", d: "The entry list is locked." },
      { when: "25 Jan", t: "Entries due", d: "Submit your writing online." },
      { when: "6 Feb", t: "Winners announced", d: "At the festival's closing ceremony." },
    ],
    prizes: { total: 10, note: "Judged on originality, depth of insight, plausibility and quality of writing." },
    faqs: [
      { q: "Who can take part?", a: "Anyone eligible for BitFest, as an individual. [ELIGIBILITY]" },
      { q: "Is there a registration fee?", a: "BDT 500 per person. [PAYMENT METHOD]" },
      { q: "How long should the entry be?", a: "[WORD LIMIT AND FORMAT]" },
      { q: "How do I submit?", a: "Online, by 25 January 2027. [SUBMISSION LINK]" },
      { q: "How is it judged?", a: "On originality, depth of insight, plausibility and quality of writing." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  "project-showcase": {
    slug: "project-showcase",
    description: "Project Showcase at BitFest 4.0: teams of up to three exhibit working projects and prototypes to judges and visitors at KUET on 5 February.",
    lead: "An exhibition of working projects and prototypes. Teams of up to three demo to judges and visitors on Friday, 5 February.",
    about: "Participants exhibit innovative projects, prototypes and technological solutions, showing creativity, originality, practical applications and potential impact on society. Run by HACK, teams of up to three demo to judges and visitors on Friday, 5 February, from 10 am to 5 pm.",
    points: [
      { t: "Build", d: "Bring a project or prototype that works." },
      { t: "Exhibit", d: "Demo it at your stall to judges and visitors." },
      { t: "Explain", d: "Show why it matters and how it holds up." },
    ],
    facts: [
      { k: "Exhibition", v: "Fri 5 Feb 2027" },
      { k: "Team size", v: "Up to 3 members" },
      { k: "Registration", v: "BDT 1,500 per team" },
      { k: "Onsite teams", v: "35" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register your team and project online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked." },
      { when: "5 Feb", t: "Exhibition opens", d: "Stalls open to judges and visitors at 10 am." },
      { when: "5 Feb", t: "Judging ends", d: "Scores are in by 5 pm." },
      { when: "6 Feb", t: "Prize ceremony", d: "At the festival's closing, before CSE Night." },
    ],
    prizes: { total: 50, note: "Judged on innovation, technical complexity, practicality and presentation." },
    faqs: [
      { q: "Who can take part?", a: "University students from across Bangladesh, in teams of up to three." },
      { q: "Is there a registration fee?", a: "BDT 1,500 per team. [PAYMENT METHOD]" },
      { q: "Software or hardware?", a: "Either: any working project, prototype or technological solution." },
      { q: "What does a stall come with?", a: "A display board and power. [STALL SIZE]" },
      { q: "How is it judged?", a: "On innovation, technical complexity, practicality and presentation." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  iupc: {
    slug: "iupc",
    description: "The Inter-University Programming Contest at BitFest 4.0: 140 teams of three with a coach, ICPC rules, a five-hour main contest at KUET on 6 February.",
    lead: "The flagship of BitFest. University teams solve algorithmic problems on an ICPC-style judge: a mock contest on Friday, then the five-hour main contest on Saturday, 6 February.",
    about: "University teams of three, each with a coach, compete to solve algorithmic and computational problems within a set time, showing programming skill, problem-solving and teamwork. Run by SGIPC on an ICPC-style judge, it opens with a mock contest at 3 pm on Friday, 5 February; the five-hour main contest runs on Saturday, 6 February. Teams rank by problems solved, then by total penalty time.",
    points: [
      { t: "Read", d: "Work through the problem set as a team of three." },
      { t: "Code", d: "Five hours to turn ideas into accepted solutions." },
      { t: "Submit", d: "Solved problems, then penalty time, set the ranking." },
    ],
    facts: [
      { k: "Main contest", v: "Sat 6 Feb 2027" },
      { k: "Team size", v: "3 + coach" },
      { k: "Registration", v: "BDT 5,500 per team" },
      { k: "Onsite teams", v: "140" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register a team of three and its coach online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked." },
      { when: "5 Feb", t: "Mock contest", d: "3 pm on the KUET campus: try the judge and the machines." },
      { when: "6 Feb", t: "Main contest", d: "Five hours on an ICPC-style judge." },
      { when: "6 Feb", t: "Prize ceremony", d: "At the festival's closing, before CSE Night." },
    ],
    prizes: { total: 170, note: "Ranked on problems solved, then total penalty time, under ICPC rules." },
    faqs: [
      { q: "Who can take part?", a: "Teams of three university students from across Bangladesh, each with a coach." },
      { q: "Is there a registration fee?", a: "BDT 5,500 per team. [PAYMENT METHOD]" },
      { q: "When is the contest?", a: "A mock contest at 3 pm on Friday, 5 February, then the five-hour main contest on Saturday, 6 February." },
      { q: "How are teams ranked?", a: "By problems solved, then by total penalty time, under ICPC rules." },
      { q: "Which languages can we use?", a: "[ALLOWED LANGUAGES AND JUDGE DETAILS]" },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  "ict-olympiad": {
    slug: "ict-olympiad",
    description: "The ICT Olympiad at BitFest 4.0: school students compete individually on ICT, computing fundamentals and logical problem-solving at KUET on 5 February.",
    lead: "For school students. Compete on information and communication technology, computing fundamentals and logical problem-solving: two hours on Friday, 5 February.",
    about: "School students compete individually on information and communication technology, computing fundamentals and logical problem-solving. Organised by the IEEE Computer Society, it is held onsite at KUET on Friday, 5 February, from 10 am to 12 pm, for up to 100 students. Ranking is by score on the olympiad paper, with ties broken by completion time.",
    points: [
      { t: "Think", d: "Logical problems that reward clear reasoning." },
      { t: "Compute", d: "Questions on computing fundamentals." },
      { t: "Connect", d: "Information and communication technology in practice." },
    ],
    facts: [
      { k: "Olympiad", v: "Fri 5 Feb 2027, 10 am – 12 pm" },
      { k: "For", v: "School students, individual" },
      { k: "Registration", v: "BDT 350 per person" },
      { k: "Places", v: "100 students" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register online as an individual." },
      { when: "19 Jan", t: "Registration closes", d: "The list of students is locked." },
      { when: "5 Feb", t: "Olympiad", d: "Two hours on the KUET campus, 10 am to 12 pm." },
      { when: "6 Feb", t: "Prize ceremony", d: "At the festival's closing, before CSE Night." },
    ],
    prizes: { total: 15, note: "Ranked on the score on the olympiad paper; ties broken by completion time." },
    faqs: [
      { q: "Who can take part?", a: "School students, individually. [CLASSES ELIGIBLE]" },
      { q: "Is there a registration fee?", a: "BDT 350 per person. [PAYMENT METHOD]" },
      { q: "When and where is it?", a: "On Friday, 5 February 2027, from 10 am to 12 pm on the KUET campus." },
      { q: "What does it cover?", a: "Information and communication technology, computing fundamentals and logical problem-solving. [SYLLABUS]" },
      { q: "How is it ranked?", a: "By score on the olympiad paper; ties are broken by completion time." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  "3mt": {
    slug: "3mt",
    description: "Three-Minute Thesis at BitFest 4.0: teams of two present their research in three minutes to a non-specialist audience at KUET on 6 February.",
    lead: "Your research in three minutes. Teams of two explain their work and why it matters to a non-specialist audience on Saturday, 6 February.",
    about: "Participants present their research in just three minutes, communicating complex ideas, contributions and potential impact clearly to a non-specialist audience. Run by KMiNDS, teams of two present on Saturday, 6 February, from 10 am to 3 pm at KUET.",
    points: [
      { t: "Distil", d: "Your research, down to what matters." },
      { t: "Design", d: "One slide to carry it." },
      { t: "Deliver", d: "Three minutes for a non-specialist audience." },
    ],
    facts: [
      { k: "Presentations", v: "Sat 6 Feb 2027" },
      { k: "Team size", v: "2 members" },
      { k: "Registration", v: "BDT 1,000 per team" },
      { k: "Onsite teams", v: "30" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register a team of two online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked." },
      { when: "6 Feb", t: "Presentations", d: "10 am to 3 pm: three minutes per team." },
      { when: "6 Feb", t: "Prize ceremony", d: "At the festival's closing, before CSE Night." },
    ],
    prizes: { total: 40, note: "Judged on clarity, engagement and impact within three minutes." },
    faqs: [
      { q: "Who can take part?", a: "University students from across Bangladesh, in teams of two." },
      { q: "Is there a registration fee?", a: "BDT 1,000 per team. [PAYMENT METHOD]" },
      { q: "What research can we present?", a: "[ELIGIBLE RESEARCH]" },
      { q: "What happens at three minutes?", a: "[TIME RULE]" },
      { q: "How is it judged?", a: "On clarity, engagement and impact within three minutes." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  datathon: {
    slug: "datathon",
    description: "The Datathon at BitFest 4.0: an online preliminary on real datasets, then the top 30 teams in an onsite final at KUET on 6 February.",
    lead: "Real datasets and a live leaderboard. An online preliminary selects the top 30 teams for the onsite final on Saturday, 6 February.",
    about: "Participants analyse datasets to uncover meaningful patterns, generate insights and build data-driven solutions with statistics, machine learning and visualisation. Run by KMiNDS, the online preliminary runs from 20 to 29 January, and the top 30 teams of three come to KUET for the onsite final on Saturday, 6 February, from 9 am to 3 pm.",
    points: [
      { t: "Clean", d: "Get a real-world dataset into shape." },
      { t: "Model", d: "Build, validate and climb the preliminary leaderboard." },
      { t: "Explain", d: "Take the final's hidden test set, then present your approach." },
    ],
    facts: [
      { k: "Final", v: "Sat 6 Feb 2027" },
      { k: "Team size", v: "3 members" },
      { k: "Registration", v: "BDT 1,000 per team" },
      { k: "Onsite teams", v: "Top 30" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Form a team of three and register online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked for the preliminary." },
      { when: "20–29 Jan", t: "Online preliminary", d: "On a leaderboard platform. BDT 1,000 per team is paid at this stage." },
      { when: "31 Jan", t: "Finalists announced", d: "The top 30 teams are invited to KUET." },
      { when: "6 Feb", t: "Onsite final", d: "9 am to 3 pm on the KUET campus." },
    ],
    prizes: { total: 100, note: "Judged first on the score on a hidden test set, then on approach and presentation." },
    faqs: [
      { q: "Who can take part?", a: "University students from across Bangladesh, in teams of three." },
      { q: "Where does the preliminary happen?", a: "Online, on a leaderboard platform, from 20 to 29 January 2027. [LINK TO THE COMPETITION PAGE]" },
      { q: "Who goes to the final?", a: "The top 30 teams of the preliminary, announced on 31 January." },
      { q: "Is there a registration fee?", a: "BDT 1,000 per team, paid at the preliminary. [PAYMENT METHOD]" },
      { q: "How is the final judged?", a: "First on your score on a hidden test set, then on your approach and presentation." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  ctf: {
    slug: "ctf",
    description: "Capture the Flag at BitFest 4.0: a free online preliminary, then 40 teams of four on a live scoreboard at KUET on 6 February.",
    lead: "Cybersecurity challenges on a live scoreboard. A free online preliminary shortlists 40 teams of four for the onsite final on Saturday, 6 February.",
    about: "Participants solve cybersecurity challenges in cryptography, web security, digital forensics, reverse engineering and vulnerability analysis in a controlled environment. Run by KCSC, a free online preliminary from 20 to 29 January shortlists 40 teams of four for the onsite final on a live scoreboard on Saturday, 6 February, from 10 am to 3 pm. Points come from captured flags; ties are broken by time.",
    points: [
      { t: "Find", d: "Hidden flags across five areas of security." },
      { t: "Exploit", d: "Break the web app, the cipher, the binary." },
      { t: "Capture", d: "Every flag climbs the live scoreboard." },
    ],
    facts: [
      { k: "Final", v: "Sat 6 Feb 2027" },
      { k: "Team size", v: "4 members" },
      { k: "Registration", v: "Free prelim · BDT 1,000 onsite" },
      { k: "Onsite teams", v: "40" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register a team of four online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked." },
      { when: "20–29 Jan", t: "Online preliminary", d: "Free to enter." },
      { when: "31 Jan", t: "Finalists announced", d: "40 teams are invited to KUET." },
      { when: "6 Feb", t: "Onsite final", d: "10 am to 3 pm on a live scoreboard." },
      { when: "6 Feb", t: "Prize ceremony", d: "At the festival's closing, before CSE Night." },
    ],
    prizes: { total: 75, note: "Points from captured flags; ties broken by time." },
    faqs: [
      { q: "Who can take part?", a: "University students from across Bangladesh, in teams of four." },
      { q: "Is there a registration fee?", a: "The online preliminary is free. Teams selected for the final pay BDT 1,000. [PAYMENT METHOD]" },
      { q: "What are the categories?", a: "Cryptography, web security, digital forensics, reverse engineering and vulnerability analysis." },
      { q: "What should we bring?", a: "[LAPTOPS, TOOLS AND NETWORK RULES]" },
      { q: "How are ties broken?", a: "By time: the team that reached the score first ranks higher." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  "it-case": {
    slug: "it-case",
    description: "The Tech Business Case Competition at BitFest 4.0: a written online round, then 10 teams defend their strategy before a jury at KUET on 6 February.",
    lead: "Analyse a technology business case and propose a strategy. A written online round selects 10 teams to present and defend it before a jury on Saturday, 6 February.",
    about: "Participants analyse technology business scenarios and propose feasible, innovative and sustainable strategies, showing entrepreneurial thinking and decision-making. Run by the BitFest team, a written online round from 20 to 29 January selects 10 teams of three, who present and defend their strategy before a jury on Saturday, 6 February, from 10 am to 3 pm.",
    points: [
      { t: "Analyse", d: "Find what the case is really about." },
      { t: "Model", d: "Build the numbers behind your strategy." },
      { t: "Defend", d: "Present it, then hold it up under the jury's questions." },
    ],
    facts: [
      { k: "Final", v: "Sat 6 Feb 2027" },
      { k: "Team size", v: "3 members" },
      { k: "Registration", v: "BDT 1,000 per team" },
      { k: "Onsite teams", v: "Top 10" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register a team of three online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked." },
      { when: "20–29 Jan", t: "Written round", d: "An online round: the case, analysed in writing." },
      { when: "31 Jan", t: "Finalists announced", d: "The top 10 teams are invited to KUET." },
      { when: "6 Feb", t: "Case final", d: "10 am to 3 pm: present and defend your strategy before the jury." },
    ],
    prizes: { total: 100, note: "Judged on analysis, feasibility, financial reasoning and the final defence." },
    faqs: [
      { q: "Who can take part?", a: "University students from across Bangladesh, in teams of three." },
      { q: "Is there a registration fee?", a: "BDT 1,000 per team. [PAYMENT METHOD]" },
      { q: "What is the written round?", a: "An online round from 20 to 29 January: a case to analyse in writing. [FORMAT AND LENGTH]" },
      { q: "Who goes to the final?", a: "The top 10 teams of the written round, announced on 31 January." },
      { q: "How is the final judged?", a: "On analysis, feasibility, financial reasoning and the final defence." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  lfr: {
    slug: "lfr",
    description: "The Line-Following Robot Competition at BitFest 4.0: autonomous robots race a predefined track at KUET on 5 February.",
    lead: "Autonomous robots race a predefined track. Speed, accuracy and reliability decide it, on Friday, 5 February.",
    about: "Participants design and program autonomous robots that follow a line around a predefined track, competing on speed, accuracy and reliability. Run by HACK, timed runs and the knockout take place on Friday, 5 February, from 10 am to 5 pm; the fastest valid run wins.",
    points: [
      { t: "Calibrate", d: "Sensors that read the line in any light." },
      { t: "Tune", d: "Control that holds the curves and finds the junctions." },
      { t: "Race", d: "The fastest clean run takes it." },
    ],
    facts: [
      { k: "Final", v: "Fri 5 Feb 2027" },
      { k: "Team size", v: "3 members" },
      { k: "Registration", v: "BDT 2,000 per team" },
      { k: "Onsite teams", v: "30" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register a team of three online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked." },
      { when: "5 Feb", t: "Timed runs", d: "Every robot runs the track from 10 am." },
      { when: "5 Feb", t: "Knockout", d: "The fastest robots run again, done by 5 pm." },
      { when: "6 Feb", t: "Prize ceremony", d: "At the festival's closing, before CSE Night." },
    ],
    prizes: { total: 45, note: "Ranked on the fastest valid run and track completion." },
    faqs: [
      { q: "Who can take part?", a: "University students from across Bangladesh, in teams of three." },
      { q: "Is there a registration fee?", a: "BDT 2,000 per team. [PAYMENT METHOD]" },
      { q: "What is the track like?", a: "A predefined line track. [TRACK SPECIFICATION]" },
      { q: "Does the robot have to be autonomous?", a: "Yes: it follows the line on its own. [ROBOT RULES]" },
      { q: "How is it decided?", a: "On the fastest valid run and track completion." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  "soccer-bot": {
    slug: "soccer-bot",
    description: "Soccer Bot at BitFest 4.0: teams of four, group matches and knockouts on 5 February at KUET.",
    lead: "Robot soccer on a purpose-built field. Teams build and drive their robots through group matches and a knockout on Friday, 5 February.",
    about: "Participants build and control robots that play soccer matches, showing skill in robotics, control systems, strategy and teamwork. Run by HACK, group matches and the knockout take place on Friday, 5 February, from 10 am to 5 pm.",
    points: about.map((a) => ({ t: a.t, d: a.d })),
    facts: [
      { k: "Final", v: "Fri 5 Feb 2027" },
      { k: "Team size", v: "4 members" },
      { k: "Registration", v: "BDT 2,000 per team" },
      { k: "Onsite teams", v: "30" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register your team of four online." },
      { when: "19 Jan", t: "Registration closes", d: "The team list is locked." },
      { when: "5 Feb", t: "Group matches", d: "Teams play their group matches from 10 am." },
      { when: "5 Feb", t: "Knockout and final", d: "The knockout, then the final, all done by 5 pm." },
      { when: "6 Feb", t: "Prize ceremony", d: "At the festival's closing, before CSE Night." },
    ],
    prizes: { total: 45, note: "Ranked on match results through the group stage and the knockout." },
    faqs: [
      { q: "Who can take part?", a: "University students from across Bangladesh, in teams of four." },
      { q: "Is there a registration fee?", a: "BDT 2,000 per team. [PAYMENT METHOD]" },
      { q: "When do matches happen?", a: "On Friday, 5 February 2027 at KUET: group matches first, then the knockout, with the finals ending by 5 pm." },
      { q: "How is it decided?", a: "On match results, through the group stage and then the knockout." },
      { q: "Do we bring our own controller and batteries?", a: "[ANSWER]" },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
  gaming: {
    slug: "gaming",
    description: "Esports Gaming at BitFest 4.0: Valorant, FIFA and Clash Royale, with group stages and finals at KUET on 5 February.",
    lead: "Esports in three titles: Valorant, FIFA and Clash Royale. Group stages and finals run on Friday, 5 February, from 10 am to 5 pm.",
    about: "Participants compete individually or in teams in selected video games, showing strategy, coordination, quick decisions and teamwork. Run by the BitFest team, the 2027 titles are Valorant (16 teams of five), FIFA (32 players) and Clash Royale (32 players), played on Friday, 5 February, from 10 am to 5 pm.",
    points: [
      { t: "Groups", d: "Every entry plays a group stage." },
      { t: "Knockouts", d: "The best go through to the bracket." },
      { t: "Finals", d: "Played out on the festival screen." },
    ],
    facts: [
      { k: "Finals", v: "Fri 5 Feb 2027" },
      { k: "Titles", v: "Valorant · FIFA · Clash Royale" },
      { k: "Registration", v: "From BDT 300 per player" },
      { k: "Entries", v: "80" },
    ],
    timeline: [
      { when: "Soon", t: "Registration opens", d: "Register for one of the three titles online." },
      { when: "19 Jan", t: "Registration closes", d: "The entry list is locked." },
      { when: "5 Feb", t: "Group stages", d: "All three titles, from 10 am." },
      { when: "5 Feb", t: "Finals", d: "Done by 5 pm." },
      { when: "6 Feb", t: "Prize ceremony", d: "At the festival's closing, before CSE Night." },
    ],
    prizes: { total: 40, note: "Decided by match results under each title's tournament rules." },
    faqs: [
      { q: "Which games?", a: "Valorant (16 teams of five), FIFA (32 players) and Clash Royale (32 players)." },
      { q: "Is there a registration fee?", a: "Valorant BDT 1,500 per team; FIFA BDT 400 and Clash Royale BDT 300 per player. [PAYMENT METHOD]" },
      { q: "Do we bring our own devices?", a: "[WHAT TO BRING]" },
      { q: "Can I enter more than one title?", a: "[ANSWER]" },
      { q: "How are matches decided?", a: "By results under each title's tournament rules." },
    ],
    registerHref: "#", // [REGISTRATION FORM URL]
    rulebookHref: "#", // [RULEBOOK PDF URL]
  },
};

/** The register button: the form once its URL is set; until then it says when registration opens and
    scrolls to the contest's timeline, so the button never leads nowhere. */
export const registerCta = (href: string) =>
  href && href !== "#" ? { href, label: "Register your team", short: "Register" } : { href: "#timeline", label: "Registration opens soon", short: "Register" };
/** The rulebook button only shows once there is a rulebook to open. */
export const hasRulebook = (href: string) => Boolean(href) && href !== "#";

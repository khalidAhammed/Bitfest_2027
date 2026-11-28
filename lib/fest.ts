// Fest-wide facts and the 13 competitions in 8 categories, from the BitFest 4.0 sponsorship proposal
// (final, Dept. of CSE, KUET, November 2026): dates, formats, team sizes, fees, prize money and the
// organizing clubs. Venues are not in it ("final clock times and venues are published with each
// event's rulebook"). Prize money is kept here but hidden on the site (SHOW_PRIZES).

export const fest = {
  name: "BitFest",
  /** The edition, shown after the name: "BitFest 4.0". The dates carry the year. */
  year: "4.0",
  edition: "4th KUET CSE Innovation Festival",
  kicker: "4th KUET CSE Innovation Festival",
  motto: "AI for Mankind, Society and the Sustainable Development",
  blurb: "13 competitions in 8 categories: artificial intelligence, innovation, programming, research, cybersecurity, entrepreneurship, robotics and gaming. Online rounds in January, then two days of finals on the KUET campus, Khulna.",
  dates: "5–6 February 2027",
  venue: "KUET campus, Khulna",
  /** The total shown on the hero chip. The final proposal totals BDT 8,10,000 across the 13
      competitions; the organizers chose to show 700K on the site. */
  prizePool: "700K",
  email: "csefest@kuet.ac.bd",
  phone: "+880 1723-593626",
  facebook: "https://www.facebook.com/BitFestCSE",
};

/** Social preview card for a page (public/og). Served from the Vercel site for now: KUET's server
    (csefest.kuet.ac.bd) still has the old cards until it pulls the cpanel branch. Switch back to a
    relative "/og/..." path once it does. `v` makes WhatsApp and Facebook fetch the new image instead
    of a cached old one; raise it whenever the cards are redrawn. */
export const ogImage = (name: string) => `https://bitfest2027.vercel.app/og/${name}.jpg?v=3`;

export type FestEvent = {
  slug: string;
  name: string;
  /** Short form for tight spaces (chips, LED board). */
  short: string;
  kind: string;
  line: string;
  /** The onsite day: Friday 5 or Saturday 6 February 2027 (IUPC's mock contest is on the 5th), or
      "Online" for the two online-only AI competitions (entries due 25 January). */
  day: string;
  venue: string;
  pool: string;
  /** The KUET club (or the BitFest team) that runs it. */
  club: string;
  team: string;
  fee: string;
  onsite: string;
  href: string;
};

// Every contest has its own page at /events/<slug>.
const E = (e: Omit<FestEvent, "venue" | "href"> & { href?: string }): FestEvent => ({ venue: "KUET campus", href: `/events/${e.slug}`, ...e });

// In the proposal's order: 1 Artificial intelligence, 2 Innovation, 3 Programming, 4 Research,
// 5 Cybersecurity, 6 Entrepreneurship, 7 Robotics, 8 Gaming. `onsite` is the capacity.
export const events: FestEvent[] = [
  E({ slug: "ai-solutions", name: "AI-Driven Solutions for Bangladesh's Needs", short: "AI SOLUTIONS", kind: "Artificial intelligence", line: "Propose a practical AI solution to a real problem in Bangladesh, as a poster", day: "Online", pool: "20K", club: "IEEE Computer Society", team: "1", fee: "BDT 500 per person", onsite: "Open" }),
  E({ slug: "ai-hackathon", name: "AI Hackathon", short: "AI HACK", kind: "Artificial intelligence", line: "Build a working AI solution in a day", day: "5 Feb", pool: "100K", club: "Bit2Byte", team: "3", fee: "Free prelim · BDT 2,500 onsite", onsite: "40 teams" }),
  E({ slug: "imagine-ai", name: "Imagine the Future with AI", short: "IMAGINE AI", kind: "Artificial intelligence", line: "Write about how AI could change life, society and the world", day: "Online", pool: "10K", club: "BitFest team", team: "1", fee: "BDT 500 per person", onsite: "Open" }),
  E({ slug: "project-showcase", name: "Project Showcase", short: "SHOWCASE", kind: "Innovation", line: "Exhibit working projects and prototypes", day: "5 Feb", pool: "50K", club: "HACK", team: "Up to 3", fee: "BDT 1,500", onsite: "35 teams" }),
  E({ slug: "iupc", name: "IUPC", short: "IUPC", kind: "Programming", line: "Inter-University Programming Contest, ICPC rules", day: "6 Feb", pool: "170K", club: "SGIPC", team: "3 + coach", fee: "BDT 5,500", onsite: "140 teams" }),
  E({ slug: "ict-olympiad", name: "ICT Olympiad", short: "ICT OLYMPIAD", kind: "Programming", line: "For school students: ICT, computing and logical problem-solving", day: "5 Feb", pool: "15K", club: "IEEE Computer Society", team: "1", fee: "BDT 350 per person", onsite: "100 students" }),
  E({ slug: "3mt", name: "Three-Minute Thesis", short: "3MT", kind: "Research", line: "Your research in three minutes, for a non-specialist audience", day: "6 Feb", pool: "40K", club: "KMiNDS", team: "2", fee: "BDT 1,000", onsite: "30 teams" }),
  E({ slug: "datathon", name: "Datathon", short: "DATATHON", kind: "Research", line: "Real datasets, an online preliminary, then the final", day: "6 Feb", pool: "100K", club: "KMiNDS", team: "3", fee: "BDT 1,000, paid at the preliminary", onsite: "30 teams" }),
  E({ slug: "ctf", name: "Capture the Flag", short: "CTF", kind: "Cybersecurity", line: "Security challenges on a live scoreboard", day: "6 Feb", pool: "75K", club: "KCSC", team: "4", fee: "Free prelim · BDT 1,000 onsite", onsite: "40 teams" }),
  E({ slug: "it-case", name: "Tech Business Case Competition", short: "BUSINESS CASE", kind: "Entrepreneurship", line: "Analyse a technology business case, then defend your strategy", day: "6 Feb", pool: "100K", club: "BitFest team", team: "3", fee: "BDT 1,000", onsite: "10 teams" }),
  E({ slug: "lfr", name: "Line-Following Robot", short: "LFR", kind: "Robotics", line: "Autonomous robots race a predefined track", day: "5 Feb", pool: "45K", club: "HACK", team: "3", fee: "BDT 2,000", onsite: "30 teams" }),
  E({ slug: "soccer-bot", name: "Soccer Bot", short: "SOCCER BOT", kind: "Robotics", line: "Robot soccer, groups then knockouts", day: "5 Feb", pool: "45K", club: "HACK", team: "4", fee: "BDT 2,000", onsite: "30 teams" }),
  E({ slug: "gaming", name: "Esports Gaming", short: "ESPORTS", kind: "Gaming", line: "Valorant, FIFA and Clash Royale", day: "5 Feb", pool: "40K", club: "BitFest team", team: "1–5", fee: "Valorant BDT 1,500 · FIFA 400 · Clash Royale 300", onsite: "80 entries" }),
];

/** The two online-only AI competitions (entries due 25 January, winners at the closing ceremony). */
export const isOnline = (e: FestEvent) => e.day === "Online";

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** Every contest now has its own page; the 2025 pages stay mapped for any contest set back to "#". */
const OLD: Record<string, string> = { iupc: "iupc", "ai-hackathon": "hackathon", lfr: "lfr", "project-showcase": "project-showcase", gaming: "gaming", "it-case": "it-case" };
export const oldSite = (slug: string) => (OLD[slug] ? `https://bitfest2025.netlify.app/${OLD[slug]}` : "/#schedule");
/** Contest pages are not public yet: contest names keep their hover but do not link anywhere. Set to
    true when the pages are ready and every contest name links to its page again. */
export const CONTEST_PAGES_LIVE = true;
/** Prize money is hidden everywhere on the site for now (the hero's pool line, prize rows on the
    contest cards, each contest page's prize section, descriptions and FAQ answers). Set to true to
    bring it all back; PRIZES_ANNOUNCED then decides whether each contest's own figure shows or "??". */
export const SHOW_PRIZES = false;
/** Each contest's prize money is not announced yet: those amounts show as "??". */
export const PRIZES_ANNOUNCED = false;
/** A contest's prize amount ready to show ("175K"), or "??" until those are announced. */
export const money = (amount: string) => (PRIZES_ANNOUNCED ? amount : "??");
/** The fest in one line, for search results and link previews. */
export const festDescription = `13 competitions in 8 categories: artificial intelligence, innovation, programming, research, cybersecurity, entrepreneurship, robotics and gaming. ${fest.dates} at KUET, Khulna.${SHOW_PRIZES ? ` ${fest.prizePool} BDT in prizes.` : ""}`;

export const eventHref = (e: FestEvent) => (e.href !== "#" ? e.href : oldSite(e.slug));
export const isExternal = (e: FestEvent) => e.href === "#" && Boolean(OLD[e.slug]);

// The roadmap: registration 7 Dec 2026 – 19 Jan 2027, online rounds 20–29 Jan (online-only entries due
// 25 Jan), finalists on 31 Jan, onsite finals on Fri 5 and Sat 6 Feb. Dates are day offsets from
// 7 Dec 2026 (43 = 19 Jan, 49 = 25 Jan, 60 = 5 Feb, 61 = 6 Feb).
export type Milestone = { kind: "window" | "deadline" | "round" | "shortlist" | "final"; from: number; to?: number; label: string; open?: boolean };
export const SCHEDULE_START = new Date(2026, 11, 7);
export const SCHEDULE_DAYS = 62;
const REG: Milestone = { kind: "window", from: 0, to: 43, label: "Registration" };
export const schedule: Record<string, Milestone[]> = {
  "ai-solutions": [
    REG,
    { kind: "deadline", from: 49, label: "Posters due online" },
    { kind: "final", from: 61, label: "Winners announced at the closing ceremony" },
  ],
  "ai-hackathon": [
    REG,
    { kind: "round", from: 44, to: 53, label: "Online preliminary, free to enter" },
    { kind: "shortlist", from: 55, label: "Top 40 announced" },
    { kind: "final", from: 60, label: "Onsite final, 10 am – 7 pm" },
  ],
  "imagine-ai": [
    REG,
    { kind: "deadline", from: 49, label: "Entries due online" },
    { kind: "final", from: 61, label: "Winners announced at the closing ceremony" },
  ],
  "project-showcase": [REG, { kind: "final", from: 60, label: "Exhibition and judging, 10 am – 5 pm" }],
  iupc: [REG, { kind: "final", from: 60, to: 61, label: "Mock contest Fri 3 pm, main contest Sat (5 hours)" }],
  "ict-olympiad": [REG, { kind: "final", from: 60, label: "Olympiad, 10 am – 12 pm" }],
  "3mt": [REG, { kind: "final", from: 61, label: "Presentations, 10 am – 3 pm" }],
  datathon: [
    REG,
    { kind: "round", from: 44, to: 53, label: "Online preliminary on a leaderboard" },
    { kind: "shortlist", from: 55, label: "Top 30 announced" },
    { kind: "final", from: 61, label: "Onsite final, 9 am – 3 pm" },
  ],
  ctf: [
    REG,
    { kind: "round", from: 44, to: 53, label: "Online preliminary, free to enter" },
    { kind: "shortlist", from: 55, label: "Top 40 announced" },
    { kind: "final", from: 61, label: "Onsite final on a live scoreboard, 10 am – 3 pm" },
  ],
  "it-case": [
    REG,
    { kind: "round", from: 44, to: 53, label: "Written online round" },
    { kind: "shortlist", from: 55, label: "Top 10 announced" },
    { kind: "final", from: 61, label: "Case final before the jury, 10 am – 3 pm" },
  ],
  lfr: [REG, { kind: "final", from: 60, label: "Timed runs and knockout, 10 am – 5 pm" }],
  "soccer-bot": [REG, { kind: "final", from: 60, label: "Group matches and knockout, 10 am – 5 pm" }],
  gaming: [REG, { kind: "final", from: 60, label: "Group stages and finals, 10 am – 5 pm" }],
};

// "5 Feb" for a day offset. Formatted by hand and cached: the schedule asks for these labels hundreds of
// times while the home page starts up, and toLocaleDateString is slow on budget devices.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayLabels = new Map<number, string>();
export const dayLabel = (d: number) => {
  let label = dayLabels.get(d);
  if (label === undefined) {
    const t = new Date(SCHEDULE_START);
    t.setDate(t.getDate() + d);
    label = `${t.getDate()} ${MONTHS[t.getMonth()]}`;
    dayLabels.set(d, label);
  }
  return label;
};

// Prize money in thousands of BDT. The proposal gives each contest's total only; the split between
// places comes with each rulebook, so `top` stays empty.
export const prizes: Record<string, { top: [number, number, number] | null; extra?: string; total: number | null }> = Object.fromEntries(
  events.map((e) => [e.slug, { top: null, total: parseInt(e.pool, 10) }]),
);

// BitFest 2025's sponsors and media partner, as listed in the proposal. 2027 partners are not confirmed yet.
export const sponsors: { name: string; note?: string }[] = [
  { name: "MIAKI" },
  { name: "Brain Station 23" },
  { name: "City Group" },
  { name: "Apsis" },
  { name: "MicroMac" },
  { name: "NRBC Bank" },
  { name: "Suffix IT" },
  { name: "MSI" },
  { name: "Jamuna TV", note: "Media partner" },
];

// The KUET clubs and societies (and the BitFest team) that run the contests.
export const clubs = [
  { name: "SGIPC", runs: "Inter-University Programming Contest" },
  { name: "IEEE Computer Society", runs: "AI-Driven Solutions for Bangladesh's Needs, ICT Olympiad" },
  { name: "Bit2Byte", runs: "AI Hackathon" },
  { name: "KMiNDS", runs: "Three-Minute Thesis, Datathon" },
  { name: "HACK", runs: "Project Showcase, Line-Following Robot Competition, Soccer Bot" },
  { name: "KCSC", runs: "Capture the Flag" },
  { name: "BitFest team", runs: "Imagine the Future with AI, Tech Business Case Competition, Esports Gaming" },
];

import { type Milestone, dayLabel, events, schedule } from "@/lib/fest";

export type Item = Milestone & { ev: number };
export const ITEMS: Item[] = events
  .flatMap((e, i) => (schedule[e.slug] ?? []).map((m) => ({ ...m, ev: i })))
  .sort((a, b) => a.from - b.from || a.ev - b.ev);

export const KIND_LABEL: Record<Milestone["kind"], string> = {
  window: "Registration",
  deadline: "Registration closes",
  round: "Online round",
  shortlist: "Finalists announced",
  final: "Final on campus",
};

/** "8–17 Dec", "26 Dec – 3 Jan", "27 Dec – …", or one date. */
export const range = (m: Milestone) => {
  // Registration's opening date is not announced yet: its window reads "Soon – 19 Jan".
  if (m.kind === "window" && m.from === 0 && m.to !== undefined) return `Soon – ${dayLabel(m.to)}`;
  if (m.to === undefined || m.to === m.from) return dayLabel(m.from);
  if (m.open) return `${dayLabel(m.from)} – …`;
  const [d1, m1] = dayLabel(m.from).split(" ");
  const [, m2] = dayLabel(m.to).split(" ");
  return m1 === m2 ? `${d1}–${dayLabel(m.to)}` : `${dayLabel(m.from)} – ${dayLabel(m.to)}`;
};

/** The milestone's own wording, unless it only repeats its kind. */
export const detail = (m: Milestone) => (m.label === KIND_LABEL[m.kind] || m.label === "Registration" ? "" : m.label);

/** Everything that touches a day (offset from 30 Nov). */
export const onDay = (d: number) => ITEMS.filter((m) => d >= m.from && d <= (m.to ?? m.from));

/** Days that start something, in order: the dates worth stepping through. */
export const KEY_DAYS = [...new Set(ITEMS.map((m) => m.from))].sort((a, b) => a - b);

export { dayLabel, events };

import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventPageLayout from "@/components/event/EventPageLayout";
import { events, fest, CONTEST_PAGES_LIVE, ogImage } from "@/lib/fest";
import { eventPages } from "@/lib/eventPages";
import IupcHero from "@/components/contests/IupcHero";
import AiHackathonHero from "@/components/contests/AiHackathonHero";
import DatathonHero from "@/components/datathon/Hero";
import ThesisHero from "@/components/contests/ThesisHero";
import ShowcaseHero from "@/components/contests/ShowcaseHero";
import LfrHero from "@/components/contests/LfrWaterfallHero";
import SoccerHero from "@/components/soccer/Hero";
import CtfHero from "@/components/contests/CtfHero";
import CaseHero from "@/components/contests/CaseHero";
import GamingHero from "@/components/contests/GamingHero";
import AiSolutionsHero from "@/components/contests/AiSolutionsHero";
import ImagineAiHero from "@/components/contests/ImagineAiHero";
import IctOlympiadHero from "@/components/contests/IctOlympiadHero";

// Each contest's own live hero; the rest of the page is shared.
const HEROES: Record<string, ComponentType> = {
  iupc: IupcHero,
  "ai-hackathon": AiHackathonHero,
  datathon: DatathonHero,
  "3mt": ThesisHero,
  "project-showcase": ShowcaseHero,
  lfr: LfrHero,
  "soccer-bot": SoccerHero,
  ctf: CtfHero,
  "it-case": CaseHero,
  gaming: GamingHero,
  "ai-solutions": AiSolutionsHero,
  "imagine-ai": ImagineAiHero,
  "ict-olympiad": IctOlympiadHero,
};

/** Contests with their own social card in public/og; the rest use the festival's. */
const OG = new Set(events.map((e) => e.slug));

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  const page = eventPages[slug];
  if (!e || !page) return {};
  const title = `${e.name} · ${fest.name} ${fest.year}`;
  // Each contest has its own 1200x630 card in public/og (name, final date, prize money, team size).
  const image = { url: ogImage(OG.has(slug) ? slug : "home"), width: 1200, height: 630, alt: `${e.name} at ${fest.name} ${fest.year}, ${fest.dates} at ${fest.venue}.` };
  return {
    title,
    description: page.description,
    alternates: { canonical: `/events/${slug}` },
    // Kept out of search results until the contest pages are public.
    ...(CONTEST_PAGES_LIVE ? {} : { robots: { index: false, follow: false } }),
    openGraph: { type: "website", siteName: `${fest.name} ${fest.year}`, title, description: page.description, url: `/events/${slug}`, images: [image] },
    twitter: { card: "summary_large_image", title, description: page.description, images: [image.url] },
  };
}

export default async function ContestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  const page = eventPages[slug];
  const Hero = HEROES[slug];
  if (!e || !page || !Hero) notFound();
  return <EventPageLayout page={page} name={e.name} hero={<Hero />} />;
}

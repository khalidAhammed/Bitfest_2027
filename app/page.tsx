import type { Metadata } from "next";
import HomePage from "@/components/redesign/HomePage";
import HeroPinout from "@/components/redesign/heroes/HeroPinout";
import { CONTEST_PAGES_LIVE, events, festDescription } from "@/lib/fest";

const SITE = "https://csefest.kuet.ac.bd";
const kuet = {
  "@type": "Place",
  name: "Khulna University of Engineering & Technology (KUET)",
  address: { "@type": "PostalAddress", addressLocality: "Khulna", postalCode: "9203", addressCountry: "BD" },
};
const organizer = { "@type": "Organization", name: "Department of CSE, KUET", url: SITE };

// Structured data so search engines can show the fest (and each contest) as events.
const festJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "BitFest 4.0 · 4th KUET CSE Innovation Festival",
  description:
    "13 competitions in 8 categories: artificial intelligence, innovation, programming, research, cybersecurity, entrepreneurship, robotics and gaming, at KUET, Khulna.",
  startDate: "2027-02-05",
  endDate: "2027-02-06",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: kuet,
  image: [`${SITE}/og/home.jpg`],
  url: SITE,
  organizer,
  subEvent: events.map((e) => ({
    "@type": "Event",
    name: e.name,
    description: e.line,
    // The two online-only AI competitions: entries due 25 January, winners at the closing ceremony.
    startDate: e.day === "Online" ? "2027-01-25" : e.day.startsWith("5 ") ? "2027-02-05" : "2027-02-06",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: e.day === "Online" ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location: e.day === "Online" ? { "@type": "VirtualLocation", url: CONTEST_PAGES_LIVE ? `${SITE}/events/${e.slug}` : SITE } : kuet,
    image: [`${SITE}/og/${e.slug}.jpg`],
    url: CONTEST_PAGES_LIVE ? `${SITE}/events/${e.slug}` : SITE,
    organizer,
  })),
};

export const metadata: Metadata = {
  title: "BitFest 4.0 · 4th KUET CSE Innovation Festival",
  description: festDescription,
  alternates: { canonical: "/" },
};

// The landing page: the redesign (slate blue and green, chip hero), from components/redesign.
// Backups, kept out of search results: /classic (the first, orange landing page), /redesign/centre
// (the wide-panel hero) and /r4. .rd-theme switches on the redesign's colours; it adds no box.
export default function Home() {
  return (
    <div className="rd-theme contents">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(festJsonLd) }} />
      <HomePage hero={<HeroPinout glow="orbit" seat="board" lid="live" />} />
    </div>
  );
}

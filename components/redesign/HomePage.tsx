import type { ReactNode } from "react";
import HomeNav from "./HomeNav";
import EventSidebar from "@/components/event/EventSidebar";
import ContestCards from "./schedule/ContestCards";
import PastGallery from "./gallery/Gallery";
import Partners from "./Partners";
import Faq from "./Faq";
import FinalCall from "./FinalCall";
import HomeFooter from "./HomeFooter";
import BgStroke from "./BgStroke";

/** The homepage below the hero is the same in every version; only the hero changes. */
/** `nav`: "top" is the original bar; "side" is the side panel the contest pages use (the landing page). */
export default function HomePage({ hero, nav = "top" }: { hero: ReactNode; nav?: "top" | "side" }) {
  const side = nav === "side";
  return (
    <>
      {side ? (
        <EventSidebar register={{ href: "#schedule", label: "Register" }} />
      ) : (
        <>
          {/* Wide screens: the top nav. Phones and tablets: the contest pages' bar and slide-in menu. */}
          <div className="hidden lg:contents"><HomeNav /></div>
          <EventSidebar mobileOnly register={{ href: "#schedule", label: "Register" }} />
        </>
      )}
      {/* Wide screens with the side panel: the page sits to its right. */}
      <div className={side ? "lg:pl-[304px]" : "contents"}>
      {/* The page sits above the footer, which it reveals as it scrolls away (see HomeFooter). */}
      <main className="rd-main rd-main-home relative z-10 bg-bg">
        <BgStroke />
        {hero}
        <ContestCards />
        <PastGallery />
        <Partners />
        <Faq />
        <section className="rd-fade-last relative py-24 md:py-32">
          <div className="mx-auto max-w-[1440px] px-6 md:px-14">
            <FinalCall />
          </div>
        </section>
      </main>
      <HomeFooter />
      </div>
    </>
  );
}

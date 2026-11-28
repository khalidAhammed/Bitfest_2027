import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import TraceCursor from "@/components/ui/TraceCursor";
import { festDescription, ogImage } from "@/lib/fest";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const title = "BitFest 4.0 · 4th KUET CSE Innovation Festival";
const description = festDescription;

// Social previews and canonicals need absolute URLs. NEXT_PUBLIC_SITE_URL overrides the production domain.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://csefest.kuet.ac.bd";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "BitFest 4.0",
  keywords: [
    "BitFest 4.0", "BitFest 2027", "BitFest", "KUET", "KUET CSE", "KUET CSE Fest", "national tech fest Bangladesh", "IUPC",
    "programming contest", "AI hackathon", "datathon", "CTF", "robotics", "Line Following Robot", "Soccer Bot",
    "3 Minute Thesis", "project showcase", "IT business case", "esports", "Khulna",
  ],
  authors: [{ name: "Department of CSE, KUET" }],
  creator: "Department of CSE, KUET",
  publisher: "Khulna University of Engineering & Technology",
  category: "technology",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BitFest 4.0",
    title,
    description,
    url: "/",
    images: [{ url: ogImage("home"), width: 1200, height: 630, alt: "BitFest 4.0, the 4th KUET CSE Innovation Festival: 13 competitions on 5–6 February 2027 at KUET, Khulna." }],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage("home")] },
};

export const viewport: Viewport = {
  themeColor: "#070607",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="grain min-h-screen bg-bg text-ink">
        <SmoothScroll />
        <TraceCursor />
        {children}
      </body>
    </html>
  );
}

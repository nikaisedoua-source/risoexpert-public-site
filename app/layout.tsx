import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./legal-consent.css";
import "./map-dynamic.css";
import "./machine-showcase.css";
import "./model-catalog.css";
import "./reviews.css";
import "./polish.css";
import "./risoexpert-identity.css";
import { SITE_ORIGIN } from "./site-config";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: "RisoExpert | Technicien RISO en Côte d’Ivoire",
  description: "Diagnostic, dépannage et entretien de machines RISO en Côte d’Ivoire. Ouvrez votre dossier et contactez directement un technicien.",
  keywords: ["RisoExpert", "technicien RISO Côte d’Ivoire", "dépannage duplicopieur RISO", "maintenance RISO", "réparation RISO Abidjan"],
  alternates: { canonical: SITE_ORIGIN + "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: { google: "fW1ox3Pn4mb5nef3Lxk6ffyM0kDgtYhxi9cmeTKxRpE" },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
  openGraph: {
    title: "RisoExpert — L’expertise RISO, à portée de main.",
    description: "Diagnostic, dépannage et maintenance RISO en Côte d’Ivoire.",
    url: SITE_ORIGIN + "/", type: "website", locale: "fr_CI", siteName: "RisoExpert",
    images: [{ url: SITE_ORIGIN + "/og.png", width: 1200, height: 630, alt: "RisoExpert — Assistance technique RISO" }],
  },
  twitter: { card: "summary_large_image", title: "RisoExpert", description: "L’expertise RISO, à portée de main.", images: [SITE_ORIGIN + "/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={sans.variable + " " + mono.variable}>{children}</body></html>;
}

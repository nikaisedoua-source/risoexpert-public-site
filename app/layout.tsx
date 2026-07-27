import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./legal-consent.css";
import "./map-dynamic.css";
import "./machine-showcase.css";
import "./model-catalog.css";
import "./polish.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "RisoExpert | Technicien RISO en Côte d’Ivoire",
    description: "Diagnostic, dépannage et entretien de duplicopieurs RISO en Côte d’Ivoire. Demande en ligne enregistrée et suivie par un technicien.",
    keywords: ["RisoExpert", "technicien RISO Côte d’Ivoire", "dépannage duplicopieur RISO", "maintenance RISO", "réparation RISO Abidjan", "réparation RISO Yamoussoukro", "risographe Côte d’Ivoire"],
    alternates: { canonical: `${protocol}://${host}/` },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
    openGraph: { title: "RisoExpert — Dépannage et maintenance RISO en Côte d’Ivoire", description: "Diagnostic, dépannage et entretien de duplicopieurs et risographes RISO dans toutes les villes de Côte d’Ivoire.", type: "website", locale: "fr_CI", siteName: "RisoExpert", images: [{ url: image, width: 1200, height: 630, alt: "RisoExpert — Assistance technique RISO" }] },
    twitter: { card: "summary_large_image", title: "RisoExpert", description: "L’expertise RISO, à portée de main.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}

import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./legal-consent.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "RisoExpert | Technicien RISO en Côte d’Ivoire",
    description: "Diagnostic, dépannage et entretien de duplicopieurs RISO en Côte d’Ivoire. Contact direct par WhatsApp au 07 77 80 80 51.",
    keywords: ["technicien RISO Côte d’Ivoire", "dépannage duplicopieur", "maintenance RISO", "réparation RISO Abidjan"],
    icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
    openGraph: { title: "RisoExpert — L’assistance technique RISO simplifiée", description: "Dépannage et maintenance de machines RISO en Côte d’Ivoire.", type: "website", locale: "fr_CI", images: [{ url: image, width: 1200, height: 630, alt: "RisoExpert" }] },
    twitter: { card: "summary_large_image", title: "RisoExpert", description: "L’expertise RISO, à portée de main.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}

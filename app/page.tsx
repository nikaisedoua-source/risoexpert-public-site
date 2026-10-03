import RequestForm from "./request-form";
import GoogleSignIn from "./google-sign-in";
import SocialShare from "./social-share";
import MachineShowcase from "./machine-showcase";
import { FolderDeck, FolderPanel } from "./service-folders";
import { headers } from "next/headers";

const phone = "+2250777808051";
const displayPhone = "+225 07 77 80 80 51";
const whatsapp = `https://wa.me/2250777808051?text=${encodeURIComponent("Bonjour RisoExpert, j’ai besoin d’un dépannage RISO.")}`;
const whatsappChannel = "https://whatsapp.com/channel/0029VaeghXMATRSuL58NHn1x";
const telegram = "https://t.me/+WSj_HtJdAts5N2E0";
const facebookPage = "https://www.facebook.com/people/Techniciens-Riso-ci/61558758369166/";
const instagram = "https://www.instagram.com/risoexpert.ci/";
const linkedin = "https://www.linkedin.com/company/risoexpert/";
const xProfile = "https://x.com/RisoExpertCI";

const services = [
  ["Diagnostic RISO", "Analyse du modèle, du code d’erreur, des photos et des symptômes avant toute intervention."],
  ["Dépannage sur site", "Intervention à Abidjan et étude des demandes ailleurs en Côte d’Ivoire avec frais annoncés."],
  ["Maintenance préventive", "Contrôles, nettoyage technique, réglages et conseils pour réduire les arrêts de production."],
  ["Suivi machine", "Historique, devis, rendez-vous et orientation technique centralisés dans un même dossier."],
];

const faqs = [
  ["Sous quel délai vais-je recevoir une réponse ?", "Pour une demande complète, RisoExpert vise une première réponse sous 24 heures ouvrées."],
  ["Quelles zones sont couvertes ?", "Les interventions sur site sont proposées à Abidjan. Les autres villes de Côte d’Ivoire sont étudiées au cas par cas."],
  ["Le diagnostic à distance suffit-il toujours ?", "Non. Les photos et codes d’erreur servent à préparer l’intervention. Le tarif final dépend de la panne confirmée."],
  ["Comment le prix est-il fixé ?", "Le devis sépare la main-d’œuvre, le déplacement et les pièces. Aucun travail payant ne commence sans validation."],
  ["Que faire si toute la production est arrêtée ?", `Appelez directement le ${displayPhone} avec le modèle, le code d’erreur et votre commune.`],
];

const socials = [
  ["WhatsApp", whatsapp, "Écrire directement au technicien"],
  ["Chaîne WhatsApp", whatsappChannel, "Suivre les annonces RisoExpert"],
  ["Telegram", telegram, "Rejoindre le groupe d’assistance"],
  ["Facebook", facebookPage, "Voir les publications et partenaires"],
  ["Instagram", instagram, "Suivre l’activité terrain"],
  ["LinkedIn", linkedin, "Page entreprise RisoExpert"],
  ["X", xProfile, "Actualités courtes et annonces"],
];

export default async function Home() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    name: "RisoExpert",
    slogan: "L’expertise RISO, à portée de main",
    telephone: phone,
    url: `${origin}/`,
    image: `${origin}/og.png`,
    priceRange: "Devis avant intervention",
    description: "Diagnostic, dépannage et maintenance de duplicopieurs RISO en Côte d’Ivoire.",
    areaServed: "Côte d’Ivoire",
    sameAs: [facebookPage, instagram, linkedin, xProfile, whatsappChannel, telegram],
    knowsAbout: ["RISO", "duplicopieur", "risographe", "maintenance imprimante", "dépannage RISO"],
    serviceType: ["Diagnostic RISO", "Dépannage de duplicopieurs", "Maintenance préventive", "Réparation RISO"],
    address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" },
  };

  return (
    <main className="rx-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="rx-topbar">
        <div className="rx-shell rx-nav">
          <a className="rx-brand" href="#accueil" aria-label="RisoExpert accueil"><span>R</span><b>Riso<strong>Expert</strong></b></a>
          <nav aria-label="Navigation principale"><a href="#dossiers">Dossiers</a><a href="#demande">Dépannage</a><a href="#partenaires">Partenaires</a><a href="#contact">Contact</a></nav>
          <GoogleSignIn />
        </div>
      </header>

      <section className="rx-hero" id="accueil">
        <div className="rx-shell rx-hero-grid">
          <div className="rx-hero-copy">
            <p className="rx-kicker">Assistance RISO · Côte d’Ivoire</p>
            <h1>RisoExpert</h1>
            <p className="rx-signature">L’expertise RISO, à portée de main.</p>
            <p className="rx-lead">Diagnostic, dépannage et maintenance de machines RISO pour imprimeries, écoles, administrations, associations et entreprises.</p>
            <div className="rx-actions"><a className="rx-button rx-primary" href="#demande">Ouvrir un dossier</a><a className="rx-button rx-secondary" href={`tel:${phone}`}>Appeler maintenant</a><a className="rx-button rx-light" href="/api/android-apk">Télécharger l’APK</a></div>
          </div>
          <aside className="rx-case-card" aria-label="Dossier d’assistance RisoExpert">
            <div className="rx-case-top"><span>Dossier d’assistance</span><strong>Technicien disponible</strong></div>
            <div className="rx-case-body">
              <p>Diagnostic guidé</p>
              <h2>Expliquez la panne. On prépare la suite.</h2>
              <div><span>01 Machine</span><span>02 Symptôme</span><span>03 Photos</span></div>
            </div>
            <p className="rx-case-note">Envoyez le modèle, le code d’erreur, une photo et votre commune.</p>
          </aside>
        </div>
      </section>

      <section className="rx-strip" aria-label="Publics accompagnés"><div className="rx-shell"><span>Imprimeries</span><span>Écoles</span><span>Administrations</span><span>Associations</span><span>Entreprises</span></div></section>

      <section className="rx-section rx-shell" id="dossiers">
        <div className="rx-section-heading">
          <p className="rx-kicker">Tout est rangé par dossier</p>
          <h2>Chaque information s’ouvre seulement quand vous en avez besoin.</h2>
          <p>Le site devient plus propre : moins de texte affiché en même temps, plus de clarté pour trouver le bon service, contacter RisoExpert ou suivre une demande.</p>
        </div>

        <FolderDeck>
          <FolderPanel id="services" number="01" title="Services" summary="Diagnostic, dépannage, maintenance et suivi machine.">
            <div className="rx-dialog-grid">
              {services.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </FolderPanel>

          <FolderPanel id="machines" number="02" title="Machines" summary="Les familles RISO les plus suivies par RisoExpert.">
            <MachineShowcase />
          </FolderPanel>

          <FolderPanel id="demande" number="03" title="Dépannage" summary="Ouvrir un dossier avec le modèle, le code et les photos.">
            <div className="rx-request-layout">
              <div>
                <p className="rx-kicker">Demande en ligne</p>
                <h3>Expliquez votre problème maintenant.</h3>
                <p>Quelques informations suffisent pour préparer le diagnostic. Pour une production arrêtée, appelez directement.</p>
                <a className="rx-button rx-primary" href={`tel:${phone}`}>Appeler le {displayPhone}</a>
              </div>
              <RequestForm />
            </div>
          </FolderPanel>

          <FolderPanel id="faq" number="04" title="FAQ et prix" summary="Délais, devis, zones couvertes et conditions d’intervention.">
            <div className="rx-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
          </FolderPanel>

          <FolderPanel id="contact" number="05" title="Contact et réseaux" summary="WhatsApp, Telegram, Facebook, Instagram, LinkedIn et X.">
            <div className="rx-social-grid">{socials.map(([name, href, text]) => <a key={name} href={href} target="_blank" rel="noreferrer"><strong>{name}</strong><span>{text}</span></a>)}</div>
            <div className="rx-share-wrap"><SocialShare /></div>
          </FolderPanel>

          <FolderPanel id="partenaires" number="06" title="Partenaires" summary="Références visibles et publications partenaires vérifiées.">
            <div className="rx-partner-card">
              <p className="rx-kicker">Partenaire publié</p>
              <h3>Imprimerie Nouvelle Vision</h3>
              <p>Partenaire mentionné sur la page Facebook RisoExpert. Les autres publications seront ajoutées seulement après confirmation lisible du nom et du visuel.</p>
              <a className="rx-button rx-secondary" href="https://facebook.com/share/1JWksSV29QP/" target="_blank" rel="noreferrer">Voir la publication Facebook</a>
            </div>
          </FolderPanel>
        </FolderDeck>
      </section>

      <section className="rx-final" id="demande-direct">
        <div className="rx-shell">
          <div>
            <p className="rx-kicker">Dossier prioritaire</p>
            <h2>Une panne ne doit pas bloquer votre production.</h2>
          </div>
          <div className="rx-final-actions"><a className="rx-button rx-primary" href="#demande">Ouvrir un dossier</a><a className="rx-button rx-secondary" href={whatsapp}>Écrire sur WhatsApp</a></div>
        </div>
      </section>

      <footer className="rx-footer">
        <div className="rx-shell rx-footer-grid">
          <div><a className="rx-brand" href="#accueil"><span>R</span><b>Riso<strong>Expert</strong></b></a><p>L’expertise RISO, à portée de main.</p></div>
          <div><b>Contact</b><a href={`tel:${phone}`}>{displayPhone}</a><a href={whatsapp}>WhatsApp</a><a href={telegram}>Telegram</a><a href={linkedin}>LinkedIn entreprise</a></div>
          <div><b>Informations</b><a href="/api/android-apk">Application Android</a><a href="/conditions">Conditions d’utilisation</a><a href="/confidentialite">Confidentialité</a><a href="#faq">Questions fréquentes</a></div>
          <small>Service technique indépendant. RISO est une marque appartenant à son propriétaire respectif.</small>
        </div>
      </footer>
      <a className="rx-floating" href={whatsapp}>WhatsApp</a>
    </main>
  );
}

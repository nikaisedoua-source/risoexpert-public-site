import RequestForm from "./request-form";
import GoogleSignIn from "./google-sign-in";
import SocialShare from "./social-share";
import MachineShowcase from "./machine-showcase";
import ModelCatalog from "./model-catalog";
import Reviews from "./reviews";
import CinematicMachine from "./cinematic-machine";
import { FolderDeck, FolderPanel } from "./service-folders";
import { SITE_ORIGIN } from "./site-config";

const phone = "+2250777808051";
const displayPhone = "+225 07 77 80 80 51";
const whatsapp = "https://wa.me/2250777808051?text=" + encodeURIComponent("Bonjour RisoExpert, j’ai besoin d’un dépannage RISO.");
const whatsappChannel = "https://whatsapp.com/channel/0029VaeghXMATRSuL58NHn1x";
const telegram = "https://t.me/+WSj_HtJdAts5N2E0";
const facebookPage = "https://www.facebook.com/people/Techniciens-Riso-ci/61558758369166/";
const instagram = "https://www.instagram.com/risoexpert.ci/";
const linkedin = "https://www.linkedin.com/company/risoexpert/";
const xProfile = "https://x.com/RisoExpertCI";

const services = [
  ["Diagnostic RISO", "Analyse du modèle, du code d’erreur, des photos et des symptômes pour préparer une intervention ciblée."],
  ["Dépannage sur site", "Intervention à Abidjan et étude des demandes ailleurs en Côte d’Ivoire, avec déplacement annoncé au préalable."],
  ["Maintenance préventive", "Contrôles, nettoyage technique et réglages pour limiter les arrêts de production."],
  ["Suivi machine", "Un même dossier pour votre demande, les échanges techniques et la préparation du devis."],
];
const faqs = [
  ["Sous quel délai vais-je recevoir une réponse ?", "Pour une demande complète, RisoExpert vise une première réponse sous 24 heures ouvrées."],
  ["Quelles zones sont couvertes ?", "Les interventions sur site sont proposées à Abidjan. Les autres villes de Côte d’Ivoire sont étudiées au cas par cas."],
  ["Le diagnostic à distance suffit-il toujours ?", "Les photos et codes d’erreur permettent de préparer la suite. Certaines pannes nécessitent un contrôle sur place."],
  ["Comment le prix est-il fixé ?", "Le devis sépare la main-d’œuvre, le déplacement et les pièces. Aucun travail payant ne commence sans validation."],
  ["L’intervention est-elle garantie ?", "La garantie applicable est précisée sur le devis ou la facture selon la réparation et les pièces remplacées."],
  ["Que faire si toute la production est arrêtée ?", "Appelez directement le " + displayPhone + " avec le modèle, le code d’erreur et votre commune."],
];
const socials = [
  ["WhatsApp", whatsapp, "Contacter le technicien"],
  ["Chaîne WhatsApp", whatsappChannel, "Suivre les annonces"],
  ["Telegram", telegram, "Rejoindre l’assistance"],
  ["Facebook", facebookPage, "L’actualité et les partenaires"],
  ["Instagram", instagram, "Les interventions en images"],
  ["LinkedIn", linkedin, "La page entreprise"],
  ["X", xProfile, "Les actualités RisoExpert"],
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org", "@type": ["ProfessionalService", "LocalBusiness"],
    name: "RisoExpert", slogan: "L’expertise RISO, à portée de main", telephone: phone,
    url: SITE_ORIGIN + "/", image: SITE_ORIGIN + "/og.png", priceRange: "Devis avant intervention",
    description: "Diagnostic, dépannage et maintenance de machines RISO en Côte d’Ivoire.",
    areaServed: "Côte d’Ivoire", sameAs: [facebookPage, instagram, linkedin, xProfile, whatsappChannel, telegram],
    knowsAbout: ["RISO", "duplicopieur", "risographe", "maintenance imprimante", "dépannage RISO"],
    address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" },
  };
  return (
    <main className="rx-site rx-cinematic">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <a className="rx-skip" href="#dossiers">Accéder aux dossiers</a>
      <header className="rx-topbar">
        <div className="rx-shell rx-nav">
          <a className="rx-brand" href="#accueil" aria-label="RisoExpert accueil"><span className="rx-brand-mark">R<span>•</span></span><b>Riso<strong>Expert</strong><small>ASSISTANCE TECHNIQUE RISO</small></b></a>
          <nav aria-label="Navigation principale"><a href="#dossiers">Explorer</a><a href="#machines">Machines</a><a href="#partenaires">Partenaires</a><a href="#contact">Contact</a></nav>
          <div className="rx-account"><GoogleSignIn /></div>
          <a className="rx-nav-contact" href={whatsapp}>Parlons de votre machine</a>
        </div>
      </header>

      <section className="rx-hero" id="accueil" aria-labelledby="hero-title">
        <div className="rx-hero-grid-lines" aria-hidden="true" />
        <div className="rx-hero-wordmark" aria-hidden="true">RISO</div>
        <div className="rx-shell rx-hero-grid">
          <div className="rx-hero-copy">
            <div className="rx-kicker"><span className="rx-country">CI</span> L’EXPERTISE RISO · CÔTE D’IVOIRE</div>
            <h1 id="hero-title">L’expertise.<br /><em>Sans interruption.</em></h1>
            <p className="rx-signature">L’expertise RISO, à portée de main.</p>
            <p className="rx-lead">Derrière chaque impression, une machine qui compte.<br className="rx-desktop-break" /> Diagnostic, dépannage et maintenance : nous prenons le relais.</p>
            <div className="rx-actions"><a className="rx-button rx-primary" href="#demande"><span className="rx-button-symbol" aria-hidden="true">+</span> Ouvrir un dossier</a><a className="rx-button rx-secondary" href={"tel:" + phone}>Appeler un technicien</a></div>
            <div className="rx-hero-assurance"><span>Devis avant intervention</span><span>Contact direct</span></div>
          </div>
          <CinematicMachine />
        </div>
        <div className="rx-shell rx-hero-bottom"><span>DIAGNOSTIC / MAINTENANCE / DÉPANNAGE</span><a href="#dossiers">Explorer les dossiers <span aria-hidden="true">⌄</span></a><span>ABIDJAN · CÔTE D’IVOIRE</span></div>
      </section>

      <section className="rx-strip" aria-label="Publics accompagnés"><div className="rx-shell"><p>Au service de vos impressions.</p><span>Imprimeries</span><span>Écoles</span><span>Administrations</span><span>Associations</span><span>Entreprises</span></div></section>

      <section className="rx-section rx-shell" id="dossiers" aria-labelledby="dossiers-title">
        <div className="rx-section-heading">
          <div><p className="rx-kicker">01 / VOTRE ESPACE RISOEXPERT</p><h2 id="dossiers-title">Tout commence<br /><em>par le bon dossier.</em></h2></div>
          <p>Votre machine. Votre besoin. Le bon interlocuteur.<br />Choisissez un dossier pour accéder à l’essentiel.</p>
        </div>
        <FolderDeck>
          <FolderPanel id="services" number="01" title="Services" summary="Diagnostic, dépannage, maintenance et suivi machine.">
            <div className="rx-dialog-intro"><p className="rx-kicker">DE LA PANNE À LA REPRISE</p><h3>Une expertise au service de votre production.</h3></div>
            <div className="rx-dialog-grid">{services.map(([title, text], i) => <article key={title}><span className="rx-detail-number">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
            <a className="rx-button rx-primary rx-dialog-cta" href="#demande">Ouvrir un dossier</a>
          </FolderPanel>
          <FolderPanel id="machines" number="02" title="Machines" summary="Duplicopieurs, ComColor et presses de production."><MachineShowcase /></FolderPanel>
          <FolderPanel id="catalogue" number="03" title="Catalogue" summary="Identifiez votre modèle parmi les références RISO."><ModelCatalog /></FolderPanel>
          <FolderPanel id="demande" number="04" title="Dépannage" summary="Le modèle. La panne. Les photos. Votre dossier.">
            <div className="rx-request-layout"><div><p className="rx-kicker">DEMANDE EN LIGNE</p><h3>Expliquez votre problème maintenant.</h3><p>Modèle, code d’erreur, photos et commune : ces informations permettent de préparer le diagnostic.</p><div className="rx-request-steps"><span><b>01</b> Identifiez la machine</span><span><b>02</b> Décrivez la panne</span><span><b>03</b> Envoyez votre demande</span></div><p>Production arrêtée ?</p><a className="rx-button rx-primary" href={"tel:" + phone}>Appeler le {displayPhone}</a></div><RequestForm /></div>
          </FolderPanel>
          <FolderPanel id="faq" number="05" title="FAQ et devis" summary="Délais, zones couvertes et devis avant intervention."><div className="rx-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></FolderPanel>
          <FolderPanel id="avis" number="06" title="Avis clients" summary="Les retours des clients. Leur expérience RisoExpert."><Reviews /></FolderPanel>
          <FolderPanel id="contact" number="07" title="Contact et réseaux" summary="Un contact direct et toutes nos communautés.">
            <div className="rx-contact-feature"><p className="rx-kicker">UN SEUL SITE OFFICIEL</p><a href={SITE_ORIGIN + "/"}>risoexpert.website</a><p>Retrouvez les services RisoExpert et partagez cette adresse.</p></div>
            <div className="rx-social-grid">{socials.map(([name, href, text]) => <a key={name} href={href} target="_blank" rel="noreferrer"><strong>{name}</strong><span>{text}</span></a>)}</div><SocialShare />
          </FolderPanel>
          <FolderPanel id="partenaires" number="08" title="Partenaires" summary="Celles et ceux qui font avancer l’impression.">
            <div className="rx-partner-card"><p className="rx-kicker">IMPRESSION & COLLABORATION</p><h3>Imprimerie Nouvelle Vision</h3><p>Retrouvez la publication consacrée à ce partenaire sur notre page Facebook.</p><a className="rx-button rx-secondary" href="https://facebook.com/share/1JWksSV29QP/" target="_blank" rel="noreferrer">Voir la publication Facebook</a></div>
          </FolderPanel>
        </FolderDeck>
        <div className="rx-directory-foot"><span>08 DOSSIERS · UN SEUL INTERLOCUTEUR</span><a href="/api/android-apk">Télécharger l’APK Android</a></div>
      </section>

      <section className="rx-final" id="demande-direct">
        <div className="rx-shell rx-final-grid"><div className="rx-final-monogram" aria-hidden="true">R.</div><div><p className="rx-kicker">02 / REMETTONS VOTRE PRODUCTION EN MOUVEMENT</p><h2>Votre prochaine impression<br /><em>commence ici.</em></h2><p>Une panne ne doit pas bloquer votre production.<br />Un modèle, un code d’erreur, une photo. Nous préparons la suite.</p><div className="rx-final-actions"><a className="rx-button rx-primary" href="#demande">Ouvrir un dossier</a><a className="rx-button rx-secondary" href={whatsapp}>Écrire sur WhatsApp</a></div></div></div>
      </section>

      <footer className="rx-footer"><div className="rx-shell rx-footer-grid">
        <div><a className="rx-brand" href="#accueil"><span className="rx-brand-mark">R<span>•</span></span><b>Riso<strong>Expert</strong></b></a><p>L’expertise RISO, à portée de main.</p><a className="rx-official-domain" href={SITE_ORIGIN + "/"}>risoexpert.website</a></div>
        <div><b>Contact direct</b><a href={"tel:" + phone}>{displayPhone}</a><a href={whatsapp}>WhatsApp</a><a href={telegram}>Telegram</a></div>
        <div><b>RisoExpert</b><a href={facebookPage}>Facebook</a><a href={instagram}>Instagram</a><a href={linkedin}>LinkedIn entreprise</a><a href={xProfile}>X</a></div>
        <div><b>Informations</b><a href="/api/android-apk">Application Android</a><a href="/conditions">Conditions d’utilisation</a><a href="/confidentialite">Confidentialité</a><a href="#faq">Questions fréquentes</a></div>
      </div><div className="rx-shell rx-footer-bottom"><small>© 2026 RisoExpert · Côte d’Ivoire</small><small>Service technique indépendant. RISO est une marque appartenant à son propriétaire respectif.</small></div></footer>
      <a className="rx-floating" href={whatsapp} aria-label="Contacter RisoExpert sur WhatsApp"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-12 7l-5 1.5 1.5-5a8 8 0 1 1 15.5-3.5Z" stroke="currentColor" strokeWidth="1.5"/><path d="M8.5 7.5c.5 4 2.5 6 6.5 7l1-2-2-1-.8 1c-1.5-.6-2.6-1.7-3.2-3.2l1-.8-1-2-1.5 1Z" stroke="currentColor" strokeWidth="1.3"/></svg><span>Parlons RISO</span></a>
    </main>
  );
}

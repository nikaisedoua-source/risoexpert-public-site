import RequestForm from "./request-form";
import { SITE_ORIGIN } from "./site-config";

const phone = "+2250777808051";
const displayPhone = "+225 07 77 80 80 51";
const whatsapp = "https://wa.me/2250777808051?text=" + encodeURIComponent("Bonjour RisoExpert, j’ai besoin d’un dépannage RISO.");
const telegram = "https://t.me/+WSj_HtJdAts5N2E0";
const facebookPage = "https://www.facebook.com/people/Techniciens-Riso-ci/61558758369166/";
const instagram = "https://www.instagram.com/risoexpert.ci/";
const linkedin = "https://www.linkedin.com/company/risoexpert/";
const xProfile = "https://x.com/RisoExpertCI";

const services = [
  ["Diagnostic", "Identification précise de la panne à partir du modèle, du code d’erreur et de photos."],
  ["Dépannage", "Réparation ciblée pour remettre votre machine en production avec le moins d’arrêt possible."],
  ["Maintenance", "Entretien régulier pour prévenir les pannes et prolonger la durée de vie de vos équipements."],
  ["Suivi machine", "Un historique des interventions pour anticiper et décider en connaissance de cause."],
];

const faqs = [
  ["Y a-t-il un devis avant l’intervention ?", "Oui. Après analyse de votre dossier, un devis est proposé et l’intervention n’est engagée qu’avec votre accord."],
  ["Quelles informations dois-je fournir ?", "Le modèle, la description de la panne, le code d’erreur affiché et, si possible, quelques photos ou une courte vidéo."],
  ["Quels sont les délais d’intervention ?", "Ils dépendent de votre localisation et de la nature de la panne. Ils vous sont précisés dès le premier échange."],
  ["Quelles zones couvrez-vous ?", "Nous intervenons en Côte d’Ivoire. Indiquez votre ville dans votre demande pour confirmer les conditions d’intervention."],
  ["Êtes-vous affiliés à la marque RISO ?", "Non. RisoExpert est un service technique indépendant. RISO est une marque appartenant à son propriétaire respectif."],
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    name: "RisoExpert",
    slogan: "L’expertise RISO, à portée de main",
    telephone: phone,
    url: SITE_ORIGIN + "/",
    image: SITE_ORIGIN + "/og.png",
    description: "Diagnostic, dépannage et maintenance de machines RISO en Côte d’Ivoire.",
    areaServed: "Côte d’Ivoire",
    sameAs: [facebookPage, instagram, linkedin, xProfile, telegram],
    knowsAbout: ["RISO", "duplicopieur", "risographe", "maintenance imprimante", "dépannage RISO"],
    address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" },
  };

  return (
    <main className="rx-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <a className="skip-link" href="#services">Aller au contenu</a>

      <header className="site-header">
        <div className="wrap nav-bar">
          <a className="brand" href="#accueil" aria-label="RisoExpert, accueil">
            <span className="logo-mark">R</span>
            <span><b>RisoExpert</b><small>Assistance technique RISO</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Navigation principale">
            <a href="#services">Services</a><a href="#machines">Machines</a><a href="#methode">Méthode</a><a href="#demande">Dépannage</a><a href="#faq">FAQ</a><a href="#contact">Contact</a>
          </nav>
          <a className="button button-primary header-cta" href={whatsapp} target="_blank" rel="noreferrer">Parlons de votre machine</a>
          <details className="mobile-menu"><summary aria-label="Ouvrir le menu">☰</summary><nav aria-label="Menu mobile"><a href="#services">Services</a><a href="#machines">Machines</a><a href="#methode">Méthode</a><a href="#demande">Dépannage</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></nav></details>
        </div>
      </header>

      <section className="hero" id="accueil">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Expertise RISO · Côte d’Ivoire</span>
            <h1>L’expertise RISO. <em>Sans interruption.</em></h1>
            <p className="hero-lead">Derrière chaque impression, une machine qui compte. Diagnostic, dépannage et maintenance : nous prenons le relais, pour que votre production ne s’arrête pas.</p>
            <div className="hero-actions"><a className="button button-primary" href="#demande">Ouvrir un dossier</a><a className="button button-outline" href={`tel:${phone}`}>Appeler un technicien</a></div>
            <div className="trust-chips"><span>Devis avant intervention</span><span>Contact direct avec un technicien</span><span>Service indépendant</span></div>
          </div>
          <div className="machine-card">
            <div className="machine-image"><img src="/machines/mh9350.png" alt="Duplicopieur bicolore RISO MH9350" width="360" height="260" /></div>
            <h2>RISOGRAPH MH9350</h2><p>Duplicopieur bicolore</p>
            <div className="model-tags"><span>MH9350</span><span>SF9350</span><span>FT5430</span></div>
          </div>
        </div>
      </section>

      <div className="audience-strip"><div className="wrap"><span className="strip-label">Au service de</span><span>Imprimeries</span><span>Écoles</span><span>Administrations</span><span>Associations</span><span>Entreprises</span></div></div>

      <section className="section" id="services"><div className="wrap"><div className="section-heading"><span className="eyebrow">Nos services</span><h2>Un seul interlocuteur, de la panne au suivi.</h2><p>Une intervention claire et structurée pour garder vos machines RISO disponibles.</p></div><div className="card-grid services-grid">{services.map(([title, text], index) => <article className="card" key={title}><span className="card-icon">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="section machines-section" id="machines"><div className="wrap"><div className="section-heading"><span className="eyebrow">Machines</span><h2>Les équipements RISO que nous prenons en charge.</h2><p>Identifiez votre modèle et ouvrez un dossier : nous vous orientons vers la bonne solution.</p></div><div className="card-grid three-grid"><article className="card"><span className="card-label">Duplicopieurs</span><h3>Séries MH, SF, FT…</h3><p>Duplicopieurs mono et bicolores, dont les modèles MH9350, SF9350 et FT5430.</p></article><article className="card"><span className="card-label">ComColor</span><h3>Imprimantes jet d’encre</h3><p>Gamme ComColor pour l’impression à grande vitesse.</p></article><article className="card"><span className="card-label">Production</span><h3>Presses de production</h3><p>Équipements destinés aux volumes élevés, en imprimerie ou en administration.</p></article></div><p className="muted-note">Votre modèle n’est pas listé ? Écrivez-nous, nous vérifions pour vous.</p></div></section>

      <section className="process-section" id="methode"><div className="wrap"><div className="section-heading inverse"><span className="eyebrow">Comment ça marche</span><h2>Un dossier. Quatre étapes.</h2><p>Un modèle, un code d’erreur, une photo : nous préparons la suite.</p></div><div className="card-grid process-grid">{[["Décrivez la panne", "Modèle, symptômes, code d’erreur et photos si possible."], ["Diagnostic", "Un technicien analyse votre dossier et vous répond directement."], ["Devis", "Vous validez un devis avant toute intervention."], ["Intervention", "Réparation, essais et remise en service de la machine."]].map(([title, text], index) => <article className="process-step" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="request-section" id="demande"><div className="wrap request-grid"><div className="request-intro"><span className="eyebrow">Dépannage</span><h2>Ouvrez votre dossier en une minute.</h2><p>Remplissez ce court formulaire : votre demande est enregistrée et transmise à un technicien.</p><ul><li>Réponse directe, sans intermédiaire</li><li>Devis avant toute intervention</li><li>Un numéro de dossier pour suivre votre demande</li></ul><a className="direct-contact" href={`tel:${phone}`}><small>Production arrêtée ?</small><b>{displayPhone}</b></a></div><RequestForm /></div></section>

      <section className="section" id="faq"><div className="wrap narrow"><div className="section-heading"><span className="eyebrow">FAQ et devis</span><h2>Questions fréquentes</h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

      <section className="section cta-section"><div className="wrap cta-band"><div><h2>Vous nous avez fait confiance ? Partagez votre expérience.</h2><p>Vos retours aident d’autres utilisateurs de machines RISO à choisir un service fiable.</p></div><a className="button button-primary" href={facebookPage} target="_blank" rel="noreferrer">Donner mon avis</a></div></section>

      <section className="section contact-section" id="contact"><div className="wrap contact-grid"><div><span className="eyebrow">Contact et réseaux</span><h2>Un contact direct.</h2><p>Appelez, écrivez ou rejoignez la communauté des techniciens et utilisateurs RISO.</p><div className="social-links"><a href={facebookPage} target="_blank" rel="noreferrer">Facebook</a><a href={instagram} target="_blank" rel="noreferrer">Instagram</a><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={xProfile} target="_blank" rel="noreferrer">X</a></div></div><div className="contact-list"><a href={`tel:${phone}`}><span>☎</span><div><b>{displayPhone}</b><small>Appeler un technicien</small></div></a><a href={whatsapp} target="_blank" rel="noreferrer"><span>◌</span><div><b>WhatsApp</b><small>Réponse directe</small></div></a><a href={telegram} target="_blank" rel="noreferrer"><span>↗</span><div><b>Telegram</b><small>Communauté RISO</small></div></a></div></div></section>

      <footer><div className="wrap footer-grid"><div><a className="brand" href="#accueil"><span className="logo-mark">R</span><span><b>RisoExpert</b></span></a><p>L’expertise RISO, à portée de main.</p></div><div><h3>Navigation</h3><a href="#services">Services</a><a href="#machines">Machines</a><a href="#demande">Dépannage</a><a href="#faq">FAQ</a></div><div><h3>Contact</h3><a href={`tel:${phone}`}>{displayPhone}</a><a href={whatsapp}>WhatsApp</a><a href={telegram}>Telegram</a></div><div><h3>Informations</h3><a href="/conditions">Conditions d’utilisation</a><a href="/confidentialite">Confidentialité</a><a href="/api/android-apk">Application Android</a></div></div><div className="wrap legal">© 2026 RisoExpert · Côte d’Ivoire. Service technique indépendant. RISO est une marque appartenant à son propriétaire respectif.</div></footer>
      <a className="floating-whatsapp" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Écrire sur WhatsApp">◌ WhatsApp</a>
    </main>
  );
}

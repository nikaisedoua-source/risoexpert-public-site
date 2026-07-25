import RequestForm from "./request-form";
import VisitorInsights from "./visitor-insights";
import GoogleSignIn from "./google-sign-in";
import SocialShare from "./social-share";
import MachineShowcase from "./machine-showcase";
import { headers } from "next/headers";
import Image from "next/image";

const phone = "+2250777808051";
const whatsapp = `https://wa.me/2250777808051?text=${encodeURIComponent("Bonjour RisoExpert, j’ai besoin d’un dépannage RISO.")}`;
const facebook = "https://www.facebook.com/people/Maintenancier-Riso/61581266351611/";

const services = [
  ["Diagnostic précis", "Photos, vidéo et message d’erreur analysés avant le déplacement."],
  ["Intervention rapide", "Dépannage sur site à Abidjan et accompagnement en Côte d’Ivoire."],
  ["Maintenance préventive", "Contrôles réguliers pour réduire les arrêts de production."],
  ["Suivi professionnel", "Historique des machines, devis, rendez-vous et factures."],
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
    priceRange: "Sur devis",
    description: "Diagnostic, maintenance et dépannage de duplicopieurs RISO à Abidjan et en Côte d’Ivoire.",
    areaServed: "Côte d’Ivoire",
    sameAs: [facebook],
    knowsAbout: ["RISO", "duplicopieur", "risographe", "maintenance imprimante", "dépannage RISO"],
    serviceType: ["Diagnostic RISO", "Dépannage de duplicopieurs", "Maintenance préventive", "Réparation RISO"],
    address: { "@type": "PostalAddress", addressLocality: "Ebimpé, Abidjan", addressCountry: "CI" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="topbar">
        <div className="shell nav">
          <a className="logo" href="#accueil" aria-label="RisoExpert accueil"><span>R</span><b>Riso<strong>Expert</strong></b></a>
          <nav aria-label="Navigation principale"><a href="#services">Services</a><a href="#machines">Machines</a><a href="#demande">Dépannage</a><a href="#application">Application</a><a href="#visiteurs">Visiteurs</a></nav>
          <GoogleSignIn />
        </div>
      </header>

      <section className="hero" id="accueil">
        <div className="heroGlow" />
        <div className="shell heroGrid">
          <div className="heroCopy">
            <p className="kicker gold">Technicien indépendant • Ebimpé — Abidjan</p>
            <h1>L’assistance technique RISO <em>simplifiée.</em></h1>
            <p className="heroLead">Déclarez votre panne, envoyez vos photos et recevez l’accompagnement direct d’un technicien qualifié.</p>
            <div className="heroActions"><a className="button goldButton" href="#demande">Déclarer une panne</a><a className="button ghostButton" href={`/api/android-apk`}>Télécharger l’application</a></div>
            <div className="heroTrust"><span>Intervention rapide</span><span>Devis clair</span><span>Suivi personnalisé</span></div>
          </div>
          <div className="heroPortrait" aria-label="Technicien RisoExpert"><div className="portraitHalo"/><Image src="/risoexpert-avatar-sheet.png" alt="Avatar du technicien RisoExpert en tenue professionnelle" width={1080} height={720} priority sizes="(max-width: 950px) 100vw, 50vw"/><div className="responseBadge"><i/> Disponible pour un diagnostic<small>Contact direct : 07 77 80 80 51</small></div></div>
        </div>
      </section>

      <section className="quickStrip"><div className="shell"><span>Imprimeries</span><span>Écoles</span><span>Administrations</span><span>Associations</span><span>Entreprises</span></div></section>

      <section className="section services shell" id="services">
        <div className="sectionHeading"><div><p className="kicker">Une expertise de proximité</p><h2>De la première alerte au retour en production.</h2></div><p>Un interlocuteur unique pour comprendre la panne, préparer l’intervention et suivre chaque machine dans la durée.</p></div>
        <div className="serviceGrid">{services.map(([title, text], index) => <article className="serviceCard" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <MachineShowcase />

      <section className="process"><div className="shell processGrid"><div><p className="kicker gold">Simple et transparent</p><h2>Trois étapes. Une machine remise en service.</h2></div><ol><li><b>01</b><div><strong>Décrivez la panne</strong><span>Modèle, symptômes, message d’erreur et localisation.</span></div></li><li><b>02</b><div><strong>Recevez une première orientation</strong><span>Diagnostic à distance et préparation du déplacement.</span></div></li><li><b>03</b><div><strong>Suivez l’intervention</strong><span>Rendez-vous, devis et historique disponibles.</span></div></li></ol></div></section>

      <section className="section requestSection shell" id="demande">
        <div className="requestIntro"><p className="kicker">Demande en ligne</p><h2>Expliquez votre problème maintenant.</h2><p>Votre demande est enregistrée de façon sécurisée avec un numéro de dossier. Le technicien peut ensuite assurer un vrai suivi.</p><div className="directContact"><span>Besoin d’une réponse immédiate ?</span><a href={`tel:${phone}`}>07 77 80 80 51</a></div></div>
        <RequestForm />
      </section>

      <section className="download" id="application"><div className="shell downloadGrid"><div className="phoneMock"><div className="phoneTop">RisoExpert <i/></div><h3>Bonjour !</h3><p>Comment pouvons-nous vous aider aujourd’hui ?</p><div className="mockCard"><b>Déclarer une panne</b><span>Décrivez votre problème en quelques étapes simples.</span><strong>Commencer →</strong></div><div className="mockTiles"><span>Mes machines</span><span>Mes demandes</span></div></div><div><p className="kicker gold">Application Android</p><h2>Votre assistance vous accompagne partout.</h2><p>Enregistrez vos équipements, gardez l’historique de vos demandes et transmettez une panne directement au technicien.</p><a className="button goldButton" href="/api/android-apk">Télécharger l’APK Android <small>61,9 Mo</small></a><p className="installNote">Téléchargement direct sécurisé — Android uniquement.</p></div></div></section>

      <VisitorInsights />
      <div className="shell"><SocialShare /></div>

      <section className="finalCta"><div className="shell"><div><p className="kicker gold">Votre partenaire de confiance</p><h2>Ne laissez pas une panne arrêter votre activité.</h2></div><div><a className="button goldButton" href="#demande">Demander un dépannage</a><a className="facebookLink" href={facebook} target="_blank" rel="noreferrer">Suivre RisoExpert sur Facebook →</a></div></div></section>

      <footer><div className="shell footerGrid"><div><a className="logo footerLogo" href="#accueil"><span>R</span><b>Riso<strong>Expert</strong></b></a><p>L’expertise RISO, à portée de main.</p></div><div><b>Contact</b><a href={`tel:${phone}`}>+225 07 77 80 80 51</a><a href={whatsapp}>WhatsApp</a><a href={facebook}>Facebook</a></div><div><b>Informations</b><a href="/conditions">Conditions d’utilisation</a><a href="/confidentialite">Confidentialité</a><a href="#application">Application Android</a></div><small>Service technique indépendant. RISO est une marque appartenant à son propriétaire respectif.</small></div></footer>
      <a className="floatingWhatsapp" href={whatsapp}>WhatsApp</a>
    </main>
  );
}

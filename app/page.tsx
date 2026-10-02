import RequestForm from "./request-form";
import GoogleSignIn from "./google-sign-in";
import SocialShare from "./social-share";
import MachineShowcase from "./machine-showcase";
import { headers } from "next/headers";
import Image from "next/image";

const phone = "+2250777808051";
const whatsapp = `https://wa.me/2250777808051?text=${encodeURIComponent("Bonjour RisoExpert, j’ai besoin d’un dépannage RISO.")}`;
const telegram = "https://t.me/+2250501556003";
const facebookAccount = "https://www.facebook.com/share/1EUQU266gP/";
const facebookPage = "https://www.facebook.com/share/1BDe8nBw64/";
const linkedin = "https://www.linkedin.com/in/nikaise-doua-aa95052b8";
const xProfile = "https://x.com/DecassanKoui";
const odooSite = "https://risoexpert.odoo.com/";

const services = [
  ["Diagnostic précis", "Photos, vidéo et message d’erreur analysés avant le déplacement."],
  ["Intervention rapide", "Dépannage sur site à Abidjan et accompagnement en Côte d’Ivoire."],
  ["Maintenance préventive", "Contrôles réguliers pour réduire les arrêts de production."],
  ["Suivi professionnel", "Historique des machines, devis, rendez-vous et factures."],
];

const faqs = [
  ["Sous quel délai vais-je recevoir une réponse ?", "Pour une demande complète, RisoExpert s’engage à envoyer une première réponse et, si nécessaire, un devis sous 24 heures ouvrées."],
  ["Quelles zones sont couvertes ?", "Les interventions sur site sont proposées à Abidjan. Les demandes ailleurs en Côte d’Ivoire sont étudiées au cas par cas, avec les frais de déplacement annoncés avant validation."],
  ["Le diagnostic à distance suffit-il toujours ?", "Non. Les photos, vidéos et codes d’erreur permettent une première orientation. Le tarif final n’est confirmé qu’après avoir identifié la panne et les pièces éventuellement nécessaires."],
  ["Comment le prix est-il fixé ?", "Le devis distingue la main-d’œuvre, le déplacement et les pièces. Aucun travail payant n’est engagé sans votre accord préalable."],
  ["L’intervention est-elle garantie ?", "La garantie applicable est précisée sur le devis ou la facture selon la nature de la réparation et les pièces remplacées."],
  ["Que faire si toute la production est arrêtée ?", "Appelez directement le 07 77 80 80 51. Indiquez le modèle, le code d’erreur et votre commune pour accélérer le premier diagnostic."],
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
    priceRange: "Devis sous 24 h ouvrées",
    description: "Diagnostic, maintenance et dépannage de duplicopieurs RISO à Abidjan et en Côte d’Ivoire.",
    areaServed: "Côte d’Ivoire",
    sameAs: [facebookAccount, facebookPage, linkedin, xProfile],
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
          <nav aria-label="Navigation principale"><a href="#services">Services</a><a href="#machines">Machines</a><a href="#tarifs">Tarifs</a><a href="#faq">FAQ</a><a href="#demande">Dépannage</a><a href={odooSite}>Espace client</a></nav>
          <GoogleSignIn />
        </div>
      </header>

      <section className="hero" id="accueil">
        <div className="heroGlow" />
        <div className="shell heroGrid">
          <div className="heroCopy">
            <p className="kicker gold">Assistance technique de proximité • Ebimpé — Abidjan</p>
            <h1>L’assistance technique RISO <em>simplifiée.</em></h1>
            <p className="heroLead">Déclarez votre panne, envoyez vos photos et recevez l’accompagnement direct d’un technicien qualifié.</p>
            <div className="heroActions"><a className="button goldButton" href={`tel:${phone}`}>Appeler en urgence</a><a className="button ghostButton" href="#demande">Déclarer une panne</a><a className="button ghostButton" href="/api/android-apk">Télécharger l’APK Android</a></div>
            <p className="apkNotice">Installation Android directe : votre téléphone peut demander d’autoriser l’installation depuis le navigateur.</p>
            <div className="heroTrust"><span>Réponse sous 24 h ouvrées</span><span>Devis avant intervention</span><span>Suivi personnalisé</span></div>
          </div>
          <div className="heroPortrait" aria-label="Technicien RisoExpert"><div className="portraitHalo"/><Image src="/risoexpert-avatar-single.png" alt="Avatar détouré du technicien RisoExpert en tenue professionnelle" width={1024} height={1536} priority sizes="(max-width: 950px) 100vw, 50vw"/><div className="responseBadge"><i/> Disponible pour un diagnostic<small>Contact direct : 07 77 80 80 51</small></div></div>
        </div>
      </section>

      <section className="quickStrip"><div className="shell"><span>Imprimeries</span><span>Écoles</span><span>Administrations</span><span>Associations</span><span>Entreprises</span></div></section>

      <section className="section services shell" id="services">
        <div className="sectionHeading"><div><p className="kicker">Une expertise de proximité</p><h2>De la première alerte au retour en production.</h2></div><p>Un interlocuteur unique pour comprendre la panne, préparer l’intervention et suivre chaque machine dans la durée.</p></div>
        <div className="serviceGrid">{services.map(([title, text], index) => <article className="serviceCard" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <MachineShowcase />

      <section className="process"><div className="shell processGrid"><div><p className="kicker gold">Simple et transparent</p><h2>Trois étapes. Une machine remise en service.</h2></div><ol><li><b>01</b><div><strong>Décrivez la panne</strong><span>Modèle, symptômes, message d’erreur et localisation.</span></div></li><li><b>02</b><div><strong>Recevez une première orientation</strong><span>Diagnostic à distance et préparation du déplacement.</span></div></li><li><b>03</b><div><strong>Suivez l’intervention</strong><span>Rendez-vous, devis et historique disponibles.</span></div></li></ol></div></section>

      <section className="section pricing shell" id="tarifs">
        <div className="sectionHeading"><div><p className="kicker">Des coûts annoncés avant d’agir</p><h2>Un devis lisible sous 24 h ouvrées.</h2></div><p>Le montant dépend du modèle, de la panne, du déplacement et des pièces. Vous recevez le détail avant toute intervention payante.</p></div>
        <div className="pricingGrid">
          <article><span>01</span><h3>Première orientation</h3><p>Analyse des symptômes, photos et codes d’erreur pour préparer la suite.</p></article>
          <article><span>02</span><h3>Devis détaillé</h3><p>Main-d’œuvre, déplacement et pièces présentés séparément, sans frais cachés.</p></article>
          <article><span>03</span><h3>Votre accord d’abord</h3><p>L’intervention payante commence uniquement après votre validation.</p></article>
        </div>
      </section>

      <section className="section requestSection shell" id="demande">
        <div className="requestIntro"><p className="kicker">Demande en ligne</p><h2>Expliquez votre problème maintenant.</h2><p>Quelques informations suffisent pour ouvrir votre dossier et préparer le diagnostic.</p><div className="directContact"><strong>Production arrêtée ? N’attendez pas.</strong><span>Appelez directement pour une première orientation.</span><a href={`tel:${phone}`}>Appeler le 07 77 80 80 51</a><a className="whatsappUrgent" href={whatsapp}>Ou écrire sur WhatsApp</a></div></div>
        <RequestForm />
      </section>

      <section className="section faq shell" id="faq">
        <div className="sectionHeading"><div><p className="kicker">Questions fréquentes</p><h2>Ce qu’il faut savoir avant une intervention.</h2></div><p>Délais, zone couverte, prix et garanties : les réponses essentielles sont réunies ici.</p></div>
        <div className="faqList">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>

      <div className="shell"><SocialShare /></div>

      <section className="finalCta"><div className="shell"><div><p className="kicker gold">Votre partenaire de confiance</p><h2>Ne laissez pas une panne arrêter votre activité.</h2></div><div><a className="button goldButton" href="#demande">Demander un dépannage</a><a className="facebookLink" href={facebookPage} target="_blank" rel="noreferrer">Suivre la page RisoExpert sur Facebook →</a></div></div></section>

      <footer><div className="shell footerGrid"><div><a className="logo footerLogo" href="#accueil"><span>R</span><b>Riso<strong>Expert</strong></b></a><p>L’expertise RISO, à portée de main.</p></div><div><b>Contact</b><a href={`tel:${phone}`}>+225 07 77 80 80 51</a><a href={whatsapp}>WhatsApp : 07 77 80 80 51</a><a href={telegram}>Telegram : 05 01 55 60 03</a><a href={facebookAccount}>Compte Facebook</a><a href={facebookPage}>Page Facebook</a><a href={linkedin}>LinkedIn</a><a href={xProfile}>X — @DecassanKoui</a></div><div><b>Informations</b><a href={odooSite}>Accéder au site Odoo</a><a href="/api/android-apk">Télécharger l’application Android</a><a href="#tarifs">Devis et tarifs</a><a href="#faq">Questions fréquentes</a><a href="/conditions">Conditions d’utilisation</a><a href="/confidentialite">Confidentialité</a></div><small>Service technique indépendant. RISO est une marque appartenant à son propriétaire respectif.</small></div></footer>
      <a className="floatingWhatsapp" href={whatsapp}>WhatsApp</a>
    </main>
  );
}

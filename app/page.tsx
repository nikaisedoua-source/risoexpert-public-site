const whatsapp = "https://wa.me/2250777808051?text=Bonjour%2C%20j%E2%80%99ai%20besoin%20d%E2%80%99un%20d%C3%A9pannage%20RISO.%20Mod%C3%A8le%20%3A%20%E2%80%A6%20Probl%C3%A8me%20%3A%20%E2%80%A6%20Commune%20%3A%20%E2%80%A6";
const facebook = "https://www.facebook.com/people/Maintenancier-Riso/61581266351611/";

const services = [
  ["Diagnostic rapide", "Analyse de la panne à distance par photo ou vidéo, puis intervention si nécessaire."],
  ["Dépannage sur site", "Recherche de panne, réparation, réglages et remise en service de votre duplicopieur."],
  ["Entretien préventif", "Nettoyage, contrôle et maintenance planifiée pour limiter les arrêts de production."],
  ["Pièces et consommables", "Conseil, remplacement de pièces et accompagnement pour vos besoins courants."],
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "RISO ASSIST PRO",
    description: "Technicien indépendant spécialisé en assistance et maintenance de duplicopieurs RISO en Côte d’Ivoire.",
    telephone: "+2250777808051",
    sameAs: [facebook],
    areaServed: "Côte d’Ivoire",
    address: { "@type": "PostalAddress", addressLocality: "Ebimpé", addressCountry: "CI" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="nav shell">
        <a className="brand" href="#accueil"><span>RA</span> RISO ASSIST PRO</a>
        <nav aria-label="Navigation principale">
          <a href="#services">Services</a><a href="#methode">Comment ça marche</a><a href={facebook} target="_blank" rel="noreferrer">Facebook</a><a href="#contact">Contact</a>
        </nav>
        <a className="navCta" href={whatsapp}>WhatsApp</a>
      </header>

      <section className="hero shell" id="accueil">
        <div className="heroCopy">
          <p className="eyebrow">Assistance technique • Côte d’Ivoire</p>
          <h1>Votre machine RISO en panne&nbsp;? Reprenez votre production rapidement.</h1>
          <p className="lead">Diagnostic, dépannage, entretien et suivi professionnel pour imprimeries, écoles, administrations, associations et entreprises.</p>
          <div className="actions">
            <a className="primary" href={whatsapp}>Demander un diagnostic</a>
            <a className="secondary" href="tel:+2250777808051">Appeler le 07 77 80 80 51</a>
            <a className="secondary" href={facebook} target="_blank" rel="noreferrer">Voir notre page Facebook</a>
          </div>
          <div className="trust"><span>✓ Contact direct</span><span>✓ Suivi de l’intervention</span><span>✓ Devis clair</span></div>
        </div>
        <div className="heroVisual">
          <img src="/technicien-riso-ci.png" alt="Technicien spécialisé en maintenance de machines RISO en Côte d’Ivoire" />
          <div className="availability"><i /> Disponible pour votre diagnostic<br/><small>Zone de départ : Ebimpé</small></div>
        </div>
      </section>

      <section className="audience"><div className="shell audienceInner"><b>Une assistance adaptée à votre activité</b><span>Imprimeries</span><span>Écoles</span><span>Administrations</span><span>Associations</span><span>Entreprises</span></div></section>

      <section className="section shell" id="services">
        <p className="eyebrow">Services</p><h2>De la première alerte au retour en production</h2>
        <p className="sectionIntro">Un interlocuteur unique et un historique clair pour chaque machine.</p>
        <div className="cards">{services.map(([title, text], i) => <article className="card" key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="method" id="methode"><div className="shell methodGrid">
        <div><p className="eyebrow light">Simple et transparent</p><h2>Trois étapes pour avancer</h2><p>Envoyez le modèle, le message d’erreur et une photo. Vous obtenez une première orientation avant le déplacement.</p></div>
        <ol><li><b>Expliquez la panne</b><span>WhatsApp, téléphone ou application.</span></li><li><b>Recevez le diagnostic et le devis</b><span>Coût et intervention présentés clairement.</span></li><li><b>Suivez la remise en service</b><span>Rendez-vous, statut et facture conservés.</span></li></ol>
      </div></section>

      <section className="section shell proof">
        <div><p className="eyebrow">Pourquoi RISO ASSIST PRO</p><h2>Le sérieux d’un suivi professionnel, la proximité d’un technicien direct.</h2></div>
        <div className="proofList"><p><b>Historique par machine</b><br/>Retrouvez les pannes, interventions et documents.</p><p><b>Photos avant déplacement</b><br/>Un premier diagnostic permet de mieux préparer la visite.</p><p><b>Maintenance préventive</b><br/>Anticipez les arrêts et protégez votre activité.</p></div>
      </section>

      <section className="cta" id="contact"><div className="shell ctaInner"><div><p className="eyebrow light">Besoin d’aide maintenant ?</p><h2>Envoyez une photo de la panne et le modèle de votre machine.</h2><p>Réponse directe par WhatsApp ou téléphone selon disponibilité.</p></div><div className="actions"><a className="primary inverse" href={whatsapp}>Ouvrir WhatsApp</a><a className="secondary inverseBorder" href="tel:+2250777808051">07 77 80 80 51</a></div></div></section>

      <footer className="shell footer"><div><b>RISO ASSIST PRO</b><p>Service technique indépendant spécialisé dans les équipements RISO.</p></div><div><b>Contact</b><p>Ebimpé, Côte d’Ivoire<br/><a href="tel:+2250777808051">+225 07 77 80 80 51</a><br/><a href={facebook} target="_blank" rel="noreferrer">Maintenancier Riso sur Facebook</a><br/><a href="/confidentialite">Confidentialité</a></p></div><small>RISO est une marque appartenant à son propriétaire respectif. Ce service indépendant n’est pas présenté comme un service officiel du fabricant.</small></footer>
      <a className="floating" href={whatsapp} aria-label="Contacter le technicien sur WhatsApp">WhatsApp</a>
    </main>
  );
}

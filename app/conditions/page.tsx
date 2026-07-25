import "../confidentialite/legal.css";
import Link from "next/link";

export const metadata = {
  title: "Conditions d’utilisation | RisoExpert",
  description: "Conditions applicables aux services de dépannage RisoExpert.",
};

export default function TermsPage() {
  return (
    <main className="legal shell">
      <Link className="legalBack" href="/">← Retour à l’accueil</Link>
      <p className="eyebrow">Cadre du service</p>
      <h1>Conditions d’utilisation</h1>
      <p className="lead">Version du 20 juillet 2026.</p>
      <section><h2>1. Objet et acceptation</h2><p>Ces conditions encadrent l’utilisation du site, de l’application RisoExpert et des services de diagnostic, maintenance et dépannage. L’acceptation est obligatoire avant l’envoi d’une demande ou la création d’un compte. La case d’acceptation n’est jamais précochée.</p></section>
      <section><h2>2. Demandes et diagnostic</h2><p>Le client fournit des informations exactes sur son identité, ses coordonnées, sa machine et la panne observée. Une orientation à distance reste indicative : un diagnostic définitif peut nécessiter une inspection sur place. Le client ne doit pas exécuter une manipulation dangereuse ou interdite par le constructeur.</p></section>
      <section><h2>3. Devis, rendez-vous et paiement</h2><p>Les travaux payants, pièces et déplacements sont précisés dans un devis ou un accord communiqué au client. Les délais dépendent notamment de l’accès au site, de la disponibilité des pièces et de l’état réel de la machine. Les conditions de paiement convenues pour l’intervention restent applicables.</p></section>
      <section><h2>4. Responsabilités</h2><p>RisoExpert exécute ses prestations avec diligence professionnelle. Le client reste responsable des sauvegardes, des consommables, de l’utilisation conforme de la machine et de l’exactitude des informations transmises. Aucune clause ne limite les droits auxquels le client ne peut légalement renoncer, ni la responsabilité qui ne peut être exclue par la loi.</p></section>
      <section><h2>5. Données et sécurité</h2><p>Les données sont utilisées pour gérer les comptes, demandes et interventions conformément à la Politique de confidentialité. RisoExpert met en œuvre des mesures techniques et organisationnelles raisonnables, mais aucun système numérique ne garantit une sécurité absolue. En cas d’incident, les mesures correctives et notifications prévues par la réglementation applicable seront mises en œuvre. L’acceptation de ces conditions ne vaut pas renonciation aux droits légaux du client.</p></section>
      <section><h2>6. Photos et contenus transmis</h2><p>Le client ne transmet que les photos, vidéos et documents nécessaires au dépannage et qu’il est autorisé à partager. Il évite d’inclure des personnes, documents confidentiels ou informations sans rapport avec l’intervention.</p></section>
      <section><h2>7. Suspension et disponibilité</h2><p>L’accès peut être suspendu en cas d’usage frauduleux, de contenu illicite, d’attaque du service ou de non-respect de ces conditions. Des interruptions temporaires peuvent survenir pour maintenance, sécurité ou événement extérieur raisonnablement incontrôlable.</p></section>
      <section><h2>8. Droit applicable et contact</h2><p>Ces conditions sont soumises au droit de Côte d’Ivoire. Les parties recherchent d’abord une solution amiable. Pour toute question, réclamation ou demande relative aux données, contactez RisoExpert au <a href="tel:+2250777808051">+225 07 77 80 80 51</a> ou par <a href="https://wa.me/2250777808051">WhatsApp</a>.</p></section>
      <p className="legalNote">RisoExpert est un service technique indépendant. RISO est une marque appartenant à son propriétaire respectif.</p>
    </main>
  );
}

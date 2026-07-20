import "./legal.css";

export const metadata = {
  title: "Politique de confidentialité | RISO ASSIST PRO",
  description: "Comment RISO ASSIST PRO protège les données de ses clients.",
};

export default function PrivacyPage() {
  return (
    <main className="legal shell">
      <a className="legalBack" href="/">← Retour à l’accueil</a>
      <p className="eyebrow">Vos données</p>
      <h1>Politique de confidentialité</h1>
      <p className="lead">Dernière mise à jour : 20 juillet 2026.</p>
      <section><h2>Données collectées</h2><p>Nous traitons les informations nécessaires à votre compte et à une intervention : identité, coordonnées, machines enregistrées, demandes, messages, photos de panne, devis, factures et avis. Les données techniques de notification peuvent aussi être enregistrées.</p></section>
      <section><h2>Utilisation et conservation</h2><p>Ces données servent à diagnostiquer les pannes, organiser les rendez-vous, communiquer avec vous, établir les documents commerciaux et sécuriser le service. Elles ne sont ni vendues ni utilisées pour une publicité extérieure. Elles sont conservées pendant la relation client puis la durée nécessaire aux obligations comptables, légales ou de défense des droits.</p></section>
      <section><h2>Protection et destinataires</h2><p>L’accès est limité au client concerné et au technicien autorisé. L’hébergement applicatif s’appuie sur Supabase et les notifications sur Firebase. Des contrôles d’accès, des liens temporaires pour les photos et des communications chiffrées sont utilisés.</p></section>
      <section><h2>Vos droits</h2><p>Vous pouvez demander l’accès ou la rectification de vos données. La suppression définitive du compte est disponible directement dans la rubrique Profil de l’application ; les éléments strictement nécessaires aux obligations légales sont alors anonymisés. Vous pouvez aussi contacter RISO ASSIST PRO au <a href="tel:+2250777808051">+225 07 77 80 80 51</a> ou par <a href="https://wa.me/2250777808051">WhatsApp</a>.</p></section>
      <p className="legalNote">RISO ASSIST PRO est un service technique indépendant basé à Ebimpé, Côte d’Ivoire.</p>
    </main>
  );
}

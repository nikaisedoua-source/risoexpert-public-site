import "./legal.css";

export const metadata = {
  title: "Politique de confidentialité | RisoExpert",
  description: "Comment RisoExpert protège les données de ses clients.",
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
      <section><h2>Base légale et consentement</h2><p>Lorsque vous créez un compte ou envoyez une demande, vous acceptez explicitement le traitement des informations nécessaires à l’exécution du service. La version des documents acceptés et la date du consentement peuvent être conservées afin de démontrer votre accord. Vous pouvez retirer votre consentement pour les traitements qui ne sont pas indispensables à une obligation légale ou à l’exécution d’une intervention en nous contactant.</p></section>
      <section><h2>Protection et destinataires</h2><p>L’accès est limité au client concerné, au technicien autorisé et aux prestataires indispensables au fonctionnement du service. L’hébergement applicatif s’appuie sur Supabase, les notifications sur Firebase et le formulaire en ligne peut transmettre votre demande à WhatsApp lorsque vous choisissez ce canal. Des contrôles d’accès, des liens temporaires pour les photos et des communications chiffrées sont utilisés.</p></section>
      <section><h2>Incident de sécurité</h2><p>Aucun service numérique ne peut garantir un risque nul. En cas d’accès non autorisé, de perte ou de divulgation, RisoExpert prendra les mesures raisonnables pour limiter les conséquences, sécuriser le service et effectuer les notifications requises par la réglementation applicable. Cette information ne supprime pas les droits légaux des utilisateurs ni les obligations de sécurité de RisoExpert.</p></section>
      <section><h2>Statistiques de fréquentation</h2><p>Le site comptabilise une visite par navigateur et par jour. La ville et le pays approximatifs sont fournis par l’hébergeur ou par le service de géolocalisation IPWhois. Seuls la ville, le pays, des coordonnées approximatives et un total sont transmis à RisoExpert et conservés sous forme agrégée. RisoExpert n’enregistre ni l’adresse IP ni une position GPS précise dans le compteur public.</p></section>
      <section><h2>Vos droits</h2><p>Vous pouvez demander l’accès ou la rectification de vos données. La suppression définitive du compte est disponible directement dans la rubrique Profil de l’application ; les éléments strictement nécessaires aux obligations légales sont alors anonymisés. Vous pouvez aussi contacter RisoExpert au <a href="tel:+2250777808051">+225 07 77 80 80 51</a> ou par <a href="https://wa.me/2250777808051">WhatsApp</a>.</p></section>
      <p className="legalNote">Cette politique est établie en référence à la loi ivoirienne n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel. RisoExpert est un service technique indépendant basé à Ebimpé, Côte d’Ivoire.</p>
    </main>
  );
}

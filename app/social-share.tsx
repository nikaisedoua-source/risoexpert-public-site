"use client";

const site = "https://risoexpert.odoo.com";
const message = "RisoExpert — dépannage et maintenance RISO en Côte d’Ivoire et au Cameroun";

export default function SocialShare() {
  const links = [
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(site)}`],
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(site)}`],
    ["X", `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(site)}`],
    ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(`${message} ${site}`)}`],
  ];
  return <section className="socialShare" aria-label="Partager RisoExpert">
    <div><p className="kicker">Faire connaître RisoExpert</p><h2>Partagez l’expertise RISO autour de vous.</h2></div>
    <div className="shareLinks">{links.map(([label, href]) =>
      <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>)}</div>
  </section>;
}

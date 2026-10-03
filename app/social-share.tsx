"use client";

import { SITE_ORIGIN } from "./site-config";

const message = "RisoExpert — L’expertise RISO, à portée de main.";
export default function SocialShare() {
  const site = SITE_ORIGIN + "/";
  const links = [
    ["Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(site)],
    ["LinkedIn", "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(site)],
    ["X", "https://twitter.com/intent/tweet?text=" + encodeURIComponent(message) + "&url=" + encodeURIComponent(site)],
    ["WhatsApp", "https://wa.me/?text=" + encodeURIComponent(message + " " + site)],
    ["Telegram", "https://t.me/share/url?url=" + encodeURIComponent(site) + "&text=" + encodeURIComponent(message)],
  ];
  return <section className="rx-share-wrap" aria-label="Partager RisoExpert"><h3>Partager le site officiel</h3><div>{links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>)}</div></section>;
}

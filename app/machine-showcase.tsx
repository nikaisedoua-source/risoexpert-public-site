"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const machines = [
  { model: "RISOGRAPH SF9350 EII", type: "Duplicopieur monochrome A3", image: "/machines/sf9350.jpg", alt: "Duplicopieur RISO SF9350 EII", facts: ["150 pages/min", "600 × 600 dpi", "Master + tambour"], text: "Idéal pour les écoles, administrations, associations et ateliers qui impriment de gros volumes.", checks: ["Vérifier format, sens et état du papier", "Noter le message exact affiché", "Ne jamais forcer un bourrage inaccessible"], care: ["Vitre et scanner propres", "Poussière retirée des zones accessibles", "Masters et encres protégés de la chaleur"], consumables: "Master SF EII • Encre RISO • Tambour compatible", source: "https://www.riso.com/download/manual/sfeii/UsersGuide_RISO%20SF9x50EII_ENG.pdf" },
  { model: "RISOGRAPH MH9350", type: "Deux couleurs en un passage", image: "/machines/mh9350.png", alt: "Duplicopieur bicolore RISO MH9350", facts: ["150 pages/min", "600 × 600 dpi", "Papier 46–210 g/m²"], text: "Conçu pour les documents pédagogiques, formulaires et supports bicolores.", checks: ["Identifier le tambour concerné", "Contrôler les guides papier", "Comparer le défaut en mono et bicolore"], care: ["Protéger les tambours sortis", "Nettoyer uniquement les surfaces prévues", "Faire contrôler tout décalage des couleurs"], consumables: "Masters MH • Encres couleur RISO • Tambours 1 et 2", source: "https://www.riso.com/download/manual/mh/UsersGuide_RISO%20MH_ENG.pdf" },
  { model: "ComColor FT5430", type: "Jet d’encre couleur haute vitesse", image: "/machines/ft5430.jpg", alt: "Imprimante jet d’encre couleur RISO ComColor FT5430", facts: ["140 pages/min", "Encres CMJN", "Scanner en option"], text: "Une solution A3 rapide pour les documents couleur du quotidien.", checks: ["Lire le code complet S, W ou X", "Vérifier format et guides du bac", "Redémarrer seulement si le message le demande"], care: ["Nettoyer les vitres du scanner", "Utiliser le nettoyage de tête intégré", "Ne jamais ouvrir le circuit d’encre"], consumables: "Noir • Cyan • Magenta • Jaune", source: "https://www.riso.com/download/manual/ft/FT_TroubleshootingGuide_ENG.pdf" },
  { model: "VALEZUS T2200", type: "Presse jet d’encre de production", image: "/machines/t2200.jpg", alt: "Presse jet d’encre de production RISO VALEZUS T2200", facts: ["330 ipm A4 recto verso", "CMJN + gris", "8 000 feuilles"], text: "Pensée pour les volumes intensifs et les flux transactionnels.", checks: ["Consigner code, module et travail actif", "Contrôler magasins et empileurs accessibles", "Ne pas relancer en boucle une erreur système"], care: ["Respecter le plan de maintenance", "Local entre 15 et 30 °C", "Modules internes réservés au technicien"], consumables: "Noir • Cyan • Magenta • Jaune • Gris", source: "https://us.riso.com/products/comcolor-inkjet-printers/valezus-series/valezus-t2200/" },
];

export default function MachineShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % machines.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused]);
  const select = (index: number) => setActive((index + machines.length) % machines.length);
  const machine = machines[active];
  return (
    <section className="machineSection" id="machines" aria-labelledby="machines-title">
      <div className="shell">
        <div className="machineHeading"><div><p className="kicker gold">Machines prises en charge</p><h2 id="machines-title">Une expertise adaptée à chaque technologie RISO.</h2></div><p>Découvrez les principales familles de machines accompagnées par RisoExpert. Les modèles apparentés peuvent également être diagnostiqués.</p></div>
        <div className="machineStage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <div className="machineVisual" key={`visual-${active}`}><span className="machineOrbit" aria-hidden="true"/><span className="machineScan" aria-hidden="true"/><Image unoptimized src={machine.image} alt={machine.alt} width={900} height={650} sizes="(max-width: 950px) 100vw, 55vw"/><span className="machineCount">{String(active + 1).padStart(2, "0")} / {String(machines.length).padStart(2, "0")}</span></div>
          <article className="machineCopy" key={`copy-${active}`} aria-live="polite"><p>{machine.type}</p><h3>{machine.model}</h3><div className="machineFacts">{machine.facts.map((fact) => <span key={fact}>{fact}</span>)}</div><p className="machineDescription">{machine.text}</p><details className="technicalDetails"><summary>Voir le guide technique essentiel</summary><div className="technicalGrid"><div><b>Contrôles sûrs</b><ul>{machine.checks.map((item) => <li key={item}>{item}</li>)}</ul></div><div><b>Entretien préventif</b><ul>{machine.care.map((item) => <li key={item}>{item}</li>)}</ul></div></div><p><b>Consommables :</b> {machine.consumables}</p><a href={machine.source} target="_blank" rel="noreferrer">Source officielle RISO ↗</a></details><a className="machineCta" href="#demande">Demander une intervention sur ce modèle <b>→</b></a></article>
          <button className="machineArrow previous" type="button" onClick={() => select(active - 1)} aria-label="Machine précédente">←</button><button className="machineArrow next" type="button" onClick={() => select(active + 1)} aria-label="Machine suivante">→</button>
        </div>
        <div className="machineTabs" aria-label="Choisir une machine">{machines.map((item, index) => <button type="button" key={item.model} className={index === active ? "active" : ""} onClick={() => select(index)} aria-current={index === active ? "true" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{item.model}</button>)}</div>
        <p className="machineNote">Synthèses issues des guides officiels RISO. Configuration selon le pays et les options installées. Coupez l’alimentation et appelez un technicien avant toute intervention interne.</p>
      </div>
    </section>
  );
}

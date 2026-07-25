"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const machines = [
  { model: "RISOGRAPH SF9350 EII", type: "Duplicopieur monochrome A3", image: "/machines/sf9350.jpg", alt: "Duplicopieur RISO SF9350 EII", facts: ["150 pages/min", "600 × 600 dpi", "Bac 1 000 feuilles"], text: "Idéal pour les écoles, administrations, associations et ateliers qui impriment de gros volumes. Diagnostic des bourrages, défauts d’impression, tambour, master, alimentation papier et capteurs." },
  { model: "RISOGRAPH MH9350", type: "Deux couleurs en un passage", image: "/machines/mh9350.png", alt: "Duplicopieur bicolore RISO MH9350", facts: ["150 pages/min", "600 × 600 dpi", "Format A3"], text: "Conçu pour les documents pédagogiques, formulaires et supports bicolores. Assistance sur le calage, les tambours, les masters, l’alimentation et la qualité des aplats." },
  { model: "ComColor FT5430", type: "Jet d’encre couleur haute vitesse", image: "/machines/ft5430.jpg", alt: "Imprimante jet d’encre couleur RISO ComColor FT5430", facts: ["140 pages/min", "Couleur CMJN", "3 bacs papier"], text: "Une solution A3 rapide pour les documents couleur du quotidien. Maintenance de l’alimentation, de la qualité d’image, du scanner, des contrôleurs et de la connexion réseau." },
  { model: "VALEZUS T2200", type: "Presse jet d’encre de production", image: "/machines/t2200.jpg", alt: "Presse jet d’encre de production RISO VALEZUS T2200", facts: ["330 pages/min recto verso", "5 couleurs", "Flux continu"], text: "Pensée pour les volumes intensifs et les flux transactionnels. Diagnostic de la motorisation, de l’alimentation, de l’empilage, du contrôle image et de l’environnement réseau." },
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
          <div className="machineVisual" key={`visual-${active}`}><span className="machineOrbit" aria-hidden="true"/><span className="machineScan" aria-hidden="true"/><Image src={machine.image} alt={machine.alt} width={900} height={650} sizes="(max-width: 950px) 100vw, 55vw"/><span className="machineCount">{String(active + 1).padStart(2, "0")} / {String(machines.length).padStart(2, "0")}</span></div>
          <article className="machineCopy" key={`copy-${active}`} aria-live="polite"><p>{machine.type}</p><h3>{machine.model}</h3><div className="machineFacts">{machine.facts.map((fact) => <span key={fact}>{fact}</span>)}</div><p className="machineDescription">{machine.text}</p><a className="machineCta" href="#demande">Demander une intervention sur ce modèle <b>→</b></a></article>
          <button className="machineArrow previous" type="button" onClick={() => select(active - 1)} aria-label="Machine précédente">←</button><button className="machineArrow next" type="button" onClick={() => select(active + 1)} aria-label="Machine suivante">→</button>
        </div>
        <div className="machineTabs" aria-label="Choisir une machine">{machines.map((item, index) => <button type="button" key={item.model} className={index === active ? "active" : ""} onClick={() => select(index)} aria-current={index === active ? "true" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{item.model}</button>)}</div>
        <p className="machineNote">Caractéristiques issues des données constructeurs. Configuration selon le pays et les options installées.</p>
      </div>
    </section>
  );
}

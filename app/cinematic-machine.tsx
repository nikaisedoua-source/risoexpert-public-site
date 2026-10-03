"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const models = [
  { name: "MH9350", label: "Duplicopieur bicolore", image: "/machines/mh9350.png", number: "01", family: "RISOGRAPH" },
  { name: "SF9350", label: "Duplicopieur monochrome", image: "/machines/sf9350.jpg", number: "02", family: "RISOGRAPH" },
  { name: "FT5430", label: "Impression couleur haute vitesse", image: "/machines/ft5430.jpg", number: "03", family: "COMCOLOR" },
];

export default function CinematicMachine() {
  const [selected, setSelected] = useState(0);
  const [motion, setMotion] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  const model = models[selected];
  return <div className={"rx-machine-theater" + (motion ? "" : " rx-motion-paused")}>
    <div className="rx-theater-orbit rx-orbit-one" aria-hidden="true"/><div className="rx-theater-orbit rx-orbit-two" aria-hidden="true"/><div className="rx-theater-orbit rx-orbit-three" aria-hidden="true"/>
    <div className="rx-theater-top"><span>RISO / {model.family}</span><button type="button" onClick={() => setMotion(value => !value)} aria-pressed={motion} aria-label={motion ? "Mettre les animations en pause" : "Activer les animations"}>{motion ? "Ⅱ" : "▶"}</button></div>
    <div className={"rx-theater-product" + (selected === 0 ? " rx-transparent-product" : "")} key={model.name}><span className="rx-product-name" aria-hidden="true">{model.name}</span><Image src={model.image} alt={model.family + " " + model.name + " — " + model.label} width={900} height={720} unoptimized priority={selected === 0} sizes="(max-width: 850px) 92vw, 48vw"/><div className="rx-product-scan" aria-hidden="true"/></div>
    <div className="rx-theater-caption"><div><span>EXPERTISE MACHINE</span><strong>{model.label}</strong></div><a href="#machines" aria-label={"Explorer les machines RISO, dont le " + model.name}>Découvrir</a></div>
    <div className="rx-model-controls" aria-label="Choisir une machine à découvrir">{models.map((item, index) => <button type="button" key={item.name} aria-pressed={index === selected} onClick={() => setSelected(index)}><span>{item.number}</span>{item.name}</button>)}</div>
    <div className="rx-orbit-label" aria-hidden="true">PRECISION / RISOEXPERT</div>
  </div>;
}

"use client";

import { useMemo, useState } from "react";

const families = [
  { name: "VALEZUS — presses de production", status: "Actuel", models: ["T2200", "T1200", "T2100"] },
  { name: "ComColor GN", status: "Nouveau", models: ["GN9830", "GN7630"] },
  { name: "ComColor GL", status: "Actuel", models: ["GL9730", "GL7430", "GL9730R", "GL7430R"] },
  { name: "ComColor FT / FT EII", status: "Actuel", models: ["FT5430", "FT5231", "FT5230", "FT5000", "FT2430", "FT1430", "FT5430R", "FT5231R", "FT5230R", "FT5000R", "FT1430R", "FT5430 EII", "FT5231 EII", "FT5230 EII", "FT5000 EII", "FT2430 EII", "Black FT1430 EII"] },
  { name: "RISOGRAPH MH / MF", status: "Actuel", models: ["MH9450", "MH9350", "MF9450", "MF9350"] },
  { name: "RISOGRAPH SF / SF EII", status: "Actuel", models: ["SF9490", "SF9450", "SF9390", "SF9350", "SF5450", "SF5350", "SF5250", "SF5130", "variantes EII, EIIU et EIIAG"] },
  { name: "RISO CV", status: "Actuel", models: ["CV1200", "CV3 Series", "CV18x5 Series"] },
  { name: "ComColor GD", status: "Historique", models: ["GD9630", "GD9631", "GD7330"] },
  { name: "ComColor FW", status: "Historique", models: ["FW5230", "FW5231", "FW5000", "FW2230", "FW1230"] },
  { name: "ComColor / HC", status: "Historique", models: ["X1 Series", "9150", "7150", "3150", "3110", "9050", "7050", "7010", "3050", "3010", "HC5500", "HC5000"] },
  { name: "RISOGRAPH ME / SE", status: "Historique", models: ["ME9450", "ME9350", "SE9480", "SE Series"] },
  { name: "RISOGRAPH MZ / MV", status: "Historique", models: ["MZ1090", "MZ990", "MZ790", "MZ10 Series", "MZ9 Series", "MZ8 Series", "MZ7 Series", "MV9791", "MV7791", "MV97 Series", "MV77 Series", "MV7 Series"] },
  { name: "RISOGRAPH RZ / RV", status: "Historique", models: ["RZ1090", "RZ990", "RZ590", "RZ390", "RZ310", "RZ220", "RZ10 Series", "RZ9 Series", "RZ5 Series", "RZ3 Series", "RZ2 Series", "RV969x", "RV97x0", "RV97x1", "RV5 Series", "RV3 Series", "RV2 Series"] },
  { name: "RISOGRAPH EZ / ES", status: "Historique", models: ["EZ591", "EZ391", "EZ221", "EZ5x1 Series", "EZ3x1 Series", "EZ2x1 Series", "ES5xx1 Series", "ES3xx1 Series", "ES2xx1 Series"] },
  { name: "RISOGRAPH RP / RN", status: "Historique", models: ["RP3790", "RP3700", "RP3505", "RP3105", "RN2530", "RN2130", "RN2030", "RN2000"] },
  { name: "RISOGRAPH GR / FR", status: "Historique", models: ["GR1700", "GR1750", "GR2710", "GR2750", "GR3710", "GR3750", "GR3770", "FR2950", "FR2950a", "FR3910", "FR3950", "FR3950a"] },
  { name: "RISOGRAPH RA / RG / RC", status: "Historique", models: ["RA4200", "RA4900", "RA5900", "RC4500", "RC5600", "RC6300", "RG Series"] },
  { name: "RISOGRAPH CR / TR", status: "Historique", models: ["CR1610", "CR1630", "TR1510", "TR1530"] },
  { name: "Autres duplicopieurs", status: "Historique", models: ["A2 Series", "KZ Series", "CZ Series", "EV Series", "RE Series reconditionnée"] },
  { name: "Fabrication d’écrans", status: "Spécialisé", models: ["GOCCOPRO 100", "GOCCOPRO QS200", "GOCCOPRO QS2536", "MiScreen a4"] },
];

export default function ModelCatalog() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return families;
    return families
      .map((family) => ({
        ...family,
        models: family.models.filter((model) =>
          `${family.name} ${model}`.toLowerCase().includes(term),
        ),
      }))
      .filter((family) => family.models.length > 0);
  }, [query]);
  const total = families.reduce((count, family) => count + family.models.length, 0);

  return (
    <section className="catalogSection" id="catalogue" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="catalogHeading">
          <div><p className="kicker">Catalogue technique</p><h2 id="catalog-title">Les modèles RISO, actuels et historiques.</h2></div>
          <p>{total} références et familles documentées, classées pour identifier rapidement une machine et préparer son diagnostic.</p>
        </div>
        <label className="catalogSearch">
          <span>Rechercher un modèle</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. SF9350, FT5430, RZ990…" type="search" />
        </label>
        <div className="catalogGrid">
          {filtered.map((family) => (
            <article className="catalogFamily" key={family.name}>
              <div><h3>{family.name}</h3><span>{family.status}</span></div>
              <ul>{family.models.map((model) => <li key={model}>RISO {model}</li>)}</ul>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <p className="catalogEmpty">Aucun modèle trouvé. Vérifiez la référence ou envoyez une photo de la plaque signalétique.</p>}
        <p className="catalogNote">Les suffixes et caractéristiques peuvent varier selon le pays, l’alimentation électrique et les options installées.</p>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";

type Location = { city: string; country: string; latitude: number | null; longitude: number | null; visits: number };
type VisitData = { total: number; locations: Location[] };

export default function VisitorInsights() {
  const [data, setData] = useState<VisitData | null>(null);

  useEffect(() => {
    fetch("/api/visits", { method: "POST" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setData)
      .catch(() => setData({ total: 0, locations: [] }));
  }, []);

  const map = useMemo(() => {
    const projection = geoMercator().center([-5.5, 7.5]).scale(1850).translate([300, 225]);
    const path = geoPath(projection);
    const countries = feature(world as never, (world as never as { objects: { countries: never } }).objects.countries) as unknown as { features: Array<never> };
    return { projection, paths: countries.features.map((country, index) => ({ index, d: path(country) ?? "" })) };
  }, []);

  const locations = data?.locations ?? [];
  const max = Math.max(1, ...locations.map((item) => item.visits));

  return (
    <section className="insights" id="visiteurs">
      <div className="shell">
        <div className="insightsHeading">
          <div><p className="kicker gold">Présence en temps réel</p><h2>Une assistance suivie partout où vous travaillez.</h2></div>
          <div className="visitTotal"><strong>{data ? data.total.toLocaleString("fr-FR") : "—"}</strong><span>visites enregistrées</span></div>
        </div>
        <div className="insightsGrid">
          <div className="mapPanel" aria-label="Carte des villes d’origine des visiteurs">
            <svg viewBox="0 0 600 450" role="img" aria-label="Carte de l’Afrique de l’Ouest avec les villes des visiteurs">
              <g className="countries">{map.paths.map((item) => <path key={item.index} d={item.d} />)}</g>
              {locations.map((item) => {
                if (item.latitude == null || item.longitude == null) return null;
                const point = map.projection([item.longitude, item.latitude]);
                if (!point) return null;
                const radius = 6 + Math.sqrt(item.visits / max) * 13;
                return <g key={`${item.country}-${item.city}`} className="mapPoint" transform={`translate(${point[0]} ${point[1]})`}><circle r={radius} /><circle r="3" /><title>{item.city} : {item.visits} visite{item.visits > 1 ? "s" : ""}</title></g>;
              })}
            </svg>
            <span className="mapCaption">Origine approximative par ville — aucune adresse IP conservée</span>
          </div>
          <div className="cityChart" aria-label="Nombre de visites par ville">
            <h3>Visites par ville</h3>
            {locations.length === 0 ? <p className="emptyData">Les premières visites apparaîtront ici.</p> : locations.slice(0, 7).map((item) => (
              <div className="cityRow" key={`${item.country}-${item.city}`}>
                <div><span>{item.city}</span><strong>{item.visits}</strong></div>
                <div className="bar"><i style={{ width: `${Math.max(8, item.visits / max * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

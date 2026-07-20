"use client";

import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";

type Location = { city: string; country: string; latitude: number | null; longitude: number | null; visits: number };
type VisitData = { total: number; locations: Location[] };

function countryFlag(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "🌍";
  return String.fromCodePoint(...[...normalized].map((letter) => 127397 + letter.charCodeAt(0)));
}

export default function VisitorInsights() {
  const [data, setData] = useState<VisitData | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () => fetch("/api/visits")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((snapshot) => { if (active) setData(snapshot); })
      .catch(() => undefined);
    const today = new Date().toISOString().slice(0, 10);
    const locate = localStorage.getItem("risoexpert_geo_day") === today
      ? Promise.resolve({})
      : fetch("https://ipwho.is/?fields=success,city,country_code,latitude,longitude&lang=fr")
          .then((response) => response.ok ? response.json() : {})
          .then((location) => {
            localStorage.setItem("risoexpert_geo_day", today);
            return location?.success ? {
              city: location.city,
              country: location.country_code,
              latitude: location.latitude,
              longitude: location.longitude,
            } : {};
          })
          .catch(() => ({}));
    locate.then((location) => fetch("/api/visits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(location),
    }))
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((snapshot) => { if (active) setData(snapshot); })
      .catch(() => setData({ total: 0, locations: [] }));
    const timer = window.setInterval(refresh, 60_000);
    return () => { active = false; window.clearInterval(timer); };
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
                const placeLabelLeft = point[0] > 475;
                return <g key={`${item.country}-${item.city}`} className="mapPoint" transform={`translate(${point[0]} ${point[1]})`}>
                  <circle className="pointPulse" r={radius} />
                  <circle className="pointCore" r="4" />
                  <text className="mapLabel" x={placeLabelLeft ? -radius - 6 : radius + 6} y="4" textAnchor={placeLabelLeft ? "end" : "start"}>{countryFlag(item.country)} {item.city}</text>
                  <title>{countryFlag(item.country)} {item.city}, {item.country} : {item.visits} visite{item.visits > 1 ? "s" : ""}</title>
                </g>;
              })}
            </svg>
            <span className="mapCaption">Origine approximative par ville — aucune adresse IP conservée</span>
          </div>
          <div className="cityChart" aria-label="Nombre de visites par ville">
            <h3>Visites par ville</h3>
            {locations.length === 0 ? <p className="emptyData">Les premières visites réelles apparaîtront ici.</p> : locations.slice(0, 10).map((item) => (
              <div className="cityRow" key={`${item.country}-${item.city}`}>
                <div><span><b className="cityFlag" aria-hidden="true">{countryFlag(item.country)}</b>{item.city}</span><strong>{item.visits}</strong></div>
                <div className="bar"><i style={{ width: `${Math.max(8, item.visits / max * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

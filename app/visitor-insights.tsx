"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
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
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [livePosition, setLivePosition] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const watchId = useRef<number | null>(null);
  const resolvedPlace = useRef<{ city: string; country: string } | null>(null);
  const resolvingPlace = useRef(false);

  async function recordLocation(location: { city: string; country: string; latitude: number; longitude: number }) {
    const response = await fetch("/api/visits", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(location),
    });
    if (!response.ok) throw new Error("record-failed");
    setData(await response.json());
  }

  async function locateAndRecord(force = false) {
    setLocating(true);
    setLocationMessage("");
    try {
      const today = new Date().toISOString().slice(0, 10);
      const cached = localStorage.getItem("risoexpert_geo_v2");
      const parsed = cached ? JSON.parse(cached) : null;
      let location = !force && parsed?.day === today ? parsed.location : null;
      if (!location) {
        const geoResponse = await fetch("https://ipwho.is/?fields=success,city,country_code,latitude,longitude&lang=fr");
        const geo = geoResponse.ok ? await geoResponse.json() : null;
        if (!geo?.success || !geo.city || !geo.country_code) throw new Error("location-unavailable");
        location = { city: geo.city, country: geo.country_code, latitude: geo.latitude, longitude: geo.longitude };
        localStorage.setItem("risoexpert_geo_v2", JSON.stringify({ day: today, location }));
      }
      await recordLocation(location);
      setLocationMessage(`${countryFlag(location.country)} ${location.city} a été localisée.`);
    } catch {
      setLocationMessage("La ville n’a pas pu être détectée. Réessayez dans quelques instants.");
    } finally {
      setLocating(false);
    }
  }

  function toggleLivePosition() {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setLocationMessage("Suivi GPS arrêté.");
      return;
    }
    if (!navigator.geolocation) return setLocationMessage("Le GPS n’est pas disponible sur cet appareil.");
    setLocating(true);
    setLocationMessage("Recherche du signal GPS…");
    watchId.current = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        setLivePosition({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy });
        setLocating(false);
        if (!resolvedPlace.current && !resolvingPlace.current) {
          resolvingPlace.current = true;
          const response = await fetch("/api/reverse-geocode", {
            method: "POST", headers: { "content-type": "application/json" },
            body: JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude }),
          }).catch(() => null);
          const place = response?.ok ? await response.json() as { city?: string; country?: string } : null;
          if (place?.city) resolvedPlace.current = { city: place.city, country: place.country || "CI" };
          resolvingPlace.current = false;
        }
        const place = resolvedPlace.current;
        setLocationMessage(`${place?.city ? `${place.city} — ` : ""}position GPS en direct, précision ±${Math.round(coords.accuracy)} m.`);
        recordLocation({
          city: place?.city || "Position GPS", country: place?.country || "CI",
          latitude: coords.latitude, longitude: coords.longitude,
        }).catch(() => undefined);
      },
      () => { setLocating(false); setLocationMessage("Autorisez la localisation précise dans votre navigateur, puis réessayez."); },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 20000 },
    );
  }

  useEffect(() => {
    let active = true;
    const refresh = () => fetch("/api/visits")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((snapshot) => { if (active) setData(snapshot); })
      .catch(() => undefined);
    locateAndRecord().catch(() => undefined);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      active = false; window.clearInterval(timer);
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const map = useMemo(() => {
    const countries = feature(world as never, (world as never as { objects: { countries: never } }).objects.countries) as unknown as { features: Array<never> };
    const projection = geoNaturalEarth1().fitExtent([[18, 18], [582, 432]], countries as never);
    const path = geoPath(projection);
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
              {livePosition && (() => {
                const point = map.projection([livePosition.longitude, livePosition.latitude]);
                return point ? <g className="livePoint" transform={`translate(${point[0]} ${point[1]})`}>
                  <circle className="liveAccuracy" r={Math.max(10, Math.min(35, livePosition.accuracy / 80))} />
                  <circle className="liveCore" r="6" />
                  <text className="mapLabel" x="14" y="4">Vous êtes ici</text>
                </g> : null;
              })()}
            </svg>
            <span className="mapCaption">Le point bleu suit votre GPS avec votre autorisation. Ville fournie par © OpenStreetMap ; statistiques publiques regroupées par ville.</span>
            <div className="locationAction">
              <button type="button" onClick={toggleLivePosition}>{watchId.current !== null ? "Arrêter le suivi GPS" : locating ? "Détection en cours…" : "Activer ma position en direct"}</button>
              <button className="secondaryLocation" type="button" onClick={() => locateAndRecord(true)} disabled={locating}>Détecter ma ville</button>
              {locationMessage && <span role="status">{locationMessage}</span>}
            </div>
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

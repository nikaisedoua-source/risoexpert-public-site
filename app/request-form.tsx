"use client";

import { FormEvent, useState } from "react";
import { currentSupabaseAccessToken } from "./supabase-browser";

export default function RequestForm() {
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState("");

  function locate() {
    if (!navigator.geolocation) return setGeoStatus("GPS non disponible sur cet appareil.");
    setGeoStatus("Localisation GPS en cours…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
        setGeoStatus(`Position GPS ajoutée (précision ±${Math.round(coords.accuracy)} m).`);
      },
      () => setGeoStatus("Position non autorisée. Vous pouvez saisir la commune manuellement."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    setReference("");
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const accessToken = await currentSupabaseAccessToken();
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ ...payload, ...coordinates, legalConsent: data.get("legalConsent") === "on" }),
      });
      const result = await response.json() as { id?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error || "Enregistrement impossible.");
      setReference(result.id);
      event.currentTarget.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Une erreur est survenue. Réessayez.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="requestForm" onSubmit={submit}>
      <label className="honeypot" aria-hidden="true">
        Site web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="formGrid">
        <label>Nom complet<input name="name" autoComplete="name" required /></label>
        <label>Téléphone<input name="phone" type="tel" autoComplete="tel" required /></label>
        <label>Ville ou commune<input name="location" autoComplete="address-level2" required /></label>
        <label>Machine et modèle<input name="machine" placeholder="Ex. RISO SF 9350" required /></label>
        <label>Urgence<select name="urgency" defaultValue="Normale"><option>Normale</option><option>Élevée</option><option>Critique — production arrêtée</option></select></label>
        <label>Message d’erreur<input name="error" placeholder="Code ou message affiché" /></label>
      </div>
      <div className="geoField"><button type="button" onClick={locate}>Utiliser ma position GPS</button>{geoStatus && <span role="status">{geoStatus}</span>}</div>
      <label>Expliquez précisément le problème<textarea name="problem" rows={5} minLength={10} required placeholder="Depuis quand, bruit observé, qualité d’impression, actions déjà tentées…" /></label>
      <p className="formHelp">La demande est enregistrée directement et transmise au technicien. WhatsApp n’est pas nécessaire.</p>
      <label className="consentField">
        <input name="legalConsent" type="checkbox" required />
        <span>J’ai lu et j’accepte les <a href="/conditions" target="_blank">Conditions d’utilisation</a> et la <a href="/confidentialite" target="_blank">Politique de confidentialité</a>. Je consens au traitement de mes informations pour gérer ma demande de dépannage.</span>
      </label>
      <button className="primary formSubmit" type="submit" disabled={sending}>{sending ? "Enregistrement…" : "Enregistrer ma demande"}</button>
      {reference && <p className="formSuccess" role="status">Demande enregistrée. Votre numéro de dossier : <strong>{reference}</strong>.</p>}
      {error && <p className="formError" role="alert">{error}</p>}
    </form>
  );
}

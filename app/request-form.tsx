"use client";

import { FormEvent, useState } from "react";
import { currentSupabaseAccessToken } from "./supabase-browser";

export default function RequestForm() {
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
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
        body: JSON.stringify({ ...payload, legalConsent: data.get("legalConsent") === "on" }),
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
      </div>
      <label>Décrivez brièvement le problème<textarea name="problem" rows={4} minLength={10} required placeholder="Code d’erreur, bruit, qualité d’impression ou production arrêtée…" /></label>
      <p className="formHelp">Formulaire court, sans localisation GPS. Votre demande reçoit un numéro de dossier.</p>
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

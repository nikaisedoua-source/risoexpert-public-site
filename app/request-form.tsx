"use client";

import { FormEvent, useState } from "react";

export default function RequestForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      "Bonjour, je souhaite demander un dépannage RISO.",
      `Nom : ${data.get("name")}`,
      `Téléphone : ${data.get("phone")}`,
      `Ville / commune : ${data.get("location")}`,
      `Machine / modèle : ${data.get("machine")}`,
      `Urgence : ${data.get("urgency")}`,
      `Problème : ${data.get("problem")}`,
      `Message d’erreur : ${data.get("error") || "Non renseigné"}`,
    ];
    setSent(true);
    window.open(
      `https://wa.me/2250777808051?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form className="requestForm" onSubmit={submit}>
      <div className="formGrid">
        <label>Nom complet<input name="name" autoComplete="name" required /></label>
        <label>Téléphone<input name="phone" type="tel" autoComplete="tel" required /></label>
        <label>Ville ou commune<input name="location" autoComplete="address-level2" required /></label>
        <label>Machine et modèle<input name="machine" placeholder="Ex. RISO SF 9350" required /></label>
        <label>Urgence<select name="urgency" defaultValue="Normale"><option>Normale</option><option>Élevée</option><option>Critique — production arrêtée</option></select></label>
        <label>Message d’erreur<input name="error" placeholder="Code ou message affiché" /></label>
      </div>
      <label>Expliquez précisément le problème<textarea name="problem" rows={5} minLength={10} required placeholder="Depuis quand, bruit observé, qualité d’impression, actions déjà tentées…" /></label>
      <p className="formHelp">Après validation, WhatsApp s’ouvre avec votre demande complète. Vous pourrez y joindre des photos ou une vidéo de la panne.</p>
      <button className="primary formSubmit" type="submit">Envoyer ma demande au technicien</button>
      {sent && <p className="formSuccess" role="status">Votre demande est prête dans WhatsApp. Appuyez sur Envoyer pour la transmettre.</p>}
    </form>
  );
}

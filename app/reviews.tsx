"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { currentSupabaseAccessToken, getSupabaseBrowserClient } from "./supabase-browser";

type Review = {
  id: string;
  authorName: string;
  profilePicture: string;
  country: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Account = { name: string; picture: string } | null;

const countryLabel = (country: string) =>
  country === "CI" ? "🇨🇮 Côte d’Ivoire"
    : country === "CM" ? "🇨🇲 Cameroun"
      : `🌍 ${country}`;

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState<Account>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((response) => response.ok ? response.json() : { reviews: [] })
      .then((data: { reviews?: Review[] }) => setReviews(data.reviews ?? []))
      .catch(() => setReviews([]));
    getSupabaseBrowserClient().then(async (client) => {
      if (client) {
        const { data } = await client.auth.getUser();
        const user = data.user;
        if (user) {
          setAccount({
            name: user.user_metadata.full_name || user.email || "Client",
            picture: user.user_metadata.avatar_url || user.user_metadata.picture || "",
          });
        }
      } else {
        const response = await fetch("/api/auth/session");
        const data = await response.json() as { user?: { name?: string; picture?: string } | null };
        if (data.user) setAccount({ name: data.user.name || "Client", picture: data.user.picture || "" });
      }
    });
  }, []);

  const average = useMemo(
    () => reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0,
    [reviews],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const accessToken = await currentSupabaseAccessToken();
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        country: data.get("country"),
        comment: data.get("comment"),
        website: data.get("website"),
        rating,
      }),
    });
    const result = await response.json().catch(() => ({})) as { review?: Review; error?: string };
    if (response.ok && result.review) {
      setReviews((current) => [result.review!, ...current]);
      setMessage("Merci, votre avis est publié.");
      form.reset();
      setRating(5);
    } else {
      setMessage(result.error || "Publication impossible pour le moment.");
    }
    setSending(false);
  }

  return (
    <section className="reviewsSection" id="avis" aria-labelledby="reviews-title">
      <div className="shell">
        <div className="reviewsHeading">
          <div>
            <p className="kicker">Avis clients</p>
            <h2 id="reviews-title">Votre expérience compte.</h2>
            <p>Attribuez une note et partagez votre retour avec les professionnels des deux pays.</p>
          </div>
          <div className="ratingSummary" aria-label={`${average.toFixed(1)} étoiles sur 5`}>
            <strong>{reviews.length ? average.toFixed(1) : "—"}</strong>
            <div><span>{"★".repeat(Math.round(average))}{"☆".repeat(5 - Math.round(average))}</span><small>{reviews.length} avis</small></div>
          </div>
        </div>

        <div className="reviewsLayout">
          <form className="reviewForm" onSubmit={submit}>
            <h3>Donnez votre avis</h3>
            {!account ? (
              <div className="reviewAccountNotice">
                <strong>Compte obligatoire</strong>
                <span>Connectez-vous avec Google en haut de la page avant de publier.</span>
              </div>
            ) : !account.picture ? (
              <div className="reviewAccountNotice">
                <strong>Photo de profil obligatoire</strong>
                <span>Ajoutez une photo à votre compte Google puis reconnectez-vous.</span>
              </div>
            ) : (
              <div className="reviewIdentity">
                <Image src={account.picture} alt="" width={44} height={44} unoptimized referrerPolicy="no-referrer" />
                <span><small>Avis publié par</small><strong>{account.name}</strong></span>
              </div>
            )}
            <div className="starPicker" role="radiogroup" aria-label="Votre note">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                  className={value <= rating ? "selected" : ""}
                  onClick={() => setRating(value)}
                >★</button>
              ))}
            </div>
            <label>Pays<input name="country" required minLength={2} maxLength={60} placeholder="Ex. Sénégal, France, Canada…" /></label>
            <label>Votre commentaire<textarea name="comment" required minLength={10} maxLength={600} rows={4} placeholder="Qualité du diagnostic, délai, accompagnement…" /></label>
            <label className="reviewTrap" aria-hidden="true">Site<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <button className="primary" disabled={sending || !account?.picture}>{sending ? "Publication…" : "Publier mon avis"}</button>
            {message && <p className="reviewMessage" role="status">{message}</p>}
          </form>

          <div className="reviewList" aria-live="polite">
            {reviews.length === 0 ? (
              <div className="emptyReviews"><span>☆</span><h3>Soyez le premier à laisser un avis</h3><p>Les avis publiés apparaîtront ici.</p></div>
            ) : reviews.map((review) => (
              <article className="reviewCard" key={review.id}>
                <div><Image className="reviewAvatar" src={review.profilePicture} alt="" width={44} height={44} unoptimized referrerPolicy="no-referrer" /><p><strong>{review.authorName}</strong><small>{countryLabel(review.country)} · {new Date(review.createdAt).toLocaleDateString("fr-FR")}</small></p><b>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</b></div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

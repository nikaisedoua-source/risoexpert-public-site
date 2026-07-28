"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Review = {
  id: string;
  authorName: string;
  country: "CI" | "CM";
  rating: number;
  comment: string;
  createdAt: string;
};

const flags = { CI: "🇨🇮", CM: "🇨🇲" };

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((response) => response.ok ? response.json() : { reviews: [] })
      .then((data: { reviews?: Review[] }) => setReviews(data.reviews ?? []))
      .catch(() => setReviews([]));
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
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        authorName: data.get("authorName"),
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
            <label>Votre nom<input name="authorName" required minLength={2} maxLength={60} /></label>
            <label>Pays<select name="country" defaultValue="CI"><option value="CI">🇨🇮 Côte d’Ivoire</option><option value="CM">🇨🇲 Cameroun</option></select></label>
            <label>Votre commentaire<textarea name="comment" required minLength={10} maxLength={600} rows={4} placeholder="Qualité du diagnostic, délai, accompagnement…" /></label>
            <label className="reviewTrap" aria-hidden="true">Site<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <button className="primary" disabled={sending}>{sending ? "Publication…" : "Publier mon avis"}</button>
            {message && <p className="reviewMessage" role="status">{message}</p>}
          </form>

          <div className="reviewList" aria-live="polite">
            {reviews.length === 0 ? (
              <div className="emptyReviews"><span>☆</span><h3>Soyez le premier à laisser un avis</h3><p>Les avis publiés apparaîtront ici.</p></div>
            ) : reviews.map((review) => (
              <article className="reviewCard" key={review.id}>
                <div><span className="reviewAvatar">{review.authorName.charAt(0).toUpperCase()}</span><p><strong>{review.authorName}</strong><small>{flags[review.country]} · {new Date(review.createdAt).toLocaleDateString("fr-FR")}</small></p><b>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</b></div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

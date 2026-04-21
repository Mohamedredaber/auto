import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
function today() {
  return new Date().toISOString().split("T")[0];
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function diffDays(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.max(1, Math.round(ms / 86400000));
}

export default function PricingCard({ car }) {
  const [depart, setDepart] = useState(today());
  const [retour, setRetour] = useState(addDays(today(), 3));

  const days = useMemo(() => diffDays(depart, retour), [depart, retour]);
  const pricePerDay = parseFloat(car?.price_per_day) || 0;
  const subtotal = days * pricePerDay;

  const handleDepart = (e) => {
    setDepart(e.target.value);
    if (e.target.value >= retour) setRetour(addDays(e.target.value, 1));
  };

  return (
    <div className="pricing-card">
      <div className="pricing-card__header">
        <div className="pricing-card__price-row">
          <span className="pricing-card__price">{pricePerDay.toLocaleString("fr-MA")}</span>
          <span className="pricing-card__unit">MAD / jour</span>
        </div>
        <div className="pricing-card__rating">
          <span className="pricing-card__stars">★★★★★</span>
          <span>4.9 (28 avis)</span>
        </div>
      </div>

      {/* Body */}
      <div className="pricing-card__body">
        <div className="pricing-card__dates">
          <div className="pricing-card__date-field">
            <label className="pricing-card__date-label">Départ</label>
            <input
              type="date"
              className="pricing-card__date-input"
              value={depart}
              min={today()}
              onChange={handleDepart}
            />
          </div>
          <div className="pricing-card__date-field">
            <label className="pricing-card__date-label">Retour</label>
            <input
              type="date"
              className="pricing-card__date-input"
              value={retour}
              min={addDays(depart, 1)}
              onChange={(e) => setRetour(e.target.value)}
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="pricing-card__breakdown">
          <div className="pricing-card__breakdown-row">
            <span className="pricing-card__breakdown-label">
              Location ({days} jour{days > 1 ? "s" : ""})
            </span>
            <span className="pricing-card__breakdown-value">
              {subtotal.toLocaleString("fr-MA")} MAD
            </span>
          </div>
          <div className="pricing-card__breakdown-row">
            <span className="pricing-card__breakdown-label">Assurance Premium</span>
            <span className="pricing-card__breakdown-value--free">Gratuit</span>
          </div>
        </div>

        <div className="pricing-card__total-row">
          <span className="pricing-card__total-label">Total</span>
          <span className="pricing-card__total-value">{subtotal.toLocaleString("fr-MA")} MAD</span>
        </div>

           <Link to={`/reserve/${car.id}`} state={{ depart, retour , subtotal ,pricePerDay }} className="pricing-card__cta">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
        Réserver maintenant
      </Link>
            
        
  
        <p className="pricing-card__guarantee">
          Aucun frais caché · Annulation gratuite 24h avant
        </p>
      </div>

      {/* Conditions */}
      <div className="pricing-card__conditions">
        <p className="pricing-card__conditions-title">Conditions de location</p>
        {[
          "Âge minimum : 23 ans",
          "Permis de conduire (min. 2 ans)",
          "Dépôt de garantie : 15 000 MAD",
        ].map((c) => (
          <div className="pricing-card__condition" key={c}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {c}
          </div>
        ))}
        <a className="pricing-card__conditions-link">Consulter les conditions détaillées</a>
      </div>
    </div>
  );
}
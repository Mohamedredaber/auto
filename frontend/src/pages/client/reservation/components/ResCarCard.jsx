/* ResCarCard — fiche voiture côté gauche de la réservation */

const FUEL_LABELS = {
  gasoline: "Essence",
  diesel: "Diesel",
  hybrid: "Hybride",
  electric: "Électrique",
};

export default function ResCarCard({ car }) {
  const coverImage = car?.cover_image?.url || car?.gallery?.[0]?.url || null;
  console.log("Cover Image:", car);
  const agencyName = car?.agency?.agency_name || "—";
  const city = car?.agency?.city || car?.city || null;
  const fuel = FUEL_LABELS[car?.fuel] || car?.fuel || "—";
  const pricePerDay = parseFloat(car?.price_per_day) || 0;

  return (
    <div>
      {/* Car image card */}
      <div className="res-car-card">
        <div className="res-car-card__img-wrap">
          {coverImage ? (
            <img src={coverImage} alt={`${car.brand} ${car.model}`} loading="lazy" />
          ) : (
            <div className="res-car-card__img-placeholder">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
          )}
          <span className="res-car-card__badge">Premium</span>
        </div>

        <div className="res-car-card__body">
          <div className="res-car-card__title-row">
            <div className="res-car-card__name">
              {car.brand} {car.model}
              {car.version && <> {car.version}</>}
            </div>
            <div className="res-car-card__price-col">
              <span className="res-car-card__price-label">Par jour</span>
              <span className="res-car-card__price-value">{pricePerDay.toLocaleString("fr-MA")}</span>
              <span className="res-car-card__price-unit">MAD</span>
            </div>
          </div>

          {city && (
            <div className="res-car-card__location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {city}, Maroc
            </div>
          )}

          <div className="res-car-card__meta">
            <div className="res-car-card__meta-row">
              <span className="res-car-card__meta-key">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Agence
              </span>
              <span className="res-car-card__meta-val">{agencyName}</span>
            </div>
            <div className="res-car-card__meta-row">
              <span className="res-car-card__meta-key">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Assurance
              </span>
              <span className="res-car-card__meta-val">Incluse (Standard)</span>
            </div>
            <div className="res-car-card__meta-row">
              <span className="res-car-card__meta-key">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
                Carburant
              </span>
              <span className="res-car-card__meta-val">{fuel}</span>
            </div>
          </div>

          <div className="res-car-card__note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            Le kilométrage illimité est inclus pour cette location. Politique de carburant : Plein à Plein.
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="res-trust">
        <div className="res-trust__item">
          <div className="res-trust__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="res-trust__label">Paiement Sécurisé</span>
        </div>
        <div className="res-trust__item">
          <div className="res-trust__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span className="res-trust__label">Annulation Gratuite</span>
        </div>
      </div>
    </div>
  );
}
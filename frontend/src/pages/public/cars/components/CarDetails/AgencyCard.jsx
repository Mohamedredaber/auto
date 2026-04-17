import { useCallback } from "react";
import "../../../styles/components/agency-card-details.css";

export default function AgencyCard({ car }) {
  const agency = car?.agency || {};

  const handleContactAgency = useCallback(() => {
    // Logique pour contacter l'agence
    alert(`Contacter ${agency?.name || "l'agence"}`);
  }, [agency]);

  const handleViewProfile = useCallback(() => {
    // Logique pour voir le profil de l'agence
    alert(`Voir le profil de ${agency?.name || "l'agence"}`);
  }, [agency]);

  return (
    <section className="agency-card">
      <h2 className="agency-card__title">Informations sur l'agence</h2>

      <div className="agency-card__container">
        {/* Logo & Info */}
        <div className="agency-card__header">
          <div className="agency-card__logo">
            <div className="agency-card__logo-placeholder">🏢</div>
          </div>

          <div className="agency-card__info">
            <h3 className="agency-card__name">
              {agency?.name || "Atlas Prestige Cars"}
            </h3>
            <div className="agency-card__rating">
              <span className="agency-card__stars">⭐ 4.8</span>
              <span className="agency-card__review-count">
                {agency?.totalReviews || "3 200+"} Commentaires
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="agency-card__details">
          <div className="agency-card__detail-item">
            <span className="agency-card__detail-icon">✓</span>
            <span className="agency-card__detail-text">Agence vérifiée</span>
          </div>
          <div className="agency-card__detail-item">
            <span className="agency-card__detail-icon">💬</span>
            <span className="agency-card__detail-text">Support 24/7</span>
          </div>
          <div className="agency-card__detail-item">
            <span className="agency-card__detail-icon">📄</span>
            <span className="agency-card__detail-text">Paiement sécurisé</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="agency-card__actions">
          <button
            className="agency-card__btn agency-card__btn--contact"
            onClick={handleContactAgency}
          >
            Contacter l'agence
          </button>
          <button
            className="agency-card__btn agency-card__btn--profile"
            onClick={handleViewProfile}
          >
            Voir le profil
          </button>
        </div>

        {/* Location Info */}
        <div className="agency-card__location">
          <p className="agency-card__location-label">📍 Localisation</p>
          <p className="agency-card__location-city">
            {agency?.city || "Casablanca"}, Maroc
          </p>
        </div>
      </div>
    </section>
  );
}

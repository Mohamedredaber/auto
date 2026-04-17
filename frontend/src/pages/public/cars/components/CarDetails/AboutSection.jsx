import "../../../styles/components/about-section-details.css";

export default function AboutSection({ car }) {
  return (
    <section className="about-section">
      <h2 className="about-section__title">À propos de ce véhicule</h2>

      <p className="about-section__description">
        {car?.description ||
          `Découvrez le luxe raffiné et les performances exceptionnelles du ${car?.brand} ${car?.model}.
          Ce SUV combine un design avant-gardiste avec une technologie de pointe, idéal pour
          vos déplacements professionnels ou vos escapades prestigieuses au Maroc.
          Confort inégalé, système audio Meridian et toit panoramique inclus.`}
      </p>

      <div className="about-section__features">
        <div className="about-section__feature">
          <div className="about-section__feature-icon">🛡️</div>
          <div className="about-section__feature-content">
            <h3 className="about-section__feature-title">Protection Totale</h3>
            <p className="about-section__feature-desc">
              L'assurance tous risques est incluse par défaut.
            </p>
          </div>
        </div>

        <div className="about-section__feature">
          <div className="about-section__feature-icon">🔄</div>
          <div className="about-section__feature-content">
            <h3 className="about-section__feature-title">
              Utilisation Flexible
            </h3>
            <p className="about-section__feature-desc">
              Annulation gratuite jusqu'à 48h avant la location.
            </p>
          </div>
        </div>

        <div className="about-section__feature">
          <div className="about-section__feature-icon">🛣️</div>
          <div className="about-section__feature-content">
            <h3 className="about-section__feature-title">
              Kilométrage Illimité
            </h3>
            <p className="about-section__feature-desc">
              Explorez tous les coins du Maroc sans contrainte d'essence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

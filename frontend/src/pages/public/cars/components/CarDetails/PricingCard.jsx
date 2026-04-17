import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/components/pricing-card-details.css";

export default function PricingCard({ car }) {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  // Calcul du nombre de jours
  const calculateDays = () => {
    const start = new Date(selectedDates.start);
    const end = new Date(selectedDates.end);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const days = calculateDays();
  const pricePerDay = Number(car?.price_per_day) || 0;
  const locationPrice = days * pricePerDay;
  const insurancePrice = 300; // À voir avec votre logique
  const total = locationPrice + insurancePrice;

  const handleDateChange = useCallback(
    (field) => (e) => {
      setSelectedDates((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    },
    [],
  );

  const handleReserve = useCallback(() => {
    navigate("/login", {
      state: {
        from: `/cars/${car?.id}`,
        carId: car?.id,
        dates: selectedDates,
      },
    });
  }, [navigate, car?.id, selectedDates]);

  return (
    <div className="pricing-card">
      {/* Header avec prix */}
      <div className="pricing-card__header">
        <div className="pricing-card__price">
          <span className="pricing-card__amount">
            {pricePerDay.toLocaleString("fr-MA")}
          </span>
          <span className="pricing-card__unit">MAD / jour</span>
        </div>
        <div className="pricing-card__rating">
          <span className="pricing-card__stars">⭐ 4.9</span>
          <span className="pricing-card__reviews">(78 avis)</span>
        </div>
      </div>

      {/* Section Dates */}
      <div className="pricing-card__section">
        <div className="pricing-card__date-group">
          <label className="pricing-card__label">
            <span>DÉPART</span>
            <input
              type="date"
              className="pricing-card__input"
              value={selectedDates.start}
              onChange={handleDateChange("start")}
            />
          </label>
        </div>

        <div className="pricing-card__date-group">
          <label className="pricing-card__label">
            <span>RETOUR</span>
            <input
              type="date"
              className="pricing-card__input"
              value={selectedDates.end}
              onChange={handleDateChange("end")}
            />
          </label>
        </div>
      </div>

      {/* Tarification */}
      <div className="pricing-card__breakdown">
        <div className="pricing-card__row">
          <span className="pricing-card__label-row">
            Location ({days} jour{days > 1 ? "s" : ""})
          </span>
          <span className="pricing-card__value-row">
            {locationPrice.toLocaleString("fr-MA")} MAD
          </span>
        </div>
        <div className="pricing-card__row">
          <span className="pricing-card__label-row">Assurance Premium</span>
          <span className="pricing-card__value-row">Gratuit</span>
        </div>
        <div className="pricing-card__divider" />
        <div className="pricing-card__row pricing-card__row--total">
          <span className="pricing-card__label-row">Total</span>
          <span className="pricing-card__total">
            {total.toLocaleString("fr-MA")} MAD
          </span>
        </div>
      </div>

      {/* Bouton Réserver */}
      <button className="pricing-card__btn-reserve" onClick={handleReserve}>
        Réserver maintenant
      </button>

      {/* Note de conditions */}
      <p className="pricing-card__note">
        ASSURANCE/DÉPÔT/ANNULATION/CONDUCTEUR
      </p>

      {/* Conditions */}
      <div className="pricing-card__conditions">
        <div className="pricing-card__condition-item">
          <input type="checkbox" id="age" defaultChecked />
          <label htmlFor="age">Âge minimum : 23 ans</label>
        </div>
        <div className="pricing-card__condition-item">
          <input type="checkbox" id="license" defaultChecked />
          <label htmlFor="license">Permis de conduire (min. 2 ans)</label>
        </div>
        <div className="pricing-card__condition-item">
          <input type="checkbox" id="deposit" defaultChecked />
          <label htmlFor="deposit">Dépôt de garantie : 15 000 MAD</label>
        </div>
      </div>
    </div>
  );
}

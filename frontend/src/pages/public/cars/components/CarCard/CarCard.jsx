import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPinIconCar,
  FuelIcon,
  TransmissionIcon,
  CalendarIconCar,
} from "../../../../../components/layout/icons/index";
import "../../../../../styles/components/carcard.css";

/* ─── Helpers ──────────────────────────────────────── */
const STATUS_MAP = {
  available:   { label: "Disponible",   cls: "badge--available"   },
  rented:      { label: "Loué",         cls: "badge--rented"      },
  maintenance: { label: "Maintenance",  cls: "badge--maintenance" },
};

function StatusBadge({ status }) {
  const { label, cls } = STATUS_MAP[status] ?? { label: status, cls: "" };
  return <span className={`car-badge ${cls}`}>{label}</span>;
}

/* ─── Component ─────────────────────────────────────── */
function CarCard({ car, onReserve }) {
  const navigate = useNavigate();

  const {
    id,
    brand,
    model,
    year,
    price_per_day,
    status,
    fuel,
    transmission,
    seats,
    cover_image,
    city,
  } = car;

  const handleDetails = () => navigate(`/cars/${id}`);

  return (
    <article className="car-card">
      <div className="car-card__image-wrap">
        <img
          src={cover_image}
          alt={`${brand} ${model}`}
          className="car-card__image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/images/default-car.png";
          }}
        />
        <StatusBadge status={status} />
        {year && <span className="car-card__year">{year}</span>}
      </div>

      <div className="car-card__body">
        {/* Titre */}
        <div className="car-card__title-row">
          <div>
            <h3 className="car-card__brand">{brand}</h3>
            <p className="car-card__model">{model}</p>
          </div>
          <div className="car-card__price">
            <span className="car-card__price-amount">
              {Number(price_per_day).toLocaleString("fr-MA")}
            </span>
            <span className="car-card__price-unit">MAD/j</span>
          </div>
        </div>

        {/* Specs */}
        <ul className="car-card__specs">
          {city && (
            <li className="car-card__spec">
              <MapPinIconCar className="car-card__spec-icon" />
              {city}
            </li>
          )}
          {fuel && (
            <li className="car-card__spec">
              <FuelIcon className="car-card__spec-icon" />
              {fuel}
            </li>
          )}
          {transmission && (
            <li className="car-card__spec">
              <TransmissionIcon className="car-card__spec-icon" />
              {transmission}
            </li>
          )}
          {seats && (
            <li className="car-card__spec">
              <CalendarIconCar className="car-card__spec-icon" />
              {seats} places
            </li>
          )}
        </ul>

        <div className="car-card__actions">
          <button
            type="button"
            className="car-card__btn car-card__btn--outline"
            onClick={handleDetails}
          >
            Détails
          </button>
          <button
            type="button"
            className="car-card__btn car-card__btn--primary"
            disabled={status !== "available"}
            onClick={() => onReserve?.(car)}
          >
            Réserver
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(CarCard);
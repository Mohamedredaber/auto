import { memo, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPinIconCar,
  FuelIcon,
  TransmissionIcon,
  CalendarIconCar,
} from "../../../../../components/layout/icons/index";
import { selectIsAuth, selectRole } from "../../../../../features/auth/authSelectors";
import "../../../../../styles/components/carcard.css";

const STATUS_MAP = {
  available:   { label: "Disponible",  cls: "badge--available"   },
  rented:      { label: "Loué",         cls: "badge--rented"      },
  maintenance: { label: "Maintenance",  cls: "badge--maintenance" },
};

const StatusBadge = memo(({ status }) => {
  const config = STATUS_MAP[status] || { label: status, cls: "" };
  return <span className={`car-badge ${config.cls}`}>{config.label}</span>;
});

function CarCard({ car }) {
  const isAuth = useSelector(selectIsAuth);
  const role = useSelector(selectRole);
  const navigate = useNavigate();

  const {
    id, brand, model, year, price_per_day,
    status, fuel, transmission, seats, cover_image, city,
  } = car;

  // 1. Mémorisation du prix formaté
  const formattedPrice = useMemo(() => 
    Number(price_per_day).toLocaleString("fr-MA"), 
  [price_per_day]);

  // 2. Détermination dynamique de l'action principale
  const renderPrimaryAction = () => {
    if (!isAuth) {
      return (
        <Link to="/login" className="car-card__btn car-card__btn--primary">
          Se connecter
        </Link>
      );
    }

    const actions = {
      client: { label: "Réserver", to: `/reserve/${id}` },
      admin_agency: { label: "Gérer", to: `/dashboard/agency/cars/${id}` },
      super_admin: { label: "Gérer", to: `/dashboard/admin/cars/${id}` },
    };

    const currentAction = actions[role];

    return currentAction ? (
      <Link to={currentAction.to} className="car-card__btn car-card__btn--primary">
        {currentAction.label}
      </Link>
    ) : null;
  };

  return (
    <article className="car-card">
      <div className="car-card__image-wrap" onClick={() => navigate(`/cars/${id}`)} style={{cursor: 'pointer'}}>
        <img
          src={cover_image || "/images/default-car.png"}
          alt={`${brand} ${model}`}
          className="car-card__image"
          loading="lazy"
        />
        <StatusBadge status={status} />
        {year && <span className="car-card__year">{year}</span>}
      </div>

      <div className="car-card__body">
        <div className="car-card__title-row">
          <div>
            <h3 className="car-card__brand">{brand}</h3>
            <p className="car-card__model">{model}</p>
          </div>
          <div className="car-card__price">
            <span className="car-card__price-amount">{formattedPrice}</span>
            <span className="car-card__price-unit">MAD/j</span>
          </div>
        </div>

        <ul className="car-card__specs">
          <SpecItem Icon={MapPinIconCar} text={city} />
          <SpecItem Icon={FuelIcon} text={fuel} />
          <SpecItem Icon={TransmissionIcon} text={transmission} />
          <SpecItem Icon={CalendarIconCar} text={`${seats} places`} />
        </ul>

        <div className="car-card__actions">
          <button
            type="button"
            className="car-card__btn car-card__btn--outline"
            onClick={() => navigate(`/cars/${id}`)}
          >
            Détails
          </button>
          {renderPrimaryAction()}
        </div>
      </div>
    </article>
  );
}

const SpecItem = ({ Icon, text }) => {
  if (!text) return null;
  return (
    <li className="car-card__spec">
      <Icon className="car-card__spec-icon" />
      {text}
    </li>
  );
};

export default memo(CarCard);
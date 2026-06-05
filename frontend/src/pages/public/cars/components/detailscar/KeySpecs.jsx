/* KeySpecs — affiche transmission, carburant, sièges, climatisation */

const FUEL_LABELS = {
  diesel: "Diesel",
  essence: "Essence",
  hybrid: "Hybride",
  electric: "Électrique",
};

const TRANSMISSION_LABELS = {
  manual: "Manuelle",
  automatic: "Automatique",
};

// Icons as inline SVG strings (no external deps needed)
function Icon({ d, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const SPECS = (car) => [
  {
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    label: "Transmission",
    value: TRANSMISSION_LABELS[car.transmission] || car.transmission || "—",
  },
  {
    icon: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z",
    label: "Carburant",
    value: FUEL_LABELS[car.fuel] || car.fuel || "—",
  },
  {
    icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    label: "Sièges",
    value: `${car.seats || 5} Places`,
  },
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    label: "Année",
    value: car.year || "—",
  },
];

export default function KeySpecs({ car }) {
  return (
    <div className="key-specs">
      <h3 className="key-specs__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
        Caractéristiques Clés
      </h3>
      <div className="key-specs__grid">
        {SPECS(car).map(({ icon, label, value }) => (
          <div className="key-specs__item" key={label}>
            <div className="key-specs__icon">
              <Icon d={icon} />
            </div>
            <div>
              <span className="key-specs__label">{label}</span>
              <span className="key-specs__value">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
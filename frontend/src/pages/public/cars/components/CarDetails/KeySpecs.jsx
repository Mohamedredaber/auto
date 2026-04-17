import {
  TransmissionIcon,
  FuelIcon,
  CalendarIconCar,
  VolumeIcon,
} from "../../../../../components/layout/icons";
import "../../../styles/components/key-specs-details.css";

const iconMap = {
  transmission: TransmissionIcon,
  fuel: FuelIcon,
  seats: CalendarIconCar,
  climatisation: VolumeIcon,
};

export default function KeySpecs({ car }) {
  const specs = [
    {
      key: "transmission",
      label: "TRANSMISSION",
      value: car?.transmission || "—",
    },
    {
      key: "fuel",
      label: "CARBURANT",
      value: car?.fuel || "—",
    },
    {
      key: "seats",
      label: "SIÈGES",
      value: `${car?.seats || "—"} Places`,
    },
    {
      key: "climatisation",
      label: "CLIMATISATION",
      value: "Bi-zone",
    },
  ];

  return (
    <div className="key-specs">
      <h3 className="key-specs__title">Caractéristiques Clés</h3>
      <div className="key-specs__grid">
        {specs.map((spec) => {
          const IconComponent = iconMap[spec.key] || (() => null);
          return (
            <div key={spec.key} className="key-specs__item">
              <div className="key-specs__icon">
                <IconComponent />
              </div>
              <div className="key-specs__content">
                <span className="key-specs__label">{spec.label}</span>
                <span className="key-specs__value">{spec.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

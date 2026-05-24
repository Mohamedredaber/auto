/* AdditionalInfo — parse et affiche additional_information="bluetooth,camera_recul,..." */

// Map clé → libellé + icône SVG path
const EQUIPMENT_MAP = {
  bluetooth: {
    label: "Bluetooth",
    icon: "M6.5 6.5l11 11M17.5 6.5l-11 11M12 2v4M12 18v4M4.22 10H2M22 10h-2.22M4.22 14H2M22 14h-2.22",
    iconSimple: "M8.5 12a5.5 5.5 0 0 0 3 4.9V7.1A5.5 5.5 0 0 0 8.5 12z",
  },
  camera_recul: {
    label: "Caméra de recul",
    icon: "M15 10l4.553-2.069A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.914L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  },
  toit_panoramique: {
    label: "Toit panoramique",
    icon: "M3 12h18M3 6h18M3 18h18M9 3v18M15 3v18",
  },
  cuir: {
    label: "Sièges en cuir",
    icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  },
  gps: {
    label: "GPS intégré",
    icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  },
  climatisation: {
    label: "Climatisation",
    icon: "M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24",
  },
  usb: {
    label: "Port USB",
    icon: "M12 2v8M8 6l4-4 4 4M8 22h8M12 18v4M7 10v4a5 5 0 0 0 10 0v-4",
  },
  apple_carplay: {
    label: "Apple CarPlay",
    icon: "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z",
  },
};

function EquipmentIcon({ path }) {
  return (
    <svg
      className="additional-info__tag-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

function parseEquipment(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default function AdditionalInfo({ additional_information }) {
  const items = parseEquipment(additional_information);
  if (!items.length) return null;

  return (
    <div className="additional-info">
      <h3 className="additional-info__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Équipements &amp; Options
      </h3>
      <div className="additional-info__tags">
        {items.map((key) => {
          const eq = EQUIPMENT_MAP[key];
          const label = eq?.label ?? key.replace(/_/g, " ");
          const iconPath = eq?.icon ?? "M5 13l4 4L19 7";
          return (
            <span className="additional-info__tag" key={key}>
              <EquipmentIcon path={iconPath} />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
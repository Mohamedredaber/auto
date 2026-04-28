const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
import { useNavigate } from "react-router-dom";
function getLogoUrl(logo) {
  if (!logo) return null;
  if (logo.startsWith("http")) return logo;
  return `${API_BASE}/storage/${logo}`;
}

function formatHour(time) {
  // "08:00:00" → "08:00"
  return time ? time.slice(0, 5) : "—";
}

export default function AgencyCard({ agency }) {
  const navigate = useNavigate();
  if (!agency) return null;

  const logoUrl = getLogoUrl(agency.logo);
  const initial = (agency.agency_name || "A")[0].toUpperCase();

  const BADGES = [
    { label: "Agence vérifiée", active: agency.is_verified },
    { label: "Support 24/7", active: true },
    { label: "Contrat digital", active: true },
    { label: "Paiement sécurisé", active: true },
  ];

  return (
    <div className="agency-card">
      <h3 className="agency-card__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Informations sur l'agence
      </h3>

      <div className="agency-card__header">
        <div className="agency-card__identity">
          {logoUrl ? (
            <img className="agency-card__logo" src={logoUrl} alt={agency.agency_name} />
          ) : (
            <div className="agency-card__logo-fallback">{initial}</div>
          )}
          <div>
            <span className="agency-card__name">{agency.agency_name}</span>
            <span className="agency-card__city">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {agency.city}
            </span>
          </div>
        </div>
        <div className="agency-card__rating">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          4.8
        </div>
      </div>

      <div className="agency-card__badges">
        {BADGES.map(({ label, active }) => (
          <div className="agency-card__badge" key={label}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={active ? "var(--color-success)" : "var(--color-text-muted)"}
              strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span style={{ color: active ? "var(--color-text-secondary)" : "var(--color-text-muted)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {agency.time_start && agency.time_end && (
        <div className="agency-card__hours">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Horaires : <strong>{formatHour(agency.time_start)} – {formatHour(agency.time_end)}</strong>
        </div>
      )}

      <button className="agency-card__link" onClick={() => navigate(`/agency/${agency.id}`)}>
        Voir le profil de l'agence
      </button>
    </div>
  );
}
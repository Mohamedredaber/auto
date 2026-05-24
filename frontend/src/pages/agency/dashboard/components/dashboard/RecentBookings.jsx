/* RecentBookings.jsx — Tableau des 5 dernières réservations */
import React from "react";
import StatusBadge from "../shared/StatusBadge";

const CarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

/* Avatar initiales */
function Avatar({ name }) {
  const safeName = name ?? "Client";
  const initials = safeName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const hue = [...safeName].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className="rb-avatar"
      style={{
        background: `hsl(${hue},35%,22%)`,
        color: `hsl(${hue},60%,65%)`,
      }}
    >
      {initials}
    </div>
  );
}

export default function RecentBookings({ bookings = [], loading, onViewAll }) {
  const skeleton = Array(5).fill(null);

  return (
    <div className="rb-card">
      <div className="rb-header">
        <div>
          <h2 className="rb-title">Réservations Récentes</h2>
          <p className="rb-sub">
            Les 5 dernières interactions clients sur votre plateforme.
          </p>
        </div>
        <button className="rb-viewall" onClick={onViewAll}>
          Tout voir
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="rb-table-wrap">
        <table className="rb-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Véhicule</th>
              <th>Période</th>
              <th>Prix Total</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeleton.map((_, i) => (
                <tr key={i} className="rb-row">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <td key={j}>
                      <div
                        className="rb-skel"
                        style={{ width: j === 6 ? 24 : "80%" }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="rb-empty">
                  Aucune réservation récente.
                </td>
              </tr>
            ) : (
              bookings.map((b, i) => {
                // تصحيح استخراج الاسم من الـ Object الجديد (user)
                const firstName = b.user?.first_name ?? "";
                const lastName = b.user?.last_name ?? "";
                const fullName =
                  firstName || lastName
                    ? `${firstName} ${lastName}`.trim()
                    : "Client Inconnu";

                const vehicleName = b.car
                  ? `${b.car.brand} ${b.car.model}`
                  : "Véhicule supprimé";

                const dateStart = b.start_date ?? "—";
                const dateEnd = b.end_date ?? "—";
                const price = b.total_price ?? "0";
                const status = b.status ?? "pending";
                return (
                  <tr key={b.id ?? i} className="rb-row">
                    <td>
                      <div className="rb-client">
                        <Avatar name={fullName} />
                        <div>
                          <div className="rb-client-name">{fullName}</div>
                          {b.user?.email && (
                            <div className="rb-client-email">
                              {b.user.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rb-vehicle">
                        <CarIcon />
                        {vehicleName}
                      </div>
                    </td>
                    <td className="rb-period">
                      <span>{dateStart}</span>
                      <span className="rb-period-sep">au</span>
                      <span>{dateEnd}</span>
                    </td>
                    <td className="rb-price">
                      {`${Number(price).toLocaleString("fr-MA")} MAD`}
                    </td>
                    <td>
                      <StatusBadge status={status} />
                    </td>
                    <td>
                      {/* <button className="rb-dots">
                        <DotsIcon />
                      </button> */}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .rb-card { background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 1rem; overflow: hidden; }
        .rb-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.5rem; gap: 1rem; flex-wrap: wrap; }
        .rb-title { font-size: 1.0625rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0.25rem; }
        .rb-sub { font-size: 0.8125rem; color: var(--color-text-muted); }
        .rb-viewall { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: 8px; font-size: 0.8125rem; font-weight: 600; color: var(--color-text-secondary); cursor: pointer; transition: all 0.2s; }
        .rb-table-wrap { overflow-x: auto; }
        .rb-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .rb-table thead th { padding: 0.75rem 1.25rem; text-align: left; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); background: var(--color-bg-secondary); }
        .rb-row { border-bottom: 1px solid var(--color-border-subtle); transition: background 0.15s; }
        .rb-row:hover { background: var(--color-bg-card-hover); }
        .rb-table tbody td { padding: 1rem 1.25rem; color: var(--color-text-primary); vertical-align: middle; }
        .rb-client { display: flex; align-items: center; gap: 0.75rem; min-width: 180px; }
        .rb-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
        .rb-client-name { font-weight: 600; font-size: 0.875rem; color: var(--color-text-primary); }
        .rb-client-email { font-size: 0.75rem; color: var(--color-text-muted); }
        .rb-vehicle { display: flex; align-items: center; gap: 6px; color: var(--color-text-secondary); }
        .rb-period { display: flex; flex-direction: column; font-size: 0.8125rem; }
        .rb-period-sep { font-size: 0.7rem; color: var(--color-text-muted); padding: 2px 0; }
        .rb-price { font-weight: 700; color: var(--color-primary-400); }
        .rb-dots { cursor: pointer; background: none; border: none; color: var(--color-text-muted); }
        .rb-skel { height: 14px; border-radius: 4px; background: var(--color-border); animation: rb-shimmer 1.4s infinite; }
        @keyframes rb-shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

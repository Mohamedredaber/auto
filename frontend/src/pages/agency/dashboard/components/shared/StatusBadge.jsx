/* StatusBadge.jsx — Badge de statut réutilisable */
import React from "react";

/**
 * Props:
 *  status — "confirmed" | "pending" | "completed" | "cancelled"
 *           (accepte aussi les valeurs Laravel en anglais ou français)
 */
const STATUS_MAP = {
  // anglais (Laravel)
  confirmed:  { label: "Confirmé",   color: "var(--color-success)",         bg: "var(--color-success-bg)"  },
  pending:    { label: "En attente", color: "var(--color-warning)",         bg: "var(--color-warning-bg)"  },
  completed:  { label: "Terminé",    color: "var(--color-info)",            bg: "var(--color-info-bg)"     },
  cancelled:  { label: "Annulé",     color: "var(--color-primary-400)",     bg: "var(--color-error-bg)"    },
  available:  { label: "Disponible", color: "var(--color-badge-available)", bg: "var(--color-success-bg)"  },
  reserved:   { label: "Réservé",    color: "var(--color-badge-reserved)",  bg: "var(--color-warning-bg)"  },
  unavailable:{ label: "Indisponible",color:"var(--color-badge-unavailable)",bg:"var(--color-error-bg)"   },
};

export default function StatusBadge({ status }) {
  const key = (status ?? "").toLowerCase();
  const cfg = STATUS_MAP[key] ?? { label: status, color: "var(--color-text-muted)", bg: "var(--color-accent-700)" };

  return (
    <span
      className="sb-root"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}44` }}
    >
      <span className="sb-dot" style={{ background: cfg.color }} />
      {cfg.label}

      <style>{`
        .sb-root {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .sb-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>
    </span>
  );
}
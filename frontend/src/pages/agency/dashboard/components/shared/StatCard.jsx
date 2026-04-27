/* StatCard.jsx — Carte statistique réutilisable */
import React from "react";

/**
 * Props:
 *  icon        — élément JSX (icône SVG)
 *  label       — string  ex: "Total Voitures"
 *  value       — string | number
 *  badge       — string  ex: "+3 ce mois"
 *  badgeColor  — "green" | "red" | "blue" (défaut green)
 *  loading     — bool
 */
export default function StatCard({ icon, label, value, badge, badgeColor = "green", loading }) {
  const badgeColors = {
    green: { bg: "var(--color-success-bg)",  color: "var(--color-success)"  },
    red:   { bg: "var(--color-error-bg)",    color: "var(--color-primary-400)" },
    blue:  { bg: "var(--color-info-bg)",     color: "var(--color-info)"     },
  };
  const bc = badgeColors[badgeColor] ?? badgeColors.green;

  return (
    <div className="sc-card">
      <div className="sc-top">
        <div className="sc-icon">{icon}</div>
        {badge && (
          <span className="sc-badge" style={{ background: bc.bg, color: bc.color }}>
            {badge}
          </span>
        )}
      </div>
      <div className="sc-label">{label}</div>
      {loading ? (
        <div className="sc-skeleton" />
      ) : (
        <div className="sc-value">{value ?? "—"}</div>
      )}

      <style>{`
        .sc-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 1rem;
          padding: 1.25rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .sc-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--gradient-primary);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .sc-card:hover {
          border-color: var(--color-primary-600);
          box-shadow: 0 8px 24px #00000044;
        }
        .sc-card:hover::before { opacity: 1; }

        .sc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .sc-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: var(--color-error-bg);
          border: 1px solid #EF444430;
          display: flex; align-items: center; justify-content: center;
          color: var(--color-primary-400);
        }
        .sc-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 99px;
          white-space: nowrap;
        }
        .sc-label {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .sc-value {
          font-size: 1.625rem;
          font-weight: 800;
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .sc-skeleton {
          height: 2rem;
          width: 60%;
          border-radius: 6px;
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-border-subtle) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: sc-shimmer 1.4s infinite;
        }
        @keyframes sc-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
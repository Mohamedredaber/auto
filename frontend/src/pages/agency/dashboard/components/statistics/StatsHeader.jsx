/* StatsHeader.jsx — En-tête section Statistiques */
import React from "react";

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default function StatsHeader({ onExport, period, onPeriodChange }) {
  const periods = ["7j", "30j", "3m", "6m", "1an"];

  return (
    <div className="sh-root">
      <div className="sh-left">
        <h2 className="sh-title">Analyses & Statistiques</h2>
        <p className="sh-sub">Vue détaillée des performances de votre agence.</p>
      </div>
      <div className="sh-right">
        {/* Sélecteur de période */}
        <div className="sh-periods">
          {periods.map((p) => (
            <button
              key={p}
              className={`sh-period-btn${period === p ? " active" : ""}`}
              onClick={() => onPeriodChange?.(p)}
            >
              {p}
            </button>
          ))}
        </div>
        {/* Export */}
        <button className="sh-export" onClick={onExport}>
          <DownloadIcon />
          Exporter
        </button>
      </div>

      <style>{`
        .sh-root {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .sh-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }
        .sh-sub {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .sh-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .sh-periods {
          display: flex;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 3px;
          gap: 2px;
        }
        .sh-period-btn {
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
        }
        .sh-period-btn:hover  { color: var(--color-text-primary); }
        .sh-period-btn.active {
          background: var(--color-primary-600);
          color: var(--color-text-primary);
          box-shadow: 0 2px 8px #DC262640;
        }
        .sh-export {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }
        .sh-export:hover {
          border-color: var(--color-primary-500);
          color: var(--color-primary-400);
        }
      `}</style>
    </div>
  );
}
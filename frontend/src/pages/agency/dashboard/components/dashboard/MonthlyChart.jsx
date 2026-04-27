/* MonthlyChart.jsx — Graphique mensuel (mini vue dashboard) */
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* Tooltip personnalisé */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="mc-tooltip">
      <div className="mc-tooltip-label">{label}</div>
      <div className="mc-tooltip-val">
        {payload[0].value} réservations
      </div>
      <style>{`
        .mc-tooltip {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.8125rem;
          box-shadow: 0 8px 24px #00000044;
        }
        .mc-tooltip-label { color: var(--color-text-muted); margin-bottom: 3px; font-size: 0.75rem; }
        .mc-tooltip-val   { color: var(--color-text-primary); font-weight: 700; }
      `}</style>
    </div>
  );
};

/* Données de fallback si chartData est vide */
const FALLBACK = [
  { month: "Jan", value: 0 },
  { month: "Fév", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Avr", value: 0 },
  { month: "Mai", value: 0 },
  { month: "Juin",value: 0 },
];

export default function MonthlyChart({ chartData = [], loading }) {
  /* Normaliser les données : accepte { month, value } ou { month, bookings } etc. */
  const data = (chartData.length ? chartData : FALLBACK).map((d) => ({
    month: d.month ?? d.mois ?? d.label ?? "?",
    value: d.value ?? d.bookings ?? d.reservations ?? d.count ?? 0,
  }));

  /* Tendance : comparaison dernier vs avant-dernier */
  const last   = data[data.length - 1]?.value ?? 0;
  const before = data[data.length - 2]?.value ?? 0;
  const trend  = last - before;

  return (
    <div className="mc-card">
      {/* Header */}
      <div className="mc-header">
        <div>
          <h3 className="mc-title">Volume Mensuel</h3>
          <p className="mc-sub">Réservations par mois</p>
        </div>
        <div className="mc-trend" style={{
          color: trend >= 0 ? "var(--color-success)" : "var(--color-error)",
          background: trend >= 0 ? "var(--color-success-bg)" : "var(--color-error-bg)",
        }}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="mc-skel" />
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2A2A35"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#EF444433", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#mcGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#EF4444", stroke: "#1A1A20", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <style>{`
        .mc-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 1rem;
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .mc-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.2rem;
        }
        .mc-sub {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .mc-trend {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 99px;
        }
        .mc-skel {
          flex: 1;
          min-height: 180px;
          border-radius: 8px;
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-border-subtle) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: mc-shimmer 1.4s infinite;
        }
        @keyframes mc-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
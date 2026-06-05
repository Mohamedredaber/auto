/* BookingTrends.jsx — Graphique tendances réservations (grand AreaChart rouge) */
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bt-tooltip">
      <div className="bt-tt-label">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="bt-tt-row">
          <span className="bt-tt-dot" style={{ background: entry.color }} />
          <span className="bt-tt-key">{entry.name}</span>
          <span className="bt-tt-val">{entry.value}</span>
        </div>
      ))}
      <style>{`
        .bt-tooltip {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.8125rem;
          box-shadow: 0 8px 24px #00000055;
          min-width: 140px;
        }
        .bt-tt-label { color: var(--color-text-muted); font-size: 0.75rem; margin-bottom: 6px; font-weight: 600; }
        .bt-tt-row { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
        .bt-tt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .bt-tt-key { color: var(--color-text-secondary); flex: 1; }
        .bt-tt-val { color: var(--color-text-primary); font-weight: 700; }
      `}</style>
    </div>
  );
};

const FALLBACK = [
  { month: "Jan", reservations: 0, revenus: 0 },
  { month: "Fév", reservations: 0, revenus: 0 },
  { month: "Mar", reservations: 0, revenus: 0 },
  { month: "Avr", reservations: 0, revenus: 0 },
  { month: "Mai", reservations: 0, revenus: 0 },
  { month: "Juin",reservations: 0, revenus: 0 },
];

export default function BookingTrends({ chartData = [], loading }) {
  const data = (chartData.length ? chartData : FALLBACK).map((d) => ({
    month:        d.month ?? d.mois ?? d.label ?? "?",
    reservations: d.reservations ?? d.bookings ?? d.value ?? d.count ?? 0,
    revenus:      Math.round((d.revenus ?? d.revenue ?? d.revenu ?? 0) / 1000),
  }));

  return (
    <div className="bt-card">
      <div className="bt-header">
        <div>
          <h3 className="bt-title">Tendances des Réservations</h3>
          <p className="bt-sub">Évolution mensuelle des réservations et revenus</p>
        </div>
        <div className="bt-legend">
          <span className="bt-leg-item">
            <span className="bt-leg-dot" style={{ background: "#EF4444" }} />
            Réservations
          </span>
          <span className="bt-leg-item">
            <span className="bt-leg-dot" style={{ background: "#F59E0B" }} />
            Revenus (k MAD)
          </span>
        </div>
      </div>

      {loading ? (
        <div className="bt-skel" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="btGradRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="btGradYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#EF444422", strokeWidth: 1 }} />
            <Area
              type="monotone" dataKey="reservations" name="Réservations"
              stroke="#EF4444" strokeWidth={2.5}
              fill="url(#btGradRed)"
              dot={false}
              activeDot={{ r: 6, fill: "#EF4444", stroke: "#1A1A20", strokeWidth: 2 }}
            />
            <Area
              type="monotone" dataKey="revenus" name="Revenus (k MAD)"
              stroke="#F59E0B" strokeWidth={2}
              fill="url(#btGradYellow)"
              dot={false}
              activeDot={{ r: 5, fill: "#F59E0B", stroke: "#1A1A20", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <style>{`
        .bt-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 1rem;
          padding: 1.5rem;
        }
        .bt-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .bt-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }
        .bt-sub { font-size: 0.8125rem; color: var(--color-text-muted); }
        .bt-legend {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .bt-leg-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .bt-leg-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .bt-skel {
          height: 280px;
          border-radius: 8px;
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-border-subtle) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: bt-shimmer 1.4s infinite;
        }
        @keyframes bt-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
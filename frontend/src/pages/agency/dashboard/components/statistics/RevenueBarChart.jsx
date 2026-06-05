/* RevenueBarChart.jsx — Graphique revenus mensuels (BarChart) */
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rc-tooltip">
      <div className="rc-tt-label">{label}</div>
      <div className="rc-tt-val">
        {Number(payload[0].value).toLocaleString("fr-MA")} MAD
      </div>
      <style>{`
        .rc-tooltip {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.8125rem;
          box-shadow: 0 8px 24px #00000055;
        }
        .rc-tt-label { color: var(--color-text-muted); font-size: 0.75rem; margin-bottom: 4px; }
        .rc-tt-val   { color: var(--color-text-primary); font-weight: 700; font-size: 1rem; }
      `}</style>
    </div>
  );
};

const FALLBACK = ["Jan","Fév","Mar","Avr","Mai","Juin"].map((m) => ({ month: m, revenu: 0 }));

export default function RevenueBarChart({ chartData = [], loading }) {
  const data = (chartData.length ? chartData : FALLBACK).map((d) => ({
    month:  d.month ?? d.mois ?? d.label ?? "?",
    revenu: d.revenu ?? d.revenue ?? d.revenus ?? d.total ?? 0,
  }));

  const maxVal = Math.max(...data.map((d) => d.revenu), 1);

  return (
    <div className="rc-card">
      <div className="rc-header">
        <div>
          <h3 className="rc-title">Revenus Mensuels</h3>
          <p className="rc-sub">Chiffre d'affaires par mois en MAD</p>
        </div>
        <div className="rc-total">
          {Number(data.reduce((s, d) => s + d.revenu, 0)).toLocaleString("fr-MA")}
          <span> MAD</span>
        </div>
      </div>

      {loading ? (
        <div className="rc-skel" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#EF444410" }} />
            <Bar dataKey="revenu" name="Revenu" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => {
                const intensity = maxVal > 0 ? entry.revenu / maxVal : 0;
                const alpha = Math.round(80 + intensity * 175).toString(16).padStart(2, "0");
                return <Cell key={i} fill={`#DC2626${alpha}`} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <style>{`
        .rc-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 1rem;
          padding: 1.5rem;
        }
        .rc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .rc-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }
        .rc-sub { font-size: 0.8125rem; color: var(--color-text-muted); }
        .rc-total {
          font-size: 1.375rem;
          font-weight: 800;
          color: var(--color-primary-400);
          white-space: nowrap;
        }
        .rc-total span {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .rc-skel {
          height: 240px;
          border-radius: 8px;
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-border-subtle) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: rc-shimmer 1.4s infinite;
        }
        @keyframes rc-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
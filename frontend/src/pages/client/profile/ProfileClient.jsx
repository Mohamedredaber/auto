/* MonthlyChart.jsx — Graphique mensuel optimisé */
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* Tooltip personnalisé */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#16181a",
      border: "1px solid #2d2d2d",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "0.8125rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.44)",
    }}>
      <div style={{ color: "#6b7280", marginBottom: "3px", fontSize: "0.75rem" }}>
        {label}
      </div>
      <div style={{ color: "#fff", fontWeight: 700 }}>
        {payload[0].value} réservations
      </div>
    </div>
  );
};

/* Données de fallback */
const FALLBACK = [
  { month: "Jan", value: 0 },
  { month: "Fév", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Avr", value: 0 },
  { month: "Mai", value: 0 },
  { month: "Juin", value: 0 },
];

export default function MonthlyChart({ chartData = [], loading = false }) {
  console.log("📊 MonthlyChart render", { chartData, loading });
  const normalizeData = () => {
    try {
      if (!Array.isArray(chartData) || chartData.length === 0) {
        return FALLBACK;
      }

      return chartData.map((d) => ({
        month: d.month || d.mois || d.label || "?",
        value: Math.max(0, Number(d.value || d.bookings || d.reservations || d.count || 0)),
      })).slice(0, 12); // Max 12 mois
    } catch (err) {
      console.error(" Erreur normalisation chartData:", err);
      return FALLBACK;
    }
  };

  const data = normalizeData();
  
  // Calcul tendance
  const last = data[data.length - 1]?.value ?? 0;
  const before = data[data.length - 2]?.value ?? 0;
  const trend = last - before;
  const trendColor = trend >= 0 ? "#10b981" : "#ef4444";
  const trendBg = trend >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)";

  return (
    <div style={{
      background: "#16181a",
      border: "1px solid #2d2d2d",
      borderRadius: "1rem",
      padding: "1.5rem",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "0.2rem",
            margin: 0,
          }}>Volume Mensuel</h3>
          <p style={{
            fontSize: "0.8125rem",
            color: "#6b7280",
            margin: 0,
          }}>Réservations par mois</p>
        </div>
        
        <div style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          padding: "4px 10px",
          borderRadius: "99px",
          color: trendColor,
          background: trendBg,
        }}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}
        </div>
      </div>

      {/* Graphique ou skeleton */}
      {loading ? (
        <div style={{
          flex: 1,
          minHeight: "180px",
          borderRadius: "8px",
          background: "linear-gradient(90deg, #2d2d2d 25%, #3a3a3f 50%, #2d2d2d 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}>
          <style>{`
            @keyframes shimmer {
              0%   { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart 
            data={data} 
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
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
              width={40}
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
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
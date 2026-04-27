/* Dashboard.jsx — Page principale du tableau de bord agence */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector }   from "react-redux";
import { useNavigate }                from "react-router-dom";
import { fetchDashboardData }         from "../../../features/agency/dashboardThunks";
import {
  selectDashboardStats,
  selectRecentBookings,
  selectChartData,
  selectIsDashboardLoading,
} from "../../../features/agency/dashboardSelector";

import StatCard    from "./components/shared/StatCard";
import StatusBadge from "./components/shared/StatusBadge";

import RecentBookings from "./components/dashboard/RecentBookings";
import MonthlyChart   from "./components/dashboard/MonthlyChart";
import StatsHeader    from "./components/statistics/StatsHeader";
import BookingTrends  from "./components/statistics/BookingTrends";
import RevenueBarChart from "./components/statistics/RevenueBarChart";
import VehicleTable   from "./components/statistics/VehicleTable";

const Icons = {
  Car: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
  Available: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Revenue: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
};

/* ══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const stats          = useSelector(selectDashboardStats);
  const recentBookings = useSelector(selectRecentBookings);
  const chartData      = useSelector(selectChartData);
  const isLoading      = useSelector(selectIsDashboardLoading);

  const [section, setSection] = useState("overview");
  const [period,  setPeriod]  = useState("30j");

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const statCards = [
    {
      icon:       <Icons.Car />,
      label:      "Total Voitures",
      value:      stats?.total_voitures ?? 0,
      badge:      "+3 ce mois",
      badgeColor: "green",
    },
    {
      icon:       <Icons.Available />,
      label:      "Voitures Disponibles",
      value:      stats?.voitures_disponibles ?? 0,
      badge:      `${stats?.total_voitures
        ? Math.round((stats.voitures_disponibles / stats.total_voitures) * 100)
        : 0}% du parc`,
      badgeColor: "green",
    },
    {
      icon:       <Icons.Calendar />,
      label:      "Réservations Actives",
      value:      stats?.reservations_actives ?? 0,
      badge:      "+12% vs avr.",
      badgeColor: "green",
    },
    {
      icon:       <Icons.Revenue />,
      label:      "Revenu Mensuel",
      value:      stats?.revenu_mensuel != null
        ? `${Number(stats.revenu_mensuel).toLocaleString("fr-MA")} MAD`
        : "0 MAD",
      badge:      "+8.5% croissance",
      badgeColor: "green",
    },
  ];

  const handleExport = () => {
    /* TODO: implémenter export CSV/PDF */
    alert("Export en cours de développement…");
  };

  return (
    <div className="db-root">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">Tableau de Bord</h1>
          <p className="db-page-sub">
            Bienvenue, voici l'état actuel de votre agence aujourd'hui.
          </p>
        </div>

        {/* Section tabs */}
        <div className="db-section-tabs">
          <button
            className={`db-tab${section === "overview" ? " active" : ""}`}
            onClick={() => setSection("overview")}
          >
            Vue d'ensemble
          </button>
          <button
            className={`db-tab${section === "statistics" ? " active" : ""}`}
            onClick={() => setSection("statistics")}
          >
            Statistiques
          </button>
        </div>
      </div>

      {/* ── Stats cards ─────────────────────────────────────── */}
      <div className="db-stats-grid">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} loading={isLoading} />
        ))}
      </div>

      {/* ════════ SECTION : VUE D'ENSEMBLE ════════ */}
      {section === "overview" && (
        <div className="db-overview">
          <div className="db-overview-main">
            <RecentBookings
              bookings={recentBookings}
              loading={isLoading}
              onViewAll={() => navigate("/dashboard/agency/reservations")}
            />
          </div>
          <div className="db-overview-side">
            <MonthlyChart chartData={chartData} loading={isLoading} />

            {/* Résumé de performance */}
            <div className="db-perf-card">
              <div className="db-perf-icon">
                <Icons.Revenue />
              </div>
              <div>
                <h4 className="db-perf-title">Résumé de performance</h4>
                <p className="db-perf-text">
                  Votre volume de réservation a augmenté de{" "}
                  <strong style={{ color: "var(--color-success)" }}>18%</strong>{" "}
                  par rapport au trimestre précédent. La tendance reste positive
                  pour la saison estivale.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ SECTION : STATISTIQUES ════════ */}
      {section === "statistics" && (
        <div className="db-statistics">
          <StatsHeader
            period={period}
            onPeriodChange={setPeriod}
            onExport={handleExport}
          />

          <div className="db-stats-charts">
            <BookingTrends  chartData={chartData} loading={isLoading} />
            <RevenueBarChart chartData={chartData} loading={isLoading} />
          </div>

          <VehicleTable vehicles={[]} loading={isLoading} />
        </div>
      )}

      <style>{`
        .db-root {
          padding: 2rem 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          animation: db-fade 0.4s ease both;
        }
        @keyframes db-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Page header */
        .db-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .db-page-title {
          font-size: 1.875rem;
          font-weight: 800;
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 0.375rem;
        }
        .db-page-sub {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
        }

        /* Section tabs */
        .db-section-tabs {
          display: flex;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 4px;
          gap: 2px;
        }
        .db-tab {
          padding: 7px 18px;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
        }
        .db-tab:hover  { color: var(--color-text-primary); }
        .db-tab.active {
          background: var(--color-primary-600);
          color: #fff;
          box-shadow: 0 2px 8px #DC262640;
        }

        /* Grille des stats */
        .db-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        /* Overview layout */
        .db-overview {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.25rem;
          align-items: start;
        }
        .db-overview-main { display: flex; flex-direction: column; gap: 1.25rem; }
        .db-overview-side { display: flex; flex-direction: column; gap: 1.25rem; }

        /* Perf card */
        .db-perf-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 1rem;
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .db-perf-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: var(--color-error-bg);
          border: 1px solid #EF444430;
          display: flex; align-items: center; justify-content: center;
          color: var(--color-primary-400);
          flex-shrink: 0;
        }
        .db-perf-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }
        .db-perf-text {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* Statistics layout */
        .db-statistics { display: flex; flex-direction: column; gap: 1.25rem; }
        .db-stats-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .db-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .db-overview   { grid-template-columns: 1fr; }
          .db-overview-side { display: grid; grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .db-root { padding: 1.25rem 1rem; }
          .db-stats-grid { grid-template-columns: 1fr 1fr; }
          .db-stats-charts { grid-template-columns: 1fr; }
          .db-overview-side { grid-template-columns: 1fr; }
          .db-page-header { flex-direction: column; }
          .db-page-title { font-size: 1.5rem; }
        }
        @media (max-width: 480px) {
          .db-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
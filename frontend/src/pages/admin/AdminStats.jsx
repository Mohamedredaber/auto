import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  DollarSign,
  CalendarCheck,
  Building2,
  Users,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";

import api from "../../api";
import "../../styles/pages/AdminStats.css";

const EMPTY_STATS = {
  cards: {
    total_revenue: 0,
    total_bookings: 0,
    total_agencies: 0,
    total_users: 0,
  },
  bookings_by_month: [],
  revenues_by_month: [],
  agencies_by_month: [],
  top_cars: [],
};

export default function AdminStats() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/super-admin/stats");

        setStats(response.data.data || EMPTY_STATS);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des statistiques.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = stats.cards || EMPTY_STATS.cards;
  const bookingsByMonth = stats.bookings_by_month || [];
  const revenuesByMonth = stats.revenues_by_month || [];
  const agenciesByMonth = stats.agencies_by_month || [];
  const topCars = stats.top_cars || [];

  if (loading) {
    return <div className="stats-page">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="stats-page stats-error">{error}</div>;
  }

  return (
    <div className="stats-page">
      <div className="stats-header">
        <div>
          <h1>Analytiques & Statistiques</h1>
          <p>Surveillez la croissance et les performances d’AutoConnect.</p>
        </div>

        {/* <button className="export-btn">Exporter</button> */}
      </div>

      <div className="stats-cards">
        <StatCard
          icon={<DollarSign size={18} />}
          title="Chiffre d’Affaires Total"
          value={`${Number(cards.total_revenue || 0).toLocaleString()} DH`}
          growth="+12.5%"
        />

        <StatCard
          icon={<CalendarCheck size={18} />}
          title="Réservations Totales"
          value={cards.total_bookings || 0}
          growth="+8.2%"
        />

        <StatCard
          icon={<Building2 size={18} />}
          title="Agences Partenaires"
          value={cards.total_agencies || 0}
          growth="+24%"
        />

        <StatCard
          icon={<Users size={18} />}
          title="Utilisateurs Actifs"
          value={cards.total_users || 0}
          growth="-2.1%"
          negative
        />
      </div>

      <div className="section-title">
        <h2>Tendances & Performance</h2>
        <p>Analyse détaillée des flux opérationnels et financiers.</p>
      </div>

      <div className="charts-grid">
        <ChartCard
          title="Réservations par Mois"
          subtitle="Évolution des volumes de location"
          empty={bookingsByMonth.length === 0}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={bookingsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2b36" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#f0627d"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenus Mensuels"
          subtitle="Montants exprimés en Dirhams"
          empty={revenuesByMonth.length === 0}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenuesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2b36" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="#f0627d"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Nouvelles Agences"
          subtitle="Rythme d’expansion du réseau de partenaires"
          empty={agenciesByMonth.length === 0}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={agenciesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2b36" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="agencies"
                stroke="#2563eb"
                fill="#1e3a8a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top Modèles Loués"
          subtitle="Performance par modèle de véhicule"
          empty={topCars.length === 0}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topCars} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2b36" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#9ca3af"
                width={100}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#f0627d" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* <div className="bottom-stats">
        <MiniStat icon={<TrendingUp />} label="Taux de Conversion" value="18.4%" />
        <MiniStat icon={<Clock />} label="Durée Moyenne" value="4.2 Jours" />
        <MiniStat icon={<Star />} label="Satisfaction Client" value="4.8 / 5" />
      </div> */}
    </div>
  );
}

function StatCard({ icon, title, value, growth, negative }) {
  return (
    <div className="stat-box">
      <div className="stat-top">
        <span className="stat-icon-main">{icon}</span>
        <span className={negative ? "growth negative" : "growth"}>
          {growth}
        </span>
      </div>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function ChartCard({ title, subtitle, empty, children }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <p>{subtitle}</p>

      {empty ? (
        <div className="chart-empty">Aucune donnée disponible.</div>
      ) : (
        children
      )}
    </div>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="mini-stat">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}
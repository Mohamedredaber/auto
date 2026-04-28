import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientDashboard } from "../../features/client/clientThunks";
import {
  selectDashboardStats,
  selectDashboardRecentActivity,
  selectDashboardAccountHealth,
  selectDashboardChartData,
  selectIsDashboardLoading,
} from "../../features/client/clientSelectors";
import { TrendingUp, DollarSign, Calendar, AlertCircle } from "lucide-react";
import "./Dashboard.css";

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const recentActivity = useSelector(selectDashboardRecentActivity);
  const accountHealth = useSelector(selectDashboardAccountHealth);
  const chartData = useSelector(selectDashboardChartData);
  const loading = useSelector(selectIsDashboardLoading);

  useEffect(() => {
    dispatch(getClientDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && stats) {
      console.log("📊 DASHBOARD STATS:", stats);
      console.log("📈 CHART DATA:", chartData);
      console.log("🎯 RECENT ACTIVITY:", recentActivity);
      console.log("❤️ ACCOUNT HEALTH:", accountHealth + "%");
    }
  }, [loading, stats, chartData, recentActivity, accountHealth]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dash-header">
        <h1>
          Tableau de <span className="accent">Bord</span>
        </h1>
        <p>Bienvenue, voir votre activité en un coup d'œil</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Total Bookings */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Réservations</span>
            <Calendar className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{stats.total_bookings}</div>
          <div className="stat-card-label">Total de réservations</div>
        </div>

        {/* Total Spent */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Budget</span>
            <DollarSign className="stat-card-icon" />
          </div>
          <div className="stat-card-value">
            {stats.total_spent.toLocaleString()}
          </div>
          <div className="stat-card-label">MAD dépensés</div>
        </div>

        {/* Active Bookings */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Actif</span>
            <TrendingUp className="stat-card-icon" />
          </div>
          <div className="stat-card-value">{stats.active_bookings}</div>
          <div className="stat-card-label">Réservations actives</div>
        </div>
      </div>

      {/* Account Health */}
      <div className="health-section">
        <div className="health-header">
          <h2 className="health-title">État du Profil</h2>
          <AlertCircle className="health-icon" size={24} />
        </div>
        <div className="health-bar-container">
          <div
            className="health-bar-fill"
            style={{ width: `${accountHealth}%` }}
          ></div>
        </div>
        <p className="health-percentage">
          Profil complété à <strong>{accountHealth}%</strong>
        </p>
      </div>

      {/* Recent Activity */}
      {recentActivity ? (
        <div className="activity-section">
          <h2 className="activity-title">Dernière Réservation</h2>
          <div className="activity-content">
            <div className="activity-image">
              {recentActivity.car_image && (
                <img
                  src={recentActivity.car_image}
                  alt={`${recentActivity.car_brand} ${recentActivity.car_model}`}
                />
              )}
            </div>
            <div className="activity-details">
              <h3>
                {recentActivity.car_brand} {recentActivity.car_model}
              </h3>
              <p className="activity-agency">
                Chez{" "}
                <span className="agency-name">
                  {recentActivity.agency_name}
                </span>
              </p>

              <div className="activity-dates">
                <div className="activity-date-item">
                  <span className="activity-date-label">Date de départ</span>
                  <span className="activity-date-value">
                    {new Date(recentActivity.start_date).toLocaleDateString(
                      "fr-FR",
                    )}
                  </span>
                </div>
                <div className="activity-date-item">
                  <span className="activity-date-label">Date de retour</span>
                  <span className="activity-date-value">
                    {new Date(recentActivity.end_date).toLocaleDateString(
                      "fr-FR",
                    )}
                  </span>
                </div>
              </div>

              <div className="activity-footer">
                <div className="activity-price">
                  <span className="activity-price-label">Prix total</span>
                  <span className="activity-price-value">
                    {recentActivity.total_price} MAD
                  </span>
                </div>
                <span
                  className={`status-badge-dashboard ${
                    recentActivity.status === "completed"
                      ? "status-completed"
                      : recentActivity.status === "confirmed"
                        ? "status-confirmed"
                        : "status-pending"
                  }`}
                >
                  {recentActivity.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucune réservation trouvée.</p>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;

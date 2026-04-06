import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../../features/auth/authThunks";
import useAuth from "../../hooks/useAuth";
// import "../../styles/dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/", { replace: true });
  };

  return (
    <div className="client-dashboard">
      <div className="dashboard-header">
        <h2>Mon Espace Client</h2>
        <p>
          Bienvenue {user?.first_name} {user?.last_name} !
        </p>
        <button onClick={handleLogout} className="logout-btn-dashboard">
          Déconnexion
        </button>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Réservations actives</h3>
            <div className="stat-number">0</div>
            <p>Aucune réservation en cours</p>
          </div>

          <div className="stat-card">
            <h3>Réservations passées</h3>
            <div className="stat-number">0</div>
            <p>Historique vide</p>
          </div>

          <div className="stat-card">
            <h3>Favoris</h3>
            <div className="stat-number">0</div>
            <p>Véhicules favoris</p>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Actions rapides</h3>
          <div className="actions-grid">
            <button className="action-btn primary">Réserver un véhicule</button>
            <button className="action-btn secondary">
              Voir mes réservations
            </button>
            <button className="action-btn secondary">
              Modifier mon profil
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Activité récente</h3>
          <div className="activity-list">
            <p className="no-activity">Aucune activité récente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../../features/auth/authThunks";
import useAuth from "../../hooks/useAuth";
import "../../styles/dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Panneau d'Administration Système</h2>
        <p>
          Super Administrateur: {user?.first_name} {user?.last_name}
        </p>
        <button onClick={handleLogout} className="logout-btn-dashboard">
          Déconnexion
        </button>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total utilisateurs</h3>
            <div className="stat-number">0</div>
            <p>Dans le système</p>
          </div>

          <div className="stat-card">
            <h3>Agences actives</h3>
            <div className="stat-number">0</div>
            <p>Vérifiées</p>
          </div>

          <div className="stat-card">
            <h3>Véhicules totaux</h3>
            <div className="stat-number">0</div>
            <p>En catalogue</p>
          </div>

          <div className="stat-card">
            <h3>Réservations totales</h3>
            <div className="stat-number">0</div>
            <p>Toutes agences</p>
          </div>

          <div className="stat-card">
            <h3>Revenus totaux</h3>
            <div className="stat-number">0€</div>
            <p>Ce mois</p>
          </div>

          <div className="stat-card">
            <h3>Signalements</h3>
            <div className="stat-number">0</div>
            <p>À traiter</p>
          </div>
        </div>

        <div className="admin-actions">
          <h3>Administration système</h3>
          <div className="actions-grid">
            <button className="action-btn primary">
              Gérer les utilisateurs
            </button>
            <button className="action-btn primary">Valider les agences</button>
            <button className="action-btn primary">Catalogue véhicules</button>
            <button className="action-btn secondary">
              Toutes les réservations
            </button>
            <button className="action-btn secondary">
              Rapports et statistiques
            </button>
            <button className="action-btn secondary">Paramètres système</button>
          </div>
        </div>

        <div className="system-status">
          <h3>État du système</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Serveur API</span>
            </div>
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Base de données</span>
            </div>
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Système de paiement</span>
            </div>
            <div className="status-item">
              <span className="status-indicator warning"></span>
              <span>Notifications email</span>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Activité récente du système</h3>
          <div className="activity-list">
            <p className="no-activity">Aucune activité récente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

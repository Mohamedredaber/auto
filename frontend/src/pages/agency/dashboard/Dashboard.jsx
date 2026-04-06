import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../../../features/auth/authThunks";
import useAuth from "../../../hooks/useAuth";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/", { replace: true });
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="agency-dashboard">
      <div className="dashboard-header">
        <h2>Tableau de Bord Agence</h2>
        <p>
          Agence: {user?.first_name} {user?.last_name}
        </p>
        <button onClick={handleLogout} className="logout-btn-dashboard">
          Déconnexion
        </button>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Véhicules actifs</h3>
            <div className="stat-number">0</div>
            <p>En catalogue</p>
          </div>

          <div className="stat-card">
            <h3>Réservations</h3>
            <div className="stat-number">0</div>
            <p>Ce mois</p>
          </div>

          <div className="stat-card">
            <h3>Clients</h3>
            <div className="stat-number">0</div>
            <p>Enregistrés</p>
          </div>

          <div className="stat-card">
            <h3>Revenus</h3>
            <div className="stat-number">0€</div>
            <p>Mensuel</p>
          </div>

          <div className="stat-card">
            <h3>Taux d'occupation</h3>
            <div className="stat-number">0%</div>
            <p>Véhicules loués</p>
          </div>

          <div className="stat-card">
            <h3>Requêtes en attente</h3>
            <div className="stat-number">0</div>
            <p>À traiter</p>
          </div>
        </div>

        <div className="agency-actions">
          <h3>Gestion de l'agence</h3>
          <div className="actions-grid">
            <button
              className="action-btn primary"
              onClick={() => navigateTo("/dashboard/agency/cars")}
            >
              Mes Véhicules
            </button>
            <button
              className="action-btn primary"
              onClick={() => navigateTo("/dashboard/agency/reservations")}
            >
              Réservations
            </button>
            <button
              className="action-btn primary"
              onClick={() => navigateTo("/dashboard/agency/clients")}
            >
              Mes Clients
            </button>
            <button className="action-btn secondary">Statistiques</button>
            <button className="action-btn secondary">Rapports</button>
            <button className="action-btn secondary">Paramètres</button>
          </div>
        </div>

        <div className="agency-status">
          <h3>État de l'agence</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Système actif</span>
            </div>
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Paiements activés</span>
            </div>
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Notifications actives</span>
            </div>
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Profil vérifié</span>
            </div>
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

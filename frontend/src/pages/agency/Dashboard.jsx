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
    <div className="agency-dashboard">
      <div className="dashboard-header">
        <h2>Espace Agence</h2>
        <p>Agence: {user?.agency?.agency_name || "Non configurée"}</p>
        <p>
          Gestionnaire: {user?.first_name} {user?.last_name}
        </p>
        <button onClick={handleLogout} className="logout-btn-dashboard">
          Déconnexion
        </button>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Véhicules disponibles</h3>
            <div className="stat-number">0</div>
            <p>Dans votre flotte</p>
          </div>

          <div className="stat-card">
            <h3>Réservations actives</h3>
            <div className="stat-number">0</div>
            <p>En cours</p>
          </div>

          <div className="stat-card">
            <h3>Revenus du mois</h3>
            <div className="stat-number">0€</div>
            <p>Ce mois-ci</p>
          </div>

          <div className="stat-card">
            <h3>Note moyenne</h3>
            <div className="stat-number">0/5</div>
            <p>Évaluations clients</p>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Actions rapides</h3>
          <div className="actions-grid">
            <button className="action-btn primary">Ajouter un véhicule</button>
            <button className="action-btn primary">
              Voir les réservations
            </button>
            <button className="action-btn secondary">
              Gérer le profil agence
            </button>
            <button className="action-btn secondary">
              Consulter les statistiques
            </button>
          </div>
        </div>

        <div className="agency-info">
          <h3>Informations de l'agence</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Adresse:</strong> {user?.agency?.address || "Non défini"}
            </div>
            <div className="info-item">
              <strong>Ville:</strong> {user?.agency?.city || "Non défini"}
            </div>
            <div className="info-item">
              <strong>Horaires:</strong> {user?.agency?.time_start || "??:??"} -{" "}
              {user?.agency?.time_end || "??:??"}
            </div>
            <div className="info-item">
              <strong>Statut:</strong>{" "}
              {user?.agency?.is_verified ? "Vérifiée" : "En attente"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

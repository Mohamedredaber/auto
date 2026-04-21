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
    <div className="dashboard">
      <h1>
        Bienvenue sur votre tableau de bord, {user?.name || "Utilisateur"}!
      </h1>
      <p>Gérez vos réservations, consultez votre historique et plus encore.</p>
      <button className="dashboard__logout-btn" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard;

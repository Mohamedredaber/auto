import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminUser } from "../../api/adminUserApi";
import "../../styles/pages/UserDetails.css";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const response = await fetchAdminUser(id);
        setUser(response.data.data);
      } catch (err) {
        setError("Erreur lors du chargement de l'utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) return <p className="user-state">Chargement...</p>;
  if (error) return <p className="user-state error">{error}</p>;
  if (!user) return <p className="user-state">Utilisateur introuvable.</p>;

  return (
    <div className="user-details-page">
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard/admin/users")}
      >
        ← Retour aux utilisateurs
      </button>

      <h1>
        {user.first_name} {user.last_name}
      </h1>

      <div className="user-card">
        <div className="user-avatar">
          {(user.first_name || "U").charAt(0)}
        </div>

        <div>
          <h2>
            {user.first_name} {user.last_name}
          </h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="details-table">
        <div>
          <span>ID</span>
          <strong>{user.id}</strong>
        </div>

        <div>
          <span>Prénom</span>
          <strong>{user.first_name}</strong>
        </div>

        <div>
          <span>Nom</span>
          <strong>{user.last_name}</strong>
        </div>

        <div>
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div>
          <span>Téléphone</span>
          <strong>{user.phone || "-"}</strong>
        </div>

        <div>
          <span>Rôle</span>
          <strong>{user.role}</strong>
        </div>

        <div>
          <span>Agence ID</span>
          <strong>{user.agency_id || "-"}</strong>
        </div>

        <div>
          <span>Agence</span>
          <strong>{user.agency_name || "-"}</strong>
        </div>

        <div>
          <span>Date création</span>
          <strong>
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "-"}
          </strong>
        </div>

        <div>
          <span>Dernière modification</span>
          <strong>
            {user.updated_at
              ? new Date(user.updated_at).toLocaleDateString()
              : "-"}
          </strong>
        </div>
      </div>
    </div>
  );
}
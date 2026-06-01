import { useNavigate } from "react-router-dom";
import "../../styles/pages/AdminAgencies.css";

export default function AdminCreateAgency() {
  const navigate = useNavigate();

  return (
    <div className="admin-agencies">
      <div className="admin-header">
        <div>
          <h1>Nouvelle agence</h1>
          <p>Creation manuelle d'une agence (formulaire a venir).</p>
        </div>
        <button className="secondary-button" onClick={() => navigate("/dashboard/admin/agencies")}
        >
          Retour
        </button>
      </div>

      <div className="table-card">
        <div className="empty-state">
          Formulaire de creation en cours de preparation.
        </div>
      </div>
    </div>
  );
}

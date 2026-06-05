import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminBooking } from "../../api/adminBookingsApi";
import "../../styles/pages/BookingDetails.css";

const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  canceled: "Annulée",
  completed: "Terminée",
};

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      setLoading(true);

      const response = await fetchAdminBooking(id);

      setBooking(response.data.data);
    } catch (err) {
      console.error(err);

      setError("Erreur lors du chargement de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="booking-state">Chargement...</div>;
  }

  if (error) {
    return <div className="booking-state error">{error}</div>;
  }

  if (!booking) {
    return (
      <div className="booking-state">
        Réservation introuvable.
      </div>
    );
  }

  return (
    <div className="booking-details-page">
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard/admin/bookings")}
      >
        ← Retour aux réservations
      </button>

      <h1>Détails réservation #{booking.id}</h1>

      <div className="details-table">
        <div>
          <span>ID Réservation</span>
          <strong>{booking.id}</strong>
        </div>

        <div>
          <span>Client</span>
          <strong>{booking.user_name}</strong>
        </div>

        <div>
          <span>Email Client</span>
          <strong>{booking.user_email}</strong>
        </div>

        <div>
          <span>ID Utilisateur</span>
          <strong>{booking.user_id}</strong>
        </div>

        <div>
          <span>Voiture</span>
          <strong>{booking.car_name}</strong>
        </div>

        <div>
          <span>ID Voiture</span>
          <strong>{booking.car_id}</strong>
        </div>

        <div>
          <span>Agence</span>
          <strong>{booking.agency_name}</strong>
        </div>

        <div>
          <span>ID Agence</span>
          <strong>{booking.agency_id}</strong>
        </div>

        <div>
          <span>Date début</span>
          <strong>{booking.start_date}</strong>
        </div>

        <div>
          <span>Date fin</span>
          <strong>{booking.end_date}</strong>
        </div>

        <div>
          <span>Prix Total</span>
          <strong>{booking.total_price} MAD</strong>
        </div>

        <div>
          <span>Statut</span>

          <strong>
            <span
              className={`booking-status ${booking.status}`}
            >
              {STATUS_LABELS[booking.status] ||
                booking.status}
            </span>
          </strong>
        </div>

        <div>
          <span>Créée le</span>

          <strong>
            {new Date(
              booking.created_at
            ).toLocaleString("fr-FR")}
          </strong>
        </div>

        <div>
          <span>Dernière modification</span>

          <strong>
            {new Date(
              booking.updated_at
            ).toLocaleString("fr-FR")}
          </strong>
        </div>
      </div>
    </div>
  );
}
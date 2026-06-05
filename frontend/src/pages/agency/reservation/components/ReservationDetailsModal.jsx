import React, { useState } from "react";
import { X, Download, Share2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateBookingStatus } from "../../../../features/agency/bookingThunks";
import "./ReservationDetailsModal.css";

const ReservationDetailsModal = ({ booking, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(booking?.status || "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !booking) return null;

  const statusOptions = ["pending", "confirmed", "canceled", "completed"];
  const statusLabels = {
    pending: "En attente",
    confirmed: "Confirmée",
    canceled: "Annulée",
    completed: "Complétée",
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === booking.status) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateBookingStatus({
          id: booking.id,
          status: newStatus,
        }),
      ).unwrap();
      setSelectedStatus(newStatus);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = () => {
    const content = `DÉTAILS DE RÉSERVATION
${new Date().toLocaleDateString("fr-FR")}
=====================================
ID Réservation: RES-${booking.id}
Client: ${booking.user?.first_name ?? "—"} ${booking.user?.last_name ?? ""}
Email: ${booking.user?.email ?? "—"}
Téléphone: ${booking.user?.phone ?? "—"}

VÉHICULE
Marque: ${booking.car?.brand ?? "—"}
Modèle: ${booking.car?.model ?? ""}
Année: ${booking.car?.year ?? "—"}
Immatriculation: ${booking.car?.license_plate ?? "—"}

PÉRIODE DE LOCATION
Début: ${booking.start_date}
Fin: ${booking.end_date}
Jours: ${calculateDays(booking.start_date, booking.end_date)}

TARIFICATION
Prix par jour: ${booking.car?.price_per_day ?? "—"} MAD
Total: ${booking.total_price ?? "—"} MAD
Statut: ${statusLabels[booking.status] ?? booking.status}
`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content),
    );
    element.setAttribute("download", `reservation-${booking.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    const text = `Réservation RES-${booking.id}: ${booking.car?.brand ?? ""} ${booking.car?.model ?? ""} du ${booking.start_date} au ${booking.end_date} - ${booking.total_price ?? "—"} MAD`;

    if (navigator.share) {
      navigator.share({
        title: "Détails de réservation",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Informations copiées au presse-papiers");
    }
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Détails de la Réservation</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Section Client */}
          <div className="detail-section">
            <h3>Informations Client</h3>
            <div className="detail-row">
              <span className="label">Nom:</span>
              <span className="value">
                {booking.user?.first_name ?? "—"}{" "}
                {booking.user?.last_name ?? ""}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{booking.user?.email ?? "—"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Téléphone:</span>
              <span className="value">{booking.user?.phone ?? "—"}</span>
            </div>
          </div>

          {/* Section Véhicule */}
          <div className="detail-section">
            <h3>Informations Véhicule</h3>
            <div className="detail-row">
              <span className="label">Marque & Modèle:</span>
              <span className="value">
                {booking.car?.brand ?? "—"} {booking.car?.model ?? ""}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Année:</span>
              <span className="value">{booking.car?.year ?? "—"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Immatriculation:</span>
              <span className="value">{booking.car?.license_plate ?? "—"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Prix/jour:</span>
              <span className="value">
                {booking.car?.price_per_day ?? "—"} MAD
              </span>
            </div>
          </div>

          {/* Section Réservation */}
          <div className="detail-section">
            <h3>Période de Location</h3>
            <div className="detail-row">
              <span className="label">Début:</span>
              <span className="value">{booking.start_date}</span>
            </div>
            <div className="detail-row">
              <span className="label">Fin:</span>
              <span className="value">{booking.end_date}</span>
            </div>
            <div className="detail-row">
              <span className="label">Nombre de jours:</span>
              <span className="value">
                {calculateDays(booking.start_date, booking.end_date)}
              </span>
            </div>
          </div>

          {/* Section Tarification */}
          <div className="detail-section">
            <h3>Tarification</h3>
            <div className="detail-row">
              <span className="label">Montant Total:</span>
              <span className="value price-highlight">
                {booking.total_price} MAD
              </span>
            </div>
          </div>

          {/* Section Statut */}
          <div className="detail-section">
            <h3>Gestion du Statut</h3>
            <div className="status-selector">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`status-btn ${selectedStatus === status ? "active" : ""}`}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                >
                  <span className={`badge-small badge-${status}`}>
                    {statusLabels[status]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={18} /> Télécharger
          </button>
          <button className="btn-secondary" onClick={handleShare}>
            <Share2 size={18} /> Partager
          </button>
          <button className="btn-primary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateBookingThunk,
  cancelBookingThunk,
} from "../../../../features/agency/bookingThunks";

const BookingActions = ({ booking, onClose }) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    {
      value: "pending",
      label: "⏳ En attente",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "✅ Confirmée",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "canceled",
      label: "❌ Annulée",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "completed",
      label: "✔️ Complétée",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const handleStatusChange = async () => {
    console.log(`🔄 Changement de statut de ${booking.id} à ${selectedStatus}`);
    setLoading(true);
    try {
      await dispatch(
        updateBookingThunk({
          id: booking.id,
          status: selectedStatus,
        }),
      );
      console.log("✅ Statut mis à jour avec succès");
      onClose();
    } catch (error) {
      console.error("❌ Erreur lors du changement de statut:", error);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation?")) {
      console.log(`❌ Annulation de la réservation ${booking.id}`);
      setLoading(true);
      try {
        await dispatch(cancelBookingThunk(booking.id));
        console.log("✅ Réservation annulée avec succès");
        onClose();
      } catch (error) {
        console.error("❌ Erreur lors de l'annulation:", error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="booking-actions bg-white rounded-lg p-6 border border-gray-300">
      <h3 className="text-lg font-bold mb-4">🎯 Actions sur la Réservation</h3>

      {/* Sélecteur de statut */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Modifier le statut:</label>
        <select
          value={selectedStatus}
          onChange={(e) => {
            console.log("📝 Nouveau statut sélectionné:", e.target.value);
            setSelectedStatus(e.target.value);
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3">
        <button
          onClick={handleStatusChange}
          disabled={loading || selectedStatus === booking.status}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
        >
          {loading ? "⏳ En cours..." : "💾 Mettre à jour"}
        </button>

        {booking.status !== "canceled" && booking.status !== "completed" && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-semibold"
          >
            {loading ? "⏳ En cours..." : "❌ Annuler"}
          </button>
        )}

        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold"
        >
          ✕ Fermer
        </button>
      </div>

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
        <p className="font-bold mb-2">🐛 Info Debug:</p>
        <p>ID: {booking.id}</p>
        <p>Statut actuel: {booking.status}</p>
        <p>Statut sélectionné: {selectedStatus}</p>
      </div>
    </div>
  );
};

export default BookingActions;

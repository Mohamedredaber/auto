import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgencyBookingsThunk,
  fetchBookingStatsThunk,
} from "../../../features/agency/bookingThunks";
import {
  selectAllBookings,
  selectBookingLoading,
  selectBookingErrors,
  selectBookingStats,
} from "../../../features/agency/bookingSelector";
import ReservationList from "./componenets/ReservationList";

const Myreservationss = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectAllBookings);
  const loading = useSelector(selectBookingLoading);
  const errors = useSelector(selectBookingErrors);
  const stats = useSelector(selectBookingStats);

  useEffect(() => {
    // Charger les réservations
    dispatch(fetchAgencyBookingsThunk());
    // Charger les statistiques
    dispatch(fetchBookingStatsThunk());
  }, [dispatch]);

  // Afficher les données dans la console
  useEffect(() => {
    console.log("=== RÉSERVATIONS DE L'AGENCE ===");
    console.log("📊 Réservations:", bookings);
    console.log("📈 Statistiques:", stats);
    console.log("⏳ Loading:", loading);
    if (errors) {
      console.error("❌ Erreurs:", errors);
    }
  }, [bookings, stats, loading, errors]);

  return (
    <div className="myreservationss-container p-4">
      <h1 className="text-3xl font-bold mb-6">Mes Réservations</h1>

      {/* Affichage des erreurs */}
      {errors && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erreur:</p>
          <p>{errors.message || JSON.stringify(errors)}</p>
        </div>
      )}

      {/* Affichage du loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Chargement des réservations...</p>
        </div>
      )}

      {/* Affichage des statistiques */}
      {stats && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Réservations</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.total_bookings || 0}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">En attente</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending || 0}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Confirmées</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.confirmed || 0}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Revenus Totaux</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.total_revenue?.toFixed(2) || "0.00"} DH
            </p>
          </div>
        </div>
      )}

      {/* Composant de liste des réservations */}
      {!loading && bookings && bookings.length > 0 ? (
        <ReservationList bookings={bookings} />
      ) : (
        !loading && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">Aucune réservation trouvée</p>
          </div>
        )
      )}
    </div>
  );
};

export default Myreservationss;

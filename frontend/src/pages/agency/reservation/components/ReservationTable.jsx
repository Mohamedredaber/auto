import React, { useState } from "react";
import { MoreHorizontal, Calendar, MapPin } from "lucide-react";
import { useDispatch } from "react-redux";
import ActionMenu from "./ActionMenu";
import ReservationDetailsModal from "./ReservationDetailsModal";
import { DataTable } from "../../../../components/ui";
import {
  cancelAgencyBooking,
  getAgencyBookings,
} from "../../../../features/agency/bookingThunks";

const ReservationTable = ({ bookings, isLoading }) => {
  const dispatch = useDispatch();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div className="loader-table">Chargement...</div>;

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleEditStatus = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCancel = async (bookingId) => {
    try {
      await dispatch(cancelAgencyBooking(bookingId)).unwrap();
      // Rafraîchir la liste
      dispatch(getAgencyBookings({}));
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    // Rafraîchir la liste après fermeture du modal
    dispatch(getAgencyBookings({}));
  };

  return (
    <>
      <DataTable className="table-wrapper">
      <table className="visily-table ui-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Véhicule</th>
            <th>Période</th>
            <th>Total (MAD)</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="text-muted">RES-{booking.id}</td>
              <td>
                <div className="client-cell">
                  <div className="avatar-sm">
                    {booking.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="client-info">
                    <span className="client-name">
                      {booking.user.name}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <div className="vehicle-info">
                  <strong>
                    {booking.car.brand} {booking.car.model}
                  </strong>
                  <span className="text-xs text-muted">
                    ANNEE {booking.car.year}
                  </span>
                </div>
              </td>
              <td>
                <div className="period-cell">
                  <div>
                    <span className="label">Début:</span> {booking.start_date}
                  </div>
                  <div>
                    <span className="label">Fin:</span> {booking.end_date}
                  </div>
                </div>
              </td>
              <td className="price-cell">{booking.total_price} DH</td>
              <td>
                <span className={`badge badge-${booking.status}`}>
                  {booking.status === "canceled" ? "Annulée" : booking.status}
                </span>
              </td>
              <td>
                <ActionMenu
                  booking={booking}
                  onViewDetails={handleViewDetails}
                  onEditStatus={handleEditStatus}
                  onCancel={handleCancel}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </DataTable>

      <ReservationDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};
export default ReservationTable;

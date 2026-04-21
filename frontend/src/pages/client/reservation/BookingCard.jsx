import React from 'react';
import { useDispatch } from 'react-redux';
import { cancelBookingThunk } from '../../../features/client/clientThunks';
import { Calendar, MapPin, Car, Trash2 } from 'lucide-react'; // Ou tes icônes personnalisées
const BookingCard = ({ booking }) => {
  const dispatch = useDispatch();
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="car-info">
          <div className="car-icon-wrapper">
          </div>
          <div>
            <h3>{booking.car_details?.brand
 || "Véhicule"}</h3>
            <p className="agency-name">

              {booking.car?.agency}</p>
          </div>
        </div>
        <span className={`status-badge ${getStatusStyle(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="booking-card-body">
        <div className="info-item">

          <span>Du <strong>{booking.dates?.start}</strong> au <strong>{booking.dates?.end}</strong></span>
        </div>
        <div className="price-tag">
          {booking.total_price}
        </div>
      </div>

      <div className="booking-card-footer">
        {booking.status === 'pending' && (
          <button 
            className="btn-cancel"
            onClick={() => dispatch(cancelBookingThunk(booking.id))}
          >
            Annuler la réservation
          </button>
        )}
        <button className="btn-details">Voir détails</button>
      </div>
    </div>
  );
};

export default BookingCard;
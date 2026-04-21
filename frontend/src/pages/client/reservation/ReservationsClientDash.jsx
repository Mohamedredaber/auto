
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserBookings  , } from '../../../features/client/clientThunks';
import { selectBookingsSortedByDate, selectIsLoading } from '../../../features/client/clientSelectors';
import BookingCard from './BookingCard';
import './Bookings.css'
const ReservationsClientDash = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookingsSortedByDate);
  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  return (
    <div className="bookings-container">
      <header className="page-header">
        <h1>Mes Réservations</h1>
        <p>Gérez vos locations et suivez l'état de vos demandes.</p>
      </header>

      {isLoading ? (
        <div className="loader">Chargement de vos réservations...</div>
      ) : (
        <div className="bookings-grid">
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="empty-state">
              <p>Vous n'avez aucune réservation pour le moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationsClientDash;
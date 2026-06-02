import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserBookings, cancelBookingThunk } from '../../../features/client/clientThunks';
import { selectBookingsSortedByDate, selectIsLoading } from '../../../features/client/clientSelectors';
import BookingCard from './components/BookingCard';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui';
import './Bookings.css';

const ReservationsClientDash = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookingsSortedByDate);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleCancel = (id) => {  
    if (window.confirm("Voulez-vous vraiment annuler cette réservation ?")) {
      console.log(`Annulation de la réservation ${id}...`);
      dispatch(cancelBookingThunk(id));
    }
  };

  if (isLoading) return <div className="loader">Chargement de vos trajets...</div>;

  return (
    <div className="bookings-container">
      <header className="dash-header">
        <h1>Mes <span className="accent">Réservations</span></h1>
        <p>Gérez vos locations et l'historique de vos véhicules.</p>
      </header>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>Aucune réservation trouvée.</p>
          <Button as={Link} to="/cars">Louer une voiture</Button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
        
      )}
    </div>
  );
};

export default ReservationsClientDash;
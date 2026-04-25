import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAgencyBookings, 
  getBookingStats 
} from '../../../features/agency/BookingThunks';
import { 
  selectAllBookings, 
  selectBookingStats, 
  selectBookingLoading,
  selectBookingPagination 
} from '../../../features/agency/bookingSelector';
import './ReservationDashAgency.css';
// Sous-composants (à créer ci-dessous)
import ReservationStats from './components/ReservationStats';
import ReservationTable from './components/ReservationTable';
import ReservationFilters from './components/ReservationFilters';

const ReservationDashAgency = () => {
  const dispatch = useDispatch();
  
  // Sélecteurs
  const bookings = useSelector(selectAllBookings);
  const stats = useSelector(selectBookingStats);
  const loading = useSelector(selectBookingLoading);
  const pagination = useSelector(selectBookingPagination);
  console.log("Stats dans le composant:", bookings);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1
  });

  useEffect(() => {
    dispatch(getBookingStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAgencyBookings(filters));
  }, [dispatch, filters]);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="agency-reservations-container">
      <header className="page-header">
        <h1>Gestion des Réservations</h1>
        <p>Supervisez et gérez l'ensemble des contrats de location de la plateforme.</p>
      </header>

      {/* Cartes statistiques du haut */}
      <ReservationStats stats={stats} />

      {/* Barre de recherche et filtres */}
      <ReservationFilters filters={filters} setFilters={setFilters} />

      {/* Table des données */}
      <div className="table-container shadow-card">
        <ReservationTable bookings={bookings} isLoading={loading} />
        
        {/* Pagination footer */}
        <div className="table-footer">
          <span>Affichage de {bookings.length} sur {pagination.total} réservations</span>
          <div className="pagination-btns">
            <button 
              disabled={pagination.current_page === 1}
              onClick={() => handlePageChange(pagination.current_page - 1)}
            >Précédent</button>
            <button 
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => handlePageChange(pagination.current_page + 1)}
            >Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDashAgency;
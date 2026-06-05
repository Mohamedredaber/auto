import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar } from 'lucide-react';
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
import { Card } from '../../../components/ui';
// Sous-composants (à créer ci-dessous)
import ReservationStats from './components/ReservationStats';
import ReservationTable from './components/ReservationTable';
import ReservationFilters from './components/ReservationFilters';

const ReservationDashAgency = () => {
  const dispatch = useDispatch();
  
  // Sélecteurs
  const bookings = useSelector(selectAllBookings) || [];
  const stats = useSelector(selectBookingStats);
  const loading = useSelector(selectBookingLoading);
  const pagination = useSelector(selectBookingPagination) || {};
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
    <div className="agency-reservations-container animate-fade-in text-white">
      <Card as="header" className="page-header ac-card">
        <h1 className="inline-flex items-center gap-2">
          <Calendar size={20} className="text-red-500" />
          Gestion des Réservations
        </h1>
        <p className="text-gray-400">Supervisez et gérez l'ensemble des contrats de location de la plateforme.</p>
      </Card>

      {/* Cartes statistiques du haut */}
      <ReservationStats stats={stats} />

      {/* Barre de recherche et filtres */}
      <ReservationFilters filters={filters} setFilters={setFilters} />

      {/* Table des données */}
      <Card className="table-container shadow-card ac-card">
        <ReservationTable bookings={bookings} isLoading={loading} />
        
        {/* Pagination footer */}
        <div className="table-footer">
          <span>
            Affichage de {bookings.length} sur {pagination.total ?? bookings.length} réservations
          </span>
          <div className="pagination-btns">
            <button 
              className="pagination-btn"
              disabled={(pagination.current_page ?? 1) === 1}
              onClick={() => handlePageChange((pagination.current_page ?? 1) - 1)}
            >Précédent</button>
            <button 
              className="pagination-btn"
              disabled={(pagination.current_page ?? 1) >= (pagination.last_page ?? 1)}
              onClick={() => handlePageChange((pagination.current_page ?? 1) + 1)}
            >Suivant</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReservationDashAgency;
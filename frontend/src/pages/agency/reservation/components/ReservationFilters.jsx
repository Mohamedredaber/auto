import React from 'react';
import { Search, Filter, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../../../components/ui';

const ReservationFilters = ({ filters, setFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div className="filters-bar ac-card">
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
        <input 
          className="ac-input-dark"
          type="text" 
          name="search"
          placeholder="Rechercher par ID, client ou véhicule..." 
          value={filters.search}
          onChange={handleInputChange}
        />
      </div>

      <div className="filters-actions">
        <div className="filter-select">
          <Filter size={16} />
          <select name="status" value={filters.status} onChange={handleInputChange}>
            <option value="all">Statut</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="canceled">Annulée</option>
            <option value="completed">Terminée</option>
          </select>
        </div>

        {/* <Button variant="secondary" className="filter-btn">
          <MapPin size={16} /> Ville
        </Button> */}

        {/* <Button variant="secondary" className="filter-btn">
          <CalendarIcon size={16} /> Date
        </Button> */}

        {/* <Button variant="primary" className="btn-primary-pink">
          Nouvelle Réservation
        </Button> */}
      </div>
    </div>
  );
};

export default ReservationFilters;
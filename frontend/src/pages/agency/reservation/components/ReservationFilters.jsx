import React from 'react';
import { Search, Filter, MapPin, Calendar as CalendarIcon } from 'lucide-react';

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

        <button className="filter-btn">
          <MapPin size={16} /> Ville
        </button>

        <button className="filter-btn">
          <CalendarIcon size={16} /> Date
        </button>

        <button className="btn-primary-pink">
          Nouvelle Réservation
        </button>
      </div>
    </div>
  );
};

export default ReservationFilters;
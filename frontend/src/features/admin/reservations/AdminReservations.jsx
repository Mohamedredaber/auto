import React, { useState } from 'react';
import ReservationsTable from './components/ReservationsTable';
import { Search, Filter, Download } from 'lucide-react';

const AdminReservations = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Réservations</h1>
          <p className="text-gray-400 mt-1">Supervisez toutes les réservations de la plateforme.</p>
        </div>
        <button className="ac-btn ac-btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>
      
      <div className="ac-card">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rechercher par client, agence ou voiture..." 
              className="ac-input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button className="ac-btn ac-btn-outline flex items-center gap-2 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Statut
            </button>
            <button className="ac-btn ac-btn-outline flex items-center gap-2 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Date
            </button>
          </div>
        </div>

        {/* Table */}
        <ReservationsTable searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default AdminReservations;

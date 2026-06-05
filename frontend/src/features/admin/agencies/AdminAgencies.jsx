import React, { useState } from 'react';
import AgenciesTable from './components/AgenciesTable';
import { Search, Filter } from 'lucide-react';

const AdminAgencies = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Agences</h1>
          <p className="text-gray-400 mt-1">Gérez les agences partenaires et leurs statuts.</p>
        </div>
      </div>
      
      <div className="ac-card">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rechercher une agence..." 
              className="ac-input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="ac-btn ac-btn-outline flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrer par statut
          </button>
        </div>

        {/* Table */}
        <AgenciesTable searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default AdminAgencies;

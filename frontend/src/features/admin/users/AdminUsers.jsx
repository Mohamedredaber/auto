import React, { useState } from 'react';
import UsersTable from './components/UsersTable';
import { Search, Filter } from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h1>
          <p className="text-gray-400 mt-1">Gérez tous les utilisateurs de la plateforme (clients, admins agences, etc).</p>
        </div>
      </div>
      
      <div className="ac-card">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..." 
              className="ac-input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button className="ac-btn ac-btn-outline flex items-center gap-2 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Rôle
            </button>
            <button className="ac-btn ac-btn-outline flex items-center gap-2 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Statut
            </button>
          </div>
        </div>

        {/* Table */}
        <UsersTable searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default AdminUsers;

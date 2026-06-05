import React from 'react';
import { CheckCircle, XCircle, Eye, ShieldAlert } from 'lucide-react';

const mockAgencies = [
  { id: 1, name: 'AutoPlus Location', city: 'Casablanca', status: 'verified', carsCount: 24, joinDate: '2023-10-15' },
  { id: 2, name: 'Premium Cars', city: 'Rabat', status: 'pending', carsCount: 5, joinDate: '2023-11-02' },
  { id: 3, name: 'EcoRide', city: 'Marrakech', status: 'suspended', carsCount: 12, joinDate: '2023-08-20' },
  { id: 4, name: 'City Rent', city: 'Tanger', status: 'verified', carsCount: 30, joinDate: '2023-01-10' },
];

const AgenciesTable = ({ searchTerm }) => {
  const filtered = mockAgencies.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-gray-800/50 text-xs uppercase text-gray-300">
          <tr>
            <th className="px-6 py-4 font-medium">Agence</th>
            <th className="px-6 py-4 font-medium">Ville</th>
            <th className="px-6 py-4 font-medium">Voitures</th>
            <th className="px-6 py-4 font-medium">Statut</th>
            <th className="px-6 py-4 font-medium">Date d'inscription</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {filtered.map((agency) => (
            <tr key={agency.id} className="hover:bg-gray-800/20 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{agency.name}</td>
              <td className="px-6 py-4">{agency.city}</td>
              <td className="px-6 py-4">{agency.carsCount}</td>
              <td className="px-6 py-4">
                {agency.status === 'verified' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Vérifiée
                  </span>
                )}
                {agency.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    En attente
                  </span>
                )}
                {agency.status === 'suspended' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                    <XCircle className="w-3.5 h-3.5" />
                    Suspendue
                  </span>
                )}
              </td>
              <td className="px-6 py-4">{agency.joinDate}</td>
              <td className="px-6 py-4 flex justify-end gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Voir détails">
                  <Eye className="w-4 h-4" />
                </button>
                {agency.status === 'pending' && (
                  <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Vérifier">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {agency.status !== 'suspended' && (
                  <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Suspendre">
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                Aucune agence trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgenciesTable;

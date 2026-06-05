import React from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const mockCars = [
  { id: 1, name: 'Mercedes Classe C', agency: 'AutoPlus Location', price: '1200 MAD', status: 'approved' },
  { id: 2, name: 'Renault Clio 5', agency: 'EcoRide', price: '350 MAD', status: 'pending' },
  { id: 3, name: 'Range Rover Evoque', agency: 'Premium Cars', price: '2500 MAD', status: 'rejected' },
  { id: 4, name: 'Dacia Duster', agency: 'City Rent', price: '400 MAD', status: 'approved' },
];

const CarsTable = ({ searchTerm }) => {
  const filtered = mockCars.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.agency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-gray-800/50 text-xs uppercase text-gray-300">
          <tr>
            <th className="px-6 py-4 font-medium">Voiture</th>
            <th className="px-6 py-4 font-medium">Agence</th>
            <th className="px-6 py-4 font-medium">Prix/Jour</th>
            <th className="px-6 py-4 font-medium">Statut</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {filtered.map((car) => (
            <tr key={car.id} className="hover:bg-gray-800/20 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{car.name}</td>
              <td className="px-6 py-4">{car.agency}</td>
              <td className="px-6 py-4 font-medium text-gray-300">{car.price}</td>
              <td className="px-6 py-4">
                {car.status === 'approved' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                    Approuvée
                  </span>
                )}
                {car.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
                    En attente
                  </span>
                )}
                {car.status === 'rejected' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                    Rejetée
                  </span>
                )}
              </td>
              <td className="px-6 py-4 flex justify-end gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Voir détails">
                  <Eye className="w-4 h-4" />
                </button>
                {car.status === 'pending' && (
                  <>
                    <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Approuver">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Rejeter">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                Aucune voiture trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CarsTable;

import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const mockReservations = [
  { id: 'RES-001', client: 'Ahmed Ali', car: 'Mercedes Classe C', agency: 'AutoPlus Location', dates: '12 Nov - 15 Nov 2023', total: '3600 MAD', status: 'confirmed' },
  { id: 'RES-002', client: 'Sara Ahmed', car: 'Renault Clio 5', agency: 'EcoRide', dates: '20 Nov - 25 Nov 2023', total: '1750 MAD', status: 'pending' },
  { id: 'RES-003', client: 'Youssef Karim', car: 'Range Rover Evoque', agency: 'Premium Cars', dates: '01 Dec - 05 Dec 2023', total: '10000 MAD', status: 'cancelled' },
  { id: 'RES-004', client: 'Mounia Zaki', car: 'Dacia Duster', agency: 'City Rent', dates: '10 Dec - 12 Dec 2023', total: '800 MAD', status: 'completed' },
];

const ReservationsTable = ({ searchTerm }) => {
  const filtered = mockReservations.filter(r => 
    r.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-gray-800/50 text-xs uppercase text-gray-300">
          <tr>
            <th className="px-6 py-4 font-medium">ID</th>
            <th className="px-6 py-4 font-medium">Client</th>
            <th className="px-6 py-4 font-medium">Voiture / Agence</th>
            <th className="px-6 py-4 font-medium">Dates</th>
            <th className="px-6 py-4 font-medium">Total</th>
            <th className="px-6 py-4 font-medium">Statut</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {filtered.map((res) => (
            <tr key={res.id} className="hover:bg-gray-800/20 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{res.id}</td>
              <td className="px-6 py-4 font-medium text-gray-300">{res.client}</td>
              <td className="px-6 py-4">
                <div className="text-white">{res.car}</div>
                <div className="text-xs text-gray-500 mt-0.5">{res.agency}</div>
              </td>
              <td className="px-6 py-4">{res.dates}</td>
              <td className="px-6 py-4 font-medium text-white">{res.total}</td>
              <td className="px-6 py-4">
                {res.status === 'confirmed' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                    <CheckCircle className="w-3.5 h-3.5" /> Confirmée
                  </span>
                )}
                {res.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
                    <Clock className="w-3.5 h-3.5" /> En attente
                  </span>
                )}
                {res.status === 'cancelled' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                    <XCircle className="w-3.5 h-3.5" /> Annulée
                  </span>
                )}
                {res.status === 'completed' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <CheckCircle className="w-3.5 h-3.5" /> Terminée
                  </span>
                )}
              </td>
              <td className="px-6 py-4 flex justify-end gap-2">
                {res.status === 'pending' && (
                  <>
                    <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Confirmer">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Annuler">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                Aucune réservation trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsTable;

import React from 'react';
import { Shield, User, Lock, Unlock, Eye } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Karim Youssef', email: 'karim@example.com', role: 'client', status: 'active', joinDate: '2023-12-01' },
  { id: 2, name: 'AutoPlus Admin', email: 'admin@autoplus.ma', role: 'admin_agency', status: 'active', joinDate: '2023-10-15' },
  { id: 3, name: 'System Admin', email: 'super@autoconnect.com', role: 'super_admin', status: 'active', joinDate: '2023-01-01' },
  { id: 4, name: 'Sara Ahmed', email: 'sara@example.com', role: 'client', status: 'blocked', joinDate: '2024-01-12' },
];

const getRoleBadge = (role) => {
  switch (role) {
    case 'super_admin':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20"><Shield className="w-3.5 h-3.5" /> Super Admin</span>;
    case 'admin_agency':
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20"><Shield className="w-3.5 h-3.5" /> Admin Agence</span>;
    case 'client':
    default:
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20"><User className="w-3.5 h-3.5" /> Client</span>;
  }
};

const UsersTable = ({ searchTerm }) => {
  const filtered = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-gray-800/50 text-xs uppercase text-gray-300">
          <tr>
            <th className="px-6 py-4 font-medium">Utilisateur</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium">Rôle</th>
            <th className="px-6 py-4 font-medium">Statut</th>
            <th className="px-6 py-4 font-medium">Date d'inscription</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {filtered.map((user) => (
            <tr key={user.id} className="hover:bg-gray-800/20 transition-colors">
              <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                {user.name}
              </td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
              <td className="px-6 py-4">
                {user.status === 'active' ? (
                  <span className="text-green-500 font-medium text-xs">Actif</span>
                ) : (
                  <span className="text-red-500 font-medium text-xs">Bloqué</span>
                )}
              </td>
              <td className="px-6 py-4">{user.joinDate}</td>
              <td className="px-6 py-4 flex justify-end gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Voir profil">
                  <Eye className="w-4 h-4" />
                </button>
                {user.role !== 'super_admin' && (
                  user.status === 'active' ? (
                    <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Bloquer l'utilisateur">
                      <Lock className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Débloquer l'utilisateur">
                      <Unlock className="w-4 h-4" />
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

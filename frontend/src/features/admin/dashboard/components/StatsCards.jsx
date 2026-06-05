import React from 'react';
import { Users, Building2, Car, Calendar, CircleDollarSign } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    { label: 'Utilisateurs', value: '1,245', icon: <Users className="text-blue-500 w-5 h-5" />, delta: '+12%' },
    { label: 'Agences', value: '48', icon: <Building2 className="text-purple-500 w-5 h-5" />, delta: '+3%' },
    { label: 'Voitures', value: '842', icon: <Car className="text-red-500 w-5 h-5" />, delta: '+5%' },
    { label: 'Réservations', value: '3,102', icon: <Calendar className="text-orange-500 w-5 h-5" />, delta: '+18%' },
    { label: 'Revenu', value: '124.5k MAD', icon: <CircleDollarSign className="text-green-500 w-5 h-5" />, delta: '+22%' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((item, index) => (
        <div key={index} className="ac-card flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-400 text-sm font-medium">{item.label}</span>
            <span className="bg-gray-800/50 p-2 rounded-lg">{item.icon}</span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div className="text-2xl font-bold text-white truncate">{item.value}</div>
            <span className="text-green-500 text-sm font-medium">{item.delta}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

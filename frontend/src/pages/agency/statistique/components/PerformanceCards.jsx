import { TrendingUp, CircleDollarSign, CarFront, Clock } from 'lucide-react';

const PerformanceCards = ({ summary }) => {
  const stats = [
    { label: 'Total Réservations', value: summary?.total_bookings, icon: <TrendingUp className="text-blue-500 w-5 h-5" />, color: 'text-blue-500' },
    { label: 'Revenu Total', value: summary?.total_revenue, icon: <CircleDollarSign className="text-green-500 w-5 h-5" />, color: 'text-green-500' },
    { label: 'Véhicule Populaire', value: summary?.popular_car, icon: <CarFront className="text-red-500 w-5 h-5" />, color: 'text-red-500' },
    { label: 'Durée Moyenne', value: summary?.avg_duration, icon: <Clock className="text-purple-500 w-5 h-5" />, color: 'text-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div key={index} className="ac-card flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-400 text-sm font-medium">{item.label}</span>
            <span className="bg-gray-800/50 p-2 rounded-lg">{item.icon}</span>
          </div>
          <div className="text-xl font-bold text-white truncate">{item.value || '---'}</div>
        </div>
      ))}
    </div>
  );
};
export default PerformanceCards;
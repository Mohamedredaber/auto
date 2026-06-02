import React from 'react';
import { Calendar, User } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'reservation',
    title: 'Nouvelle réservation',
    description: 'Ahmed Ali a réservé une Mercedes C-Class (Agence X)',
    time: 'Il y a 10 min',
    icon: <Calendar className="w-4 h-4 text-orange-500" />
  },
  {
    id: 2,
    type: 'user',
    title: 'Nouvel utilisateur inscrit',
    description: 'Sarah a créé un compte client',
    time: 'Il y a 45 min',
    icon: <User className="w-4 h-4 text-blue-500" />
  },
  {
    id: 3,
    type: 'reservation',
    title: 'Réservation annulée',
    description: 'Youssef a annulé sa réservation',
    time: 'Il y a 2 heures',
    icon: <Calendar className="w-4 h-4 text-red-500" />
  },
  {
    id: 4,
    type: 'user',
    title: 'Nouvelle agence',
    description: 'L\'agence "AutoPlus" est en attente de vérification',
    time: 'Il y a 3 heures',
    icon: <User className="w-4 h-4 text-purple-500" />
  }
];

const RecentActivities = () => {
  return (
    <div className="ac-card h-full">
      <h2 className="text-lg font-semibold text-white mb-6">Activités Récentes</h2>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="mt-1 bg-gray-800/50 p-2 rounded-full h-fit">
              {activity.icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">{activity.title}</h4>
              <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
              <span className="text-xs text-gray-500 mt-2 block">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;

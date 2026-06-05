import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, percentage, isPositive, colorClass }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-card-header">
      <div className="stat-icon-wrapper">
        <Icon size={20} />
      </div>
      {percentage && (
        <span className={`stat-percentage ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {percentage}%
        </span>
      )}
    </div>
    <div className="stat-card-body">
      <span className="stat-label">{title}</span>
      <h2 className="stat-value">{value.toLocaleString()}</h2>
    </div>
  </div>
);

const ReservationStats = ({ stats }) => {
  if (!stats) return <div className="stats-skeleton">Chargement des stats...</div>;

  return (
    <div className="stats-grid">
      <StatCard 
        title="Total Réservations" 
        value={stats.total_bookings} 
        icon={Calendar} 
        percentage="12.5" 
        isPositive={true}
        colorClass="blue-glow"
      />
      <StatCard 
        title="En Attente" 
        value={stats.pending} 
        icon={Clock} 
        percentage="3" 
        isPositive={false}
        colorClass="orange-glow"
      />
      <StatCard 
        title="Confirmées" 
        value={stats.confirmed} 
        icon={CheckCircle} 
        percentage="18.2" 
        isPositive={true}
        colorClass="green-glow"
      />
      <StatCard 
        title="Annulées" 
        value={stats.canceled} 
        icon={XCircle} 
        percentage="2.4" 
        isPositive={false}
        colorClass="red-glow"
      />
    </div>
  );
};

export default ReservationStats;
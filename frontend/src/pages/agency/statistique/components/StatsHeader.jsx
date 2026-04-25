import { Calendar, Download } from 'lucide-react';

const StatsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Analyses de Performance</h1>
        <p className="text-gray-400 text-sm">Suivez l'évolution de votre flotte en temps réel.</p>
      </div>
      <div className="flex gap-3">
        <button className="header-btn-secondary text-sm">
          <Calendar className="w-4 h-4" />
          Derniers 12 mois
        </button>
        <button className="btn-exporter text-sm">
          <Download className="w-4 h-4" />
          Exporter le rapport
        </button>
      </div>
    </div>
  );
};
export default StatsHeader;
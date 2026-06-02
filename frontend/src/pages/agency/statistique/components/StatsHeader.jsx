import { useState } from 'react';
import { Calendar, Download, Loader2 } from 'lucide-react';
import axios from 'axios';

const StatsHeader = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/agency/statistics/export', {
        responseType: 'text',
        withCredentials: true,
      });

      const win = window.open('', '_blank');
      win.document.write(response.data);
      win.document.close();
    } catch (error) {
      console.error('Erreur export:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Analyses de Performance</h1>
        <p className="text-gray-400 text-sm">Suivez l'évolution de votre flotte en temps réel.</p>
      </div>
      <div className="flex gap-3">
        <button
          className="btn-exporter text-sm"
          onClick={handleExport}
          disabled={loading}
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Download className="w-4 h-4" />
          }
          {loading ? 'Génération...' : 'Exporter le rapport'}
        </button>
      </div>
    </div>
  );
};

export default StatsHeader;
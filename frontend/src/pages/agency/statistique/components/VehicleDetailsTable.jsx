const VehicleDetailsTable = ({ vehicles }) => {
  return (
    <div className="ac-card p-0 overflow-hidden">
      <div className="p-6 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-white font-semibold">Détails par Modèle</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#26292b]/50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Modèle</th>
              <th className="px-6 py-4">Locations</th>
              <th className="px-6 py-4">Taux d'utilisation</th>
              <th className="px-6 py-4">Revenu</th>
              <th className="px-6 py-4 text-center">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm">
            {vehicles?.map((car, index) => (
              <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{car.model}</td>
                <td className="px-6 py-4 text-gray-300">{car.count}</td>
                <td className="px-6 py-4 min-w-[150px]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full" 
                        style={{ width: `${car.usage_rate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{car.usage_rate}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-white font-semibold">{car.revenue} MAD</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs">
                    Performant
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default VehicleDetailsTable;
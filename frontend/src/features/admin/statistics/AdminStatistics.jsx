import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const topAgenciesData = [
  { name: 'AutoPlus', revenue: 45000 },
  { name: 'Premium Cars', revenue: 38000 },
  { name: 'EcoRide', revenue: 29000 },
  { name: 'City Rent', revenue: 25000 },
  { name: 'Maroc Auto', revenue: 18000 },
];

const carCategoriesData = [
  { name: 'Économique', value: 400 },
  { name: 'Compacte', value: 300 },
  { name: 'SUV', value: 300 },
  { name: 'Luxe', value: 200 },
];

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];

const AdminStatistics = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Statistiques Globales</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Agencies Chart */}
        <div className="ac-card h-96">
          <h2 className="text-lg font-semibold text-white mb-6">Top Agences par Revenu (MAD)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topAgenciesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#222222' }}
                contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', color: '#fff', borderRadius: '8px' }}
              />
              <Bar dataKey="revenue" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Rented Cars Categories */}
        <div className="ac-card h-96 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">Catégories les plus louées</h2>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carCategoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {carCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', color: '#fff', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {carCategoriesData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm text-gray-300">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Basic text table or lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ac-card">
           <h2 className="text-lg font-semibold text-white mb-4">Voitures les plus populaires</h2>
           <ul className="divide-y divide-gray-800">
             <li className="py-3 flex justify-between items-center text-sm">
                <span className="text-white">Mercedes Classe C</span>
                <span className="text-gray-400">145 réservations</span>
             </li>
             <li className="py-3 flex justify-between items-center text-sm">
                <span className="text-white">Renault Clio 5</span>
                <span className="text-gray-400">120 réservations</span>
             </li>
             <li className="py-3 flex justify-between items-center text-sm">
                <span className="text-white">Dacia Duster</span>
                <span className="text-gray-400">98 réservations</span>
             </li>
           </ul>
        </div>
        <div className="ac-card">
           <h2 className="text-lg font-semibold text-white mb-4">KPIs de Performance</h2>
           <div className="space-y-4">
              <div>
                 <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Taux de conversion</span>
                    <span className="text-white">4.8%</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Taux de remplissage flotte</span>
                    <span className="text-white">72%</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;

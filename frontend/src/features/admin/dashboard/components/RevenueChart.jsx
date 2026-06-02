import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, reservations: 240 },
  { name: 'Feb', revenue: 3000, reservations: 139 },
  { name: 'Mar', revenue: 2000, reservations: 980 },
  { name: 'Apr', revenue: 2780, reservations: 390 },
  { name: 'May', revenue: 1890, reservations: 480 },
  { name: 'Jun', revenue: 2390, reservations: 380 },
  { name: 'Jul', revenue: 3490, reservations: 430 },
];

const RevenueChart = () => {
  return (
    <div className="ac-card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Évolution des Revenus</h2>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
            <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', color: '#fff', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;

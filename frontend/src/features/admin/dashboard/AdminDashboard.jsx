import React from 'react';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import RecentActivities from './components/RecentActivities';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Vue d'ensemble</h1>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

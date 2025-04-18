import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/employerService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    canceled: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats({
          inProgress: data.inProgress || 0,
          completed: data.completed || 0,
          canceled: data.canceled || 0,
          loading: false,
          error: null
        });
      } catch (err) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard statistics'
        }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (stats.error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {stats.error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Employer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Leads in Progress</h2>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
          <p className="text-gray-500 text-sm mt-1">Total leads not completed</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-green-600 mb-2">Leads Completed</h2>
          <p className="text-3xl font-bold">{stats.completed}</p>
          <p className="text-gray-500 text-sm mt-1">Successfully closed leads</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Leads Canceled</h2>
          <p className="text-3xl font-bold">{stats.canceled}</p>
          <p className="text-gray-500 text-sm mt-1">Leads that were canceled</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
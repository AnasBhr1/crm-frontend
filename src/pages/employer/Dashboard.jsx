import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, Users, CheckSquare, Ban, Clock } from 'lucide-react';
import { API_URL } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-full ${color} text-white`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-3xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <div className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            <span>{change >= 0 ? `+${change}%` : `${change}%`}</span>
            <ArrowUpRight className={`ml-1 h-4 w-4 ${change >= 0 ? 'text-green-500' : 'rotate-90 text-red-500'}`} />
            <span className="ml-1 text-gray-500">since last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/employer/dashboard-stats`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Ban className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback data for development/preview
  const fallbackStats = {
    inProgress: 24,
    completed: 18,
    canceled: 5,
    totalManagers: 6,
    changes: {
      inProgress: 12,
      completed: 8,
      canceled: -3,
      totalManagers: 2
    }
  };
  
  const displayStats = stats || fallbackStats;
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-1">Overview</h2>
        <p className="text-sm text-gray-500">Monitor your business performance and lead management.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Leads in Progress"
          value={displayStats.inProgress}
          icon={Clock}
          color="bg-blue-500"
          change={displayStats.changes.inProgress}
        />
        <StatsCard
          title="Leads Completed"
          value={displayStats.completed}
          icon={CheckSquare}
          color="bg-green-500"
          change={displayStats.changes.completed}
        />
        <StatsCard
          title="Leads Canceled"
          value={displayStats.canceled}
          icon={Ban}
          color="bg-red-500"
          change={displayStats.changes.canceled}
        />
        <StatsCard
          title="Total Managers"
          value={displayStats.totalManagers}
          icon={Users}
          color="bg-purple-500"
          change={displayStats.changes.totalManagers}
        />
      </div>
      
      <div className="mt-12">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${['blue', 'green', 'yellow', 'red', 'purple'][index % 5]}-100 flex items-center justify-center`}>
                        <span className={`text-${['blue', 'green', 'yellow', 'red', 'purple'][index % 5]}-700 font-medium`}>{['AB', 'CD', 'EF', 'GH', 'IJ'][index]}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {['Acme Corp', 'Globex Industries', 'Initech LLC', 'Umbrella Corp', 'Massive Dynamic'][index]}
                        </div>
                        <div className="text-sm text-gray-500">
                          {['Lead created', 'Status updated to In Progress', 'Lead assigned to manager', 'Status updated to Completed', 'New contact info added'][index]}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${['bg-yellow-100 text-yellow-800', 'bg-blue-100 text-blue-800', 'bg-purple-100 text-purple-800', 'bg-green-100 text-green-800', 'bg-gray-100 text-gray-800'][index]}`}>
                        {['Pending', 'In Progress', 'Assigned', 'Completed', 'Updated'][index]}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {['John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Williams', 'Michael Brown'][index]}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {['5 minutes ago', '1 hour ago', '3 hours ago', 'Yesterday', '2 days ago'][index]}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
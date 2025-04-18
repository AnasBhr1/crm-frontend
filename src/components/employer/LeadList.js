import React, { useState, useEffect } from 'react';
import { getLeads, deleteLead, getManagers } from '../../services/employerService';
import LeadForm from './LeadForm';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [filters, setFilters] = useState({
    managerId: '',
    status: ''
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.managerId) queryParams.append('managerId', filters.managerId);
      if (filters.status) queryParams.append('status', filters.status);
      
      const data = await getLeads(queryParams);
      setLeads(data);
      setError(null);
    } catch (err) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const data = await getManagers();
      setManagers(data);
    } catch (err) {
      console.error('Failed to load managers:', err);
    }
  };

  useEffect(() => {
    fetchManagers();
    fetchLeads();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const handleEdit = (lead) => {
    setCurrentLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(id);
        fetchLeads();
      } catch (err) {
        setError('Failed to delete lead');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setCurrentLead(null);
  };

  const handleFormSuccess = () => {
    fetchLeads();
    handleFormClose();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && leads.length === 0) {
    return <div className="text-center py-10">Loading leads...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Leads</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Lead
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6">
          <LeadForm 
            lead={currentLead} 
            managers={managers}
            onSuccess={handleFormSuccess} 
            onCancel={handleFormClose} 
          />
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Manager</label>
            <select
              name="managerId"
              value={filters.managerId}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">All Managers</option>
              {managers.map(manager => (
                <option key={manager._id} value={manager._id}>{manager.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {
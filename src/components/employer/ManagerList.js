import React, { useState, useEffect } from 'react';
import { getManagers, deleteManager } from '../../services/employerService';
import ManagerForm from './ManagerForm';

const ManagerList = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentManager, setCurrentManager] = useState(null);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const data = await getManagers();
      setManagers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load managers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleEdit = (manager) => {
    setCurrentManager(manager);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      try {
        await deleteManager(id);
        fetchManagers();
      } catch (err) {
        setError('Failed to delete manager');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setCurrentManager(null);
  };

  const handleFormSuccess = () => {
    fetchManagers();
    handleFormClose();
  };

  if (loading) {
    return <div className="text-center py-10">Loading managers...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Managers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Manager
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6">
          <ManagerForm 
            manager={currentManager} 
            onSuccess={handleFormSuccess} 
            onCancel={handleFormClose} 
          />
        </div>
      )}

      {managers.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded text-center">
          No managers found. Add your first manager to get started.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {managers.map((manager) => (
                <tr key={manager._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{manager.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{manager.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(manager)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(manager._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash, Plus, Search, X, User, Mail, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [modalMode, setModalMode] = useState('create');
  const [currentId, setCurrentId] = useState(null);
  const [errors, setErrors] = useState({});
  
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/employer/managers`);
      setManagers(response.data);
    } catch (error) {
      toast.error('Failed to fetch managers');
      console.error('Error fetching managers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchManagers();
  }, []);
  
  const openCreateModal = () => {
    setModalData({ name: '', email: '', password: '' });
    setModalMode('create');
    setCurrentId(null);
    setErrors({});
    setShowModal(true);
  };
  
  const openEditModal = (manager) => {
    setModalData({
      name: manager.name,
      email: manager.email,
      password: '',
    });
    setModalMode('edit');
    setCurrentId(manager._id);
    setErrors({});
    setShowModal(true);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!modalData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!modalData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(modalData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (modalMode === 'create' && !modalData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (modalMode === 'create' && modalData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (modalMode === 'create') {
        await axios.post(`${API_URL}/api/employer/managers`, modalData);
        toast.success('Manager created successfully');
      } else {
        // If password is empty in edit mode, don't send it
        const dataToSend = { ...modalData };
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        
        await axios.put(`${API_URL}/api/employer/managers/${currentId}`, dataToSend);
        toast.success('Manager updated successfully');
      }
      
      setShowModal(false);
      fetchManagers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        `Failed to ${modalMode === 'create' ? 'create' : 'update'} manager`
      );
      console.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} manager:`, error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      try {
        await axios.delete(`${API_URL}/api/employer/managers/${id}`);
        toast.success('Manager deleted successfully');
        fetchManagers();
      } catch (error) {
        toast.error('Failed to delete manager');
        console.error('Error deleting manager:', error);
      }
    }
  };
  
  const filteredManagers = managers.filter(
    manager => manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Fallback data for development/preview
  const fallbackManagers = [
    { _id: '1', name: 'John Smith', email: 'john.smith@example.com', leadsCount: 8 },
    { _id: '2', name: 'Jane Doe', email: 'jane.doe@example.com', leadsCount: 12 },
    { _id: '3', name: 'Robert Johnson', email: 'robert.johnson@example.com', leadsCount: 5 },
    { _id: '4', name: 'Emily Williams', email: 'emily.williams@example.com', leadsCount: 9 },
    { _id: '5', name: 'Michael Brown', email: 'michael.brown@example.com', leadsCount: 7 },
  ];
  
  const displayManagers = managers.length > 0 ? filteredManagers : fallbackManagers;
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">Managers</h2>
          <p className="text-sm text-gray-500">Manage your team members and their access.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4" /> Add Manager
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10 py-2"
              placeholder="Search managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leads
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayManagers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No managers found.
                      {searchTerm && ' Try adjusting your search.'}
                    </td>
                  </tr>
                ) : (
                  displayManagers.map((manager) => (
                    <tr key={manager._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {manager.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{manager.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{manager.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{manager.leadsCount || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(manager)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(manager._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-light bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {modalMode === 'create' ? 'Add Manager' : 'Edit Manager'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="form-label flex items-center">
                            <User className="h-4 w-4 mr-1 text-gray-500" /> Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className={`form-input ${errors.name ? 'border-error' : ''}`}
                            value={modalData.name}
                            onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                          />
                          {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="form-label flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-500" /> Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className={`form-input ${errors.email ? 'border-error' : ''}`}
                            value={modalData.email}
                            onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                          />
                          {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="password" className="form-label flex items-center">
                            <Key className="h-4 w-4 mr-1 text-gray-500" /> 
                            {modalMode === 'create' ? 'Password' : 'New Password (leave blank to keep unchanged)'}
                          </label>
                          <input
                            type="password"
                            id="password"
                            className={`form-input ${errors.password ? 'border-error' : ''}`}
                            value={modalData.password}
                            onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
                          />
                          {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary sm:ml-3"
                  >
                    {modalMode === 'create' ? 'Create' : 'Update'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline mt-3 sm:mt-0"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Managers;
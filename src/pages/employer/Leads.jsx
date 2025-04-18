import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  X, 
  Trash, 
  Edit, 
  Building, 
  Mail, 
  User, 
  UserCircle, 
  FileText,
  ChevronDown
} from 'lucide-react';
import { API_URL, LEAD_STATUS, LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from '../../config/constants';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterManager, setFilterManager] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [modalData, setModalData] = useState({
    contactName: '',
    contactEmail: '',
    companyName: '',
    status: LEAD_STATUS.PENDING,
    managerId: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  
  const fetchLeads = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/employer/leads`;
      
      // Add query params if filters are applied
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterManager) params.append('managerId', filterManager);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setLeads(response.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employer/managers`);
      setManagers(response.data);
    } catch (error) {
      toast.error('Failed to fetch managers');
      console.error('Error fetching managers:', error);
    }
  };
  
  useEffect(() => {
    fetchLeads();
    fetchManagers();
  }, [filterStatus, filterManager]);
  
  const openCreateModal = () => {
    setModalData({
      contactName: '',
      contactEmail: '',
      companyName: '',
      status: LEAD_STATUS.PENDING,
      managerId: '',
      notes: ''
    });
    setModalMode('create');
    setCurrentId(null);
    setErrors({});
    setShowModal(true);
  };
  
  const openEditModal = (lead) => {
    setModalData({
      contactName: lead.contactName,
      contactEmail: lead.contactEmail,
      companyName: lead.companyName,
      status: lead.status,
      managerId: lead.managerId || '',
      notes: lead.notes || ''
    });
    setModalMode('edit');
    setCurrentId(lead._id);
    setErrors({});
    setShowModal(true);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!modalData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    
    if (!modalData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(modalData.contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }
    
    if (!modalData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!modalData.status) {
      newErrors.status = 'Status is required';
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
        await axios.post(`${API_URL}/api/employer/leads`, modalData);
        toast.success('Lead created successfully');
      } else {
        await axios.put(`${API_URL}/api/employer/leads/${currentId}`, modalData);
        toast.success('Lead updated successfully');
      }
      
      setShowModal(false);
      fetchLeads();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        `Failed to ${modalMode === 'create' ? 'create' : 'update'} lead`
      );
      console.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} lead:`, error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`${API_URL}/api/employer/leads/${id}`);
        toast.success('Lead deleted successfully');
        fetchLeads();
      } catch (error) {
        toast.error('Failed to delete lead');
        console.error('Error deleting lead:', error);
      }
    }
  };
  
  const resetFilters = () => {
    setFilterStatus('');
    setFilterManager('');
    setShowFilters(false);
  };
  
  const filteredLeads = leads.filter(lead => {
    return (
      (lead.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       lead.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  // Fallback data for development/preview
  const fallbackLeads = [
    { 
      _id: '1', 
      contactName: 'John Smith', 
      contactEmail: 'john.smith@acme.com', 
      companyName: 'Acme Corp', 
      status: LEAD_STATUS.PENDING, 
      managerId: '1',
      managerName: 'Jane Doe',
      createdAt: '2023-04-15T10:30:00Z'
    },
    { 
      _id: '2', 
      contactName: 'Emily Johnson', 
      contactEmail: 'emily@globex.com', 
      companyName: 'Globex Industries', 
      status: LEAD_STATUS.IN_PROGRESS, 
      managerId: '2',
      managerName: 'Robert Johnson',
      createdAt: '2023-04-12T14:20:00Z'
    },
    { 
      _id: '3', 
      contactName: 'Michael Williams', 
      contactEmail: 'michael@initech.com', 
      companyName: 'Initech LLC', 
      status: LEAD_STATUS.COMPLETED, 
      managerId: '1',
      managerName: 'Jane Doe',
      createdAt: '2023-04-10T09:15:00Z'
    },
    { 
      _id: '4', 
      contactName: 'Sarah Brown', 
      contactEmail: 'sarah@umbrella.com', 
      companyName: 'Umbrella Corp', 
      status: LEAD_STATUS.CANCELED, 
      managerId: '3',
      managerName: 'Emily Williams',
      createdAt: '2023-04-08T16:45:00Z'
    },
    { 
      _id: '5', 
      contactName: 'David Miller', 
      contactEmail: 'david@massive.com', 
      companyName: 'Massive Dynamic', 
      status: LEAD_STATUS.IN_PROGRESS, 
      managerId: '2',
      managerName: 'Robert Johnson',
      createdAt: '2023-04-05T11:00:00Z'
    },
  ];
  
  const displayLeads = leads.length > 0 ? filteredLeads : fallbackLeads;
  
  // Fallback managers data for development/preview
  const fallbackManagers = [
    { _id: '1', name: 'Jane Doe' },
    { _id: '2', name: 'Robert Johnson' },
    { _id: '3', name: 'Emily Williams' },
  ];
  
  const displayManagers = managers.length > 0 ? managers : fallbackManagers;
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">Leads</h2>
          <p className="text-sm text-gray-500">Manage all leads and assign them to your team.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="form-input pl-10 py-2 w-full md:w-80"
                placeholder="Search leads..."
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
            
            <div className="ml-0 md:ml-auto flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline ml-2 flex items-center"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-1 transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Manager</label>
                <select
                  className="form-select"
                  value={filterManager}
                  onChange={(e) => setFilterManager(e.target.value)}
                >
                  <option value="">All Managers</option>
                  {displayManagers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="btn btn-outline w-full"
                >
                  <X className="h-4 w-4 mr-1" /> Clear Filters
                </button>
              </div>
            </div>
          )}
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
                    Company / Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayLeads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No leads found.
                      {searchTerm && ' Try adjusting your search.'}
                      {(filterStatus || filterManager) && ' Try adjusting your filters.'}
                    </td>
                  </tr>
                ) : (
                  displayLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Building className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lead.companyName}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <User className="h-3 w-3 mr-1" /> {lead.contactName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {lead.contactEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${LEAD_STATUS_COLORS[lead.status]}`}>
                          {LEAD_STATUS_LABELS[lead.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {lead.managerId ? (
                            <>
                              <UserCircle className="h-5 w-5 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">
                                {lead.managerName || 'Unknown Manager'}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(lead)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
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
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {modalMode === 'create' ? 'Add Lead' : 'Edit Lead'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="companyName" className="form-label flex items-center">
                            <Building className="h-4 w-4 mr-1 text-gray-500" /> Company Name
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            className={`form-input ${errors.companyName ? 'border-error' : ''}`}
                            value={modalData.companyName}
                            onChange={(e) => setModalData({ ...modalData, companyName: e.target.value })}
                          />
                          {errors.companyName && <p className="mt-1 text-sm text-error">{errors.companyName}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="contactName" className="form-label flex items-center">
                            <User className="h-4 w-4 mr-1 text-gray-500" /> Contact Name
                          </label>
                          <input
                            type="text"
                            id="contactName"
                            className={`form-input ${errors.contactName ? 'border-error' : ''}`}
                            value={modalData.contactName}
                            onChange={(e) => setModalData({ ...modalData, contactName: e.target.value })}
                          />
                          {errors.contactName && <p className="mt-1 text-sm text-error">{errors.contactName}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="contactEmail" className="form-label flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-500" /> Contact Email
                          </label>
                          <input
                            type="email"
                            id="contactEmail"
                            className={`form-input ${errors.contactEmail ? 'border-error' : ''}`}
                            value={modalData.contactEmail}
                            onChange={(e) => setModalData({ ...modalData, contactEmail: e.target.value })}
                          />
                          {errors.contactEmail && <p className="mt-1 text-sm text-error">{errors.contactEmail}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="status" className="form-label flex items-center">
                            Status
                          </label>
                          <select
                            id="status"
                            className={`form-select ${errors.status ? 'border-error' : ''}`}
                            value={modalData.status}
                            onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                          >
                            {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          {errors.status && <p className="mt-1 text-sm text-error">{errors.status}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="managerId" className="form-label flex items-center">
                            <UserCircle className="h-4 w-4 mr-1 text-gray-500" /> Assign to Manager
                          </label>
                          <select
                            id="managerId"
                            className="form-select"
                            value={modalData.managerId}
                            onChange={(e) => setModalData({ ...modalData, managerId: e.target.value })}
                          >
                            <option value="">Unassigned</option>
                            {displayManagers.map((manager) => (
                              <option key={manager._id} value={manager._id}>
                                {manager.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="notes" className="form-label flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-gray-500" /> Notes
                          </label>
                          <textarea
                            id="notes"
                            rows={3}
                            className="form-input"
                            value={modalData.notes}
                            onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                            placeholder="Add any additional notes here..."
                          />
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

export default Leads;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  X, 
  Edit, 
  Building, 
  Mail, 
  User, 
  Check, 
  Clock, 
  Ban,
  ChevronDown,
  FileText,
  MessageSquare,
  Plus
} from 'lucide-react';
import { API_URL, LEAD_STATUS, LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from '../../config/constants';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [note, setNote] = useState('');
  
  const fetchLeads = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/managers/leads`;
      
      // Add query params if filters are applied
      if (filterStatus) {
        url += `?status=${filterStatus}`;
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
  
  useEffect(() => {
    fetchLeads();
  }, [filterStatus]);
  
  const openUpdateModal = (lead) => {
    setCurrentLead(lead);
    setSelectedStatus(lead.status);
    setNote('');
    setShowModal(true);
  };
  
  const handleUpdateLead = async (e) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }
    
    try {
      const updatedData = {
        status: selectedStatus
      };
      
      if (note.trim()) {
        updatedData.note = note.trim();
      }
      
      await axios.patch(`${API_URL}/api/managers/leads/${currentLead._id}`, updatedData);
      toast.success('Lead updated successfully');
      setShowModal(false);
      fetchLeads();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update lead');
      console.error('Error updating lead:', error);
    }
  };
  
  const resetFilters = () => {
    setFilterStatus('');
    setShowFilters(false);
  };
  
  const filteredLeads = leads.filter(lead => {
    return (
      (lead.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       lead.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const getStatusIcon = (status) => {
    switch (status) {
      case LEAD_STATUS.PENDING:
        return <Clock className="h-4 w-4 text-gray-500" />;
      case LEAD_STATUS.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-500" />;
      case LEAD_STATUS.COMPLETED:
        return <Check className="h-4 w-4 text-green-500" />;
      case LEAD_STATUS.CANCELED:
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Fallback data for development/preview
  const fallbackLeads = [
    { 
      _id: '1', 
      contactName: 'John Smith', 
      contactEmail: 'john.smith@acme.com', 
      companyName: 'Acme Corp', 
      status: LEAD_STATUS.PENDING,
      notes: ['Initial contact made', 'Scheduled follow-up call for next week'],
      createdAt: '2023-04-15T10:30:00Z',
      updatedAt: '2023-04-15T10:30:00Z'
    },
    { 
      _id: '2', 
      contactName: 'Emily Johnson', 
      contactEmail: 'emily@globex.com', 
      companyName: 'Globex Industries', 
      status: LEAD_STATUS.IN_PROGRESS,
      notes: ['Sent proposal', 'Client requesting additional information'],
      createdAt: '2023-04-12T14:20:00Z',
      updatedAt: '2023-04-12T14:20:00Z'
    },
    { 
      _id: '3', 
      contactName: 'Michael Williams', 
      contactEmail: 'michael@initech.com', 
      companyName: 'Initech LLC', 
      status: LEAD_STATUS.COMPLETED,
      notes: ['Deal closed', 'Signed contract received'],
      createdAt: '2023-04-10T09:15:00Z',
      updatedAt: '2023-04-10T09:15:00Z'
    },
    { 
      _id: '4', 
      contactName: 'Sarah Brown', 
      contactEmail: 'sarah@umbrella.com', 
      companyName: 'Umbrella Corp', 
      status: LEAD_STATUS.CANCELED,
      notes: ['Client went with competitor', 'Follow up in 6 months'],
      createdAt: '2023-04-08T16:45:00Z',
      updatedAt: '2023-04-08T16:45:00Z'
    },
    { 
      _id: '5', 
      contactName: 'David Miller', 
      contactEmail: 'david@massive.com', 
      companyName: 'Massive Dynamic', 
      status: LEAD_STATUS.IN_PROGRESS,
      notes: ['Negotiating terms', 'Client interested in premium package'],
      createdAt: '2023-04-05T11:00:00Z',
      updatedAt: '2023-04-05T11:00:00Z'
    },
  ];
  
  const displayLeads = leads.length > 0 ? filteredLeads : fallbackLeads;
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-1">My Leads</h2>
        <p className="text-sm text-gray-500">Manage your assigned leads and update their status.</p>
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
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="btn btn-outline w-full md:w-auto"
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
          <>
            {displayLeads.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No leads found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm && 'Try adjusting your search.'}
                  {filterStatus && !searchTerm && 'Try adjusting your filters.'}
                  {!searchTerm && !filterStatus && 'You have no leads assigned to you yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {displayLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="card hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Building className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{lead.companyName}</h3>
                      </div>
                      <span className={`badge ${LEAD_STATUS_COLORS[lead.status]}`}>
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="text-sm mb-4">
                        <div className="flex items-center mb-1">
                          <User className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{lead.contactName}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <a href={`mailto:${lead.contactEmail}`} className="text-primary">{lead.contactEmail}</a>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" /> Notes
                        </h4>
                        {lead.notes && lead.notes.length > 0 ? (
                          <ul className="space-y-2">
                            {lead.notes.map((note, index) => (
                              <li key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                {note}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No notes yet.</p>
                        )}
                      </div>
                      
                      <div className="mt-5 flex justify-end">
                        <button
                          className="btn btn-primary"
                          onClick={() => openUpdateModal(lead)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Status Update Modal */}
      {showModal && currentLead && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateLead}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-light bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                        Update Lead Status
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {currentLead.companyName} - {currentLead.contactName}
                      </p>
                      
                      <div className="mb-4">
                        <label className="form-label">Current Status</label>
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${LEAD_STATUS_COLORS[currentLead.status]}`}>
                          {getStatusIcon(currentLead.status)}
                          <span className="ml-1">{LEAD_STATUS_LABELS[currentLead.status]}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="status" className="form-label">New Status</label>
                        <select
                          id="status"
                          className="form-select"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="note" className="form-label flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-gray-500" /> Add Note
                        </label>
                        <textarea
                          id="note"
                          rows={3}
                          className="form-input"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Add a note about this status change..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary sm:ml-3"
                  >
                    Update Lead
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
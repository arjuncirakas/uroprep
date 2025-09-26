import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, FileText, TrendingUp, Clock, User, Phone, Mail, Eye, FileX, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Mock patient data - replace with actual API calls
  const mockPatients = [
    {
      id: 'URP2024001',
      name: 'John Smith',
      dob: '1965-03-15',
      medicare: '1234567890',
      phone: '0412 345 678',
      currentStatus: 'Active Surveillance',
      lastPSA: { value: 6.2, date: '2024-01-10' },
      referrals: [
        { id: 1, date: '2023-06-15', reason: 'PSA 8.5', status: 'Completed', outcome: 'Active Surveillance' },
        { id: 2, date: '2024-01-10', reason: 'Routine follow-up', status: 'Active', outcome: null }
      ],
      psaHistory: [
        { value: 8.5, date: '2023-06-15', velocity: null },
        { value: 7.8, date: '2023-09-20', velocity: -0.23 },
        { value: 6.2, date: '2024-01-10', velocity: -0.53 }
      ],
      appointments: [
        { date: '2024-04-15', type: 'Follow-up', status: 'Scheduled' },
        { date: '2024-07-15', type: 'PSA Review', status: 'Scheduled' }
      ]
    },
    {
      id: 'URP2024002',
      name: 'Mary Johnson',
      dob: '1958-07-22',
      medicare: '0987654321',
      phone: '0423 456 789',
      currentStatus: 'Post-Surgery',
      lastPSA: { value: 0.1, date: '2024-01-20' },
      referrals: [
        { id: 1, date: '2023-08-10', reason: 'PSA 15.2, abnormal DRE', status: 'Completed', outcome: 'Surgery' }
      ],
      psaHistory: [
        { value: 15.2, date: '2023-08-10', velocity: null },
        { value: 0.1, date: '2024-01-20', velocity: null }
      ],
      appointments: [
        { date: '2024-02-20', type: '3-month follow-up', status: 'Completed' },
        { date: '2024-05-20', type: '6-month follow-up', status: 'Scheduled' }
      ]
    }
  ];

  const filters = ['All', 'Active Surveillance', 'Post-Surgery', 'Awaiting Triage', 'Discharged'];

  // Filter patients by status and search term
  const filteredPatients = mockPatients.filter(patient => {
    // Status filter
    const statusMatch = activeFilter === 'All' || patient.currentStatus === activeFilter;
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicare.includes(searchTerm) ||
      patient.phone.includes(searchTerm);
    
    return statusMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active Surveillance': return 'bg-blue-100 text-blue-800';
      case 'Post-Surgery': return 'bg-green-100 text-green-800';
      case 'Awaiting Triage': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled for Surgery': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Search</h1>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, UPI, Medicare number, or phone..."
              className="w-full pl-10 pr-20 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              ⌘K
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{filter}</span>
                  <span className={`py-0.5 px-2 rounded-full text-xs font-semibold transition-colors ${
                    activeFilter === filter
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {filter === 'All' ? mockPatients.length : 
                     mockPatients.filter(p => p.currentStatus === filter).length}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {activeFilter} Patients ({filteredPatients.length})
              {searchTerm && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - Search: "{searchTerm}"
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {searchTerm 
                ? `Found ${filteredPatients.length} patient${filteredPatients.length !== 1 ? 's' : ''} matching your search`
                : 'All patients referred by your practice to urology'
              }
            </p>
          </div>
        </div>
          
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          {filteredPatients.length > 0 ? (
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[200px] min-w-[200px]">Patient</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">UPI</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[180px] min-w-[180px]">Contact</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[160px] min-w-[160px]">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[160px] min-w-[160px]">Latest PSA</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPatients.map((patient, index) => (
                  <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-4 px-4 w-[200px] min-w-[200px]">
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{patient.name}</p>
                          <p className="text-xs text-gray-500 leading-tight">Age: {calculateAge(patient.dob)} years</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-[140px] min-w-[140px]">
                      <div className="space-y-1">
                        <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-medium rounded-full border border-green-300">
                          {patient.id}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-[180px] min-w-[180px]">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 leading-tight">Medicare: {patient.medicare}</p>
                        <p className="text-xs text-gray-500 leading-tight flex items-center">
                          <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                          {patient.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-[160px] min-w-[160px]">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.currentStatus)}`}>
                          {patient.currentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-[160px] min-w-[160px]">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            patient.lastPSA.value > 10 ? 'bg-red-500' : 
                            patient.lastPSA.value > 4 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}></div>
                          <span className={`text-sm font-semibold ${
                            patient.lastPSA.value > 10 ? 'text-red-600' : 
                            patient.lastPSA.value > 4 ? 'text-amber-600' : 
                            'text-green-600'
                          }`}>
                            {patient.lastPSA.value} ng/mL
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-tight">{formatDate(patient.lastPSA.date)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-[140px] min-w-[140px]">
                      <div className="flex items-center justify-start">
                        <button
                          onClick={() => navigate(`/gp/patient-details/${patient.id}`)}
                          className="group relative inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1 text-white group-hover:text-white transition-colors" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </td>
                </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FileX className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchTerm ? 'No patients found' : 'No patients available'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? `No patients match your search for "${searchTerm}". Try adjusting your search terms or clearing the search.`
                  : 'There are no patients in this category at the moment.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Footer with Pagination */}
        {filteredPatients.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients
              </div>
              
              {/* Pagination */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default PatientSearch;

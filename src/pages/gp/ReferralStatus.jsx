import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  FileText,
  Search,
  X,
  FileX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ReferralStatus = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  // Mock referral data - replace with actual API calls
  const mockReferrals = [
    {
      id: 'REF001',
      upi: 'URP2024001',
      patientName: 'John Smith',
      dob: '1965-03-15',
      referralDate: '2024-01-15',
      status: 'Active Surveillance',
      priority: 'Medium',
      currentDatabase: 'DB2',
      daysSinceReferral: 12,
      nextAction: '6-month PSA review',
      nextAppointment: '2024-07-15',
      latestPSA: 6.2
    },
    {
      id: 'REF002',
      upi: 'URP2024002',
      patientName: 'Mary Johnson',
      dob: '1958-07-22',
      referralDate: '2024-01-10',
      status: 'Post-Surgery',
      priority: 'High',
      currentDatabase: 'DB4',
      daysSinceReferral: 17,
      nextAction: '3-month follow-up',
      nextAppointment: '2024-04-20',
      latestPSA: 0.1
    },
    {
      id: 'REF003',
      upi: 'URP2024003',
      patientName: 'Robert Brown',
      dob: '1970-11-08',
      referralDate: '2024-01-20',
      status: 'Awaiting Triage',
      priority: 'Routine',
      currentDatabase: 'Queue',
      daysSinceReferral: 7,
      nextAction: 'Initial triage',
      nextAppointment: null,
      latestPSA: 5.8
    },
    {
      id: 'REF004',
      upi: 'URP2024004',
      patientName: 'David Wilson',
      dob: '1962-05-14',
      referralDate: '2023-12-05',
      status: 'Discharged to GP',
      priority: 'Low',
      currentDatabase: 'Discharged',
      daysSinceReferral: 52,
      nextAction: 'Annual PSA monitoring',
      nextAppointment: '2024-12-05',
      latestPSA: 3.1
    }
  ];

  const filters = ['All', 'Awaiting Triage', 'Active Surveillance', 'Post-Surgery', 'Discharged to GP'];

  // Filter referrals by status and search query
  const filteredReferrals = mockReferrals.filter(ref => {
    // Status filter
    const statusMatch = activeFilter === 'All' || 
      (activeFilter === 'Awaiting Triage' && ref.status === 'Awaiting Triage') ||
      (activeFilter === 'Active Surveillance' && ref.status === 'Active Surveillance') ||
      (activeFilter === 'Post-Surgery' && ref.status === 'Post-Surgery') ||
      (activeFilter === 'Discharged to GP' && ref.status === 'Discharged to GP');
    
    // Search filter
    const searchMatch = searchQuery === '' || 
      ref.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.upi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReferrals = filteredReferrals.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Clear session storage when component mounts to ensure clean state
  useEffect(() => {
    sessionStorage.removeItem('lastVisitedPage');
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Active Surveillance': return 'bg-blue-100 text-blue-800';
      case 'Post-Surgery': return 'bg-green-100 text-green-800';
      case 'Awaiting Triage': return 'bg-yellow-100 text-yellow-800';
      case 'Discharged to GP': return 'bg-gray-100 text-gray-800';
      case 'Scheduled for Surgery': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Routine': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referral Status Tracker</h1>
      </div>
      
      {/* Search Bar and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, UPI, or referral ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
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
        
        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity">
            <FileText className="h-4 w-4 mr-2" />
            <span className="font-medium">New Referral</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                    {filter === 'All' ? mockReferrals.length : 
                     mockReferrals.filter(ref => {
                       switch (filter) {
                         case 'Awaiting Triage': return ref.status === 'Awaiting Triage';
                         case 'Active Surveillance': return ref.status === 'Active Surveillance';
                         case 'Post-Surgery': return ref.status === 'Post-Surgery';
                         case 'Discharged to GP': return ref.status === 'Discharged to GP';
                         default: return true;
                       }
                     }).length}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {activeFilter} Referrals ({filteredReferrals.length})
              {searchQuery && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - Search: "{searchQuery}"
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {searchQuery 
                ? `Found ${filteredReferrals.length} referral${filteredReferrals.length !== 1 ? 's' : ''} matching your search`
                : 'Track your latest patient referrals and their status'
              }
            </p>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          {filteredReferrals.length > 0 ? (
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[200px] min-w-[200px]">Patient</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">Referral ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[180px] min-w-[180px]">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[160px] min-w-[160px]">PSA Level</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentReferrals.map((referral, index) => (
                <tr key={referral.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="py-4 px-4 w-[200px] min-w-[200px]">
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {referral.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {referral.priority === 'High' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{referral.patientName}</p>
                        <p className="text-xs text-gray-500 leading-tight">Referred: {formatDate(referral.referralDate)}</p>
                        <p className="text-xs text-gray-400 leading-tight">{referral.daysSinceReferral} days ago</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[140px] min-w-[140px]">
                    <div className="space-y-1">
                      <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-medium rounded-full border border-green-300">
                        {referral.id}
                      </div>
                      <p className="text-xs text-gray-500 leading-tight">UPI: {referral.upi}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[180px] min-w-[180px]">
                    <div className="flex items-center space-x-2">
                      {referral.status === 'Awaiting Triage' && <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />}
                      {referral.status === 'Active Surveillance' && <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                      {referral.status === 'Post-Surgery' && <AlertCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                      {referral.status === 'Discharged to GP' && <CheckCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />}
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[160px] min-w-[160px]">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          referral.latestPSA > 10 ? 'bg-red-500' : 
                          referral.latestPSA > 4 ? 'bg-amber-500' : 
                          'bg-green-500'
                        }`}></div>
                        <span className={`text-sm font-semibold ${
                          referral.latestPSA > 10 ? 'text-red-600' : 
                          referral.latestPSA > 4 ? 'text-amber-600' : 
                          'text-green-600'
                        }`}>
                          {referral.latestPSA} ng/mL
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-tight">Next: {referral.nextAction}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[140px] min-w-[140px]">
                    <div className="flex items-center justify-start">
                      <button
                        onClick={() => {
                          sessionStorage.setItem('lastVisitedPage', 'referral-status');
                          navigate(`/gp/referral-details/${referral.id}`);
                        }}
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
                {searchQuery ? 'No referrals found' : 'No referrals available'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No referrals match your search for "${searchQuery}". Try adjusting your search terms or clearing the search.`
                  : 'There are no referrals in this category at the moment. Check back later or try a different filter.'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
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
        {filteredReferrals.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredReferrals.length)} of {filteredReferrals.length} referrals
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

export default ReferralStatus;

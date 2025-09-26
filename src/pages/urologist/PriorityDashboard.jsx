import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  Stethoscope, 
  Target, 
  CheckCircle,
  Calendar,
  Activity,
  Bell,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  X,
  Search,
  Filter,
  User,
  Shield,
  TrendingUp,
  FileX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PriorityDashboard = () => {
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  const { alerts } = useSelector(state => state.alerts);
  
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Calculate basic priority metrics
  const calculatePriorityMetrics = () => {
    const urgentReferrals = referrals.filter(r => r.priority === 'urgent' && r.status === 'pending');
    const awaitingDecisions = db1.patients.filter(p => !p.clinicalDecision);
    const tomorrowSurgeries = db3.patients.filter(p => {
      const surgeryDate = new Date(p.surgeryDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return surgeryDate.toDateString() === tomorrow.toDateString();
    });
    const overdueFollowups = db4.patients.filter(p => 
      p.nextAppointment && new Date(p.nextAppointment) < new Date()
    );

    return {
      urgentReferrals,
      awaitingDecisions,
      tomorrowSurgeries,
      overdueFollowups
    };
  };

  const priorityMetrics = calculatePriorityMetrics();

  // Combined priority data for table view
  const allPriorityCases = [
    {
      id: 1,
      name: 'John Smith',
      age: 65,
      psa: 25.4,
      category: 'Urgent Referrals',
      priority: 'High',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main St, Melbourne VIC 3000',
      referringGP: 'Dr. Sarah Johnson',
      referralDate: '2024-01-10',
      clinicalNotes: 'Patient presents with elevated PSA and family history of prostate cancer. DRE reveals firm nodule in left lobe.',
      imaging: 'MRI scheduled for next week',
      comorbidities: 'Hypertension, Type 2 Diabetes',
      waitTime: 5,
      status: 'Awaiting Review'
    },
    {
      id: 2,
      name: 'Mary Johnson',
      age: 58,
      psa: 18.7,
      category: 'Urgent Referrals',
      priority: 'High',
      phone: '+61 423 456 789',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave, Sydney NSW 2000',
      referringGP: 'Dr. Michael Chen',
      referralDate: '2024-01-12',
      clinicalNotes: 'Rapidly rising PSA over 6 months. Patient reports urinary symptoms and weight loss.',
      imaging: 'CT scan completed - no distant metastases',
      comorbidities: 'Obesity',
      waitTime: 3,
      status: 'Awaiting Review'
    },
    {
      id: 3,
      name: 'David Wilson',
      age: 68,
      psa: 8.5,
      category: 'Awaiting Decisions',
      priority: 'High',
      phone: '+61 445 678 901',
      email: 'david.wilson@email.com',
      address: '321 Elm St, Perth WA 6000',
      clinicalNotes: 'Patient completed all investigations. MRI shows T2a disease. Awaiting urologist decision on treatment pathway.',
      imaging: 'MRI completed - T2a disease',
      comorbidities: 'None',
      lastReview: '2024-01-15',
      status: 'Decision Pending'
    },
    {
      id: 4,
      name: 'Sarah Davis',
      age: 71,
      psa: 15.2,
      category: 'Awaiting Decisions',
      priority: 'High',
      phone: '+61 456 789 012',
      email: 'sarah.davis@email.com',
      address: '654 Maple Dr, Adelaide SA 5000',
      clinicalNotes: 'High-risk prostate cancer. All staging investigations complete. Awaiting MDT discussion and treatment recommendation.',
      imaging: 'CT and bone scan completed',
      comorbidities: 'Hypertension',
      lastReview: '2024-01-14',
      status: 'MDT Pending'
    },
    {
      id: 5,
      name: 'Michael Miller',
      age: 69,
      psa: 15.2,
      category: 'Tomorrow\'s Surgeries',
      priority: 'High',
      phone: '+61 467 890 123',
      email: 'michael.miller@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      surgeryType: 'RALP',
      time: '09:00',
      gleasonScore: '4+4=8',
      stage: 'T3a',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      estimatedDuration: '4 hours',
      specialRequirements: 'Cardiac monitoring required',
      checklist: 'Complete',
      status: 'Scheduled'
    },
    {
      id: 6,
      name: 'Jennifer Wilson',
      age: 64,
      psa: 8.7,
      category: 'Tomorrow\'s Surgeries',
      priority: 'Medium',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      surgeryType: 'Open Prostatectomy',
      time: '14:00',
      gleasonScore: '3+4=7',
      stage: 'T2c',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Jennifer Lee',
      estimatedDuration: '5 hours',
      specialRequirements: 'None',
      checklist: 'Complete',
      status: 'Scheduled'
    },
    {
      id: 7,
      name: 'William Thompson',
      age: 68,
      psa: 2.1,
      category: 'Overdue Follow-ups',
      priority: 'Medium',
      phone: '+61 489 012 345',
      email: 'william.thompson@email.com',
      address: '258 Pine St, Canberra ACT 2600',
      lastAppointment: '2023-11-15',
      nextAppointment: '2024-01-10',
      clinicalNotes: 'Post-operative follow-up. Last PSA was 2.1 ng/mL. Patient has been contacted but unable to attend scheduled appointment.',
      imaging: 'PSMA PET scan scheduled',
      comorbidities: 'None',
      daysOverdue: 5,
      status: 'Overdue'
    },
    {
      id: 8,
      name: 'Christopher Lee',
      age: 72,
      psa: 1.8,
      category: 'Overdue Follow-ups',
      priority: 'High',
      phone: '+61 490 123 456',
      email: 'christopher.lee@email.com',
      address: '369 Oak Ave, Gold Coast QLD 4217',
      lastAppointment: '2023-10-20',
      nextAppointment: '2024-01-05',
      clinicalNotes: 'Active surveillance patient. PSA rising slowly. Multiple attempts to contact patient unsuccessful.',
      imaging: 'MRI scheduled',
      comorbidities: 'Diabetes',
      daysOverdue: 10,
      status: 'Overdue'
    }
  ];

  const filters = ['All', 'Urgent Referrals', 'Awaiting Decisions', 'Tomorrow\'s Surgeries', 'Overdue Follow-ups'];

  // Filter cases by category and search query
  const filteredCases = allPriorityCases.filter(case_ => {
    // Category filter
    const categoryMatch = activeFilter === 'All' || case_.category === activeFilter;
    
    // Search filter
    const searchMatch = searchQuery === '' || 
      case_.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.phone.includes(searchQuery) ||
      case_.id.toString().includes(searchQuery);
    
    return categoryMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCases = filteredCases.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Awaiting Review': return 'bg-yellow-100 text-yellow-800';
      case 'Decision Pending': return 'bg-orange-100 text-orange-800';
      case 'MDT Pending': return 'bg-purple-100 text-purple-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Urgent Referrals': return AlertTriangle;
      case 'Awaiting Decisions': return Target;
      case 'Tomorrow\'s Surgeries': return Stethoscope;
      case 'Overdue Follow-ups': return Clock;
      default: return User;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Priority Dashboard</h1>
        <p className="text-gray-600 mt-1">Clinical decision support and priority case management</p>
      </div>
      
      {/* Search Bar and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, phone, or ID..."
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
            <Filter className="h-4 w-4 mr-2" />
            <span className="font-medium">Filter Options</span>
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
                    {filter === 'All' ? allPriorityCases.length : 
                     allPriorityCases.filter(case_ => case_.category === filter).length}
            </span>
          </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Priority Cases List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {activeFilter} Cases ({filteredCases.length})
              {searchQuery && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - Search: "{searchQuery}"
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {searchQuery 
                ? `Found ${filteredCases.length} case${filteredCases.length !== 1 ? 's' : ''} matching your search`
                : 'Track priority cases requiring clinical attention'
              }
            </p>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          {filteredCases.length > 0 ? (
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[200px] min-w-[200px]">Patient</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[180px] min-w-[180px]">Category</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[160px] min-w-[160px]">Priority</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[160px] min-w-[160px]">PSA Level</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentCases.map((case_, index) => {
                  const CategoryIcon = getCategoryIcon(case_.category);
                  return (
                    <tr key={case_.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-4 px-4 w-[200px] min-w-[200px]">
                    <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {case_.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                            {case_.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-sm leading-tight">{case_.name}</p>
                            <p className="text-xs text-gray-500 leading-tight">Age: {case_.age}</p>
                            <p className="text-xs text-gray-400 leading-tight">ID: {case_.id}</p>
                      </div>
                    </div>
                      </td>
                      <td className="py-4 px-4 w-[180px] min-w-[180px]">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.category}
                          </span>
                  </div>
                      </td>
                      <td className="py-4 px-4 w-[160px] min-w-[160px]">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(case_.priority)}`}>
                          {case_.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 w-[160px] min-w-[160px]">
                        <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              case_.psa > 10 ? 'bg-red-500' : 
                              case_.psa > 4 ? 'bg-amber-500' : 
                              'bg-green-500'
                            }`}></div>
                            <span className={`text-sm font-semibold ${
                              case_.psa > 10 ? 'text-red-600' : 
                              case_.psa > 4 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}>
                              {case_.psa} ng/mL
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 leading-tight">Status: {case_.status}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 w-[140px] min-w-[140px]">
                        <div className="flex items-center justify-start">
                    <button
                            onClick={() => handlePatientSelect(case_)}
                            className="group relative inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1 text-white group-hover:text-white transition-colors" />
                            <span>View Details</span>
                    </button>
                  </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FileX className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery ? 'No cases found' : 'No cases available'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No cases match your search for "${searchQuery}". Try adjusting your search terms or clearing the search.`
                  : 'There are no cases in this category at the moment. Check back later or try a different filter.'
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
        {filteredCases.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCases.length)} of {filteredCases.length} cases
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

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-sm text-gray-600">Age: {selectedPatient.age} • PSA: {selectedPatient.psa} ng/mL</p>
                  </div>
                </div>
                <button
                  onClick={closePatientModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Patient Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Age</p>
                        <p className="text-lg font-bold text-blue-600">{selectedPatient.age}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-3">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-900">PSA</p>
                        <p className="text-lg font-bold text-green-600">{selectedPatient.psa} ng/mL</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPatient.gleasonScore && (
                    <div className="bg-gradient-to-r from-yellow-50 to-gray-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center mr-3">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-yellow-900">Gleason</p>
                          <p className="text-lg font-bold text-yellow-600">{selectedPatient.gleasonScore}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.stage && (
                    <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-900">Stage</p>
                          <p className="text-lg font-bold text-purple-600">{selectedPatient.stage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedPatient.address}</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Information */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Clinical Information</h4>
                  <div className="space-y-3">
                    {selectedPatient.clinicalNotes && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Clinical Notes:</p>
                        <p className="text-sm text-gray-700">{selectedPatient.clinicalNotes}</p>
                      </div>
                    )}
                    {selectedPatient.imaging && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Imaging:</p>
                        <p className="text-sm text-gray-700">{selectedPatient.imaging}</p>
                      </div>
                    )}
                    {selectedPatient.comorbidities && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Comorbidities:</p>
                        <p className="text-sm text-gray-700">{selectedPatient.comorbidities}</p>
                      </div>
                    )}
                    {selectedPatient.referringGP && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Referring GP:</p>
                        <p className="text-sm text-gray-700">{selectedPatient.referringGP}</p>
                      </div>
                    )}
                    {selectedPatient.surgeon && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Surgeon:</p>
                        <p className="text-sm text-gray-700">{selectedPatient.surgeon}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      console.log('Call patient:', selectedPatient.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Patient
                  </button>
                  <button
                    onClick={() => {
                      console.log('Schedule appointment for:', selectedPatient.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closePatientModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      console.log('Edit patient:', selectedPatient.id);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Edit Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorityDashboard;
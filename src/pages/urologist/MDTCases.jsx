import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Clock,
  Database,
  Activity,
  Stethoscope,
  Heart,
  ArrowRight,
  X,
  Filter,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Target,
  Shield,
  Users,
  Send,
  Download,
  ClipboardList,
  MessageSquare,
  FileCheck
} from 'lucide-react';

const MDTCases = () => {
  const navigate = useNavigate();
  const { referrals } = useSelector(state => state.referrals);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showMDTNotesModal, setShowMDTNotesModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Mock MDT cases data
  const mdtCases = [
    {
      id: 'MDT001',
      patientName: 'Michael Miller',
      age: 69,
      dob: '1955-03-20',
      phone: '+61 467 890 123',
      email: 'michael.miller@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      psa: 15.2,
      status: 'Pending Review',
      priority: 'High',
      type: 'OPD',
      referralDate: '2024-01-08',
      referringGP: 'Dr. Sarah Johnson',
      clinicalNotes: 'High-risk prostate cancer. MRI shows extracapsular extension. PSMA PET scan shows no distant metastases.',
      imaging: 'MRI completed - T3a disease with extracapsular extension',
      comorbidities: 'Hypertension',
      familyHistory: false,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary frequency'],
      waitTime: 7,
      lastPSA: 15.2,
      gleasonScore: '4+4=8',
      stage: 'T3a',
      mdtDate: '2024-01-20',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: ''
    },
    {
      id: 'MDT002',
      patientName: 'Jennifer Wilson',
      age: 64,
      dob: '1960-04-18',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      psa: 8.7,
      status: 'Pending Review',
      priority: 'Medium',
      type: 'OPD',
      referralDate: '2024-01-10',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'Intermediate-risk prostate cancer. CT shows no lymph node involvement. Patient prefers active surveillance.',
      imaging: 'CT completed - T2c disease, no lymph node involvement',
      comorbidities: 'None',
      familyHistory: true,
      dre: 'abnormal',
      clinicalSymptoms: [],
      waitTime: 5,
      lastPSA: 8.7,
      gleasonScore: '3+4=7',
      stage: 'T2c',
      mdtDate: '2024-01-22',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: ''
    },
    {
      id: 'MDT003',
      patientName: 'William Anderson',
      age: 66,
      dob: '1958-01-25',
      phone: '+61 489 012 345',
      email: 'william.anderson@email.com',
      address: '258 Pine St, Canberra ACT 2600',
      psa: 22.5,
      status: 'Pending Review',
      priority: 'High',
      type: 'IPD',
      referralDate: '2024-01-05',
      referringGP: 'Dr. Jennifer Lee',
      clinicalNotes: 'High-risk prostate cancer with bone pain. Bone scan shows multiple lesions. PSMA PET scan confirms metastatic disease.',
      imaging: 'Bone scan and PSMA PET completed - multiple bone metastases',
      comorbidities: 'Diabetes',
      familyHistory: false,
      dre: 'abnormal',
      clinicalSymptoms: ['bone pain', 'weight loss'],
      waitTime: 10,
      lastPSA: 22.5,
      gleasonScore: '4+5=9',
      stage: 'T4 N1 M1',
      mdtDate: '2024-01-18',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: ''
    },
    {
      id: 'MDT004',
      patientName: 'Christopher Lee',
      age: 72,
      dob: '1952-08-12',
      phone: '+61 490 123 456',
      email: 'christopher.lee@email.com',
      address: '369 Oak Ave, Gold Coast QLD 4217',
      psa: 6.8,
      status: 'Pending Review',
      priority: 'Medium',
      type: 'OPD',
      referralDate: '2024-01-12',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'Intermediate-risk prostate cancer. MRI shows T2b disease. Patient has multiple comorbidities.',
      imaging: 'MRI completed - T2b disease, organ-confined',
      comorbidities: 'Hypertension, Diabetes, COPD',
      familyHistory: false,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary hesitancy'],
      waitTime: 3,
      lastPSA: 6.8,
      gleasonScore: '3+4=7',
      stage: 'T2b',
      mdtDate: '2024-01-25',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: ''
    },
    {
      id: 'MDT005',
      patientName: 'Thomas Brown',
      age: 68,
      dob: '1956-11-30',
      phone: '+61 501 234 567',
      email: 'thomas.brown@email.com',
      address: '741 Elm St, Newcastle NSW 2300',
      psa: 18.3,
      status: 'Pending Review',
      priority: 'High',
      type: 'IPD',
      referralDate: '2024-01-15',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'High-risk prostate cancer. MRI shows seminal vesicle involvement. PSMA PET scan shows no distant metastases.',
      imaging: 'MRI and PSMA PET completed - T3b disease with seminal vesicle involvement',
      comorbidities: 'None',
      familyHistory: true,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary frequency', 'nocturia'],
      waitTime: 0,
      lastPSA: 18.3,
      gleasonScore: '4+4=8',
      stage: 'T3b',
      mdtDate: '2024-01-28',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: ''
    }
  ];

  // Filter and search logic
  const filteredCases = mdtCases.filter(case_ => {
    const matchesSearch = searchTerm === '' || 
      case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.phone.includes(searchTerm) ||
      case_.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'high' && case_.priority === 'High') ||
      (activeFilter === 'medium' && case_.priority === 'Medium') ||
      (activeFilter === 'low' && case_.priority === 'Low');
    
    const matchesTypeFilter = typeFilter === 'all' || 
      (typeFilter === 'opd' && case_.type === 'OPD') ||
      (typeFilter === 'ipd' && case_.type === 'IPD');
    
    return matchesSearch && matchesFilter && matchesTypeFilter;
  });

  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'psa':
        return b.psa - a.psa;
      case 'waitTime':
        return b.waitTime - a.waitTime;
      case 'mdtDate':
        return new Date(a.mdtDate) - new Date(b.mdtDate);
      case 'name':
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });


  const handleMDTNotes = (case_) => {
    setSelectedCase(case_);
    setShowMDTNotesModal(true);
  };

  const closeMDTNotesModal = () => {
    setShowMDTNotesModal(false);
    setSelectedCase(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Review': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Review Complete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'OPD': return 'bg-green-100 text-green-800';
      case 'IPD': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MDT Cases</h1>
            <p className="text-sm text-gray-600 mt-1">Multidisciplinary team cases - Review, edit notes, and assign outcomes</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedCases.length} MDT Cases
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter MDT Cases</h2>
              <p className="text-sm text-gray-600 mt-1">Find cases for multidisciplinary team discussion</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Search</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="all">All Cases</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="all">All Types</option>
                <option value="opd">OPD Cases</option>
                <option value="ipd">IPD Cases</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="priority">Sort by Priority</option>
                <option value="psa">Sort by PSA</option>
                <option value="waitTime">Sort by Wait Time</option>
                <option value="mdtDate">Sort by MDT Date</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedCases.filter(c => c.priority === 'High').length} High Priority
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MDT Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">MDT Cases Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Cases awaiting multidisciplinary team discussion</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Queue</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {sortedCases.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Clinical Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">MDT Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedCases.map((case_, index) => (
                  <tr key={case_.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {case_.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {case_.priority === 'High' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{case_.patientName}</p>
                          <p className="text-sm text-gray-500">ID: {case_.id}</p>
                          <p className="text-xs text-gray-400">Age: {case_.age} • {case_.referringGP}</p>
                          </div>
                        </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">PSA: {case_.psa} ng/mL</p>
                        <p className="text-xs text-gray-500">Gleason: {case_.gleasonScore}</p>
                        <p className="text-xs text-gray-500">Stage: {case_.stage}</p>
                        <p className="text-xs text-gray-500">DRE: {case_.dre}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(case_.type)}`}>
                        {case_.type}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{formatDate(case_.mdtDate)}</p>
                          <p className="text-xs text-gray-500">Wait: {case_.waitTime} days</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(case_.priority)}`}>
                        {case_.priority}
                            </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                      <button
                          onClick={() => navigate(`/urologist/patient-details/${case_.id}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                      </button>
                      <button
                          onClick={() => navigate(`/urologist/psa-chart/${case_.id}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                          <Activity className="h-3 w-3 mr-1" />
                          <span>Chart</span>
                      </button>
                      <button
                          onClick={() => handleMDTNotes(case_)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>MDT Notes</span>
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
                <Users className="h-12 w-12 text-gray-400" />
            </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No MDT cases found
                    </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No cases match your search criteria. Try adjusting your filters or search terms.' : 'No cases are currently in the MDT queue.'}
              </p>
              <div className="flex items-center justify-center space-x-4">
                {searchTerm && (
                <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
                      setTypeFilter('all');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                </button>
                )}
              </div>
            </div>
          )}
              </div>
            </div>


      {/* MDT Notes Modal */}
      {showMDTNotesModal && selectedCase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-800 to-black rounded-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      MDT Notes - {selectedCase.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Edit MDT notes and assign outcomes</p>
                  </div>
                </div>
                <button
                  onClick={closeMDTNotesModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* MDT Notes */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">MDT Discussion Notes</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="6"
                    placeholder="Enter MDT discussion notes, findings, and recommendations..."
                    defaultValue={selectedCase.mdtNotes}
                  />
                </div>

                {/* MDT Outcome */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">MDT Outcome</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Activity className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Continue Active Surveillance</p>
                            <p className="text-sm text-gray-600">Patient remains on surveillance protocol</p>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Stethoscope className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Proceed to Surgery</p>
                            <p className="text-sm text-gray-600">Schedule surgical intervention</p>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Target className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Radiation Therapy</p>
                            <p className="text-sm text-gray-600">Refer for radiation oncology</p>
                          </div>
                        </div>
                      </button>
                      <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Send className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Systemic Therapy</p>
                            <p className="text-sm text-gray-600">Refer for medical oncology</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* MDT Recommendations */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">MDT Recommendations</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="4"
                    placeholder="Enter specific recommendations and next steps..."
                    defaultValue={selectedCase.mdtRecommendations}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeMDTNotesModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      console.log('Export MDT packet for:', selectedCase.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export MDT Packet
                  </button>
                  <button
                    onClick={() => {
                      console.log('Save MDT notes for:', selectedCase.id);
                      closeMDTNotesModal();
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Save MDT Notes
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

export default MDTCases;

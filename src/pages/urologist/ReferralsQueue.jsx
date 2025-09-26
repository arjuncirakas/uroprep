import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  FileText, 
  CheckCircle,
  X,
  Eye,
  Calendar,
  Stethoscope,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Activity,
  Edit,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Bell,
  TrendingUp
} from 'lucide-react';

const ReferralsQueue = () => {
  const dispatch = useDispatch();
  const { referrals } = useSelector(state => state.referrals);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // CPC Criteria Validation
  const validateCPCCriteria = (referral) => {
    const { psa, age, dre, familyHistory, ethnicity, clinicalSymptoms } = referral;
    const criteria = [];
    let isCompliant = false;

    // PSA criteria
    if (age >= 50 && age <= 69 && psa >= 4.0) {
      criteria.push('PSA ≥4.0 ng/mL for men aged 50-69');
      isCompliant = true;
    }
    
    // High-risk criteria
    if ((familyHistory || ethnicity === 'Aboriginal/Torres Strait Islander') && psa >= 2.0) {
      criteria.push('PSA ≥2.0 ng/mL for high-risk men');
      isCompliant = true;
    }
    
    // Clinical findings
    if (dre === 'abnormal') {
      criteria.push('Abnormal DRE findings');
      isCompliant = true;
    }
    
    // Clinical symptoms
    if (clinicalSymptoms && clinicalSymptoms.length > 0) {
      criteria.push('Clinical symptoms present');
      isCompliant = true;
    }

    return {
      isCompliant,
      criteria,
      requiresOverride: !isCompliant
    };
  };

  // Priority calculation
  const calculatePriority = (referral) => {
    const { psa, age, clinicalUrgency } = referral;
    
    if (psa > 100 || clinicalUrgency === 'urgent') return 'critical';
    if (psa > 20 || (age > 75 && psa > 10)) return 'high';
    if (psa > 10 || age > 80) return 'medium';
    return 'low';
  };

  // Enhanced referral data with detailed information
  const enhancedReferrals = [
    {
      id: 1,
      patientName: 'John Smith',
      age: 65,
      psa: 25.4,
      summary: 'PSA 25.4, ?prostate cancer',
      priority: 'urgent',
      status: 'pending',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main St, Melbourne VIC 3000',
      referringGP: 'Dr. Sarah Johnson',
      referralDate: '2024-01-10',
      clinicalNotes: 'Patient presents with elevated PSA and family history of prostate cancer. DRE reveals firm nodule in left lobe.',
      imaging: 'MRI scheduled for next week',
      comorbidities: 'Hypertension, Type 2 Diabetes',
      dre: 'abnormal',
      familyHistory: true,
      ethnicity: 'Caucasian',
      clinicalSymptoms: ['urinary frequency', 'nocturia'],
      clinicalUrgency: 'urgent',
      waitTime: 5
    },
    {
      id: 2,
      patientName: 'Mary Johnson',
      age: 58,
      psa: 18.7,
      summary: 'PSA 18.7, clinical concerns',
      priority: 'urgent',
      status: 'pending',
      phone: '+61 423 456 789',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave, Sydney NSW 2000',
      referringGP: 'Dr. Michael Chen',
      referralDate: '2024-01-12',
      clinicalNotes: 'Rapidly rising PSA over 6 months. Patient reports urinary symptoms and weight loss.',
      imaging: 'CT scan completed - no distant metastases',
      comorbidities: 'Obesity',
      dre: 'normal',
      familyHistory: false,
      ethnicity: 'Asian',
      clinicalSymptoms: ['weight loss', 'fatigue'],
      clinicalUrgency: 'urgent',
      waitTime: 3
    },
    {
      id: 3,
      patientName: 'Robert Brown',
      age: 72,
      psa: 12.3,
      summary: 'PSA 12.3, routine referral',
      priority: 'high',
      status: 'pending',
      phone: '+61 434 567 890',
      email: 'robert.brown@email.com',
      address: '789 Pine Rd, Brisbane QLD 4000',
      referringGP: 'Dr. David Wilson',
      referralDate: '2024-01-14',
      clinicalNotes: 'Stable PSA over 2 years. Patient asymptomatic. Routine surveillance referral.',
      imaging: 'PSMA PET scan negative',
      comorbidities: 'None',
      dre: 'normal',
      familyHistory: false,
      ethnicity: 'Caucasian',
      clinicalSymptoms: [],
      clinicalUrgency: 'routine',
      waitTime: 1
    },
    {
      id: 4,
      patientName: 'David Wilson',
      age: 68,
      psa: 8.5,
      summary: 'PSA 8.5, elevated',
      priority: 'high',
      status: 'pending',
      phone: '+61 445 678 901',
      email: 'david.wilson@email.com',
      address: '321 Elm St, Perth WA 6000',
      referringGP: 'Dr. Jennifer Lee',
      referralDate: '2024-01-15',
      clinicalNotes: 'Patient with elevated PSA. DRE reveals suspicious nodule. Family history of prostate cancer.',
      imaging: 'MRI scheduled',
      comorbidities: 'None',
      dre: 'abnormal',
      familyHistory: true,
      ethnicity: 'Caucasian',
      clinicalSymptoms: ['urinary hesitancy'],
      clinicalUrgency: 'high',
      waitTime: 0
    },
    {
      id: 5,
      patientName: 'Sarah Davis',
      age: 71,
      psa: 15.2,
      summary: 'PSA 15.2, high risk',
      priority: 'urgent',
      status: 'mdt_pending',
      phone: '+61 456 789 012',
      email: 'sarah.davis@email.com',
      address: '654 Maple Dr, Adelaide SA 5000',
      referringGP: 'Dr. Michael Chen',
      referralDate: '2024-01-08',
      clinicalNotes: 'High-risk prostate cancer. All staging investigations complete. Awaiting MDT discussion.',
      imaging: 'CT and bone scan completed',
      comorbidities: 'Hypertension',
      dre: 'abnormal',
      familyHistory: false,
      ethnicity: 'Caucasian',
      clinicalSymptoms: ['bone pain'],
      clinicalUrgency: 'urgent',
      waitTime: 7
    }
  ];

  const handleReferralSelect = (referral) => {
    setSelectedReferral(referral);
    setShowReferralModal(true);
  };

  const closeReferralModal = () => {
    setShowReferralModal(false);
    setSelectedReferral(null);
  };

  // Filter and search logic
  const filteredReferrals = enhancedReferrals.filter(referral => {
    const matchesSearch = referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.referringGP.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'urgent' && referral.priority === 'urgent') ||
                         (filter === 'cpc_compliant' && validateCPCCriteria(referral).isCompliant) ||
                         (filter === 'cpc_non_compliant' && !validateCPCCriteria(referral).isCompliant) ||
                         (filter === 'overdue' && referral.waitTime > 30);
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const stats = {
    total: enhancedReferrals.length,
    urgent: enhancedReferrals.filter(r => r.priority === 'urgent').length,
    cpcCompliant: enhancedReferrals.filter(r => validateCPCCriteria(r).isCompliant).length,
    overdue: enhancedReferrals.filter(r => r.waitTime > 30).length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Referrals Queue</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and process incoming patient referrals with CPC criteria validation</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">{stats.total} Referrals</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-gray-50 border border-red-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-red-900">{stats.urgent} Urgent</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-900">{stats.cpcCompliant} CPC Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Referrals</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">+3 this week</span>
                <span className="text-sm text-gray-500 ml-1">from last week</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent Cases</p>
              <p className="text-3xl font-bold text-gray-900">{stats.urgent}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-red-600">+1 today</span>
                <span className="text-sm text-gray-500 ml-1">requires attention</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-700">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CPC Compliant</p>
              <p className="text-3xl font-bold text-gray-900">{stats.cpcCompliant}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">85%</span>
                <span className="text-sm text-gray-500 ml-1">compliance rate</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-700">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overdue}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-orange-600">-2 this week</span>
                <span className="text-sm text-gray-500 ml-1">improvement</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filter & Sort Referrals</h2>
              <p className="text-sm text-gray-600 mt-1">Customize your view of the referrals queue</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients or GPs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400 w-full sm:w-64"
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
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="all">All Referrals</option>
                <option value="urgent">Urgent Only</option>
                <option value="cpc_compliant">CPC Compliant</option>
                <option value="cpc_non_compliant">CPC Non-Compliant</option>
                <option value="overdue">Overdue (>30 days)</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="priority">Sort by Priority</option>
                <option value="date">Sort by Date</option>
                <option value="psa">Sort by PSA</option>
                <option value="wait_time">Sort by Wait Time</option>
              </select>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {stats.cpcCompliant} CPC Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Referrals Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Review and process incoming patient referrals</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Queue</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {filteredReferrals.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'No referrals match your search criteria.' : 'No referrals are currently in the queue.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReferrals.map((referral) => (
                <div key={referral.id} className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {referral.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {referral.priority === 'urgent' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{referral.patientName}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              referral.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              referral.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {referral.priority.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              validateCPCCriteria(referral).isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {validateCPCCriteria(referral).isCompliant ? 'CPC COMPLIANT' : 'CPC NON-COMPLIANT'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              Wait: {referral.waitTime} days
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 mb-4">
                        <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Patient Details</h4>
                          <p><strong>Age:</strong> {referral.age} years</p>
                          <p><strong>PSA:</strong> {referral.psa} ng/mL</p>
                          <p><strong>Referring GP:</strong> {referral.referringGP}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                          <p><strong>Referral Date:</strong> {new Date(referral.referralDate).toLocaleDateString()}</p>
                          <p><strong>Wait Time:</strong> {referral.waitTime} days</p>
                          <p><strong>DRE:</strong> {referral.dre || 'Not specified'}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
                          <p><strong>Family History:</strong> {referral.familyHistory ? 'Yes' : 'No'}</p>
                          <p><strong>Clinical Symptoms:</strong> {referral.clinicalSymptoms?.join(', ') || 'None'}</p>
                          <p><strong>Ethnicity:</strong> {referral.ethnicity || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      {!validateCPCCriteria(referral).isCompliant && (
                        <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
                          <div className="flex items-center mb-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <p className="text-sm font-medium text-red-900 ml-3">CPC Criteria Issues:</p>
                          </div>
                          <ul className="text-sm text-red-800 space-y-1">
                            {validateCPCCriteria(referral).criteria.map((criterion, index) => (
                              <li key={index}>• {criterion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl">
                        <h4 className="font-medium text-gray-900 mb-2">Clinical Summary</h4>
                        <p className="text-sm text-gray-700">{referral.summary}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3 ml-6">
                      <button
                        onClick={() => handleReferralSelect(referral)}
                        className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        title="View Referral Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          dispatch({
                            type: 'referrals/processReferral',
                            payload: { referralId: referral.id, action: 'accept' }
                          });
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          dispatch({
                            type: 'referrals/processReferral',
                            payload: { referralId: referral.id, action: 'reject' }
                          });
                        }}
                        className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Referral Details Modal */}
      {showReferralModal && selectedReferral && (
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
                      {selectedReferral.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Age: {selectedReferral.age} • PSA: {selectedReferral.psa} ng/mL</p>
                  </div>
                </div>
                <button
                  onClick={closeReferralModal}
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
                        <p className="text-lg font-bold text-blue-600">{selectedReferral.age}</p>
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
                        <p className="text-lg font-bold text-green-600">{selectedReferral.psa} ng/mL</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-gray-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-yellow-900">Wait Time</p>
                        <p className="text-lg font-bold text-yellow-600">{selectedReferral.waitTime} days</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-purple-900">Priority</p>
                        <p className="text-lg font-bold text-purple-600">{selectedReferral.priority.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedReferral.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedReferral.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedReferral.address}</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Information */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Clinical Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clinical Notes:</p>
                      <p className="text-sm text-gray-700">{selectedReferral.clinicalNotes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Imaging:</p>
                      <p className="text-sm text-gray-700">{selectedReferral.imaging}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Comorbidities:</p>
                      <p className="text-sm text-gray-700">{selectedReferral.comorbidities}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Referring GP:</p>
                      <p className="text-sm text-gray-700">{selectedReferral.referringGP}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">DRE Findings:</p>
                      <p className="text-sm text-gray-700">{selectedReferral.dre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Family History:</p>
                      <p className="text-sm text-gray-700">{selectedReferral.familyHistory ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clinical Symptoms:</p>
                      <p className="text-sm text-gray-700">{selectedReferral.clinicalSymptoms?.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>

                {/* CPC Compliance */}
                <div className={`bg-gradient-to-r ${validateCPCCriteria(selectedReferral).isCompliant ? 'from-green-50 to-gray-50 border-green-200' : 'from-red-50 to-orange-50 border-red-200'} border rounded-xl p-6`}>
                  <h4 className={`text-lg font-semibold ${validateCPCCriteria(selectedReferral).isCompliant ? 'text-green-900' : 'text-red-900'} mb-4`}>
                    CPC Compliance Status
                  </h4>
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-2 ${validateCPCCriteria(selectedReferral).isCompliant ? 'text-green-800' : 'text-red-800'}`}>
                      {validateCPCCriteria(selectedReferral).isCompliant ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        {validateCPCCriteria(selectedReferral).isCompliant ? 'CPC Compliant' : 'CPC Non-Compliant'}
                      </span>
                    </div>
                    {validateCPCCriteria(selectedReferral).criteria.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Criteria Met:</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {validateCPCCriteria(selectedReferral).criteria.map((criterion, index) => (
                            <li key={index}>• {criterion}</li>
                          ))}
                        </ul>
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
                      console.log('Call patient:', selectedReferral.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Patient
                  </button>
                  <button
                    onClick={() => {
                      console.log('Schedule appointment for:', selectedReferral.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closeReferralModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      dispatch({
                        type: 'referrals/processReferral',
                        payload: { referralId: selectedReferral.id, action: 'accept' }
                      });
                      closeReferralModal();
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Accept Referral
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

export default ReferralsQueue;

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
  FileCheck,
  Upload,
  CheckSquare,
  Square,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Microscope,
  TestTube,
  FileBarChart,
  Zap,
  LineChart,
  BarChart3,
  PieChart
} from 'lucide-react';

const ActiveSurveillance = () => {
  const navigate = useNavigate();
  const { db2 } = useSelector(state => state.databases);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showPSAModal, setShowPSAModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nextVisit');

  // Mock active surveillance data
  const surveillancePatients = [
    {
      id: 'SURV001',
      patientName: 'Jennifer Wilson',
      age: 64,
      dob: '1960-04-18',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      psa: 8.7,
      status: 'Active Surveillance',
      priority: 'Medium',
      type: 'OPD',
      surveillanceStartDate: '2023-11-01',
      nextVisit: '2024-05-01',
      lastPSA: 8.7,
      psaHistory: [
        { date: '2023-03-01', psa: 3.1 },
        { date: '2023-09-01', psa: 3.3 },
        { date: '2023-11-01', psa: 8.7 }
      ],
      psaVelocity: 0.2,
      gleasonScore: '3+4=7',
      stage: 'T2c',
      mriHistory: [
        { date: '2023-09-01', result: 'No significant lesions', pirads: 2 },
        { date: '2023-11-01', result: 'Stable appearance', pirads: 2 }
      ],
      biopsyHistory: [
        { date: '2023-09-15', result: 'Negative', cores: 12, positiveCores: 0 }
      ],
      comorbidities: 'None',
      familyHistory: true,
      clinicalNotes: 'Intermediate-risk prostate cancer. Patient prefers active surveillance.',
      imaging: 'CT completed - T2c disease, no lymph node involvement',
      waitTime: 5,
      riskLevel: 'Low',
      nextSteps: 'Continue surveillance',
      dischargeEligible: false,
      psaAlert: false,
      mriAlert: false,
      biopsyAlert: false,
      followUpScheduled: true,
      compliance: 'Good'
    },
    {
      id: 'SURV002',
      patientName: 'Christopher Lee',
      age: 72,
      dob: '1952-08-12',
      phone: '+61 490 123 456',
      email: 'christopher.lee@email.com',
      address: '369 Oak Ave, Gold Coast QLD 4217',
      psa: 6.8,
      status: 'Active Surveillance',
      priority: 'Medium',
      type: 'IPD',
      surveillanceStartDate: '2023-10-15',
      nextVisit: '2024-04-15',
      lastPSA: 6.8,
      psaHistory: [
        { date: '2023-06-01', psa: 5.2 },
        { date: '2023-10-15', psa: 6.8 }
      ],
      psaVelocity: 1.6,
      gleasonScore: '3+4=7',
      stage: 'T2b',
      mriHistory: [
        { date: '2023-10-15', result: 'Organ-confined disease', pirads: 3 }
      ],
      biopsyHistory: [
        { date: '2023-10-20', result: 'Positive', cores: 12, positiveCores: 2 }
      ],
      comorbidities: 'Hypertension, Diabetes, COPD',
      familyHistory: false,
      clinicalNotes: 'Intermediate-risk prostate cancer. Patient has multiple comorbidities.',
      imaging: 'MRI completed - T2b disease, organ-confined',
      waitTime: 3,
      riskLevel: 'Medium',
      nextSteps: 'Continue surveillance',
      dischargeEligible: false,
      psaAlert: true,
      mriAlert: false,
      biopsyAlert: false,
      followUpScheduled: true,
      compliance: 'Good'
    },
    {
      id: 'SURV003',
      patientName: 'Thomas Brown',
      age: 68,
      dob: '1956-11-30',
      phone: '+61 501 234 567',
      email: 'thomas.brown@email.com',
      address: '741 Elm St, Newcastle NSW 2300',
      psa: 18.3,
      status: 'Active Surveillance',
      priority: 'High',
      type: 'OPD',
      surveillanceStartDate: '2023-12-01',
      nextVisit: '2024-06-01',
      lastPSA: 18.3,
      psaHistory: [
        { date: '2023-08-01', psa: 12.1 },
        { date: '2023-12-01', psa: 18.3 }
      ],
      psaVelocity: 6.2,
      gleasonScore: '4+4=8',
      stage: 'T3b',
      mriHistory: [
        { date: '2023-12-01', result: 'Seminal vesicle involvement', pirads: 4 }
      ],
      biopsyHistory: [
        { date: '2023-12-05', result: 'Positive', cores: 12, positiveCores: 6 }
      ],
      comorbidities: 'None',
      familyHistory: true,
      clinicalNotes: 'High-risk prostate cancer. MRI shows seminal vesicle involvement.',
      imaging: 'MRI and PSMA PET completed - T3b disease with seminal vesicle involvement',
      waitTime: 0,
      riskLevel: 'High',
      nextSteps: 'Refer back to MDT/Surgery',
      dischargeEligible: false,
      psaAlert: true,
      mriAlert: true,
      biopsyAlert: true,
      followUpScheduled: true,
      compliance: 'Good'
    }
  ];

  // Filter and search logic
  const filteredPatients = surveillancePatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'high' && patient.riskLevel === 'High') ||
      (activeFilter === 'medium' && patient.riskLevel === 'Medium') ||
      (activeFilter === 'low' && patient.riskLevel === 'Low') ||
      (activeFilter === 'alerts' && (patient.psaAlert || patient.mriAlert || patient.biopsyAlert)) ||
      (activeFilter === 'stable' && patient.riskLevel === 'Low' && !patient.psaAlert);
    
    return matchesSearch && matchesFilter;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'nextVisit':
        return new Date(a.nextVisit) - new Date(b.nextVisit);
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'psa':
        return b.psa - a.psa;
      case 'psaVelocity':
        return b.psaVelocity - a.psaVelocity;
      case 'name':
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });


  const handlePSAReview = (patient) => {
    setSelectedPatient(patient);
    setShowPSAModal(true);
  };

  const closePSAModal = () => {
    setShowPSAModal(false);
    setSelectedPatient(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Active Surveillance (DB2)</h1>
            <p className="text-sm text-gray-600 mt-1">Review serial PSA, MRI, biopsy history and monitor progression</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedPatients.length} Surveillance Patients
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
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter Surveillance Patients</h2>
              <p className="text-sm text-gray-600 mt-1">Find patients on active surveillance</p>
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
                <option value="all">All Patients</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
                <option value="alerts">With Alerts</option>
                <option value="stable">Stable</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="nextVisit">Sort by Next Visit</option>
                <option value="priority">Sort by Priority</option>
                <option value="psa">Sort by PSA</option>
                <option value="psaVelocity">Sort by PSA Velocity</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedPatients.filter(p => p.psaAlert || p.mriAlert || p.biopsyAlert).length} With Alerts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surveillance Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Active Surveillance Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Patients on active surveillance protocol</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Queue</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {sortedPatients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA Monitoring</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Next Visit</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Risk Level</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPatients.map((patient, index) => (
                  <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {patient.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {(patient.psaAlert || patient.mriAlert || patient.biopsyAlert) && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">ID: {patient.id}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.compliance} Compliance</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">PSA: {patient.psa} ng/mL</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(patient.type)}`}>
                        {patient.type}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatDate(patient.nextVisit)}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(patient.riskLevel)}`}>
                          {patient.riskLevel} Risk
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate(`/urologist/patient-details/${patient.id}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/urologist/psa-chart/${patient.id}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Activity className="h-3 w-3 mr-1" />
                          <span>Chart</span>
                        </button>
                        <button 
                          onClick={() => handlePSAReview(patient)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <LineChart className="h-3 w-3 mr-1" />
                          <span>PSA Review</span>
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
                <Activity className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No surveillance patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No patients match your search criteria. Try adjusting your filters or search terms.' : 'No patients are currently on active surveillance.'}
              </p>
              <div className="flex items-center justify-center space-x-4">
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
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


      {/* PSA Review Modal */}
      {showPSAModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-800 to-black rounded-lg">
                    <LineChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      PSA Review - {selectedPatient.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Review PSA trends and assess progression</p>
                  </div>
                </div>
                <button
                  onClick={closePSAModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* PSA Trends */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">PSA Trends</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Current PSA</p>
                        <p className="text-2xl font-bold text-green-600">{selectedPatient.psa} ng/mL</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">PSA Velocity</p>
                        <p className="text-2xl font-bold text-green-600">{selectedPatient.psaVelocity} ng/mL/year</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">PSA History</p>
                      <div className="space-y-2 mt-2">
                        {selectedPatient.psaHistory.map((psa, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm text-gray-700">{formatDate(psa.date)}</span>
                            <span className="text-sm font-medium text-gray-900">{psa.psa} ng/mL</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Risk Assessment</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">PSA Velocity Threshold</p>
                      <p className="text-sm text-gray-600">Alert if > 0.75 ng/mL/year</p>
                      <div className="mt-2">
                        {selectedPatient.psaVelocity > 0.75 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Alert: {selectedPatient.psaVelocity} ng/mL/year
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Normal: {selectedPatient.psaVelocity} ng/mL/year
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Risk Level</p>
                      <p className="text-sm text-gray-600">{selectedPatient.riskLevel} risk based on PSA trends</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Recommendations</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Next Steps</p>
                      <p className="text-sm text-gray-600">{selectedPatient.nextSteps}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Follow-Up Schedule</p>
                      <p className="text-sm text-gray-600">Next visit: {formatDate(selectedPatient.nextVisit)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closePSAModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center space-x-3">
                  {selectedPatient.psaVelocity > 0.75 ? (
                    <button
                      onClick={() => {
                        console.log('Refer to MDT for:', selectedPatient.id);
                        closePSAModal();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                      Refer to MDT
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        console.log('Continue surveillance for:', selectedPatient.id);
                        closePSAModal();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                      Continue Surveillance
                    </button>
                  )}
                  <button
                    onClick={() => {
                      console.log('Save PSA review for:', selectedPatient.id);
                      closePSAModal();
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Save Review
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

export default ActiveSurveillance;

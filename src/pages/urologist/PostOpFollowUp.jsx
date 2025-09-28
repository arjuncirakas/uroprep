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
  Zap
} from 'lucide-react';

const PostOpFollowUp = () => {
  const navigate = useNavigate();
  const { db4 } = useSelector(state => state.databases);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistopathologyModal, setShowHistopathologyModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('surgeryDate');

  // Mock post-op follow-up data
  const postOpPatients = [
    {
      id: 'POSTOP001',
      patientName: 'William Anderson',
      age: 66,
      dob: '1958-01-25',
      phone: '+61 489 012 345',
      email: 'william.anderson@email.com',
      address: '258 Pine St, Canberra ACT 2600',
      psa: 22.5,
      status: 'Post-Op Follow-Up',
      priority: 'High',
      type: 'IPD',
      surgeryDate: '2024-01-30',
      surgeryType: 'Radical Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      followUpDate: '2024-03-30',
      histopathology: 'Adenocarcinoma, Gleason 4+5=9',
      marginStatus: 'Positive margins',
      gleasonScore: '4+5=9',
      stage: 'T4 N1 M1',
      complications: 'None',
      bloodLoss: '200ml',
      surgeryDuration: '3.5 hours',
      postOpStatus: 'Stable',
      lastPSA: 22.5,
      comorbidities: 'Diabetes',
      familyHistory: false,
      clinicalNotes: 'High-risk prostate cancer with bone pain. Bone scan shows multiple lesions.',
      imaging: 'Bone scan and PSMA PET completed - multiple bone metastases',
      waitTime: 10,
      riskLevel: 'High',
      nextSteps: 'Refer to MDT / Oncology',
      dischargeEligible: false,
      histopathologyComplete: true,
      marginStatusComplete: true,
      complicationsAssessed: true,
      followUpScheduled: true
    },
    {
      id: 'POSTOP002',
      patientName: 'Robert Johnson',
      age: 71,
      dob: '1953-06-10',
      phone: '+61 512 345 678',
      email: 'robert.johnson@email.com',
      address: '456 Elm St, Perth WA 6000',
      psa: 12.8,
      status: 'Post-Op Follow-Up',
      priority: 'Medium',
      type: 'OPD',
      surgeryDate: '2024-02-05',
      surgeryType: 'Robotic Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      followUpDate: '2024-04-05',
      histopathology: 'Adenocarcinoma, Gleason 3+4=7',
      marginStatus: 'Negative margins',
      gleasonScore: '3+4=7',
      stage: 'T2c',
      complications: 'None',
      bloodLoss: '150ml',
      surgeryDuration: '2.8 hours',
      postOpStatus: 'Stable',
      lastPSA: 12.8,
      comorbidities: 'Hypertension',
      familyHistory: true,
      clinicalNotes: 'Intermediate-risk prostate cancer. Surgery completed successfully.',
      imaging: 'MRI completed - T2c disease, organ-confined',
      waitTime: 5,
      riskLevel: 'Low',
      nextSteps: 'Discharge to GP',
      dischargeEligible: true,
      histopathologyComplete: true,
      marginStatusComplete: true,
      complicationsAssessed: true,
      followUpScheduled: true
    },
    {
      id: 'POSTOP003',
      patientName: 'David Wilson',
      age: 68,
      dob: '1956-09-15',
      phone: '+61 523 456 789',
      email: 'david.wilson@email.com',
      address: '789 Oak Ave, Adelaide SA 5000',
      psa: 18.3,
      status: 'Post-Op Follow-Up',
      priority: 'High',
      type: 'IPD',
      surgeryDate: '2024-02-10',
      surgeryType: 'Radical Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      followUpDate: '2024-04-10',
      histopathology: 'Adenocarcinoma, Gleason 4+4=8',
      marginStatus: 'Positive margins',
      gleasonScore: '4+4=8',
      stage: 'T3b',
      complications: 'Minor bleeding',
      bloodLoss: '300ml',
      surgeryDuration: '4.2 hours',
      postOpStatus: 'Stable',
      lastPSA: 18.3,
      comorbidities: 'None',
      familyHistory: false,
      clinicalNotes: 'High-risk prostate cancer. MRI shows seminal vesicle involvement.',
      imaging: 'MRI and PSMA PET completed - T3b disease with seminal vesicle involvement',
      waitTime: 8,
      riskLevel: 'High',
      nextSteps: 'Refer to MDT / Oncology',
      dischargeEligible: false,
      histopathologyComplete: true,
      marginStatusComplete: true,
      complicationsAssessed: true,
      followUpScheduled: true
    }
  ];

  // Filter and search logic
  const filteredPatients = postOpPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'high' && patient.riskLevel === 'High') ||
      (activeFilter === 'medium' && patient.riskLevel === 'Medium') ||
      (activeFilter === 'low' && patient.riskLevel === 'Low') ||
      (activeFilter === 'discharge' && patient.dischargeEligible) ||
      (activeFilter === 'mdt' && !patient.dischargeEligible);
    
    return matchesSearch && matchesFilter;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'surgeryDate':
        return new Date(b.surgeryDate) - new Date(a.surgeryDate);
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'psa':
        return b.psa - a.psa;
      case 'riskLevel':
        const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      case 'name':
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });


  const handleHistopathology = (patient) => {
    setSelectedPatient(patient);
    setShowHistopathologyModal(true);
  };

  const closeHistopathologyModal = () => {
    setShowHistopathologyModal(false);
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

  const getMarginColor = (margin) => {
    switch (margin) {
      case 'Positive margins': return 'bg-red-100 text-red-800';
      case 'Negative margins': return 'bg-green-100 text-green-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Post-Op Follow-Up (DB4)</h1>
            <p className="text-sm text-gray-600 mt-1">Enter histopathology results, margin status, and assess outcomes</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedPatients.length} Post-Op Patients
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
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter Post-Op Patients</h2>
              <p className="text-sm text-gray-600 mt-1">Find patients for post-operative follow-up</p>
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
                <option value="discharge">Discharge Eligible</option>
                <option value="mdt">MDT Referral</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="surgeryDate">Sort by Surgery Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="psa">Sort by PSA</option>
                <option value="riskLevel">Sort by Risk Level</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedPatients.filter(p => p.riskLevel === 'High').length} High Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post-Op Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Post-Op Follow-Up Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Patients requiring post-operative assessment</p>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surgery Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Type</th>
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
                          {patient.priority === 'High' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">ID: {patient.id}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.surgeon}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.surgeryType}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(patient.type)}`}>
                        {patient.type}
                      </span>
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
                          onClick={() => handleHistopathology(patient)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Microscope className="h-3 w-3 mr-1" />
                          <span>Histopathology</span>
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
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No post-op patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No patients match your search criteria. Try adjusting your filters or search terms.' : 'No patients are currently in post-op follow-up.'}
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


      {/* Histopathology Modal */}
      {showHistopathologyModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-800 to-black rounded-lg">
                    <Microscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Histopathology - {selectedPatient.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Enter histopathology results and assess outcomes</p>
                  </div>
                </div>
                <button
                  onClick={closeHistopathologyModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Histopathology Results */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Histopathology Results</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        defaultValue={selectedPatient.histopathology}
                        placeholder="e.g., Adenocarcinoma, Gleason 3+4=7"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gleason Score</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        defaultValue={selectedPatient.gleasonScore}
                        placeholder="e.g., 3+4=7"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        defaultValue={selectedPatient.stage}
                        placeholder="e.g., T2c"
                      />
                    </div>
                  </div>
                </div>

                {/* Margin Status */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Margin Status</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Margin Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="Negative margins">Negative margins</option>
                        <option value="Positive margins">Positive margins</option>
                        <option value="Focal positive margins">Focal positive margins</option>
                        <option value="Extensive positive margins">Extensive positive margins</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Margin Details</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        rows="3"
                        placeholder="Enter details about margin status..."
                      />
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Risk Assessment</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="Low">Low Risk</option>
                        <option value="Medium">Medium Risk</option>
                        <option value="High">High Risk</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Risk Factors</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        rows="3"
                        placeholder="Enter risk factors and assessment..."
                      />
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Next Steps</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Action</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="Discharge to GP">Discharge to GP</option>
                        <option value="Refer to MDT">Refer to MDT</option>
                        <option value="Refer to Oncology">Refer to Oncology</option>
                        <option value="Continue Surveillance">Continue Surveillance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up Plan</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        rows="3"
                        placeholder="Enter follow-up plan and recommendations..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeHistopathologyModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Save histopathology for:', selectedPatient.id);
                    closeHistopathologyModal();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Save Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostOpFollowUp;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClinicalFindingsModal from '../../components/modals/ClinicalFindingsModal';
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
  UserPlus,
  ClipboardList,
  Users,
  Send,
  Download
} from 'lucide-react';

const OPDConsultations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { db1 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showClinicalDecisionModal, setShowClinicalDecisionModal] = useState(false);
  const [showClinicalFindingsModal, setShowClinicalFindingsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Mock OPD patients data
  const opdPatients = [
    {
      id: 'URP001',
      name: 'John Smith',
      age: 65,
      dob: '1959-03-15',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main St, Melbourne VIC 3000',
      psa: 25.4,
      status: 'Awaiting Consultation',
      priority: 'High',
      referralDate: '2024-01-10',
      referringGP: 'Dr. Sarah Johnson',
      clinicalNotes: 'Elevated PSA with family history of prostate cancer. DRE reveals firm nodule in left lobe.',
      imaging: 'MRI scheduled for next week',
      comorbidities: 'Hypertension, Type 2 Diabetes',
      familyHistory: true,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary frequency', 'nocturia'],
      waitTime: 5,
      lastPSA: 25.4,
      psaHistory: [4.2, 8.5, 15.3, 25.4],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-10']
    },
    {
      id: 'URP002',
      name: 'Mary Johnson',
      age: 58,
      dob: '1966-07-22',
      phone: '+61 423 456 789',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave, Sydney NSW 2000',
      psa: 18.7,
      status: 'Awaiting Consultation',
      priority: 'High',
      referralDate: '2024-01-12',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'Rapidly rising PSA over 6 months. Patient reports urinary symptoms and weight loss.',
      imaging: 'CT scan completed - no distant metastases',
      comorbidities: 'Obesity',
      familyHistory: false,
      dre: 'normal',
      clinicalSymptoms: ['weight loss', 'fatigue'],
      waitTime: 3,
      lastPSA: 18.7,
      psaHistory: [3.2, 5.8, 12.4, 18.7],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-12']
    },
    {
      id: 'URP003',
      name: 'Robert Brown',
      age: 72,
      dob: '1952-11-08',
      phone: '+61 434 567 890',
      email: 'robert.brown@email.com',
      address: '789 Pine Rd, Brisbane QLD 4000',
      psa: 12.3,
      status: 'Awaiting Consultation',
      priority: 'Medium',
      referralDate: '2024-01-14',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'Stable PSA over 2 years. Patient asymptomatic. Routine surveillance referral.',
      imaging: 'PSMA PET scan negative',
      comorbidities: 'None',
      familyHistory: false,
      dre: 'normal',
      clinicalSymptoms: [],
      waitTime: 1,
      lastPSA: 12.3,
      psaHistory: [11.8, 12.1, 12.0, 12.3],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-14']
    },
    {
      id: 'URP004',
      name: 'David Wilson',
      age: 68,
      dob: '1956-05-12',
      phone: '+61 445 678 901',
      email: 'david.wilson@email.com',
      address: '321 Elm St, Perth WA 6000',
      psa: 8.5,
      status: 'Awaiting Consultation',
      priority: 'Medium',
      referralDate: '2024-01-15',
      referringGP: 'Dr. Jennifer Lee',
      clinicalNotes: 'Patient with elevated PSA. DRE reveals suspicious nodule. Family history of prostate cancer.',
      imaging: 'MRI scheduled',
      comorbidities: 'None',
      familyHistory: true,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary hesitancy'],
      waitTime: 0,
      lastPSA: 8.5,
      psaHistory: [4.2, 6.8, 7.9, 8.5],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-15']
    },
    {
      id: 'URP005',
      name: 'Sarah Davis',
      age: 71,
      dob: '1953-09-30',
      phone: '+61 456 789 012',
      email: 'sarah.davis@email.com',
      address: '654 Maple Dr, Adelaide SA 5000',
      psa: 15.2,
      status: 'Awaiting Consultation',
      priority: 'High',
      referralDate: '2024-01-08',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'High-risk prostate cancer. All staging investigations complete. Awaiting MDT discussion.',
      imaging: 'CT and bone scan completed',
      comorbidities: 'Hypertension',
      familyHistory: false,
      dre: 'abnormal',
      clinicalSymptoms: ['bone pain'],
      waitTime: 7,
      lastPSA: 15.2,
      psaHistory: [8.5, 12.3, 14.1, 15.2],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-08']
    }
  ];

  // Filter and search logic
  const filteredPatients = opdPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'high' && patient.priority === 'High') ||
      (activeFilter === 'medium' && patient.priority === 'Medium') ||
      (activeFilter === 'low' && patient.priority === 'Low');
    
    return matchesSearch && matchesFilter;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'psa':
        return b.psa - a.psa;
      case 'waitTime':
        return b.waitTime - a.waitTime;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });


  const handleClinicalDecision = (patient) => {
    setSelectedPatient(patient);
    setShowClinicalDecisionModal(true);
  };

  const handleClinicalFindings = (patient) => {
    setSelectedPatient(patient);
    setShowClinicalFindingsModal(true);
  };

  const closeClinicalDecisionModal = () => {
    setShowClinicalDecisionModal(false);
    setSelectedPatient(null);
  };

  const closeClinicalFindingsModal = () => {
    setShowClinicalFindingsModal(false);
    setSelectedPatient(null);
  };

  const handleClinicalFindingsSave = () => {
    // Clinical findings are handled by the modal component
    console.log('Clinical findings saved for patient:', selectedPatient?.id);
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
      case 'Awaiting Consultation': return 'bg-blue-100 text-blue-800';
      case 'Consultation Complete': return 'bg-green-100 text-green-800';
      case 'Decision Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const calculatePSAVelocity = (psaHistory, psaDates) => {
    if (psaHistory.length < 2) return 0;
    const latest = psaHistory[psaHistory.length - 1];
    const previous = psaHistory[psaHistory.length - 2];
    const timeDiff = (new Date(psaDates[psaDates.length - 1]) - new Date(psaDates[psaDates.length - 2])) / (1000 * 60 * 60 * 24 * 365);
    return ((latest - previous) / timeDiff).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OPD Consultations (DB1)</h1>
            <p className="text-sm text-gray-600 mt-1">Core clinical entry point - Review demographics, enter findings, and make clinical decisions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedPatients.length} Patients
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
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter OPD Patients</h2>
              <p className="text-sm text-gray-600 mt-1">Find patients awaiting clinical consultation and decision</p>
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
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="priority">Sort by Priority</option>
                <option value="psa">Sort by PSA</option>
                <option value="waitTime">Sort by Wait Time</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedPatients.filter(p => p.priority === 'High').length} High Priority
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OPD Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">OPD Consultation Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Patients awaiting clinical review and decision</p>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA & Clinical</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Wait Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPatients.map((patient, index) => {
                const psaVelocity = calculatePSAVelocity(patient.psaHistory, patient.psaDates);
                return (
                    <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {patient.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{patient.name}</p>
                            <p className="text-sm text-gray-500">ID: {patient.id}</p>
                            <p className="text-xs text-gray-400">Age: {patient.age} • {patient.referringGP}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <p className="font-medium text-gray-900">{patient.psa} ng/mL</p>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-sm font-medium text-gray-900">{patient.waitTime} days</p>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
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
                            onClick={() => handleClinicalFindings(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-purple-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                        >
                            <Stethoscope className="h-3 w-3 mr-1" />
                            <span>Findings</span>
                        </button>
                        <button
                            onClick={() => handleClinicalDecision(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span>Decision</span>
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
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No patients match your search criteria. Try adjusting your filters or search terms.' : 'No patients are currently in the OPD queue.'}
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


      {/* Clinical Decision Modal */}
      {showClinicalDecisionModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-800 to-black rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Clinical Decision - {selectedPatient.name}
                    </h3>
                    <p className="text-sm text-gray-600">Review findings and select treatment pathway</p>
                  </div>
                </div>
                <button
                  onClick={closeClinicalDecisionModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-8">
                {/* Clinical Findings */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-6">Clinical Findings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">DRE Findings</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="normal">Normal</option>
                        <option value="abnormal">Abnormal</option>
                        <option value="suspicious">Suspicious</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comorbidities</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter comorbidities"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Imaging Results</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        rows="3"
                        placeholder="Enter imaging findings (MRI/TRUS)"
                      />
                    </div>
                  </div>
                </div>

                {/* Clinical Decision */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Clinical Decision</h4>
                  <div className="space-y-3">
                    <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">No Cancer</p>
                          <p className="text-sm text-gray-500">Auto-generate GP discharge summary</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Refer to MDT</p>
                          <p className="text-sm text-gray-500">Triggers MDT scheduling, summary sent to nurse panel</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Proceed to Surgery</p>
                          <p className="text-sm text-gray-500">Pushes record to Surgical Pathway (DB3) + notifies nurse</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Active Surveillance</p>
                          <p className="text-sm text-gray-500">Pushes to DB2 + 6-month follow-up auto-created</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Send className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Refer to Oncology</p>
                          <p className="text-sm text-gray-500">Exit Urology pathway, referral letter auto-sent</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Clinical Notes & Rationale</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="4"
                    placeholder="Enter clinical notes and rationale for decision..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeClinicalDecisionModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Save clinical decision for:', selectedPatient.id);
                    closeClinicalDecisionModal();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Save Clinical Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Findings Modal */}
      <ClinicalFindingsModal
        patient={selectedPatient}
        onSave={handleClinicalFindingsSave}
        onClose={closeClinicalFindingsModal}
        isOpen={showClinicalFindingsModal}
      />
    </div>
  );
};

export default OPDConsultations;

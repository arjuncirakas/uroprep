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
  Minus
} from 'lucide-react';

const SurgicalPathway = () => {
  const navigate = useNavigate();
  const { db3 } = useSelector(state => state.databases);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSurgeryModal, setShowSurgeryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('surgeryDate');

  // Mock surgical pathway data
  const surgicalPatients = [
    {
      id: 'SURG001',
      patientName: 'Michael Miller',
      age: 69,
      dob: '1955-03-20',
      phone: '+61 467 890 123',
      email: 'michael.miller@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      psa: 15.2,
      status: 'Awaiting Surgery',
      priority: 'High',
      type: 'IPD',
      surgeryDate: '2024-02-15',
      surgeryType: 'Radical Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      preOpAssessment: 'Complete',
      preOpNotes: 'Patient cleared for surgery. All pre-operative tests normal.',
      operativeNotes: '',
      complications: '',
      bloodLoss: '',
      surgeryDuration: '',
      postOpStatus: 'Pending',
      histopathology: '',
      marginStatus: '',
      gleasonScore: '4+4=8',
      stage: 'T3a',
      followUpDate: '2024-03-15',
      lastPSA: 15.2,
      comorbidities: 'Hypertension',
      familyHistory: false,
      clinicalNotes: 'High-risk prostate cancer. MRI shows extracapsular extension.',
      imaging: 'MRI completed - T3a disease with extracapsular extension',
      waitTime: 7,
      riskLevel: 'High',
      approved: false
    },
    {
      id: 'SURG002',
      patientName: 'Jennifer Wilson',
      age: 64,
      dob: '1960-04-18',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      psa: 8.7,
      status: 'Surgery Scheduled',
      priority: 'Medium',
      type: 'OPD',
      surgeryDate: '2024-02-20',
      surgeryType: 'Robotic Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      preOpAssessment: 'Complete',
      preOpNotes: 'Patient cleared for surgery. All pre-operative tests normal.',
      operativeNotes: '',
      complications: '',
      bloodLoss: '',
      surgeryDuration: '',
      postOpStatus: 'Pending',
      histopathology: '',
      marginStatus: '',
      gleasonScore: '3+4=7',
      stage: 'T2c',
      followUpDate: '2024-03-20',
      lastPSA: 8.7,
      comorbidities: 'None',
      familyHistory: true,
      clinicalNotes: 'Intermediate-risk prostate cancer. CT shows no lymph node involvement.',
      imaging: 'CT completed - T2c disease, no lymph node involvement',
      waitTime: 5,
      riskLevel: 'Medium',
      approved: true
    },
    {
      id: 'SURG003',
      patientName: 'William Anderson',
      age: 66,
      dob: '1958-01-25',
      phone: '+61 489 012 345',
      email: 'william.anderson@email.com',
      address: '258 Pine St, Canberra ACT 2600',
      psa: 22.5,
      status: 'Post-Op',
      priority: 'High',
      type: 'IPD',
      surgeryDate: '2024-01-30',
      surgeryType: 'Radical Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      preOpAssessment: 'Complete',
      preOpNotes: 'Patient cleared for surgery. All pre-operative tests normal.',
      operativeNotes: 'Surgery completed successfully. No intraoperative complications.',
      complications: 'None',
      bloodLoss: '200ml',
      surgeryDuration: '3.5 hours',
      postOpStatus: 'Stable',
      histopathology: 'Adenocarcinoma, Gleason 4+5=9',
      marginStatus: 'Positive margins',
      gleasonScore: '4+5=9',
      stage: 'T4 N1 M1',
      followUpDate: '2024-03-30',
      lastPSA: 22.5,
      comorbidities: 'Diabetes',
      familyHistory: false,
      clinicalNotes: 'High-risk prostate cancer with bone pain. Bone scan shows multiple lesions.',
      imaging: 'Bone scan and PSMA PET completed - multiple bone metastases',
      waitTime: 10,
      riskLevel: 'High',
      approved: true
    }
  ];

  // Filter and search logic
  const filteredPatients = surgicalPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'awaiting' && patient.status === 'Awaiting Surgery') ||
      (activeFilter === 'scheduled' && patient.status === 'Surgery Scheduled') ||
      (activeFilter === 'postop' && patient.status === 'Post-Op') ||
      (activeFilter === 'approved' && patient.approved) ||
      (activeFilter === 'pending' && !patient.approved);
    
    return matchesSearch && matchesFilter;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'surgeryDate':
        return new Date(a.surgeryDate) - new Date(b.surgeryDate);
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'psa':
        return b.psa - a.psa;
      case 'waitTime':
        return b.waitTime - a.waitTime;
      case 'name':
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });


  const handleSurgeryApproval = (patient) => {
    setSelectedPatient(patient);
    setShowSurgeryModal(true);
  };

  const closeSurgeryModal = () => {
    setShowSurgeryModal(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Awaiting Surgery': return 'bg-blue-100 text-blue-800';
      case 'Surgery Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Post-Op': return 'bg-green-100 text-green-800';
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

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Surgical Pathway (DB3)</h1>
            <p className="text-sm text-gray-600 mt-1">Manage surgical patients - approve scheduling, review operative notes</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedPatients.length} Surgical Patients
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
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter Surgical Patients</h2>
              <p className="text-sm text-gray-600 mt-1">Find patients in the surgical pathway</p>
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
                <option value="awaiting">Awaiting Surgery</option>
                <option value="scheduled">Surgery Scheduled</option>
                <option value="postop">Post-Op</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Approval</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="surgeryDate">Sort by Surgery Date</option>
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
                  {sortedPatients.filter(p => p.status === 'Awaiting Surgery').length} Awaiting Surgery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surgical Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Surgical Pathway Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Patients in the surgical pathway</p>
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
                      {!patient.approved && patient.status === 'Awaiting Surgery' && (
                        <button
                          onClick={() => handleSurgeryApproval(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <CheckSquare className="h-3 w-3 mr-1" />
                            <span>Approve</span>
                        </button>
                      )}
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Stethoscope className="h-12 w-12 text-gray-400" />
            </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No surgical patients found
                    </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No patients match your search criteria. Try adjusting your filters or search terms.' : 'No patients are currently in the surgical pathway.'}
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


      {/* Surgery Approval Modal */}
      {showSurgeryModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-800 to-black rounded-lg">
                    <CheckSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Approve Surgery - {selectedPatient.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Review and approve surgical scheduling</p>
                  </div>
                </div>
                <button
                  onClick={closeSurgeryModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Surgery Details */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Surgery Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Surgery Type:</strong> {selectedPatient.surgeryType}</div>
                    <div><strong>Surgery Date:</strong> {formatDate(selectedPatient.surgeryDate)}</div>
                    <div><strong>Surgeon:</strong> {selectedPatient.surgeon}</div>
                    <div><strong>Anesthetist:</strong> {selectedPatient.anesthetist}</div>
                    <div><strong>Pre-op Assessment:</strong> {selectedPatient.preOpAssessment}</div>
                    <div><strong>Priority:</strong> {selectedPatient.priority}</div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Patient Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Age:</strong> {selectedPatient.age} years</div>
                    <div><strong>PSA:</strong> {selectedPatient.psa} ng/mL</div>
                    <div><strong>Gleason Score:</strong> {selectedPatient.gleasonScore}</div>
                    <div><strong>Stage:</strong> {selectedPatient.stage}</div>
                    <div><strong>Comorbidities:</strong> {selectedPatient.comorbidities}</div>
                    <div><strong>Wait Time:</strong> {selectedPatient.waitTime} days</div>
                  </div>
                </div>

                {/* Approval Checklist */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Approval Checklist</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <span className="text-sm text-gray-700">Pre-operative assessment complete</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <span className="text-sm text-gray-700">Patient cleared for surgery</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <span className="text-sm text-gray-700">Surgical team confirmed</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <span className="text-sm text-gray-700">Operating room availability confirmed</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <span className="text-sm text-gray-700">Post-operative care plan in place</span>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Additional Notes</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="4"
                    placeholder="Enter any additional notes or considerations..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeSurgeryModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Approve surgery for:', selectedPatient.id);
                    closeSurgeryModal();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Approve Surgery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurgicalPathway;

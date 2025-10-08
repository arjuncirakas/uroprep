import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateReferral, setFilters } from '../../store/slices/referralSlice';
import { 
  Search,
  Eye,
  FileText,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  AlertCircle,
  Clock,
  Activity,
  TrendingUp,
  Zap,
  Bell,
  Share,
  Send,
  Heart,
  Stethoscope,
  Pill,
  Edit,
  Plus,
  ChevronRight,
  ArrowRight,
  TestTube,
  Database,
  Download,
  Upload
} from 'lucide-react';

const ReferralTriage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { referrals, filters } = useSelector(state => state.referrals);
  
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [triageStatus, setTriageStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showScheduleSuccessModal, setShowScheduleSuccessModal] = useState(false);
  const [showOPDModal, setShowOPDModal] = useState(false);
  const [showOPDSuccessModal, setShowOPDSuccessModal] = useState(false);
  const [showMoveToOPDSuccessModal, setShowMoveToOPDSuccessModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const [showSaveFailureModal, setShowSaveFailureModal] = useState(false);
  const [clinicalData, setClinicalData] = useState({
    currentPSA: '',
    psaDate: new Date().toISOString().split('T')[0],
    clinicalNotes: '',
    symptoms: '',
    familyHistory: '',
    medications: '',
    allergies: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: ''
    }
  });
  const [documents, setDocuments] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedOPDDate, setSelectedOPDDate] = useState('');
  const [selectedOPDTime, setSelectedOPDTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  // Enhanced dummy data with PSA criteria
  const enhancedReferrals = [
    {
      id: 'REF001',
      patientName: 'John Smith',
      age: 65,
      gender: 'Male',
      referralDate: '2024-01-10',
      receivedDate: '2024-01-12',
      status: 'pending',
      urgency: 'high',
      priority: 'urgent',
      referringGP: 'Dr. Sarah Johnson',
      practice: 'City Medical Centre',
      reason: 'Elevated PSA (8.5 ng/mL) with abnormal DRE',
      clinicalDetails: 'PSA rising from 4.2 to 8.5 over 6 months. DRE reveals firm, irregular prostate.',
      comorbidities: ['Hypertension', 'Type 2 Diabetes'],
      medications: ['Metformin', 'Lisinopril'],
      lastPSA: 8.5,
      lastPSADate: '2024-01-08',
      familyHistory: 'Father had prostate cancer at age 70',
      triagedBy: null,
      triagedAt: null,
      notes: 'Urgent review required due to rapid PSA rise',
      psaSuggestion: 'MDT/Urology OPD (urgent)',
      psaCriteria: 'PSA >10 ng/mL',
      suggestedPathway: 'MDT Review',
      procedureStatus: 'pending'
    },
    {
      id: 'REF002',
      patientName: 'Michael Brown',
      age: 58,
      gender: 'Male',
      referralDate: '2024-01-08',
      receivedDate: '2024-01-09',
      status: 'triaged',
      urgency: 'medium',
      priority: 'high',
      referringGP: 'Dr. Robert Wilson',
      practice: 'Suburban Family Practice',
      reason: 'Abnormal PSA (5.2 ng/mL) with family history',
      clinicalDetails: 'PSA 5.2 ng/mL, normal DRE. Strong family history of prostate cancer.',
      comorbidities: ['Hyperlipidemia'],
      medications: ['Atorvastatin'],
      lastPSA: 5.2,
      lastPSADate: '2024-01-05',
      familyHistory: 'Brother diagnosed with prostate cancer at age 55',
      triagedBy: 'Nurse Sarah',
      triagedAt: '2024-01-13',
      notes: 'Scheduled for first consultation within 2 weeks',
      psaSuggestion: 'OPD Consultation',
      psaCriteria: 'PSA 4-10 ng/mL',
      suggestedPathway: 'OPD Queue',
      procedureStatus: 'completed'
    },
    {
      id: 'REF003',
      patientName: 'David Wilson',
      age: 71,
      gender: 'Male',
      referralDate: '2024-01-05',
      receivedDate: '2024-01-06',
      status: 'active',
      urgency: 'low',
      priority: 'medium',
      referringGP: 'Dr. Emily Davis',
      practice: 'Rural Health Clinic',
      reason: 'Routine PSA monitoring - elevated levels',
      clinicalDetails: 'PSA 4.8 ng/mL, normal DRE. Patient asymptomatic.',
      comorbidities: ['COPD'],
      medications: ['Salbutamol', 'Tiotropium'],
      lastPSA: 4.8,
      lastPSADate: '2024-01-03',
      familyHistory: 'No significant family history',
      triagedBy: 'Nurse Michael',
      triagedAt: '2024-01-08',
      notes: 'Under active surveillance, next review in 3 months',
      psaSuggestion: 'Active Surveillance',
      psaCriteria: 'PSA <4 ng/mL',
      suggestedPathway: 'Active Surveillance',
      procedureStatus: 'scheduled'
    },
    {
      id: 'REF004',
      patientName: 'Robert Davis',
      age: 62,
      gender: 'Male',
      referralDate: '2023-12-20',
      receivedDate: '2023-12-21',
      status: 'ready_for_discharge',
      urgency: 'low',
      priority: 'low',
      referringGP: 'Dr. Jennifer Lee',
      practice: 'Metro Medical Group',
      reason: 'Post-treatment follow-up',
      clinicalDetails: 'Post-RALP patient, PSA undetectable, excellent recovery.',
      comorbidities: [],
      medications: [],
      lastPSA: 0.02,
      lastPSADate: '2024-01-10',
      familyHistory: 'No significant family history',
      triagedBy: 'Nurse Sarah',
      triagedAt: '2023-12-22',
      notes: 'Ready for discharge to GP care with annual PSA monitoring',
      psaSuggestion: 'Discharge to GP',
      psaCriteria: 'PSA <0.1 ng/mL',
      suggestedPathway: 'Discharge',
      procedureStatus: 'completed'
    },
    {
      id: 'REF005',
      patientName: 'James Anderson',
      age: 55,
      gender: 'Male',
      referralDate: '2024-01-14',
      receivedDate: '2024-01-15',
      status: 'pending',
      urgency: 'high',
      priority: 'urgent',
      referringGP: 'Dr. Mark Thompson',
      practice: 'Coastal Medical Centre',
      reason: 'Suspicious MRI findings with elevated PSA',
      clinicalDetails: 'PSA 6.8 ng/mL, MRI shows PIRADS 4 lesion in peripheral zone.',
      comorbidities: ['Obesity'],
      medications: ['Metformin'],
      lastPSA: 6.8,
      lastPSADate: '2024-01-12',
      familyHistory: 'Uncle had prostate cancer',
      triagedBy: null,
      triagedAt: null,
      notes: 'Urgent biopsy required due to MRI findings',
      psaSuggestion: 'OPD Consultation',
      psaCriteria: 'PSA 4-10 ng/mL',
      suggestedPathway: 'OPD Queue',
      procedureStatus: 'pending'
    },
    {
      id: 'REF006',
      patientName: 'William Thompson',
      age: 68,
      gender: 'Male',
      referralDate: '2024-01-11',
      receivedDate: '2024-01-12',
      status: 'triaged',
      urgency: 'medium',
      priority: 'high',
      referringGP: 'Dr. Lisa Chen',
      practice: 'University Medical Centre',
      reason: 'Active surveillance - progression concerns',
      clinicalDetails: 'PSA velocity 0.8 ng/mL/year, stable DRE. Patient concerned about progression.',
      comorbidities: ['Hypertension'],
      medications: ['Amlodipine'],
      lastPSA: 4.5,
      lastPSADate: '2024-01-09',
      familyHistory: 'No significant family history',
      triagedBy: 'Nurse Michael',
      triagedAt: '2024-01-14',
      notes: 'Review active surveillance protocol, consider repeat biopsy',
      psaSuggestion: 'Active Surveillance',
      psaCriteria: 'PSA <4 ng/mL',
      suggestedPathway: 'Active Surveillance',
      procedureStatus: 'scheduled'
    }
  ];

  const getDaysSinceReferral = (referralDate) => {
    const today = new Date();
    const referral = new Date(referralDate);
    const diffTime = Math.abs(today - referral);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


  const handleTriageUpdate = (referralId, newStatus) => {
    dispatch(updateReferral({
      id: referralId,
      status: newStatus,
      triagedAt: new Date().toISOString(),
      triagedBy: 'Current User' // This would come from auth state
    }));
  };



  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'triaged': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'ready_for_discharge': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  const handleViewPatient = (referral) => {
    setSelectedReferral(referral);
    setShowPatientModal(true);
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedReferral(null);
    setDocuments([]);
  };

  // Document handling functions
  const addDocument = () => {
    const newDocument = {
      id: Date.now(),
      title: '',
      file: null,
      fileName: ''
    };
    setDocuments([...documents, newDocument]);
  };

  const removeDocument = (documentId) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
  };

  const updateDocumentTitle = (documentId, title) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId ? { ...doc, title } : doc
    ));
  };

  const handleFileUpload = (documentId, event) => {
    const file = event.target.files[0];
    if (file) {
      setDocuments(documents.map(doc => 
        doc.id === documentId ? { ...doc, file, fileName: file.name } : doc
      ));
    }
  };


  // Procedure scheduling functions
  const handleScheduleProcedure = () => {
    setShowScheduleModal(true);
  };

  const confirmScheduleProcedure = () => {
    if (!selectedProcedure) {
      alert('Please select a procedure');
      return;
    }
    setShowScheduleModal(false);
    setShowDateTimeModal(true);
  };

  const cancelScheduleProcedure = () => {
    setShowScheduleModal(false);
    setSelectedProcedure('');
  };

  // Date/Time scheduling functions
  const confirmDateTimeSchedule = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    const procedureName = procedures.find(p => p.id === selectedProcedure)?.name;
    console.log('Scheduling procedure:', procedureName, 'for patient:', selectedReferral?.patientName, 'on', selectedDate, 'at', selectedTime);
    setShowDateTimeModal(false);
    setShowScheduleSuccessModal(true);
  };

  const cancelDateTimeSchedule = () => {
    setShowDateTimeModal(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  const closeScheduleSuccessModal = () => {
    setShowScheduleSuccessModal(false);
    setSelectedProcedure('');
    setSelectedDate('');
    setSelectedTime('');
  };

  // OPD appointment scheduling functions
  const handleScheduleOPD = () => {
    setShowOPDModal(true);
  };

  const confirmOPDSchedule = () => {
    if (!selectedOPDDate || !selectedOPDTime || !selectedDoctor) {
      alert('Please select date, time, and doctor');
      return;
    }
    const doctorName = doctors.find(d => d.id === selectedDoctor)?.name;
    console.log('Scheduling OPD appointment for patient:', selectedReferral?.patientName, 'on', selectedOPDDate, 'at', selectedOPDTime, 'with', doctorName);
    setShowOPDModal(false);
    setShowOPDSuccessModal(true);
  };

  const cancelOPDSchedule = () => {
    setShowOPDModal(false);
    setSelectedOPDDate('');
    setSelectedOPDTime('');
    setSelectedDoctor('');
  };

  const closeOPDSuccessModal = () => {
    setShowOPDSuccessModal(false);
    setSelectedOPDDate('');
    setSelectedOPDTime('');
    setSelectedDoctor('');
  };

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Available procedures
  const procedures = [
    { id: 'mri', name: 'MRI', description: 'Magnetic Resonance Imaging of the prostate' },
    { id: 'trus_biopsy', name: 'TRUS Biopsy', description: 'Transrectal Ultrasound-guided biopsy' },
    { id: 'psa_test', name: 'PSA Test', description: 'Prostate-Specific Antigen blood test' }
  ];

  // Available doctors
  const doctors = [
    { id: 'dr_smith', name: 'Dr. John Smith', specialization: 'Urologist', experience: '15 years' },
    { id: 'dr_johnson', name: 'Dr. Sarah Johnson', specialization: 'Urologist', experience: '12 years' },
    { id: 'dr_wilson', name: 'Dr. Michael Wilson', specialization: 'Urologist', experience: '18 years' },
    { id: 'dr_brown', name: 'Dr. Emily Brown', specialization: 'Urologist', experience: '10 years' },
    { id: 'dr_davis', name: 'Dr. Robert Davis', specialization: 'Urologist', experience: '20 years' }
  ];


  const filteredReferrals = enhancedReferrals.filter(referral => {
    // Search filter only
    const searchMatch = searchTerm === '' || 
      referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referringGP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.practice.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchMatch;
  });

  return (
    <div className="space-y-6">
      


      {/* Referrals Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Referrals Management</h2>
            <p className="text-sm text-gray-600 mt-1">Review and triage incoming referrals with PSA criteria and automatic suggestions</p>
          </div>
        </div>
        
        
        {/* Search */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
              <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
                  placeholder="Search by patient name, GP, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
        </div>
      </div>
    </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredReferrals.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Referring GP</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReferrals.map((referral, index) => (
                  <tr key={referral.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {referral.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{referral.patientName}</p>
                          <p className="text-sm text-gray-500">Age: {referral.age} • PSA: {referral.lastPSA} ng/mL</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="font-medium text-gray-900">{referral.referringGP}</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewPatient(referral)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View/Add Details</span>
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
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No referrals found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm !== ''
                  ? 'No referrals match your search criteria.'
                  : 'No referrals found.'
                }
              </p>
              {searchTerm !== '' && (
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Patient Details Modal */}
      {showPatientModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative top-4 mx-auto p-0  shadow-lg rounded-md bg-white max-w-6xl w-full min-w-[800px] mb-4 h-[90vh] flex flex-col">
            <div className="p-0 flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex items-center justify-end p-3 border-b border-gray-200 flex-shrink-0">
                <button
                  onClick={closePatientModal}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </button>
              </div>

              {/* Patient Header Card */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    {/* Left side - Patient Information */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {selectedReferral.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold text-gray-900">{selectedReferral.patientName}</h1>
                        <p className="text-xs text-gray-600">Referral ID: {selectedReferral.id}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md ${getStatusColor(selectedReferral.status)}`}>
                            {selectedReferral.status.replace('_', ' ')}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-green-100 text-green-800">
                            Age: {selectedReferral.age} years
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                            {selectedReferral.gender}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - GP Information */}
                    <div className="text-right">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Referring GP</h3>
                      <p className="text-sm font-medium text-gray-900">{selectedReferral.referringGP}</p>
                      <p className="text-xs text-gray-600">{selectedReferral.practice}</p>
                      <p className="text-xs text-gray-500 mt-1">Referral Date: {selectedReferral.referralDate}</p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Content */}
              <div className="bg-white flex flex-col flex-1 min-h-0">
                <div className="p-4 flex-1 overflow-y-auto">

                  {/* PSA Data Section */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">PSA Data & Criteria</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <div className="text-3xl font-bold text-blue-900">{selectedReferral.lastPSA}</div>
                          <div className="text-sm text-blue-700">ng/mL</div>
                          <div className="text-xs text-blue-600 mt-1">Latest PSA</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <div className="text-lg font-semibold text-green-900">{selectedReferral.psaCriteria}</div>
                          <div className="text-sm text-green-700">PSA Criteria</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <div className="text-lg font-semibold text-purple-900">{selectedReferral.lastPSADate}</div>
                          <div className="text-sm text-purple-700">Test Date</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Comorbidities</h3>
                          <div className="space-y-2">
                            {selectedReferral.comorbidities.map((comorbidity, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {comorbidity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Current Medications</h3>
                          <div className="space-y-2">
                            {selectedReferral.medications.map((medication, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {medication}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Family History</h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{selectedReferral.familyHistory}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Notes Section */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Clinical Notes</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Clinical Notes
                          </label>
                          <textarea
                            value={clinicalData.clinicalNotes}
                            onChange={(e) => setClinicalData({...clinicalData, clinicalNotes: e.target.value})}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter clinical observations and notes..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Assessment Section */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Patient Assessment</h2>

                      {/* Symptoms */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Symptoms
                        </label>
                        <textarea
                          value={clinicalData.symptoms}
                          onChange={(e) => setClinicalData({...clinicalData, symptoms: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Describe patient symptoms..."
                        />
                      </div>

                      {/* Family History */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Family History
                        </label>
                        <textarea
                          value={clinicalData.familyHistory}
                          onChange={(e) => setClinicalData({...clinicalData, familyHistory: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter relevant family medical history..."
                        />
                      </div>

                      {/* Medications and Allergies */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Current Medications
                          </label>
                          <textarea
                            value={clinicalData.medications}
                            onChange={(e) => setClinicalData({...clinicalData, medications: e.target.value})}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="List current medications..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Allergies
                          </label>
                          <textarea
                            value={clinicalData.allergies}
                            onChange={(e) => setClinicalData({...clinicalData, allergies: e.target.value})}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="List known allergies..."
                          />
                        </div>
                      </div>

                      {/* Vital Signs */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Vital Signs</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Blood Pressure
                            </label>
                            <input
                              type="text"
                              value={clinicalData.vitalSigns.bloodPressure}
                              onChange={(e) => setClinicalData({
                                ...clinicalData, 
                                vitalSigns: {...clinicalData.vitalSigns, bloodPressure: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="120/80"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Heart Rate (bpm)
                            </label>
                            <input
                              type="number"
                              value={clinicalData.vitalSigns.heartRate}
                              onChange={(e) => setClinicalData({
                                ...clinicalData, 
                                vitalSigns: {...clinicalData.vitalSigns, heartRate: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="72"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Temperature (°C)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={clinicalData.vitalSigns.temperature}
                              onChange={(e) => setClinicalData({
                                ...clinicalData, 
                                vitalSigns: {...clinicalData.vitalSigns, temperature: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="36.5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={clinicalData.vitalSigns.weight}
                              onChange={(e) => setClinicalData({
                                ...clinicalData, 
                                vitalSigns: {...clinicalData.vitalSigns, weight: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="70.5"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Documents & Test Results Section */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900">Documents & Test Results</h2>
                        <button
                          onClick={addDocument}
                          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Document
                        </button>
                      </div>

                      {documents.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 mb-4">No documents added yet</p>
                          <button
                            onClick={addDocument}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Document
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {documents.map((document, index) => (
                            <div key={document.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-700">Document {index + 1}</h3>
                                <button
                                  onClick={() => removeDocument(document.id)}
                                  className="flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 hover:border-red-300 transition-colors"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Remove
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Document Title
                                  </label>
                                  <input
                                    type="text"
                                    value={document.title}
                                    onChange={(e) => updateDocumentTitle(document.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    placeholder="e.g., PSA Test Results, MRI Report, Biopsy Report"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Upload File
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="file"
                                      onChange={(e) => handleFileUpload(document.id, e)}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                                    />
                                    <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                      <div className="flex items-center">
                                        <Upload className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">
                                          {document.fileName || 'Choose file...'}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">Browse</span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: PDF, DOC, DOCX, JPG, PNG, TIFF
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Clinical Data Button */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            console.log('Saving clinical data:', clinicalData);
                            console.log('Saving documents:', documents);
                            // Here you would typically save the data to your backend
                            // Simulate success for now - in real app, handle success/failure based on API response
                            setShowSaveSuccessModal(true);
                          }}
                          className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.01]"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Save Clinical Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Section */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                  onClick={() => {
                    // Handle move to OPD logic
                    console.log('Moving patient to OPD:', selectedReferral.patientName);
                    setShowMoveToOPDSuccessModal(true);
                  }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-black to-green-600 text-white font-medium rounded-lg shadow-lg hover:from-gray-800 hover:to-green-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  <span>Move to OPD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Schedule Procedure Modal */}
      {showScheduleModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[80] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-lg">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Schedule Procedure</h3>
                <p className="text-sm text-gray-600 mt-1">Select and schedule diagnostic procedure for {selectedReferral.patientName}</p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Available Procedures</h4>
                  <div className="space-y-3">
                    {procedures.map((procedure) => (
                      <label
                        key={procedure.id}
                        className={`relative flex items-start p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedProcedure === procedure.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="procedure"
                          value={procedure.id}
                          checked={selectedProcedure === procedure.id}
                          onChange={(e) => setSelectedProcedure(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 mr-3 mt-1 ${
                          selectedProcedure === procedure.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedProcedure === procedure.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-semibold text-gray-900">{procedure.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{procedure.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={confirmScheduleProcedure}
                    disabled={!selectedProcedure}
                    className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Schedule Procedure
                  </button>
                  <button
                    onClick={cancelScheduleProcedure}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date/Time Selection Modal */}
      {showDateTimeModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[90] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-lg">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-900">Schedule Appointment</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Schedule {procedures.find(p => p.id === selectedProcedure)?.name} for {selectedReferral.patientName}
                </p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Select Time</label>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-2 py-1 text-xs rounded-md border transition-all duration-200 ${
                            selectedTime === time
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Summary */}
                  {selectedDate && selectedTime && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex items-center mb-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                        <h4 className="text-sm font-semibold text-blue-900">Appointment Summary</h4>
                      </div>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Procedure:</strong> {procedures.find(p => p.id === selectedProcedure)?.name}</p>
                        <p><strong>Patient:</strong> {selectedReferral.patientName}</p>
                        <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                        <p><strong>Time:</strong> {selectedTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={confirmDateTimeSchedule}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Schedule
                  </button>
                  <button
                    onClick={cancelDateTimeSchedule}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Success Modal */}
      {showScheduleSuccessModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[100] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Appointment Scheduled!</h3>
                <p className="text-green-100 text-sm mt-2">Procedure has been successfully scheduled</p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="text-sm text-green-800 space-y-2">
                      <p><strong>Procedure:</strong> {procedures.find(p => p.id === selectedProcedure)?.name}</p>
                      <p><strong>Patient:</strong> {selectedReferral.patientName}</p>
                      <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    The patient will be notified about their scheduled appointment.
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6">
                <button
                  onClick={closeScheduleSuccessModal}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OPD Appointment Booking Modal */}
      {showOPDModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-[110] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Schedule OPD Appointment</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Schedule OPD consultation for {selectedReferral.patientName}
                    </p>
                  </div>
                  <button
                    onClick={cancelOPDSchedule}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6 flex-1 overflow-y-auto">
                <div className="space-y-6">
                  {/* Patient Info Card */}
                  <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {selectedReferral.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{selectedReferral.patientName}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">Age: {selectedReferral.age} years</span>
                          <span className="text-sm text-gray-600">PSA: {selectedReferral.lastPSA} ng/mL</span>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                            {selectedReferral.procedureStatus} procedure
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Date and Doctor Selection */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Date</label>
                        <input
                          type="date"
                          value={selectedOPDDate}
                          onChange={(e) => setSelectedOPDDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Doctor</label>
                        <select
                          value={selectedDoctor}
                          onChange={(e) => setSelectedDoctor(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        >
                          <option value="">Choose a doctor...</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization} ({doctor.experience})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Selected Summary */}
                      {selectedOPDDate && selectedOPDTime && selectedDoctor && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                          <div className="flex items-center mb-3">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                            <h4 className="text-sm font-semibold text-green-900">Appointment Summary</h4>
                          </div>
                          <div className="text-sm text-green-800 space-y-2">
                            <p><strong>Type:</strong> OPD Consultation</p>
                            <p><strong>Patient:</strong> {selectedReferral.patientName}</p>
                            <p><strong>Doctor:</strong> {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                            <p><strong>Date:</strong> {new Date(selectedOPDDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</p>
                            <p><strong>Time:</strong> {selectedOPDTime}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Select Time</label>
                      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedOPDTime(time)}
                            className={`px-3 py-2 text-sm rounded-md border transition-all duration-200 font-medium ${
                              selectedOPDTime === time
                                ? 'bg-green-500 text-white border-green-500 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50 hover:shadow-sm'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Click on a time slot to select your preferred appointment time</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={confirmOPDSchedule}
                    disabled={!selectedOPDDate || !selectedOPDTime || !selectedDoctor}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2 inline" />
                    Confirm OPD Appointment
                  </button>
                  <button
                    onClick={cancelOPDSchedule}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OPD Success Modal */}
      {showOPDSuccessModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[120] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">OPD Appointment Scheduled!</h3>
                <p className="text-green-100 text-sm mt-2">Appointment has been successfully scheduled</p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                    <div className="text-sm text-green-800 space-y-2">
                      <p><strong>Type:</strong> OPD Consultation</p>
                      <p><strong>Patient:</strong> {selectedReferral.patientName}</p>
                      <p><strong>Doctor:</strong> {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                      <p><strong>Date:</strong> {new Date(selectedOPDDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                      <p><strong>Time:</strong> {selectedOPDTime}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    The patient will be notified about their scheduled OPD appointment.
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6">
                <button
                  onClick={closeOPDSuccessModal}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Move to OPD Success Modal */}
      {showMoveToOPDSuccessModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[130] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Patient Moved to OPD!</h3>
                <p className="text-green-100 text-sm mt-2">Patient has been successfully transferred to OPD</p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center">
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                    <div className="text-sm text-emerald-800 space-y-2">
                      <p><strong>Patient:</strong> {selectedReferral.patientName}</p>
                      <p><strong>Referral ID:</strong> {selectedReferral.id}</p>
                      <p><strong>Status:</strong> Moved to OPD</p>
                      <p><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    The patient has been successfully moved to the OPD workflow and will be scheduled for consultation.
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => {
                    setShowMoveToOPDSuccessModal(false);
                    setShowPatientModal(false);
                    setSelectedReferral(null);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Success Modal */}
      {showSaveSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[140] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Data Saved Successfully!</h3>
                <p className="text-green-100 text-sm mt-2">Clinical data has been saved</p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    The clinical data for {selectedReferral?.patientName} has been successfully saved to the system.
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => setShowSaveSuccessModal(false)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Failure Modal */}
      {showSaveFailureModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[140] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Save Failed</h3>
                <p className="text-red-100 text-sm mt-2">Unable to save clinical data</p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    There was an error saving the clinical data. Please try again or contact support if the problem persists.
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => setShowSaveFailureModal(false)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReferralTriage;
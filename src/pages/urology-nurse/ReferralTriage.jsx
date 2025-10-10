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
  AlertTriangle,
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
  const [showPSAHistoryModal, setShowPSAHistoryModal] = useState(false);
  const [psaChartType, setPsaChartType] = useState('line');
  const [isPSAModalOpen, setIsPSAModalOpen] = useState(false);
  const [selectedPatientForPSA, setSelectedPatientForPSA] = useState(null);
  const [psaForm, setPsaForm] = useState({
    date: '',
    value: '',
    note: ''
  });
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
  const [testResults, setTestResults] = useState({
    mri: '',
    biopsy: '',
    trus: '',
    mriDocument: null,
    biopsyDocument: null,
    trusDocument: null
  });
  const [additionalTests, setAdditionalTests] = useState([]);
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
      referralDate: '2025-9-25',
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
      referralDate: '2025-9-25',
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
      referralDate: '2025-10-8',
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
      referralDate: '2025-10-8',
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
      referralDate: '2025-10-8',
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
      referralDate: '2025-10-8',
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

  // Function to format wait time with highlighting for urgent cases
  const formatWaitTime = (days) => {
    if (days > 10) {
      return {
        text: `${days} days - URGENT`,
        isUrgent: true,
        className: 'text-red-600 font-medium'
      };
    } else if (days > 3) {
      return {
        text: `${days} days - Review needed`,
        isUrgent: false,
        className: 'text-amber-600 font-medium'
      };
    } else {
      return {
        text: `${days} days ago`,
        isUrgent: false,
        className: 'text-gray-400'
      };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
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
    setTestResults({
      mri: '',
      biopsy: '',
      trus: '',
      mriDocument: null,
      biopsyDocument: null,
      trusDocument: null
    });
    setAdditionalTests([]);
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

  // Test results handling functions

  const handleTestDocumentUpload = (testType, event) => {
    const file = event.target.files[0];
    if (file) {
      setTestResults(prev => ({
        ...prev,
        [`${testType}Document`]: file
      }));
    }
  };

  const removeTestDocument = (testType) => {
    setTestResults(prev => ({
      ...prev,
      [`${testType}Document`]: null
    }));
  };

  // Additional tests handling functions
  const addAdditionalTest = () => {
    const newTest = {
      id: Date.now(),
      title: '',
      result: '',
      document: null
    };
    setAdditionalTests([...additionalTests, newTest]);
  };

  const removeAdditionalTest = (testId) => {
    setAdditionalTests(additionalTests.filter(test => test.id !== testId));
  };

  const updateAdditionalTest = (testId, field, value) => {
    setAdditionalTests(additionalTests.map(test => 
      test.id === testId ? { ...test, [field]: value } : test
    ));
  };

  const handleAdditionalTestDocumentUpload = (testId, event) => {
    const file = event.target.files[0];
    if (file) {
      setAdditionalTests(additionalTests.map(test => 
        test.id === testId ? { ...test, document: file, fileName: file.name } : test
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

  // PSA Chart Helper Functions

  const getPSACategory = (psa) => {
    if (psa < 4) return { category: 'Normal', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (psa < 10) return { category: 'Borderline', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (psa < 20) return { category: 'Elevated', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { category: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  // Mock PSA history data for charts
  const mockPSAHistory = [
    { value: 4.2, date: '2023-06-15', velocity: null },
    { value: 6.8, date: '2023-09-15', velocity: 1.8 },
    { value: 8.5, date: '2024-01-08', velocity: 2.1 }
  ];

  const maxPSA = Math.max(...mockPSAHistory.map(p => p.value));
  const minPSA = Math.min(...mockPSAHistory.map(p => p.value));
  const psaRange = maxPSA - minPSA;

  // PSA Entry Functions
  const handlePSAEntry = (referralId) => {
    const referral = enhancedReferrals.find(r => r.id === referralId);
    setSelectedPatientForPSA(referral);
    setIsPSAModalOpen(true);
  };

  const handlePSAFormChange = (e) => {
    const { name, value } = e.target;
    setPsaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPSA = (e) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    console.log('Adding PSA value for patient:', selectedPatientForPSA?.id, psaForm);
    
    // Reset form and close modal
    setPsaForm({
      date: '',
      value: '',
      note: ''
    });
    setSelectedPatientForPSA(null);
    setIsPSAModalOpen(false);
  };

  const closePSAModal = () => {
    setIsPSAModalOpen(false);
    setSelectedPatientForPSA(null);
    setPsaForm({
      date: '',
      value: '',
      note: ''
    });
  };

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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Referral Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReferrals.map((referral, index) => {
                  const waitTimeInfo = formatWaitTime(getDaysSinceReferral(referral.referralDate));
                  return (
                    <tr key={referral.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${waitTimeInfo.isUrgent ? 'bg-red-50/30 border-l-4 border-red-500' : ''}`}>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${waitTimeInfo.isUrgent ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-green-800 to-black'}`}>
                              <span className="text-white font-semibold text-sm">
                                {referral.patientName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {waitTimeInfo.isUrgent && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-gray-900">{referral.patientName}</p>
                              {waitTimeInfo.isUrgent && (
                                <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                  <span className="text-xs font-medium text-red-600">URGENT</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">Age: {referral.age} • PSA: {referral.lastPSA} ng/mL</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <p className="font-medium text-gray-900">{referral.referringGP}</p>
                      </td>
                      <td className="py-5 px-6">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{formatDate(referral.referralDate)}</p>
                          <p className={`text-xs leading-tight ${waitTimeInfo.className}`}>
                            {waitTimeInfo.text}
                          </p>
                        </div>
                      </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewPatient(referral)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View/Add Clinical Info</span>
                        </button>
                        <button
                          onClick={() => handlePSAEntry(referral.id)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span>Add PSA</span>
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
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900">PSA Data & Criteria</h2>
                        <button
                          onClick={() => setShowPSAHistoryModal(true)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View PSA History
                        </button>
                      </div>
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

                      {/* Allergies */}
                      <div className="mb-4">
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

                  {/* Nurse Note Section */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Nurse Note</h2>
                      
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

                  {/* Test Results Section */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Test Results</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* MRI Results */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-gray-900">MRI Results</h3>
                            {testResults.mriDocument && (
                              <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Upload Report
                            </label>
                            {testResults.mriDocument ? (
                              <div className="flex items-center justify-between px-3 py-2 border border-green-300 rounded-lg bg-green-50">
                                <div className="flex items-center">
                                  <FileText className="h-3 w-3 text-green-600 mr-2" />
                                  <span className="text-xs text-green-800 font-medium">
                                    {testResults.mriDocument.name}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeTestDocument('mri')}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="file"
                                  onChange={(e) => handleTestDocumentUpload('mri', e)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                                />
                                <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center">
                                    <Upload className="h-3 w-3 text-gray-400 mr-2" />
                                    <span className="text-xs text-gray-600">Choose file...</span>
                                  </div>
                                  <span className="text-xs text-gray-500">Browse</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Biopsy Results */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-gray-900">Biopsy Results</h3>
                            {testResults.biopsyDocument && (
                              <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Upload Report
                            </label>
                            {testResults.biopsyDocument ? (
                              <div className="flex items-center justify-between px-3 py-2 border border-green-300 rounded-lg bg-green-50">
                                <div className="flex items-center">
                                  <FileText className="h-3 w-3 text-green-600 mr-2" />
                                  <span className="text-xs text-green-800 font-medium">
                                    {testResults.biopsyDocument.name}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeTestDocument('biopsy')}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="file"
                                  onChange={(e) => handleTestDocumentUpload('biopsy', e)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                                />
                                <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center">
                                    <Upload className="h-3 w-3 text-gray-400 mr-2" />
                                    <span className="text-xs text-gray-600">Choose file...</span>
                                  </div>
                                  <span className="text-xs text-gray-500">Browse</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* TRUS Results */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <h3 className="text-sm font-semibold text-gray-900">TRUS Results</h3>
                            {testResults.trusDocument && (
                              <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Upload Report
                            </label>
                            {testResults.trusDocument ? (
                              <div className="flex items-center justify-between px-3 py-2 border border-green-300 rounded-lg bg-green-50">
                                <div className="flex items-center">
                                  <FileText className="h-3 w-3 text-green-600 mr-2" />
                                  <span className="text-xs text-green-800 font-medium">
                                    {testResults.trusDocument.name}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeTestDocument('trus')}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="file"
                                  onChange={(e) => handleTestDocumentUpload('trus', e)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                                />
                                <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center">
                                    <Upload className="h-3 w-3 text-gray-400 mr-2" />
                                    <span className="text-xs text-gray-600">Choose file...</span>
                                  </div>
                                  <span className="text-xs text-gray-500">Browse</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Test Results Section */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900">Additional Test Results</h2>
                        <button
                          onClick={addAdditionalTest}
                          className="flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Test
                        </button>
                      </div>

                      {additionalTests.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <TestTube className="h-8 w-8 text-purple-400" />
                          </div>
                          <p className="text-sm text-gray-500 mb-4">No additional tests added yet</p>
                          <button
                            onClick={addAdditionalTest}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Test
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {additionalTests.map((test, index) => (
                            <div key={test.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-700">Additional Test {index + 1}</h3>
                                <button
                                  onClick={() => removeAdditionalTest(test.id)}
                                  className="flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 hover:border-red-300 transition-colors"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Remove
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Test Title
                                  </label>
                                  <input
                                    type="text"
                                    value={test.title}
                                    onChange={(e) => updateAdditionalTest(test.id, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    placeholder="e.g., Blood Chemistry, Urinalysis, CT Scan"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Result
                                  </label>
                                  <input
                                    type="text"
                                    value={test.result}
                                    onChange={(e) => updateAdditionalTest(test.id, 'result', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    placeholder="Enter test result or status"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Upload Report
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="file"
                                      onChange={(e) => handleAdditionalTestDocumentUpload(test.id, e)}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                                    />
                                    <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                      <div className="flex items-center">
                                        <Upload className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">
                                          {test.fileName || 'Choose file...'}
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
                            console.log('Saving test results:', testResults);
                            console.log('Saving additional tests:', additionalTests);
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

      {/* PSA History Modal */}
      {showPSAHistoryModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[150] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">PSA History</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      PSA trend analysis for {selectedReferral.patientName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPSAHistoryModal(false)}
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
                  <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-black rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {selectedReferral.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{selectedReferral.patientName}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">Age: {selectedReferral.age} years</span>
                          <span className="text-sm text-gray-600">Latest PSA: {selectedReferral.lastPSA} ng/mL</span>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                            {selectedReferral.psaCriteria}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PSA History Table */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900">PSA Test History</h4>
                      <p className="text-sm text-gray-600 mt-1">Historical PSA values and trends</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Date</th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">PSA Value</th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Category</th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Velocity</th>
                            <th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {/* Hardcoded PSA history data */}
                          <tr className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-sm text-gray-900">2024-01-08</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                {selectedReferral.lastPSA} ng/mL
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                High Risk
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">+2.1 ng/mL/year</td>
                            <td className="py-4 px-6 text-sm text-gray-600">Latest test result</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-sm text-gray-900">2023-09-15</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                6.8 ng/mL
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                Elevated
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">+1.8 ng/mL/year</td>
                            <td className="py-4 px-6 text-sm text-gray-600">Rising trend noted</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-sm text-gray-900">2023-06-15</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                4.2 ng/mL
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                Borderline
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-900">+0.9 ng/mL/year</td>
                            <td className="py-4 px-6 text-sm text-gray-600">Baseline established</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* PSA Chart Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">PSA Trend Chart</h4>
                          <p className="text-sm text-gray-600 mt-1">Prostate-specific antigen levels over time</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setPsaChartType('line')}
                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                              psaChartType === 'line' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Line Chart
                          </button>
                          <button
                            onClick={() => setPsaChartType('bar')}
                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                              psaChartType === 'bar' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Bar Chart
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* Chart Area */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <div className="relative h-64">
                          {/* Chart Grid */}
                          <div className="absolute inset-0">
                            {/* Horizontal grid lines */}
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className="absolute w-full border-t border-gray-200"
                                style={{ top: `${(i / 5) * 100}%` }}
                              >
                                <span className="absolute -left-12 -top-2 text-xs text-gray-500">
                                  {Math.round(maxPSA - (i / 5) * psaRange)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Chart Content */}
                          <div className="relative h-full">
                            {psaChartType === 'line' ? (
                              // Line Chart
                              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="psaGradientModal" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Area under curve */}
                                <path
                                  d={`M 40 ${200 - ((mockPSAHistory[0].value - minPSA) / psaRange) * 160} ${mockPSAHistory.map((psa, index) => 
                                    `L ${40 + (index / (mockPSAHistory.length - 1)) * 520} ${200 - ((psa.value - minPSA) / psaRange) * 160}`
                                  ).join(' ')} L ${40 + 520} 200 L 40 200 Z`}
                                  fill="url(#psaGradientModal)"
                                />
                                
                                {/* Line */}
                                <path
                                  d={`M 40 ${200 - ((mockPSAHistory[0].value - minPSA) / psaRange) * 160} ${mockPSAHistory.map((psa, index) => 
                                    `L ${40 + (index / (mockPSAHistory.length - 1)) * 520} ${200 - ((psa.value - minPSA) / psaRange) * 160}`
                                  ).join(' ')}`}
                                  stroke="#3B82F6"
                                  strokeWidth="3"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                
                                {/* Data points */}
                                {mockPSAHistory.map((psa, index) => (
                                  <g key={index}>
                                    <circle
                                      cx={40 + (index / (mockPSAHistory.length - 1)) * 520}
                                      cy={200 - ((psa.value - minPSA) / psaRange) * 160}
                                      r="6"
                                      fill="white"
                                      stroke="#3B82F6"
                                      strokeWidth="2"
                                    />
                                    <circle
                                      cx={40 + (index / (mockPSAHistory.length - 1)) * 520}
                                      cy={200 - ((psa.value - minPSA) / psaRange) * 160}
                                      r="3"
                                      fill="#3B82F6"
                                    />
                                  </g>
                                ))}
                              </svg>
                            ) : (
                              // Bar Chart
                              <div className="flex items-end justify-between h-full px-4 space-x-2">
                                {mockPSAHistory.map((psa, index) => {
                                  const height = ((psa.value - minPSA) / psaRange) * 80; // 80% of container height
                                  const category = getPSACategory(psa.value);
                                  return (
                                    <div key={index} className="flex-1 flex flex-col items-center group">
                                      <div
                                        className={`w-full ${category.bgColor} rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer relative border`}
                                        style={{ height: `${height}%`, minHeight: '20px' }}
                                        title={`${psa.value} ng/mL - ${formatDate(psa.date)}`}
                                      >
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                            {psa.value} ng/mL
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-2 text-center">
                                        <p className="text-xs font-medium text-gray-900">{psa.value}</p>
                                        <p className="text-xs text-gray-500">{formatDate(psa.date).split('/')[0]}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Chart Legend */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900">Normal</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">&lt; 4.0 ng/mL</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900">Borderline</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">4.0 - 10.0 ng/mL</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900">Elevated</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">10.0 - 20.0 ng/mL</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900">High Risk</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">&gt; 20.0 ng/mL</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PSA Trend Analysis */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Trend Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-900">+2.1</div>
                        <div className="text-sm text-red-700">ng/mL/year</div>
                        <div className="text-xs text-red-600 mt-1">Current Velocity</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-900">3</div>
                        <div className="text-sm text-orange-700">Tests</div>
                        <div className="text-xs text-orange-600 mt-1">Last 12 Months</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-900">High</div>
                        <div className="text-sm text-yellow-700">Risk Level</div>
                        <div className="text-xs text-yellow-600 mt-1">Current Status</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowPSAHistoryModal(false)}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add PSA Value Modal */}
      {isPSAModalOpen && selectedPatientForPSA && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add PSA Value</h2>
                <p className="text-sm text-gray-600 mt-1">Patient: {selectedPatientForPSA.patientName}</p>
              </div>
              <button
                onClick={closePSAModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddPSA} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={psaForm.date}
                  onChange={handlePSAFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PSA Value (ng/mL) *
                </label>
                <input
                  type="number"
                  name="value"
                  value={psaForm.value}
                  onChange={handlePSAFormChange}
                  required
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 6.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="note"
                  value={psaForm.note}
                  onChange={handlePSAFormChange}
                  rows="3"
                  placeholder="Add any relevant notes or observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
              </div>

              {/* PSA Status Preview */}
              {psaForm.value && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">PSA Status Preview:</h4>
                  <div className="flex items-center space-x-2">
                    {parseFloat(psaForm.value) <= 4.0 ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800">Normal (≤4.0 ng/mL)</span>
                      </>
                    ) : parseFloat(psaForm.value) <= 10.0 ? (
                      <>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-800">Borderline (4.1-10.0 ng/mL)</span>
                      </>
                    ) : parseFloat(psaForm.value) <= 20.0 ? (
                      <>
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-orange-800">Elevated (10.1-20.0 ng/mL)</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-red-800">High Risk (&gt;20.0 ng/mL)</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closePSAModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add PSA Value
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReferralTriage;
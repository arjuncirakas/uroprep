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
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showTriageAcceptModal, setShowTriageAcceptModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showScheduleSuccessModal, setShowScheduleSuccessModal] = useState(false);
  const [showOPDModal, setShowOPDModal] = useState(false);
  const [showOPDSuccessModal, setShowOPDSuccessModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedOPDDate, setSelectedOPDDate] = useState('');
  const [selectedOPDTime, setSelectedOPDTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [modalActiveTab, setModalActiveTab] = useState('overview');

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

  const getProcedureStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const handleViewPatient = (referral) => {
    setSelectedReferral(referral);
    setShowPatientModal(true);
    setModalActiveTab('overview');
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedReferral(null);
  };

  const handleTriageAccept = () => {
    setShowTriageAcceptModal(true);
  };

  const confirmTriageAccept = () => {
    // Handle the actual triage acceptance logic here
    console.log('Triage accepted for patient:', selectedReferral?.patientName);
    // You could dispatch an action to update the referral status
    // dispatch(updateReferral({ id: selectedReferral?.id, status: 'triaged' }));
    setShowTriageAcceptModal(false);
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setShowPatientModal(false);
    setSelectedReferral(null);
  };

  const cancelTriageAccept = () => {
    setShowTriageAcceptModal(false);
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
    // Status filter based on active tab
    const statusMatch = activeTab === 'pending' ? referral.status === 'pending' : referral.status === 'triaged';
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referringGP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.practice.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
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
        
        {/* Tab Switcher */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'pending'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Pending
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'pending'
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {enhancedReferrals.filter(r => r.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('triaged')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'triaged'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Triaged
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'triaged'
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {enhancedReferrals.filter(r => r.status === 'triaged').length}
              </span>
            </button>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Procedure Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReferrals.map((referral, index) => (
                  <tr key={referral.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
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
                          <p className="font-semibold text-gray-900">{referral.patientName}</p>
                          <p className="text-sm text-gray-500">Age: {referral.age} • PSA: {referral.lastPSA} ng/mL</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{referral.referringGP}</p>
                        <p className="text-sm text-gray-500">{referral.practice}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getProcedureStatusColor(referral.procedureStatus)}`}>
                        {referral.procedureStatus}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewPatient(referral)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        {referral.status === 'triaged' && referral.procedureStatus === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedReferral(referral);
                              handleScheduleProcedure();
                            }}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Schedule Procedure</span>
                          </button>
                        )}
                        {referral.procedureStatus === 'completed' && (
                          <button
                            onClick={() => {
                              setSelectedReferral(referral);
                              handleScheduleOPD();
                            }}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Schedule OPD</span>
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
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No referrals found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm !== ''
                  ? 'No referrals match your search criteria.'
                  : `No ${activeTab} referrals found.`
                }
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </button>
                <button
                  onClick={() => setActiveTab(activeTab === 'pending' ? 'triaged' : 'pending')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Switch to {activeTab === 'pending' ? 'Triaged' : 'Pending'}
                </button>
              </div>
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
              <div className="flex items-center justify-end p-6 border-b border-gray-200 flex-shrink-0">
                <button
                  onClick={closePatientModal}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </button>
              </div>

              {/* Patient Header Card */}
              <div className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-gray-200 rounded-lg px-6 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {selectedReferral.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{selectedReferral.patientName}</h1>
                        <p className="text-sm text-gray-600">Referral ID: {selectedReferral.id}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getStatusColor(selectedReferral.status)}`}>
                            {selectedReferral.status.replace('_', ' ')}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-green-100 text-green-800">
                            Age: {selectedReferral.age} years
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {selectedReferral.status === 'pending' && (
                        <button
                          onClick={handleTriageAccept}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept Triage
                        </button>
                      )}
                      {selectedReferral.status === 'triaged' && (
                        <button
                          onClick={handleScheduleProcedure}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Schedule Procedure
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              {/* Tabs */}
              <div className="bg-white flex flex-col flex-1 min-h-0">
                <div className="border-b border-gray-200 flex-shrink-0">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {[
                      { id: 'overview', name: 'Overview', icon: User },
                      { id: 'psa', name: 'PSA Data', icon: TrendingUp }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setModalActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                          modalActiveTab === tab.id
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="h-4 w-4 mr-2" />
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                  {/* Overview Tab */}
                  {modalActiveTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-lg p-5">
                          <h3 className="font-semibold text-gray-900 mb-4 text-base">Patient Information</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Name:</span>
                              <span className="text-gray-900">{selectedReferral.patientName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Referral ID:</span>
                              <span className="text-gray-900">{selectedReferral.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Age:</span>
                              <span className="text-gray-900">{selectedReferral.age} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Gender:</span>
                              <span className="text-gray-900">{selectedReferral.gender}</span>
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-5">
                          <h3 className="font-semibold text-gray-900 mb-4 text-base">Referring GP</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">GP Name:</span>
                              <span className="text-gray-900">{selectedReferral.referringGP}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Practice:</span>
                              <span className="text-gray-900">{selectedReferral.practice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Referral Date:</span>
                              <span className="text-gray-900">{selectedReferral.referralDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Received:</span>
                              <span className="text-gray-900">{selectedReferral.receivedDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PSA Data Tab */}
                  {modalActiveTab === 'psa' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">PSA Data & Criteria</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                        
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Clinical Details</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700">{selectedReferral.clinicalDetails}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Family History</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700">{selectedReferral.familyHistory}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Triage Accept Confirmation Modal */}
      {showTriageAcceptModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Accept Patient Triage</h3>
                <p className="text-green-100 text-sm mt-2">Confirm triage acceptance</p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <p className="text-gray-600 text-center leading-relaxed">
                  Are you sure you want to accept the triage for <span className="font-semibold text-gray-900">{selectedReferral.patientName}</span>? 
                  This will move the patient to the next stage of the clinical workflow.
                </p>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                    <h4 className="text-sm font-semibold text-blue-900">Patient Details</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-blue-600 font-medium">PSA:</span>
                      <span className="text-blue-800 ml-1">{selectedReferral.lastPSA} ng/mL</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Age:</span>
                      <span className="text-blue-800 ml-1">{selectedReferral.age} years</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-blue-600 font-medium">Priority:</span>
                      <span className="text-blue-800 ml-1 capitalize">{selectedReferral.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6">
                <div className="flex space-x-3">
                  <button
                    onClick={confirmTriageAccept}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Accept Triage
                  </button>
                  <button
                    onClick={cancelTriageAccept}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md overflow-y-auto h-full w-full z-[70] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Triage Accepted Successfully!</h3>
                <p className="text-green-100 text-sm mt-2">Patient moved to next stage</p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <p className="text-gray-600 text-center leading-relaxed">
                  The triage for <span className="font-semibold text-gray-900">{selectedReferral.patientName}</span> has been accepted and the patient has been moved to the next stage of the clinical workflow.
                </p>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center mb-3">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full mr-2"></div>
                    <h4 className="text-sm font-semibold text-emerald-900">Status Updated</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-emerald-600 font-medium">Referral ID:</span>
                      <span className="text-emerald-800 font-mono">{selectedReferral.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-600 font-medium">Status:</span>
                      <span className="text-emerald-800">Triaged</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-600 font-medium">Next Step:</span>
                      <span className="text-emerald-800">Clinical Assessment</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6">
                <button
                  onClick={closeSuccessModal}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Continue
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

    </div>
  );
};

export default ReferralTriage;
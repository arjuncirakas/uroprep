import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  ArrowLeft,
  ArrowRight, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Zap,
  Bell,
  Share,
  Send,
  Heart,
  Stethoscope,
  Pill,
  Calendar as CalendarIcon,
  MapPin,
  Edit,
  Plus,
  Eye,
  X,
  Save,
  ChevronRight,
  Download,
  Database,
  Users,
  ArrowRightCircle,
  LineChart,
  Filter,
  BarChart3,
  Radiation
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import TestResultsModal from './TestResultsModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NursePatientDetailsModal = ({ isOpen, onClose, patientId, patientData, userRole, source, context }) => {
  const { user, role } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Helper function to get current user display name and role
  const getCurrentUserInfo = () => {
    if (!user || !role) return { name: 'Unknown User', role: 'Unknown Role' };
    
    const roleMap = {
      urologist: 'Urologist',
      urology_nurse: 'Urology Nurse',
      urology_registrar: 'Urology Registrar',
      gp: 'General Practitioner',
      admin: 'Administrator',
      mdt_coordinator: 'MDT Coordinator',
      superadmin: 'Super Administrator'
    };
    
    // Generate display name from user data
    const displayName = user.name ? 
      (user.name.includes('Dr.') ? user.name : `Dr. ${user.name}`) : 
      `Dr. ${user.email?.split('@')[0] || 'User'}`;
    
    return {
      name: displayName,
      role: roleMap[role] || role
    };
  };
  
  const currentUser = getCurrentUserInfo();
  const [isClinicalHistoryModalOpen, setIsClinicalHistoryModalOpen] = useState(false);
  const [isPSAModalOpen, setIsPSAModalOpen] = useState(false);
  const [showPSAHistoryModal, setShowPSAHistoryModal] = useState(false);
  const [showTestReportModal, setShowTestReportModal] = useState(false);
  const [selectedTestReport, setSelectedTestReport] = useState(null);
  const [psaForm, setPsaForm] = useState({
    date: '',
    value: '',
    notes: ''
  });
  const [isTestResultsModalOpen, setIsTestResultsModalOpen] = useState(false);
  const [psaChartFilter, setPsaChartFilter] = useState('6months');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [dischargeForm, setDischargeForm] = useState({
    dischargeDate: '',
    procedure: '',
    diagnosis: '',
    dischargeNotes: '',
    followUpInstructions: '',
    medications: [],
    psaPreOp: '',
    psaPostOp: ''
  });
  const [clinicalHistoryForm, setClinicalHistoryForm] = useState({
    date: '',
    type: 'consultation',
    title: '',
    details: '',
    practitioner: '',
    findings: '',
    recommendations: '',
    medications: ['']
  });
  const [isImagingModalOpen, setIsImagingModalOpen] = useState(false);
  const [imagingForm, setImagingForm] = useState({
    type: '',
    date: '',
    result: '',
    orderedBy: '',
    report: '',
    images: []
  });
  const [clinicalNotesForm, setClinicalNotesForm] = useState({
    note: '',
    priority: 'Normal',
    vitals: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: ''
    },
    medicine: ''
  });
  const [isClinicalNotesModalOpen, setIsClinicalNotesModalOpen] = useState(false);
  const [isDischargeSummaryModalOpen, setIsDischargeSummaryModalOpen] = useState(false);
  const [dischargeSummaryForm, setDischargeSummaryForm] = useState({
    procedure: '',
    diagnosis: '',
    dischargeDate: '',
    lengthOfStay: '',
    clinicalSummary: '',
    procedureDetails: '',
    psaLevels: {
      preOp: '',
      postOp: '',
      current: ''
    },
    medications: [],
    followUpInstructions: ''
  });

  // Use patientData prop if provided, otherwise use mock data
  const mockPatient = patientData || {
    id: 'URP2024001',
    name: 'John Smith',
    dob: '1965-03-15',
    medicare: '1234567890',
    phone: '0412 345 678',
    address: '123 Main Street, Melbourne VIC 3000',
    emergencyContact: 'Jane Smith (Wife)',
    emergencyPhone: '0412 345 679',
    currentStatus: 'Active Monitoring',
    currentDatabase: 'DB2',
    age: 60,
    psa: 6.2,
    psaHistory: [
      { date: '2023-06-15', value: 4.8 },
      { date: '2023-09-15', value: 5.2 },
      { date: '2023-12-15', value: 5.8 },
      { date: '2024-01-10', value: 6.2 }
    ],
    clinicalNotes: [
      {
        id: 'CN001',
        timestamp: '2024-01-15T14:30:00',
        date: '2024-01-15',
        time: '14:30',
        author: 'Jennifer Lee',
        authorRole: 'Urology Nurse',
        type: 'general',
        priority: 'Normal',
        note: 'Patient presented for routine follow-up. PSA stable at 6.2 ng/mL. No new symptoms reported. Patient continues to comply well with active monitoring protocol.',
        vitals: {
          bloodPressure: '120/80',
          heartRate: '72',
          temperature: '36.5°C',
          weight: '75kg',
          height: '175cm'
        },
        medicine: 'No changes to current medication'
      }
    ],
    dischargeSummaries: [
      {
        id: 'DS001',
        procedure: 'RALP (Robotic Assisted Laparoscopic Prostatectomy)',
        diagnosis: 'Prostate Cancer - Gleason 7 (3+4)',
        dischargeDate: '2024-01-15',
        lengthOfStay: '5 days',
        clinicalSummary: 'Patient underwent successful RALP. No complications. Catheter removed on day 5. Patient mobilizing well.',
        procedureDetails: 'Robotic-assisted laparoscopic radical prostatectomy performed successfully. No intraoperative complications.',
        psaLevels: {
          preOp: '8.5 ng/mL',
          postOp: '0.2 ng/mL',
          current: '0.8 ng/mL'
        },
        medications: ['Paracetamol 500mg', 'Ibuprofen 400mg'],
        followUpInstructions: 'Follow up in 6 weeks for PSA testing and wound check.',
        status: 'Discharged',
        riskLevel: 'Low'
      }
    ]
  };

  const [clinicalNotes, setClinicalNotes] = useState(mockPatient.clinicalNotes || []);
  const [dischargeSummaries, setDischargeSummaries] = useState(mockPatient.dischargeSummaries || []);
  const [psaHistory, setPsaHistory] = useState(mockPatient.psaHistory || []);
  const [isTestTimelineModalOpen, setIsTestTimelineModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    reportType: '',
    file: null,
    fileName: ''
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [clinicalData, setClinicalData] = useState({
    clinicalNotes: '',
    symptoms: '',
    allergies: '',
    priority: 'Normal',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: ''
    }
  });
  const [assessmentNotes, setAssessmentNotes] = useState([
    {
      id: 1,
      timestamp: new Date().toISOString(),
      nurseName: 'John Smith',
      nurseInitials: 'JS',
      clinicalNotes: 'Patient reports urinary frequency and urgency. DRE shows firm, irregular prostate with nodularity in the right lobe.',
      symptoms: 'Urinary frequency, urgency, nocturia, weak stream',
      allergies: 'Penicillin, Sulfa drugs',
      priority: 'High',
      vitalSigns: {
        bloodPressure: '145/90',
        heartRate: '78',
        temperature: '36.8',
        weight: '85.2'
      }
    }
  ]);
  
  // Filter test results to show only MRI, TRUS, and Biopsy
  const filteredTestResults = [
    {
      id: 1,
      type: 'MRI Prostate',
      date: '2025-10-14',
      orderedBy: currentUser.name,
      finding: 'PIRADS 3 lesion in left peripheral zone',
      status: 'Available',
      icon: Activity,
      iconColor: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: 2,
      type: 'Prostate Biopsy',
      date: '2025-10-10',
      orderedBy: currentUser.name,
      finding: 'Gleason 3+3=6, 2/12 cores positive',
      status: 'Available',
      icon: Target,
      iconColor: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      id: 3,
      type: 'TRUS Prostate',
      date: '2025-10-05',
      orderedBy: currentUser.name,
      finding: 'Hypoechoic lesion in left peripheral zone',
      status: 'Available',
      icon: Activity,
      iconColor: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700'
    }
  ];

  // Upload handlers
  const handleUploadFormChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }));
    }
  };

  const handleUploadReport = (e) => {
    e.preventDefault();
    if (!uploadForm.reportType || !uploadForm.file) {
      alert('Please select report type and upload a file');
      return;
    }
    
    // In a real app, this would upload to the backend
    console.log('Uploading report:', {
      type: uploadForm.reportType,
      file: uploadForm.file,
      fileName: uploadForm.fileName
    });
    
    // Reset form and close modal
    setUploadForm({
      reportType: '',
      file: null,
      fileName: ''
    });
    setIsUploadModalOpen(false);
    
    alert('Report uploaded successfully!');
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadForm({
      reportType: '',
      file: null,
      fileName: ''
    });
  };

  const handleSaveChanges = () => {
    if (!clinicalData.clinicalNotes.trim()) {
      alert('Please enter a clinical note before saving.');
      return;
    }

    // Create new assessment note
    const newNote = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      nurseName: 'John Smith',
      nurseInitials: 'JS',
      clinicalNotes: clinicalData.clinicalNotes,
      symptoms: clinicalData.symptoms,
      allergies: clinicalData.allergies,
      priority: clinicalData.priority,
      vitalSigns: { ...clinicalData.vitalSigns }
    };

    // Add to local assessment notes array
    setAssessmentNotes(prev => [newNote, ...prev]);
    
    // Reset form after saving
    setClinicalData({
      clinicalNotes: '',
      symptoms: '',
      allergies: '',
      priority: 'Normal',
      vitalSigns: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: ''
      }
    });
    
    // Show success modal instead of alert
    setShowSuccessModal(true);
  };

  // Close modal handler
  const closeModal = () => {
    onClose();
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Auto-switch tabs based on context
  useEffect(() => {
    if (context === 'newPatients') {
      setActiveTab('overview');
    }
  }, [context, activeTab]);

  // Update state when patient data changes
  useEffect(() => {
    if (patientData) {
      setClinicalNotes(patientData.clinicalNotes || []);
      setDischargeSummaries(patientData.dischargeSummaries || []);
      setPsaHistory(patientData.psaHistory || (patientData.latestPSA ? [{ date: new Date().toISOString().split('T')[0], value: patientData.latestPSA }] : []));
    }
  }, [patientData]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User, count: 1, active: activeTab === 'overview' },
    { id: 'assessment', name: 'Patient Assessment', icon: FileText, count: 1, active: activeTab === 'assessment' },
    ...(source === 'postOpFollowUp' ? [{ id: 'discharge', name: 'Discharge Summary', icon: CheckCircle, count: dischargeSummaries.length, active: activeTab === 'discharge' }] : [])
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  // Clinical Notes handlers
  const handleAddClinicalNote = () => {
    if (clinicalNotesForm.note.trim()) {
      const now = new Date();
      const newNote = {
        id: `CN${Date.now()}`,
        timestamp: now.toISOString(),
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        author: 'Jennifer Lee',
        authorRole: 'Urology Nurse',
        type: 'general',
        priority: clinicalNotesForm.priority,
        note: clinicalNotesForm.note,
        vitals: null,
        medicine: null
      };
      
      setClinicalNotes(prev => [newNote, ...prev]);
      setClinicalNotesForm({
        note: '',
        priority: 'Normal',
        vitals: {
          bloodPressure: '',
          heartRate: '',
          temperature: '',
          weight: '',
          height: ''
        },
        medicine: ''
      });
    }
  };

  const handleClinicalNotesFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setClinicalNotesForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setClinicalNotesForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const closeClinicalNotesModal = () => {
    setIsClinicalNotesModalOpen(false);
  };

  // PSA handlers
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
    console.log('Adding PSA value for patient:', patientId, psaForm);
    
    // Add new PSA value to history
    const newPSAEntry = {
      date: psaForm.date,
      value: parseFloat(psaForm.value),
      notes: psaForm.notes
    };
    
    // Update PSA history state
    setPsaHistory(prev => [...prev, newPSAEntry].sort((a, b) => new Date(a.date) - new Date(b.date)));
    
    // Reset form and close modal
    setPsaForm({
      date: '',
      value: '',
      notes: ''
    });
    setIsPSAModalOpen(false);
  };

  const closePSAModal = () => {
    setIsPSAModalOpen(false);
    setPsaForm({
      date: '',
      value: '',
      notes: ''
    });
  };

  const handleViewTestReport = (test) => {
    setSelectedTestReport(test);
    setShowTestReportModal(true);
  };

  const closeTestReportModal = () => {
    setShowTestReportModal(false);
    setSelectedTestReport(null);
  };

  // PSA Chart data
  const psaChartData = {
    labels: (psaHistory || []).map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'PSA Level (ng/mL)',
        data: (psaHistory || []).map(item => item.value),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const psaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: (psaHistory && psaHistory.length > 0) 
          ? Math.max(...psaHistory.map(item => item.value)) + 2 
          : 10
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95vw] h-[90vh] min-h-[450px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-gray-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {(mockPatient.name || mockPatient.patientName || 'Patient').split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{mockPatient.name || mockPatient.patientName || 'Patient'}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>UPI: {mockPatient.id || mockPatient.upi}</span>
                <span>Age: {mockPatient.age} years</span>
                {mockPatient.referringGP && <span>Referring GP: {mockPatient.referringGP}</span>}
                {mockPatient.status && (
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    mockPatient.status === 'Waiting for Scheduling' ? 'bg-red-100 text-red-800' :
                    mockPatient.status === 'Scheduled Doctor Appointment' ? 'bg-yellow-100 text-yellow-800' :
                    mockPatient.status === 'Scheduled for Procedure' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {mockPatient.status}
                  </span>
                )}
                <span className="flex items-center text-green-600 font-medium">
                  PSA: {psaHistory.length > 0 ? psaHistory[psaHistory.length - 1].value : (mockPatient.latestPSA || mockPatient.psa || mockPatient.lastPSA || 'N/A')} ng/mL
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-8 px-6 overflow-x-auto" style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 py-4 text-sm font-medium transition-colors ${
                    tab.active
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    tab.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </div>
                  {tab.active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-green-500 rounded-full shadow-sm"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(90vh - 120px)', minHeight: '250px' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="h-full flex">
              {/* Left Component - PSA Monitoring */}
              <div className="w-1/2 h-full flex flex-col border-r border-gray-200 p-4">
                {/* PSA Monitoring Section */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0 mb-3">
                  <div className="p-4" style={{ padding: '16px' }}>
                    <div className="flex items-center mb-3">
                      <h3 className="font-semibold text-gray-900 text-base flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-green-600" />
                        PSA Monitoring
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {(psaHistory || []).length > 0 ? psaHistory[psaHistory.length - 1].value : (mockPatient.latestPSA || mockPatient.psa || mockPatient.lastPSA || '8.5')}
                        </div>
                        <div className="text-xs text-green-700 font-medium">ng/mL</div>
                        <div className="text-xs text-gray-500 mt-1">LATEST PSA</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-semibold text-blue-600">
                          {(psaHistory || []).length > 0 ? formatDate(psaHistory[psaHistory.length - 1].date) : '10/01/2024'}
                        </div>
                        <div className="text-xs text-gray-500">Test Date</div>
                      </div>
                    </div>
                    
                    {/* PSA Action Buttons */}
                    <div className="flex space-x-3 mt-3">
                      <button
                        onClick={() => setIsPSAModalOpen(true)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-black to-green-600 border border-gray-800 rounded-lg shadow-md hover:from-gray-900 hover:to-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add PSA
                      </button>
                      <button
                        onClick={() => setShowPSAHistoryModal(true)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 hover:border-blue-400 transition-colors"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View History
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Component - Test Results */}
              <div className="w-1/2 h-full flex flex-col bg-gray-50 min-h-0" style={{ 
                maxHeight: '',
                padding: '16px'
              }}>

                {/* Test Results */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
                  <div className="p-4 flex-shrink-0" style={{ padding: '12px' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-base flex items-center">
                        <Database className="h-4 w-4 mr-2 text-blue-600" />
                        Test Results
                      </h3>
                    </div>
                  </div>

                  {/* Test Results List - Scrollable */}
                  <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="space-y-3">
                      {filteredTestResults.map((test) => {
                        const IconComponent = test.icon;
                        return (
                          <div key={test.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-8 h-8 ${test.bgColor} rounded-lg flex items-center justify-center`}>
                                <IconComponent className={`h-4 w-4 text-${test.iconColor}-600`} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">{test.type}</h4>
                                <p className="text-xs text-gray-500">{test.date} • Ordered by: {test.orderedBy}</p>
                              </div>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${test.bgColor} ${test.textColor} rounded-full`}>
                                {test.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{test.finding}</p>
                            {test.status === 'Available' && (
                              <button
                                onClick={() => handleViewTestReport(test)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Report
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex space-x-3">
                      {/* Add Test Results Button */}
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-black to-green-600 border border-gray-800 rounded-lg shadow-md hover:from-gray-900 hover:to-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test Results
                      </button>

                      {/* View History Button */}
                      <button
                        onClick={() => setIsTestTimelineModalOpen(true)}
                        className="flex-1 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        View History
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Patient Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="h-full flex">
              {/* Left Component - Clinical Notes Adding Section */}
              <div className="w-1/2 h-full flex flex-col border-r border-gray-200">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-base flex items-center mb-3">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Clinical Notes
                  </h3>
                </div>
                
                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 shadow-sm">
                    <div className="space-y-3">
                      {/* Note Input */}
                      <div>
                    <textarea
                          value={clinicalData.clinicalNotes}
                          onChange={(e) => setClinicalData({...clinicalData, clinicalNotes: e.target.value})}
                          placeholder="Add a clinical note or assessment..."
                          className="w-full px-3 py-2 text-sm border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white/80 backdrop-blur-sm shadow-inner transition-all duration-200"
                          rows="3"
                        />
                      </div>

                      {/* Symptoms Field */}
                      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                          <svg className="h-3 w-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                          Symptoms
                        </label>
                        <input
                          type="text"
                          value={clinicalData.symptoms || ''}
                          onChange={(e) => setClinicalData({...clinicalData, symptoms: e.target.value})}
                          placeholder="Enter patient symptoms..."
                          className="w-full px-2 py-1 text-xs border border-red-200 rounded focus:ring-1 focus:ring-red-400 focus:border-red-400 bg-white/80"
                        />
                      </div>

                      {/* Allergies Field */}
                      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                          <svg className="h-3 w-3 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          Allergies
                        </label>
                        <input
                          type="text"
                          value={clinicalData.allergies || ''}
                          onChange={(e) => setClinicalData({...clinicalData, allergies: e.target.value})}
                          placeholder="Enter patient allergies..."
                          className="w-full px-2 py-1 text-xs border border-orange-200 rounded focus:ring-1 focus:ring-orange-400 focus:border-orange-400 bg-white/80"
                        />
                      </div>
                      
                      {/* Vital Signs - Single Row */}
                      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          Vital Signs
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {/* Blood Pressure */}
                          <div className="text-center">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            </div>
                            <input
                              type="text"
                              value={clinicalData.vitalSigns.bloodPressure}
                              onChange={(e) => setClinicalData({
                                ...clinicalData, 
                                vitalSigns: {...clinicalData.vitalSigns, bloodPressure: e.target.value}
                              })}
                              className="w-full px-1 py-1 text-xs border border-red-200 rounded focus:ring-1 focus:ring-red-400 focus:border-red-400 bg-white/80 text-center"
                              placeholder="BP"
                            />
                            <p className="text-xs text-red-600 mt-0.5 font-medium">mmHg</p>
                          </div>

                          {/* Heart Rate */}
                          <div className="text-center">
                            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-1">
                              <Heart className="h-3 w-3 text-white" />
                            </div>
                            <input
                              type="number"
                              value={clinicalData.vitalSigns.heartRate}
                              onChange={(e) => setClinicalData({
                                ...clinicalData, 
                                vitalSigns: {...clinicalData.vitalSigns, heartRate: e.target.value}
                              })}
                              className="w-full px-1 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white/80 text-center"
                              placeholder="HR"
                            />
                            <p className="text-xs text-gray-600 mt-0.5 font-medium">BPM</p>
                          </div>

                          {/* Temperature */}
                          <div className="text-center">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-1">
                              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v6h-2z"/>
                              </svg>
                            </div>
                            <input
                              type="number"
                              step="0.1"
                              value={clinicalData.vitalSigns.temperature}
                              onChange={(e) => setClinicalData({
                                ...clinicalData, 
                                vitalSigns: {...clinicalData.vitalSigns, temperature: e.target.value}
                              })}
                              className="w-full px-1 py-1 text-xs border border-orange-200 rounded focus:ring-1 focus:ring-orange-400 focus:border-orange-400 bg-white/80 text-center"
                              placeholder="Temp"
                            />
                            <p className="text-xs text-orange-600 mt-0.5 font-medium">°C</p>
                          </div>

                          {/* Weight */}
                          <div className="text-center">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
                              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                              </svg>
                            </div>
                            <input
                              type="number"
                              step="0.1"
                              value={clinicalData.vitalSigns.weight}
                              onChange={(e) => setClinicalData({
                                ...clinicalData, 
                                vitalSigns: {...clinicalData.vitalSigns, weight: e.target.value}
                              })}
                              className="w-full px-1 py-1 text-xs border border-blue-200 rounded focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white/80 text-center"
                              placeholder="Wt"
                            />
                            <p className="text-xs text-blue-600 mt-0.5 font-medium">kg</p>
                          </div>
                        </div>
                      </div>

                      {/* Priority and Action Buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-xs font-medium text-gray-700">Priority:</label>
                      <select
                            value={clinicalData.priority || 'Normal'}
                            onChange={(e) => setClinicalData({...clinicalData, priority: e.target.value})}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                        </div>
                      <button
                          onClick={handleSaveChanges}
                          disabled={!clinicalData.clinicalNotes.trim()}
                          className="flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                        Add Note
                      </button>
                      </div>
                    </div>
                    </div>
                  </div>
              </div>

              {/* Right Component - Assessment Timeline */}
              <div className="w-1/2 h-full flex flex-col bg-gray-50 min-h-0">
                {/* Timeline Header */}
                <div className="p-6 flex-shrink-0">
                  <h3 className="font-semibold text-gray-900 text-base flex items-center mb-4">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    Assessment Timeline
                  </h3>
                  <p className="text-sm text-gray-600">Track all assessment changes and clinical notes over time</p>
                </div>

                {/* Timeline - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-green-200 to-gray-200"></div>
                    
                    <div className="space-y-6">
                      {assessmentNotes.map((note, index) => (
                          <div key={note.id} className="relative flex items-start space-x-4">
                            {/* Timeline Dot */}
                            <div className="relative flex-shrink-0">
                              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white ${
                              index === 0 ? 'ring-2 ring-green-300 bg-green-500' : 'bg-blue-500'
                            }`}>
                                <FileText className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          
                          {/* Assessment Card */}
                          <div className={`flex-1 bg-white border rounded-lg p-4 shadow-sm ${
                            index === 0 ? 'border-green-200' : 'border-gray-200'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                                    index === 0 ? 'bg-green-600' : 'bg-blue-600'
                                  }`}>
                                    {note.nurseInitials}
                                    </div>
                                  <span className="font-semibold text-gray-900 text-sm">{note.nurseName}</span>
                                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                                    index === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {index === 0 ? 'Urology Nurse' : 'Urologist'}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                  <span>
                                    {index === 0 
                                      ? `Today at ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`
                                      : 'Yesterday at 14:30'
                                    }
                                  </span>
                                  {index === 0 && (
                                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                      Current
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {index === 0 ? 'Assessment' : 'Initial Assessment'}
                                </span>
                              </div>
                            
                            <div className="space-y-3">
                              {note.symptoms && (
                                <div>
                                  <h6 className="text-xs font-semibold text-gray-700 mb-1">Symptoms:</h6>
                                  <p className="text-sm text-gray-700 leading-relaxed">{note.symptoms}</p>
                            </div>
                              )}
                              {note.allergies && (
                                <div>
                                  <h6 className="text-xs font-semibold text-gray-700 mb-1">Allergies:</h6>
                                  <p className="text-sm text-gray-700 leading-relaxed">{note.allergies}</p>
                          </div>
                              )}
                              {note.clinicalNotes && (
                                <div>
                                  <h6 className="text-xs font-semibold text-gray-700 mb-1">Clinical Notes:</h6>
                                  <p className="text-sm text-gray-700 leading-relaxed">{note.clinicalNotes}</p>
                        </div>
                      )}
                              {(note.vitalSigns.bloodPressure || note.vitalSigns.heartRate || note.vitalSigns.temperature || note.vitalSigns.weight) && (
                                <div>
                                  <h6 className="text-xs font-semibold text-gray-700 mb-1">Vital Signs:</h6>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {note.vitalSigns.bloodPressure && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">BP:</span>
                                        <span className="font-medium text-red-600">{note.vitalSigns.bloodPressure} mmHg</span>
                    </div>
                                    )}
                                    {note.vitalSigns.heartRate && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">HR:</span>
                                        <span className="font-medium text-gray-600">{note.vitalSigns.heartRate} BPM</span>
                  </div>
                                    )}
                                    {note.vitalSigns.temperature && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Temp:</span>
                                        <span className="font-medium text-orange-600">{note.vitalSigns.temperature}°C</span>
                </div>
                                    )}
                                    {note.vitalSigns.weight && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Weight:</span>
                                        <span className="font-medium text-blue-600">{note.vitalSigns.weight} kg</span>
              </div>
                                    )}
                    </div>
                      </div>
                              )}
                      </div>
                    </div>
                  </div>
                      ))}
                </div>
                    </div>
                  </div>
                          </div>
                          </div>
          )}

          {/* Discharge Summary Tab */}
          {activeTab === 'discharge' && source === 'postOpFollowUp' && (
            <div className="h-full flex flex-col">
              {/* Header with Add Button */}
              <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Discharge Summaries
                  </h3>
                  <button
                    onClick={() => setIsDischargeModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Discharge Summary
                  </button>
                </div>
              </div>

              {/* Discharge Summaries List */}
              <div className="flex-1 overflow-y-auto p-6">
                {dischargeSummaries.length > 0 ? (
                  <div className="space-y-4">
                    {dischargeSummaries.map((summary, index) => {
                      // Calculate length of stay (mock calculation)
                      const admissionDate = new Date(summary.date);
                      admissionDate.setDate(admissionDate.getDate() - 5); // Mock 5-day stay
                      const los = Math.ceil((new Date(summary.date) - admissionDate) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div key={summary.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              {/* Icon */}
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                  <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-center">{summary.id}</div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                      {summary.procedure}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {summary.diagnosis}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Discharged
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Low Risk
                                    </span>
                                  </div>
                                </div>

                                {/* Details Row */}
                                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Discharged: {formatDate(summary.date)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>LOS: {los} days</span>
                                  </div>
                                </div>

                                {/* Clinical Summary */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <FileText className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">Clinical Summary</span>
                                  </div>
                                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                    {summary.dischargeNotes || 'No clinical summary provided.'}
                                  </p>
                                </div>

                                {/* PSA Values if available */}
                                {(summary.psaPreOp || summary.psaPostOp) && (
                                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between text-sm">
                                      <div>
                                        <span className="font-medium text-blue-900">Pre-Op PSA:</span>
                                        <p className="text-blue-700 font-semibold">{summary.psaPreOp || 'N/A'} ng/mL</p>
                                      </div>
                                      <ArrowRight className="h-4 w-4 text-blue-500" />
                                      <div>
                                        <span className="font-medium text-blue-900">Post-Op PSA:</span>
                                        <p className="text-blue-700 font-semibold">{summary.psaPostOp || 'N/A'} ng/mL</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Follow-up Instructions if available */}
                                {summary.followUpInstructions && (
                                  <div className="mt-4 bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-sm font-medium text-green-900">Follow-up Instructions</span>
                                    </div>
                                    <p className="text-sm text-green-700 whitespace-pre-wrap">
                                      {summary.followUpInstructions}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-12 w-12 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Discharge Summaries</h4>
                    <p className="text-sm text-gray-500 max-w-xs mb-4">
                      Add discharge summaries to track post-operative care and patient progress.
                    </p>
                    <button
                      onClick={() => setIsDischargeModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Summary
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Discharge Summary Modal */}
          {isDischargeModalOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Add Discharge Summary</h2>
                    <p className="text-sm text-gray-600 mt-1">Patient: {mockPatient.name || mockPatient.patientName || 'Patient'}</p>
                  </div>
                  <button
                    onClick={() => setIsDischargeModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (dischargeForm.dischargeDate && dischargeForm.procedure && dischargeForm.diagnosis) {
                    const newSummary = {
                      id: `DS${Date.now()}`,
                      date: dischargeForm.dischargeDate,
                      procedure: dischargeForm.procedure,
                      diagnosis: dischargeForm.diagnosis,
                      dischargeNotes: dischargeForm.dischargeNotes,
                      followUpInstructions: dischargeForm.followUpInstructions,
                      psaPreOp: dischargeForm.psaPreOp,
                      psaPostOp: dischargeForm.psaPostOp,
                      createdBy: 'Jennifer Lee',
                      createdAt: new Date().toISOString()
                    };
                    setDischargeSummaries(prev => [newSummary, ...prev]);
                    setDischargeForm({
                      dischargeDate: '',
                      procedure: '',
                      diagnosis: '',
                      dischargeNotes: '',
                      followUpInstructions: '',
                      medications: [],
                      psaPreOp: '',
                      psaPostOp: ''
                    });
                    setIsDischargeModalOpen(false);
                  }
                }} className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discharge Date *
                      </label>
                      <input
                        type="date"
                        value={dischargeForm.dischargeDate}
                        onChange={(e) => setDischargeForm({...dischargeForm, dischargeDate: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Length of Stay
                      </label>
                      <input
                        type="number"
                        value={dischargeForm.los || '5'}
                        onChange={(e) => setDischargeForm({...dischargeForm, los: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="days"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure *
                    </label>
                    <input
                      type="text"
                      value={dischargeForm.procedure}
                      onChange={(e) => setDischargeForm({...dischargeForm, procedure: e.target.value})}
                      required
                      placeholder="e.g., RALP, Open Prostatectomy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnosis *
                    </label>
                    <input
                      type="text"
                      value={dischargeForm.diagnosis}
                      onChange={(e) => setDischargeForm({...dischargeForm, diagnosis: e.target.value})}
                      required
                      placeholder="e.g., Prostate Cancer, Gleason 3+4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinical Summary
                    </label>
                    <textarea
                      value={dischargeForm.dischargeNotes}
                      onChange={(e) => setDischargeForm({...dischargeForm, dischargeNotes: e.target.value})}
                      placeholder="Add clinical summary..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Follow-up Instructions
                    </label>
                    <textarea
                      value={dischargeForm.followUpInstructions}
                      onChange={(e) => setDischargeForm({...dischargeForm, followUpInstructions: e.target.value})}
                      placeholder="Follow-up care instructions..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pre-Op PSA
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={dischargeForm.psaPreOp}
                        onChange={(e) => setDischargeForm({...dischargeForm, psaPreOp: e.target.value})}
                        placeholder="ng/mL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Post-Op PSA
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={dischargeForm.psaPostOp}
                        onChange={(e) => setDischargeForm({...dischargeForm, psaPostOp: e.target.value})}
                        placeholder="ng/mL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsDischargeModalOpen(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Discharge Summary
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
                        </div>
                      </div>

      {/* Test Results Modal */}
      <TestResultsModal
        isOpen={isTestResultsModalOpen}
        onClose={() => setIsTestResultsModalOpen(false)}
        patientData={mockPatient}
      />

      {/* Test Timeline Modal */}
      {isTestTimelineModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[150] flex items-center justify-center">
          <div className="relative mx-auto w-full max-w-6xl">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Database className="h-6 w-6 mr-3 text-blue-600" />
                      Test Timeline & Reports
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete test history and uploaded reports for {mockPatient.name || mockPatient.patientName || 'Patient'}
                    </p>
                          </div>
                  <button
                    onClick={() => setIsTestTimelineModalOpen(false)}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </button>
                          </div>
                      </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* Timeline */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Test Timeline
                    </h4>
                    
                    <div className="space-y-6">
                      {/* Timeline Items */}
                      <div className="relative">
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {/* MRI Test */}
                        <div className="relative flex items-start space-x-4 pb-6">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                            </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-lg font-semibold text-gray-900">MRI Prostate</h5>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Available
                            </span>
                          </div>
                            <p className="text-sm text-gray-600 mt-1">2025-10-14 • Ordered by {currentUser.name}</p>
                            <p className="text-sm text-gray-700 mt-2">PIRADS 3 lesion in left peripheral zone</p>
                            <div className="mt-3 flex space-x-2">
                              <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                                View Report
                              </button>
                              <button className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                                Download
                              </button>
                        </div>
                            </div>
                            </div>

                        {/* TRUS Test */}
                        <div className="relative flex items-start space-x-4 pb-6">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-lg font-semibold text-gray-900">TRUS Prostate</h5>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Available
                            </span>
                          </div>
                            <p className="text-sm text-gray-600 mt-1">2025-10-05 • Ordered by Dr. Sarah Wilson</p>
                            <p className="text-sm text-gray-700 mt-2">Hypoechoic lesion in left peripheral zone</p>
                            <div className="mt-3 flex space-x-2">
                              <button className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-lg hover:bg-purple-100 transition-colors">
                                View Report
                              </button>
                              <button className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                                Download
                              </button>
                        </div>
                            </div>
                            </div>

                        {/* Biopsy Test */}
                        <div className="relative flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Target className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-lg font-semibold text-gray-900">Prostate Biopsy</h5>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Available
                            </span>
                          </div>
                            <p className="text-sm text-gray-600 mt-1">2025-10-10 • Ordered by Dr. Sarah Wilson</p>
                            <p className="text-sm text-gray-700 mt-2">Gleason 3+3=6, 2/12 cores positive</p>
                            <div className="mt-3 flex space-x-2">
                              <button className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors">
                                View Report
                              </button>
                              <button className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                                Download
                              </button>
                        </div>
                            </div>
                            </div>
                          </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-end">
                <button
                    onClick={() => setIsTestTimelineModalOpen(false)}
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

      {/* Upload Test Results Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Upload Test Results</h2>
                <p className="text-sm text-gray-600 mt-1">Patient: {mockPatient.name || mockPatient.patientName || 'Patient'}</p>
              </div>
              <button
                onClick={closeUploadModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
                              </button>
                          </div>
                          
            <form onSubmit={handleUploadReport} className="p-6 space-y-6">
              {/* Report Type */}
              <div>
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  id="reportType"
                  name="reportType"
                  value={uploadForm.reportType}
                  onChange={handleUploadFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                >
                  <option value="">Select Report Type</option>
                  <option value="MRI">MRI Prostate</option>
                  <option value="TRUS">TRUS Prostate</option>
                  <option value="Biopsy">Prostate Biopsy</option>
                </select>
                          </div>
                          
              {/* File Upload */}
                            <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Report File
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  required
                />
                {uploadForm.fileName && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {uploadForm.fileName}</p>
                )}
                            </div>

              {/* Notes */}
                            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                  placeholder="Additional notes about this test result..."
                />
                              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-black to-green-600 text-white font-semibold rounded-lg hover:from-gray-900 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Upload Report
                </button>
                            </div>
            </form>
                          </div>
                  </div>
                )}

      {/* Add Clinical Notes Modal */}
      {isClinicalNotesModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Clinical Note</h2>
              <button
                onClick={closeClinicalNotesModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddClinicalNote} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Note *
                </label>
                <textarea
                  value={clinicalNotesForm.note}
                  onChange={(e) => handleClinicalNotesFormChange('note', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows="4"
                  placeholder="Enter clinical note details..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={clinicalNotesForm.priority}
                  onChange={(e) => handleClinicalNotesFormChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    value={clinicalNotesForm.vitals.bloodPressure}
                    onChange={(e) => handleClinicalNotesFormChange('vitals.bloodPressure', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heart Rate
                  </label>
                  <input
                    type="text"
                    value={clinicalNotesForm.vitals.heartRate}
                    onChange={(e) => handleClinicalNotesFormChange('vitals.heartRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., 72 bpm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature
                  </label>
                  <input
                    type="text"
                    value={clinicalNotesForm.vitals.temperature}
                    onChange={(e) => handleClinicalNotesFormChange('vitals.temperature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., 36.5°C"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={clinicalNotesForm.vitals.weight}
                    onChange={(e) => handleClinicalNotesFormChange('vitals.weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., 75kg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine
                </label>
                <input
                  type="text"
                  value={clinicalNotesForm.medicine}
                  onChange={(e) => handleClinicalNotesFormChange('medicine', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Paracetamol 500mg"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeClinicalNotesModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PSA Entry Modal */}
      {isPSAModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add PSA Value</h2>
                <p className="text-sm text-gray-600 mt-1">Patient: {mockPatient.name || mockPatient.patientName || 'Patient'}</p>
              </div>
              <button
                onClick={closePSAModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddPSA} className="p-6 space-y-6">
              {/* PSA Value */}
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                  PSA Value (ng/mL)
                </label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  step="0.1"
                  min="0"
                  max="100"
                  value={psaForm.value}
                  onChange={handlePSAFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter PSA value"
                  required
                />
              </div>

              {/* Test Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={psaForm.date}
                  onChange={handlePSAFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={psaForm.notes}
                  onChange={handlePSAFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                  placeholder="Additional notes about this PSA test..."
                />
              </div>


              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closePSAModal}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-black to-green-600 text-white font-semibold rounded-lg hover:from-gray-900 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Add PSA Value
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PSA History Modal */}
      {showPSAHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[150] flex items-center justify-center">
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">PSA History</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      PSA monitoring history for {mockPatient.name || mockPatient.patientName || 'Patient'}
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
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* PSA Chart */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      PSA Trend
                    </h4>
                    <div className="h-64 w-full">
                      {/* PSA Chart */}
                      <div className="relative h-full w-full bg-white rounded-lg border border-gray-200 p-4">
                        <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
                          {/* Grid Lines */}
                          <defs>
                            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          
                          {/* Chart Area */}
                          {(psaHistory || []).length > 1 && (() => {
                            const data = (psaHistory || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
                            const maxValue = Math.max(...data.map(d => d.value));
                            const minValue = Math.min(...data.map(d => d.value));
                            const range = maxValue - minValue || 1;
                            const padding = 40;
                            const chartWidth = 800 - (padding * 2);
                            const chartHeight = 200 - (padding * 2);
                            
                            // Create path for line
                            const points = data.map((point, index) => {
                              const x = padding + (index / (data.length - 1)) * chartWidth;
                              const y = padding + chartHeight - ((point.value - minValue) / range) * chartHeight;
                              return `${x},${y}`;
                            });
                            
                            const pathData = `M ${points.join(' L ')}`;
                            
                            // Create area fill
                            const areaData = `${pathData} L ${padding + chartWidth},${padding + chartHeight} L ${padding},${padding + chartHeight} Z`;
                            
                            return (
                              <>
                                {/* Area Fill */}
                                <path
                                  d={areaData}
                                  fill="url(#psaGradient)"
                                  opacity="0.3"
                                />
                                
                                {/* Line */}
                                <path
                                  d={pathData}
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                
                                {/* Data Points */}
                                {points.map((point, index) => {
                                  const [x, y] = point.split(',').map(Number);
                                  const value = data[index].value;
                                  return (
                                    <g key={index}>
                                      <circle
                                        cx={x}
                                        cy={y}
                                        r="6"
                                        fill="#3b82f6"
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                      />
                                      <text
                                        x={x}
                                        y={y - 15}
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700"
                                        fontSize="12"
                                      >
                                        {value}
                                      </text>
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                          
                          {/* Y-axis labels */}
                          {(psaHistory || []).length > 0 && (() => {
                            const sortedData = (psaHistory || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
                            const maxValue = Math.max(...sortedData.map(d => d.value));
                            const minValue = Math.min(...sortedData.map(d => d.value));
                            const range = maxValue - minValue || 1;
                            
                            return (
                              <>
                                <text x="10" y="40" textAnchor="start" className="text-xs fill-gray-500" fontSize="10">
                                  {maxValue.toFixed(1)}
                                </text>
                                <text x="10" y="190" textAnchor="start" className="text-xs fill-gray-500" fontSize="10">
                                  {minValue.toFixed(1)}
                                </text>
                              </>
                            );
                          })()}
                          
                          {/* Gradient definition */}
                          <defs>
                            <linearGradient id="psaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* PSA History Table */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-green-600" />
                        PSA Test History
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              PSA Value (ng/mL)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(psaHistory || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map((psa, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(psa.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  psa.value > 10 ? 'bg-red-100 text-red-800' :
                                  psa.value > 4 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {psa.value} ng/mL
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  psa.value > 10 ? 'bg-red-100 text-red-800' :
                                  psa.value > 4 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {psa.value > 10 ? 'High Risk' :
                                   psa.value > 4 ? 'Elevated' :
                                   'Normal'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {psa.notes || 'No notes'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-300">
              {/* Success Icon */}
              <div className="px-6 py-8 text-center bg-gradient-to-br from-green-50 to-green-100">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg bg-gradient-to-br from-green-500 to-green-600">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-green-900">
                  Note Added Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Clinical assessment note has been saved
                </p>
              </div>

              {/* Details */}
              <div className="px-6 py-6">
                <div className="space-y-4">
                  {/* Patient Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Patient</p>
                        <p className="text-sm font-semibold text-gray-900">{mockPatient.name || mockPatient.patientName || 'Patient'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Assessment</p>
                        <p className="text-sm font-semibold text-gray-900">Clinical Note Added</p>
                      </div>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Time</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date().toLocaleDateString('en-AU')} at {new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Report Modal */}
      {showTestReportModal && selectedTestReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[150] flex items-center justify-center">
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedTestReport.type} Report</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Test report for {mockPatient.name || mockPatient.patientName || 'Patient'}
                    </p>
                  </div>
                  <button
                    onClick={closeTestReportModal}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Test Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className={`w-8 h-8 ${selectedTestReport.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                        <selectedTestReport.icon className={`h-4 w-4 text-${selectedTestReport.iconColor}-600`} />
                      </div>
                      Test Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Test Type</p>
                        <p className="font-medium text-gray-900">{selectedTestReport.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Test Date</p>
                        <p className="font-medium text-gray-900">{selectedTestReport.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Ordered By</p>
                        <p className="font-medium text-gray-900">{selectedTestReport.orderedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${selectedTestReport.bgColor} ${selectedTestReport.textColor} rounded-full`}>
                          {selectedTestReport.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Report Content */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Report Details
                    </h4>
                    
                    {/* Sample report content based on test type */}
                    {selectedTestReport.type === 'MRI Prostate' && (
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Clinical History</h5>
                          <p className="text-gray-600 text-sm">Patient with elevated PSA levels for further evaluation and staging.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Technique</h5>
                          <p className="text-gray-600 text-sm">Multi-parametric MRI of the prostate performed on 3T scanner with endorectal coil. Sequences included T1-weighted, T2-weighted, DWI, and DCE-MRI.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Findings</h5>
                          <p className="text-gray-600 text-sm">PIRADS 3 lesion identified in the left peripheral zone at the mid-gland level. The lesion demonstrates intermediate signal intensity on T2-weighted images with moderate diffusion restriction. No evidence of extraprostatic extension or seminal vesicle involvement.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Impression</h5>
                          <p className="text-gray-600 text-sm">PIRADS 3 lesion in left peripheral zone. Consider targeted biopsy for further evaluation.</p>
                        </div>
                      </div>
                    )}

                    {selectedTestReport.type === 'Prostate Biopsy' && (
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Procedure</h5>
                          <p className="text-gray-600 text-sm">Transrectal ultrasound-guided prostate biopsy performed under local anesthesia.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Specimens</h5>
                          <p className="text-gray-600 text-sm">12 core biopsy specimens obtained from systematic sampling of the prostate gland.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Histopathology</h5>
                          <p className="text-gray-600 text-sm">Gleason score 3+3=6 adenocarcinoma identified in 2 out of 12 cores. Tumor involves approximately 10% of core tissue. No perineural invasion or lymphovascular invasion identified.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Grade Group</h5>
                          <p className="text-gray-600 text-sm">Grade Group 1 (Gleason 3+3=6)</p>
                        </div>
                      </div>
                    )}

                    {selectedTestReport.type === 'TRUS Prostate' && (
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Procedure</h5>
                          <p className="text-gray-600 text-sm">Transrectal ultrasound examination of the prostate performed using high-frequency probe.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Prostate Volume</h5>
                          <p className="text-gray-600 text-sm">Estimated volume: 45 cc. Prostate measures 4.2 x 3.8 x 3.2 cm.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Findings</h5>
                          <p className="text-gray-600 text-sm">Hypoechoic lesion identified in the left peripheral zone at the mid-gland level. The lesion measures approximately 8mm in maximum dimension. No evidence of capsular irregularity or seminal vesicle involvement.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Recommendation</h5>
                          <p className="text-gray-600 text-sm">Consider MRI evaluation for further characterization of the lesion.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-end">
                  <button
                    onClick={closeTestReportModal}
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
    </div>
  );
};

export default NursePatientDetailsModal;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
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
  Target,
  Zap,
  Bell,
  Share,
  Printer,
  Send,
  Heart,
  Stethoscope,
  Pill,
  Calendar as CalendarIcon,
  MapPin,
  Edit,
  Plus,
  Eye,
  Database,
  X,
  Save,
  ChevronRight,
  ArrowRight
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

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isClinicalHistoryModalOpen, setIsClinicalHistoryModalOpen] = useState(false);
  const [isPSAModalOpen, setIsPSAModalOpen] = useState(false);
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
  const [psaForm, setPsaForm] = useState({
    date: '',
    value: '',
    type: 'routine'
  });
  const [isImagingModalOpen, setIsImagingModalOpen] = useState(false);
  const [imagingForm, setImagingForm] = useState({
    type: '',
    date: '',
    result: '',
    document: null,
    documentName: ''
  });

  // Mock patient data - in real app, fetch by ID
  const mockPatient = {
    id: 'URP001',
    name: 'John Smith',
    dob: '1959-03-15',
    medicare: '1234567890',
    phone: '+61 412 345 678',
    email: 'john.smith@email.com',
    address: '123 Main St, Melbourne VIC 3000',
    emergencyContact: 'Jane Smith (Wife)',
    emergencyPhone: '+61 412 345 679',
    currentStatus: 'OPD Queue',
    currentDatabase: 'DB1',
    lastPSA: { value: 25.4, date: '2024-01-10' },
    gleasonScore: '4+3=7',
    stage: 'T2b',
    referrals: [
      { id: 1, date: '2024-01-10', reason: 'Elevated PSA with family history', status: 'Active', outcome: null, referringGP: 'Dr. Sarah Johnson' }
    ],
    psaHistory: [
      { value: 25.4, date: '2024-01-10', velocity: null, type: 'routine' },
      { value: 18.7, date: '2023-12-15', velocity: 2.23, type: 'routine' },
      { value: 15.2, date: '2023-09-20', velocity: 1.17, type: 'routine' },
      { value: 12.8, date: '2023-06-15', velocity: 0.95, type: 'routine' },
      { value: 10.5, date: '2023-03-15', velocity: 0.77, type: 'baseline' }
    ],
    appointments: [
      { id: 'APT001', date: '2024-01-15', type: 'Initial Consultation', status: 'Completed', location: 'Urology Clinic', time: '9:00 AM' },
      { id: 'APT002', date: '2024-01-22', type: 'Follow-up', status: 'Scheduled', location: 'Urology Clinic', time: '10:30 AM' },
      { id: 'APT003', date: '2024-02-15', type: 'Surgery Consultation', status: 'Scheduled', location: 'Urology Clinic', time: '2:00 PM' }
    ],
    clinicalHistory: {
      presentingSymptoms: 'Elevated PSA, urinary frequency, family history of prostate cancer',
      comorbidities: 'Hypertension, Type 2 Diabetes',
      allergies: 'Penicillin',
      currentMedications: ['Metformin 500mg BD', 'Lisinopril 10mg daily', 'Tamsulosin 0.4mg daily'],
      familyHistory: 'Father - Prostate Cancer (age 72), Mother - Breast Cancer (age 68)',
      socialHistory: 'Non-smoker, occasional alcohol, retired engineer'
    },
    imaging: [
      { 
        id: 'IMG001',
        type: 'MRI Prostate', 
        date: '2024-01-12', 
        result: 'PIRADS 4 lesion in left peripheral zone, suspicious for malignancy',
        document: 'mri_prostate_report.pdf',
        documentName: 'MRI Prostate Report - 12/01/2024'
      },
      { 
        id: 'IMG002',
        type: 'CT Abdomen/Pelvis', 
        date: '2024-01-15', 
        result: 'No evidence of metastatic disease',
        document: 'ct_abdomen_report.pdf',
        documentName: 'CT Abdomen/Pelvis Report - 15/01/2024'
      },
      { 
        id: 'IMG003',
        type: 'Bone Scan', 
        date: '2024-01-16', 
        result: 'No evidence of bone metastases',
        document: 'bone_scan_report.pdf',
        documentName: 'Bone Scan Report - 16/01/2024'
      }
    ],
    procedures: [
      { 
        id: 'PROC001',
        type: 'Prostate Biopsy', 
        date: '2024-01-18', 
        result: 'Gleason 7 (4+3), 6/12 cores positive, bilateral involvement',
        document: 'biopsy_report.pdf',
        documentName: 'Prostate Biopsy Report - 18/01/2024'
      },
      { 
        id: 'PROC002',
        type: 'PSMA PET Scan', 
        date: '2024-01-20', 
        result: 'No evidence of distant metastases',
        document: 'psma_pet_scan_report.pdf',
        documentName: 'PSMA PET Scan Report - 20/01/2024'
      }
    ],
    dischargeSummaries: [],
    surveillanceData: null,
    clinicalHistoryTimeline: [
      {
        id: 1,
        date: '2024-01-18',
        type: 'procedure',
        title: 'Prostate Biopsy',
        details: '12-core systematic prostate biopsy performed under local anesthesia.',
        practitioner: 'Dr. Michael Chen',
        findings: 'Gleason 7 (4+3), 6/12 cores positive, bilateral involvement',
        recommendations: 'Proceed with surgical planning for radical prostatectomy',
        medications: []
      },
      {
        id: 2,
        date: '2024-01-15',
        type: 'consultation',
        title: 'Initial Consultation',
        details: 'Patient presented with elevated PSA and family history of prostate cancer.',
        practitioner: 'Dr. Michael Chen',
        findings: 'PSA 25.4 ng/mL, abnormal DRE, family history positive',
        recommendations: 'Proceed with prostate biopsy and imaging',
        medications: ['Tamsulosin 0.4mg daily']
      },
      {
        id: 3,
        date: '2024-01-10',
        type: 'test',
        title: 'PSA Blood Test',
        details: 'Routine PSA testing following GP referral.',
        practitioner: 'Lab Technician',
        findings: 'PSA: 25.4 ng/mL (significantly elevated)',
        recommendations: 'Urgent urology referral required',
        medications: []
      }
    ]
  };

  // Initialize discharge summaries state after mockPatient is defined
  const [dischargeSummaries, setDischargeSummaries] = useState(mockPatient.dischargeSummaries);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPD Queue': return 'bg-blue-100 text-blue-800';
      case 'Active Surveillance': return 'bg-green-100 text-green-800';
      case 'Surgery Scheduled': return 'bg-orange-100 text-orange-800';
      case 'Post-Op Follow-Up': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDatabaseColor = (database) => {
    switch (database) {
      case 'DB1': return 'bg-blue-100 text-blue-800';
      case 'DB2': return 'bg-green-100 text-green-800';
      case 'DB3': return 'bg-orange-100 text-orange-800';
      case 'DB4': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClinicalHistoryTypeColor = (type) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'procedure': return 'bg-purple-100 text-purple-800';
      case 'test': return 'bg-green-100 text-green-800';
      case 'medication': return 'bg-orange-100 text-orange-800';
      case 'note': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClinicalHistoryTypeIcon = (type) => {
    switch (type) {
      case 'consultation': return Stethoscope;
      case 'procedure': return Activity;
      case 'test': return CheckCircle;
      case 'medication': return Pill;
      case 'note': return FileText;
      default: return FileText;
    }
  };

  // Modal handlers
  const handleClinicalHistoryFormChange = (e) => {
    const { name, value } = e.target;
    setClinicalHistoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationChange = (index, value) => {
    setClinicalHistoryForm(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => i === index ? value : med)
    }));
  };

  const addMedication = () => {
    setClinicalHistoryForm(prev => ({
      ...prev,
      medications: [...prev.medications, '']
    }));
  };

  const removeMedication = (index) => {
    setClinicalHistoryForm(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleAddClinicalHistory = (e) => {
    e.preventDefault();
    console.log('Adding clinical history:', clinicalHistoryForm);
    
    setClinicalHistoryForm({
      date: '',
      type: 'consultation',
      title: '',
      details: '',
      practitioner: '',
      findings: '',
      recommendations: '',
      medications: ['']
    });
    setIsClinicalHistoryModalOpen(false);
  };

  const closeModal = () => {
    setIsClinicalHistoryModalOpen(false);
    setClinicalHistoryForm({
      date: '',
      type: 'consultation',
      title: '',
      details: '',
      practitioner: '',
      findings: '',
      recommendations: '',
      medications: ['']
    });
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
    console.log('Adding PSA value:', psaForm);
    
    setPsaForm({
      date: '',
      value: '',
      type: 'routine'
    });
    setIsPSAModalOpen(false);
  };

  const closePSAModal = () => {
    setIsPSAModalOpen(false);
    setPsaForm({
      date: '',
      value: '',
      type: 'routine'
    });
  };

  // Appointment modal handlers
  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setSelectedAppointment(null);
  };

  // Discharge summary modal handlers
  const handleDischargeFormChange = (e) => {
    const { name, value } = e.target;
    setDischargeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDischargeMedicationChange = (index, field, value) => {
    const updatedMedications = [...dischargeForm.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setDischargeForm(prev => ({
      ...prev,
      medications: updatedMedications
    }));
  };

  const addDischargeMedication = () => {
    setDischargeForm(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  const removeDischargeMedication = (index) => {
    setDischargeForm(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleAddDischargeSummary = (e) => {
    e.preventDefault();
    
    const newDischargeSummary = {
      id: `DS${Date.now()}`,
      dischargeDate: dischargeForm.dischargeDate,
      procedure: dischargeForm.procedure,
      diagnosis: dischargeForm.diagnosis,
      dischargeNotes: dischargeForm.dischargeNotes,
      followUpInstructions: dischargeForm.followUpInstructions,
      medications: dischargeForm.medications.filter(med => med.name.trim() !== '').map(med => med.name),
      summary: dischargeForm.dischargeNotes,
      status: 'Discharged',
      surgeon: 'Dr. Smith',
      ward: 'Urology Ward',
      readmissionRisk: 'Low',
      psaPreOp: dischargeForm.psaPreOp || '6.2',
      psaPostOp: dischargeForm.psaPostOp || '0.1',
      complications: 'None',
      acknowledged: true,
      followUpRequired: dischargeForm.followUpInstructions.trim() !== '',
      nextAppointment: dischargeForm.followUpInstructions.trim() !== '' ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      admissionDate: new Date(new Date(dischargeForm.dischargeDate).getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setDischargeSummaries(prev => [newDischargeSummary, ...prev]);

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
  };

  const closeDischargeModal = () => {
    setIsDischargeModalOpen(false);
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
  };

  const removeDischargeSummary = (summaryId) => {
    setDischargeSummaries(prev => prev.filter(summary => summary.id !== summaryId));
  };

  // Imaging modal handlers
  const handleImagingFormChange = (e) => {
    const { name, value } = e.target;
    setImagingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagingForm(prev => ({
        ...prev,
        document: file,
        documentName: file.name
      }));
    }
  };

  const handleAddImaging = (e) => {
    e.preventDefault();
    console.log('Adding imaging/procedure:', imagingForm);
    
    setImagingForm({
      type: '',
      date: '',
      result: '',
      document: null,
      documentName: ''
    });
    setIsImagingModalOpen(false);
  };

  const closeImagingModal = () => {
    setIsImagingModalOpen(false);
    setImagingForm({
      type: '',
      date: '',
      result: '',
      document: null,
      documentName: ''
    });
  };

  // PSA Chart Configuration
  const getPSAChartData = (filter) => {
    const psaData = mockPatient.psaHistory;
    let filteredData = psaData;
    
    switch (filter) {
      case '3months':
        filteredData = psaData.slice(-3);
        break;
      case '6months':
        filteredData = psaData.slice(-6);
        break;
      case '1year':
        filteredData = psaData.slice(-8);
        break;
      case 'all':
      default:
        filteredData = psaData;
        break;
    }

    return {
      labels: filteredData.map(item => new Date(item.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })),
      psaValues: filteredData.map(item => item.value),
      types: filteredData.map(item => item.type)
    };
  };

  const psaChartData = getPSAChartData(psaChartFilter);

  const psaLineChartConfig = {
    labels: psaChartData.labels,
    datasets: [
      {
        label: 'PSA Level',
        data: psaChartData.psaValues,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ],
  };

  const psaBarChartConfig = {
    labels: psaChartData.labels,
    datasets: [
      {
        label: 'PSA Level',
        data: psaChartData.psaValues,
        backgroundColor: psaChartData.psaValues.map((value, index) => 
          value > 20 ? 'rgba(239, 68, 68, 0.8)' : 
          value > 10 ? 'rgba(245, 158, 11, 0.8)' : 
          value > 4 ? 'rgba(251, 191, 36, 0.8)' :
          'rgba(34, 197, 94, 0.8)'
        ),
        borderColor: psaChartData.psaValues.map((value, index) => 
          value > 20 ? 'rgb(239, 68, 68)' : 
          value > 10 ? 'rgb(245, 158, 11)' : 
          value > 4 ? 'rgb(251, 191, 36)' :
          'rgb(34, 197, 94)'
        ),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `PSA Test - ${context[0].label}`;
          },
          label: function(context) {
            return `PSA Level: ${context.parsed.y} ng/mL`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: false,
        min: Math.min(...psaChartData.psaValues) - 2,
        max: Math.max(...psaChartData.psaValues) + 2,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500'
          },
          callback: function(value) {
            return value.toFixed(1) + ' ng/mL';
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isClinicalHistoryModalOpen || isPSAModalOpen || isAppointmentModalOpen || isDischargeModalOpen || isImagingModalOpen) {
      const scrollY = window.scrollY;
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isClinicalHistoryModalOpen, isPSAModalOpen, isAppointmentModalOpen, isDischargeModalOpen, isImagingModalOpen]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'clinical', name: 'Clinical History', icon: Stethoscope },
    { id: 'surveillance', name: 'PSA', icon: Activity },
    { id: 'appointments', name: 'Appointments', icon: CalendarIcon },
    { id: 'imaging', name: 'Imaging & Procedures', icon: Activity },
    { id: 'discharge', name: 'Discharge Summaries', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const lastVisitedPage = sessionStorage.getItem('lastVisitedPage');
              if (lastVisitedPage === 'dashboard') {
                navigate('/urologist/dashboard');
              } else if (lastVisitedPage === 'opd-consultations') {
                navigate('/urologist/opd-consultations');
              } else if (lastVisitedPage === 'mdt-cases') {
                navigate('/urologist/mdt-cases');
              } else if (lastVisitedPage === 'surgical-pathway') {
                navigate('/urologist/surgical-pathway');
              } else {
                navigate('/urologist/patient-management');
              }
            }}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {mockPatient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{mockPatient.name}</h1>
                <p className="text-sm text-gray-600">UPI: {mockPatient.id}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getStatusColor(mockPatient.currentStatus)}`}>
                    {mockPatient.currentStatus}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getDatabaseColor(mockPatient.currentDatabase)}`}>
                    {mockPatient.currentDatabase}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-green-100 text-green-800">
                    Age: {calculateAge(mockPatient.dob)} years
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Latest PSA</p>
              <p className="text-lg font-semibold text-gray-900">{mockPatient.lastPSA.value} ng/mL</p>
              <p className="text-sm text-gray-500">{formatDate(mockPatient.lastPSA.date)}</p>
              {mockPatient.gleasonScore && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Gleason Score</p>
                  <p className="text-lg font-semibold text-gray-900">{mockPatient.gleasonScore}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
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

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Patient Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-900">{mockPatient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">ID:</span>
                      <span className="text-gray-900">{mockPatient.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">DOB:</span>
                      <span className="text-gray-900">{formatDate(mockPatient.dob)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Age:</span>
                      <span className="text-gray-900">{calculateAge(mockPatient.dob)} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Medicare:</span>
                      <span className="text-gray-900">{mockPatient.medicare}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Contact Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="text-gray-900">{mockPatient.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="text-gray-900">{mockPatient.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Address:</span>
                      <span className="text-gray-900 text-right">{mockPatient.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Emergency Contact:</span>
                      <span className="text-gray-900">{mockPatient.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Emergency Phone:</span>
                      <span className="text-gray-900">{mockPatient.emergencyPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-base">PSA History</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockPatient.psaHistory.map((psa, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            psa.value > 20 ? 'bg-red-500' : 
                            psa.value > 10 ? 'bg-orange-500' : 
                            psa.value > 4 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{psa.value} ng/mL</p>
                            <p className="text-sm text-gray-600">{formatDate(psa.date)}</p>
                          </div>
                        </div>
                        {psa.velocity && (
                          <div className="text-right">
                            <p className={`text-sm font-medium ${psa.velocity > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {psa.velocity > 0 ? '+' : ''}{psa.velocity.toFixed(2)} ng/mL/year
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clinical History Tab */}
          {activeTab === 'clinical' && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Clinical History Timeline</h3>
                  <p className="text-sm text-gray-600 mt-1">Chronological record of patient interactions and procedures</p>
                </div>
                <button
                  onClick={() => setIsClinicalHistoryModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Clinical History
                </button>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {mockPatient.clinicalHistoryTimeline.map((entry, index) => {
                    const IconComponent = getClinicalHistoryTypeIcon(entry.type);
                    return (
                      <div key={entry.id} className="relative flex items-start space-x-4">
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${getClinicalHistoryTypeColor(entry.type)}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getClinicalHistoryTypeColor(entry.type)}`}>
                                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                                </span>
                                {entry.practitioner && (
                                  <span className="text-sm text-gray-500">• {entry.practitioner}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            {entry.details && (
                              <div>
                                <span className="font-medium text-gray-600">Details:</span>
                                <p className="text-gray-900 mt-1">{entry.details}</p>
                              </div>
                            )}
                            {entry.findings && (
                              <div>
                                <span className="font-medium text-gray-600">Findings:</span>
                                <p className="text-gray-900 mt-1">{entry.findings}</p>
                              </div>
                            )}
                            {entry.recommendations && (
                              <div>
                                <span className="font-medium text-gray-600">Recommendations:</span>
                                <p className="text-gray-900 mt-1">{entry.recommendations}</p>
                              </div>
                            )}
                            {entry.medications && entry.medications.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-600">Medications:</span>
                                <div className="mt-2 space-y-2">
                                  {entry.medications.map((medication, medIndex) => (
                                    <div key={medIndex} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                                      <Pill className="h-4 w-4 text-orange-600 flex-shrink-0" />
                                      <span className="text-gray-900 text-sm">{medication}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Clinical Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Presenting Symptoms:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.presentingSymptoms}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Comorbidities:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.comorbidities}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Allergies:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.allergies}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Family History:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.familyHistory}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Social History:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.socialHistory}</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Current Medications</h3>
                  <div className="space-y-3">
                    {mockPatient.clinicalHistory.currentMedications.map((med, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-xs font-semibold">{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Referral Information</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockPatient.referrals.map((referral, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">Referral from {referral.referringGP}</p>
                          <p className="text-sm text-gray-600">{formatDate(referral.date)}</p>
                          <p className="text-sm text-gray-700 mt-1">{referral.reason}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          referral.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Surveillance Tab */}
          {activeTab === 'surveillance' && (
            <div className="space-y-6">
              {/* PSA Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">PSA Level Trends</h2>
                  <p className="text-sm text-gray-600 mt-1">Monitor PSA progression over time</p>
                </div>
                <button
                  onClick={() => setIsPSAModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add PSA Value
                </button>
              </div>

              {/* PSA Level Charts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setPsaChartFilter('3months')}
                      className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                        psaChartFilter === '3months' 
                          ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      3 Months
                    </button>
                    <button 
                      onClick={() => setPsaChartFilter('6months')}
                      className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                        psaChartFilter === '6months' 
                          ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      6 Months
                    </button>
                    <button 
                      onClick={() => setPsaChartFilter('1year')}
                      className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                        psaChartFilter === '1year' 
                          ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      1 Year
                    </button>
                    <button 
                      onClick={() => setPsaChartFilter('all')}
                      className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                        psaChartFilter === 'all' 
                          ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      All
                    </button>
                  </div>
                </div>
                
                {/* Chart Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Line Chart */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">PSA Trend Line</h3>
                    <div className="h-64 w-full">
                      <Line data={psaLineChartConfig} options={chartOptions} />
                    </div>
                  </div>
                  
                  {/* Bar Chart */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">PSA Values</h3>
                    <div className="h-64 w-full">
                      <Bar data={psaBarChartConfig} options={chartOptions} />
                    </div>
                  </div>
                </div>
                
                {/* PSA Level Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-600">Normal (≤4.0 ng/mL)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-600">Elevated (4.1-10.0 ng/mL)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-sm text-gray-600">High (10.1-20.0 ng/mL)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-600">Very High (&gt;20.0 ng/mL)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PSA Values List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">PSA Test History</h3>
                    <p className="text-sm text-gray-600 mt-1">Complete record of PSA tests and their status</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Normal (≤4.0)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Elevated (4.1-10.0)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">High (10.1-20.0)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Very High (&gt;20.0)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockPatient.psaHistory.map((psa, index) => {
                    const getPSAStatus = (value) => {
                      if (value <= 4.0) return { status: 'Normal', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' };
                      if (value <= 10.0) return { status: 'Elevated', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' };
                      if (value <= 20.0) return { status: 'High', color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' };
                      return { status: 'Very High', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' };
                    };
                    
                    const psaStatus = getPSAStatus(psa.value);
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 ${psaStatus.dot} rounded-full`}></div>
                          <div className="flex items-center space-x-6">
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">{psa.value} ng/mL</p>
                              <p className="text-sm text-gray-600">{formatDate(psa.date)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${psaStatus.color}`}>
                                {psaStatus.status}
                              </span>
                              {psa.type === 'baseline' && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  Baseline
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Test #{index + 1}</p>
                          {index > 0 && (
                            <p className={`text-sm font-medium ${
                              psa.value > mockPatient.psaHistory[index - 1].value ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {psa.value > mockPatient.psaHistory[index - 1].value ? '↗' : '↘'} {Math.abs(psa.value - mockPatient.psaHistory[index - 1].value).toFixed(1)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {mockPatient.psaHistory.filter(psa => psa.value <= 4.0).length}
                      </p>
                      <p className="text-sm text-gray-600">Normal Tests</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {mockPatient.psaHistory.filter(psa => psa.value > 4.0 && psa.value <= 10.0).length}
                      </p>
                      <p className="text-sm text-gray-600">Elevated Tests</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {mockPatient.psaHistory.filter(psa => psa.value > 10.0 && psa.value <= 20.0).length}
                      </p>
                      <p className="text-sm text-gray-600">High Tests</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">
                        {mockPatient.psaHistory.filter(psa => psa.value > 20.0).length}
                      </p>
                      <p className="text-sm text-gray-600">Very High Tests</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-base">Appointments</h3>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </button>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="space-y-3">
                  {mockPatient.appointments.map((appointment, index) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">{appointment.type}</p>
                            <p className="text-sm text-gray-600">{formatDate(appointment.date)} at {appointment.time}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {appointment.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getAppointmentStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewAppointmentDetails(appointment)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span>View</span>
                          </button>
                          <button 
                            onClick={() => navigate(`/urologist/reschedule/${appointment.id}`)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Reschedule</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Imaging & Procedures Tab */}
          {activeTab === 'imaging' && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Imaging & Procedures Timeline</h3>
                  <p className="text-sm text-gray-600 mt-1">Chronological record of imaging studies and procedures with documents</p>
                </div>
                <button
                  onClick={() => setIsImagingModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Imaging/Procedure
                </button>
              </div>

              {/* Combined Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {/* Combine imaging and procedures and sort by date */}
                  {[...mockPatient.imaging, ...mockPatient.procedures]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((item, index) => {
                      const isImaging = mockPatient.imaging.some(img => img.id === item.id);
                      const iconColor = isImaging ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
                      const IconComponent = isImaging ? Activity : Stethoscope;
                      
                      return (
                        <div key={item.id} className="relative flex items-start space-x-4">
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{item.type}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-sm text-gray-600">{formatDate(item.date)}</span>
                                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${iconColor}`}>
                                    {isImaging ? 'Imaging' : 'Procedure'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-600">Results:</span>
                                <p className="text-gray-900 mt-1">{item.result}</p>
                              </div>
                              
                              {item.document && (
                                <div>
                                  <span className="font-medium text-gray-600">Document:</span>
                                  <div className="mt-2 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">{item.documentName}</p>
                                      <p className="text-xs text-gray-500">PDF Document</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                      </button>
                                      <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Imaging Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Imaging Studies</span>
                      <span className="text-lg font-bold text-blue-600">{mockPatient.imaging.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Documents Available</span>
                      <span className="text-lg font-bold text-green-600">
                        {mockPatient.imaging.filter(img => img.document).length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Procedures Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Procedures</span>
                      <span className="text-lg font-bold text-purple-600">{mockPatient.procedures.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Documents Available</span>
                      <span className="text-lg font-bold text-green-600">
                        {mockPatient.procedures.filter(proc => proc.document).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Discharge Summaries Tab */}
          {activeTab === 'discharge' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-base">Discharge Summaries</h3>
                <button
                  onClick={() => setIsDischargeModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Discharge Summary
                </button>
              </div>
                {/* Discharge Summaries Timeline */}
                <div className="space-y-6">
                  {dischargeSummaries.length > 0 ? (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {dischargeSummaries.map((summary, index) => (
                        <div key={summary.id} className="relative flex items-start space-x-6 pb-8">
                          {/* Timeline dot */}
                          <div className="relative flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-lg">
                            <FileText className="h-6 w-6 text-white" />
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-sm border border-gray-200">
                              <span className="text-xs font-semibold text-gray-700">{summary.id}</span>
                            </div>
                          </div>
                          
                          {/* Content card */}
                          <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{summary.procedure}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{summary.diagnosis}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      Discharged: {formatDate(summary.dischargeDate)}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      LOS: {Math.ceil((new Date(summary.dischargeDate) - new Date(summary.admissionDate)) / (1000 * 60 * 60 * 24))} days
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                      {summary.status}
                                    </span>
                                    <button
                                      onClick={() => removeDischargeSummary(summary.id)}
                                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                      title="Remove discharge summary"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    {summary.readmissionRisk}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Clinical Summary */}
                              <div className="mb-6">
                                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Clinical Summary
                                </h5>
                                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                  {summary.summary}
                                </p>
                              </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-3">Procedure Details</h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">Surgeon:</span>
                                      <span className="text-gray-900">{summary.surgeon}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">Ward:</span>
                                      <span className="text-gray-900">{summary.ward}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">Complications:</span>
                                      <span className="text-gray-900">{summary.complications}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">Acknowledged:</span>
                                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                        summary.acknowledged ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {summary.acknowledged ? 'Yes' : 'No'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-3">PSA Levels</h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">Pre-op PSA:</span>
                                      <span className="text-gray-900 font-semibold">{summary.psaPreOp} ng/mL</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">Post-op PSA:</span>
                                      <span className="text-gray-900 font-semibold">{summary.psaPostOp} ng/mL</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">Change:</span>
                                      <span className={`font-semibold ${
                                        summary.psaPostOp < summary.psaPreOp ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {summary.psaPostOp < summary.psaPreOp ? '↓' : '↑'} {Math.abs(summary.psaPostOp - summary.psaPreOp).toFixed(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Follow-up Instructions */}
                              {summary.followUpRequired && (
                                <div className="mb-6">
                                  <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Follow-up Instructions
                                  </h5>
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-blue-700">Next Appointment:</span>
                                        <span className="text-blue-900 font-semibold">{formatDate(summary.nextAppointment)}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-blue-700">Instructions:</span>
                                        <p className="text-blue-800 mt-1">{summary.followUpInstructions}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Medications */}
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                  <Stethoscope className="h-4 w-4 mr-2" />
                                  Discharge Medications
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {summary.medications.map((med, medIndex) => (
                                    <div key={medIndex} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <span className="text-blue-600 text-xs font-semibold">{medIndex + 1}</span>
                                        </div>
                                        <span className="text-sm font-medium text-blue-900">{med}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Discharge Summaries</h3>
                      <p className="text-gray-600 mb-4">No discharge summaries have been created for this patient yet.</p>
                      <button
                        onClick={() => setIsDischargeModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Discharge Summary
                      </button>
                    </div>
                  )}
                </div>
              </div>
          )}
        </div>
      </div>

      {/* Add Clinical History Modal */}
      {isClinicalHistoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Clinical History Entry</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddClinicalHistory} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={clinicalHistoryForm.date}
                    onChange={handleClinicalHistoryFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={clinicalHistoryForm.type}
                    onChange={handleClinicalHistoryFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Procedure</option>
                    <option value="test">Test</option>
                    <option value="medication">Medication</option>
                    <option value="note">Clinical Note</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={clinicalHistoryForm.title}
                  onChange={handleClinicalHistoryFormChange}
                  required
                  placeholder="e.g., Follow-up Consultation, PSA Test, Prostate Biopsy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practitioner
                </label>
                <input
                  type="text"
                  name="practitioner"
                  value={clinicalHistoryForm.practitioner}
                  onChange={handleClinicalHistoryFormChange}
                  placeholder="e.g., Dr. Sarah Wilson, Lab Technician"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Details *
                </label>
                <textarea
                  name="details"
                  value={clinicalHistoryForm.details}
                  onChange={handleClinicalHistoryFormChange}
                  required
                  rows={3}
                  placeholder="Describe what happened during this interaction or procedure..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Findings
                </label>
                <textarea
                  name="findings"
                  value={clinicalHistoryForm.findings}
                  onChange={handleClinicalHistoryFormChange}
                  rows={3}
                  placeholder="Record any clinical findings, test results, or observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations
                </label>
                <textarea
                  name="recommendations"
                  value={clinicalHistoryForm.recommendations}
                  onChange={handleClinicalHistoryFormChange}
                  rows={3}
                  placeholder="Record any recommendations, next steps, or follow-up instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Medications
                  </label>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Medication
                  </button>
                </div>
                <div className="space-y-3">
                  {clinicalHistoryForm.medications.map((medication, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={medication}
                        onChange={(e) => handleMedicationChange(index, e.target.value)}
                        placeholder="e.g., Tamsulosin 0.4mg daily"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {clinicalHistoryForm.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove medication"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add medications prescribed, adjusted, or discussed during this interaction
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add PSA Value Modal */}
      {isPSAModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add PSA Value</h2>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type *
                </label>
                <select
                  name="type"
                  value={psaForm.type}
                  onChange={handlePSAFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="routine">Routine Test</option>
                  <option value="follow-up">Follow-up Test</option>
                  <option value="baseline">Baseline Test</option>
                  <option value="urgent">Urgent Test</option>
                </select>
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
                        <span className="text-sm font-medium text-yellow-800">Elevated (4.1-10.0 ng/mL)</span>
                      </>
                    ) : parseFloat(psaForm.value) <= 20.0 ? (
                      <>
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-orange-800">High (10.1-20.0 ng/mL)</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-red-800">Very High (&gt;20.0 ng/mL)</span>
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
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add PSA Value
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {isAppointmentModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
              <button
                onClick={closeAppointmentModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Patient Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="ml-2 font-medium text-gray-900">{mockPatient.name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">UPI:</span>
                        <span className="ml-2 font-mono text-gray-900">{mockPatient.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Appointment Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedAppointment.type === 'Follow-up' ? 'bg-blue-100 text-blue-800' :
                          selectedAppointment.type === 'OPD' ? 'bg-purple-100 text-purple-800' :
                          selectedAppointment.type === 'Surgery' ? 'bg-red-100 text-red-800' :
                          selectedAppointment.type === 'Surveillance' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedAppointment.type}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getAppointmentStatusColor(selectedAppointment.status)}`}>
                          {selectedAppointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Schedule Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Schedule</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatDate(selectedAppointment.date)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Time:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedAppointment.time}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedAppointment.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Notes</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedAppointment.notes || 'No additional notes for this appointment.'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeAppointmentModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeAppointmentModal();
                    navigate(`/urologist/reschedule/${selectedAppointment.id}`);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Discharge Summary Modal */}
      {isDischargeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Discharge Summary</h2>
              <button
                onClick={closeDischargeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddDischargeSummary} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discharge Date *
                  </label>
                  <input
                    type="date"
                    name="dischargeDate"
                    value={dischargeForm.dischargeDate}
                    onChange={handleDischargeFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Procedure *
                  </label>
                  <input
                    type="text"
                    name="procedure"
                    value={dischargeForm.procedure}
                    onChange={handleDischargeFormChange}
                    required
                    placeholder="e.g., Radical Prostatectomy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pre-op PSA (ng/mL)
                  </label>
                  <input
                    type="number"
                    name="psaPreOp"
                    value={dischargeForm.psaPreOp || ''}
                    onChange={handleDischargeFormChange}
                    step="0.1"
                    placeholder="e.g., 6.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post-op PSA (ng/mL)
                  </label>
                  <input
                    type="number"
                    name="psaPostOp"
                    value={dischargeForm.psaPostOp || ''}
                    onChange={handleDischargeFormChange}
                    step="0.1"
                    placeholder="e.g., 0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis *
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={dischargeForm.diagnosis}
                  onChange={handleDischargeFormChange}
                  required
                  placeholder="e.g., Prostate Cancer - Gleason 7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discharge Notes *
                </label>
                <textarea
                  name="dischargeNotes"
                  value={dischargeForm.dischargeNotes}
                  onChange={handleDischargeFormChange}
                  required
                  rows={4}
                  placeholder="Enter detailed discharge notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Instructions
                </label>
                <textarea
                  name="followUpInstructions"
                  value={dischargeForm.followUpInstructions}
                  onChange={handleDischargeFormChange}
                  rows={3}
                  placeholder="Enter follow-up instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Medications Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Discharge Medications
                  </label>
                  <button
                    type="button"
                    onClick={addDischargeMedication}
                    className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Medication
                  </button>
                </div>
                
                <div className="space-y-4">
                  {dischargeForm.medications.map((medication, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Medication Name</label>
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) => handleDischargeMedicationChange(index, 'name', e.target.value)}
                          placeholder="e.g., Paracetamol"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Dosage</label>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) => handleDischargeMedicationChange(index, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => handleDischargeMedicationChange(index, 'frequency', e.target.value)}
                          placeholder="e.g., Twice daily"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                          <input
                            type="text"
                            value={medication.duration}
                            onChange={(e) => handleDischargeMedicationChange(index, 'duration', e.target.value)}
                            placeholder="e.g., 7 days"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDischargeMedication(index)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {dischargeForm.medications.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <Stethoscope className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No medications added yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeDischargeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add Discharge Summary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Imaging/Procedure Modal */}
      {isImagingModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Imaging/Procedure</h2>
              <button
                onClick={closeImagingModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddImaging} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={imagingForm.type}
                    onChange={handleImagingFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    <optgroup label="Imaging Studies">
                      <option value="MRI Prostate">MRI Prostate</option>
                      <option value="CT Abdomen/Pelvis">CT Abdomen/Pelvis</option>
                      <option value="Bone Scan">Bone Scan</option>
                      <option value="PSMA PET Scan">PSMA PET Scan</option>
                      <option value="Ultrasound">Ultrasound</option>
                      <option value="X-Ray">X-Ray</option>
                    </optgroup>
                    <optgroup label="Procedures">
                      <option value="Prostate Biopsy">Prostate Biopsy</option>
                      <option value="Cystoscopy">Cystoscopy</option>
                      <option value="Urodynamic Study">Urodynamic Study</option>
                      <option value="Radical Prostatectomy">Radical Prostatectomy</option>
                      <option value="Laparoscopic Surgery">Laparoscopic Surgery</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={imagingForm.date}
                    onChange={handleImagingFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Results/Findings *
                </label>
                <textarea
                  name="result"
                  value={imagingForm.result}
                  onChange={handleImagingFormChange}
                  required
                  rows={4}
                  placeholder="Enter detailed results, findings, or procedure notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <FileText className="h-full w-full" />
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="document-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="document-upload"
                          name="document-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleDocumentUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                
                {imagingForm.documentName && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">{imagingForm.documentName}</p>
                        <p className="text-xs text-green-700">Ready to upload</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImagingForm(prev => ({
                            ...prev,
                            document: null,
                            documentName: ''
                          }));
                          document.getElementById('document-upload').value = '';
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeImagingModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add {imagingForm.type.includes('MRI') || imagingForm.type.includes('CT') || imagingForm.type.includes('Scan') || imagingForm.type.includes('Ultrasound') || imagingForm.type.includes('X-Ray') ? 'Imaging Study' : 'Procedure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;

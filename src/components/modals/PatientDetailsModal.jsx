import React, { useState, useEffect } from 'react';
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

const PatientDetailsModal = ({ isOpen, onClose, patientId, userRole }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isClinicalHistoryModalOpen, setIsClinicalHistoryModalOpen] = useState(false);
  const [isPSAModalOpen, setIsPSAModalOpen] = useState(false);
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
    document: null,
    documentName: ''
  });
  const [isClinicalNotesModalOpen, setIsClinicalNotesModalOpen] = useState(false);
  const [activeNoteTab, setActiveNoteTab] = useState('general');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isPathwayModalOpen, setIsPathwayModalOpen] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [transferDetails, setTransferDetails] = useState({
    reason: '',
    priority: 'normal',
    clinicalRationale: '',
    additionalNotes: ''
  });
  const [appointmentBooking, setAppointmentBooking] = useState({
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });
  const [recurringAppointments, setRecurringAppointments] = useState({
    interval: '3'
  });
  const [medicationDetails, setMedicationDetails] = useState({
    medications: [{
      id: Date.now(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }],
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });
  const [isDischargeSummaryModalOpen, setIsDischargeSummaryModalOpen] = useState(false);

  // Medication management functions
  const addMedication = () => {
    setMedicationDetails(prev => ({
      ...prev,
      medications: [...prev.medications, {
        id: Date.now(),
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }]
    }));
  };

  const removeMedication = (id) => {
    setMedicationDetails(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== id)
    }));
  };

  const updateMedication = (id, field, value) => {
    setMedicationDetails(prev => ({
      ...prev,
      medications: prev.medications.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    }));
  };
  const [clinicalNotesForm, setClinicalNotesForm] = useState({
    // General Info
    note: '',
    priority: 'normal',
    
    // Medicine Details
    medicines: [{
      id: Date.now(),
      medicineName: '',
      dosage: '',
      frequency: '',
      taken: false,
      sideEffects: '',
      compliance: 'good'
    }]
  });

  // Mock patient data - in real app, fetch by ID
  const mockPatient = {
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
    pathway: 'Active Monitoring',
    lastPSA: { value: 6.2, date: '2024-01-10' },
    nextAppointment: '2024-04-10',
    referrals: [
      { id: 1, date: '2023-06-15', reason: 'PSA 8.5', status: 'Completed', outcome: 'Active Monitoring' },
      { id: 2, date: '2024-01-10', reason: 'Routine follow-up', status: 'Active', outcome: null }
    ],
    psaHistory: [
      { value: 8.5, date: '2023-06-15', velocity: null },
      { value: 7.8, date: '2023-09-20', velocity: -0.23 },
      { value: 6.2, date: '2024-01-10', velocity: -0.53 }
    ],
    appointments: [
      { id: 'APT001', date: '2024-01-15', type: 'PSA Follow-up', status: 'Scheduled', location: 'Urology Clinic', time: '9:00 AM' },
      { id: 'APT002', date: '2024-04-15', type: 'Follow-up', status: 'Scheduled', location: 'Urology Clinic', time: '10:30 AM' },
      { id: 'APT003', date: '2024-07-15', type: 'PSA Review', status: 'Scheduled', location: 'Urology Clinic', time: '2:00 PM' }
    ],
    clinicalHistory: {
      presentingSymptoms: 'Elevated PSA, urinary frequency',
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
        date: '2023-06-20', 
        result: 'PIRADS 3 lesion in left peripheral zone',
        document: 'mri_prostate_report_2023.pdf',
        documentName: 'MRI Prostate Report - 20/06/2023'
      },
      { 
        id: 'IMG002',
        type: 'CT Abdomen/Pelvis', 
        date: '2023-06-25', 
        result: 'No evidence of metastatic disease',
        document: 'ct_abdomen_report_2023.pdf',
        documentName: 'CT Abdomen/Pelvis Report - 25/06/2023'
      }
    ],
    procedures: [
      { 
        id: 'PROC001',
        type: 'Prostate Biopsy', 
        date: '2023-07-10', 
        result: 'Gleason 6 (3+3), 2/12 cores positive',
        document: 'biopsy_report_2023.pdf',
        documentName: 'Prostate Biopsy Report - 10/07/2023'
      },
      { 
        id: 'PROC002',
        type: 'Repeat Biopsy', 
        date: '2024-01-15', 
        result: 'Gleason 6 (3+3), 1/12 cores positive',
        document: 'repeat_biopsy_report_2024.pdf',
        documentName: 'Repeat Biopsy Report - 15/01/2024'
      }
    ],
    dischargeSummaries: [
      {
        id: 'DS001',
        dischargeDate: '2024-01-15',
        admissionDate: '2024-01-10',
        procedure: 'RALP (Robotic Assisted Laparoscopic Prostatectomy)',
        diagnosis: 'Prostate Cancer - Gleason 7 (3+4)',
        status: 'Discharged',
        followUpRequired: true,
        nextAppointment: '2024-04-15',
        followUpInstructions: '3-month PSA, 6-month follow-up appointment',
        medications: ['Tamsulosin 0.4mg daily', 'Paracetamol PRN'],
        complications: 'None',
        summary: 'Patient underwent successful RALP. No complications. Catheter removed on day 5. Patient mobilizing well.',
        psaPreOp: 8.5,
        psaPostOp: 0.1,
        surgeon: 'Dr. Michael Chen',
        anesthetist: 'Dr. Sarah Williams',
        ward: 'Urology Ward 3B',
        dischargeDestination: 'Home',
        readmissionRisk: 'Low',
        acknowledged: true
      }
    ],
    monitoringData: {
      protocol: 'Active Monitoring - Low Risk',
      startDate: '2023-06-15',
      nextPSA: '2024-04-15',
      nextMRI: '2024-06-15',
      nextBiopsy: '2024-07-15',
      compliance: 'Excellent',
      progressionRisk: 'Low'
    },
    psaHistory: [
      { date: '2023-06-15', value: 5.8, type: 'baseline' },
      { date: '2023-09-15', value: 5.9, type: 'routine' },
      { date: '2023-12-15', value: 6.1, type: 'routine' },
      { date: '2024-01-15', value: 6.2, type: 'routine' },
      { date: '2024-03-15', value: 6.0, type: 'routine' },
      { date: '2024-06-15', value: 6.3, type: 'routine' },
      { date: '2024-09-15', value: 6.1, type: 'routine' },
      { date: '2024-12-15', value: 6.2, type: 'routine' }
    ],
    clinicalHistoryTimeline: [
      {
        id: 1,
        date: '2024-01-15',
        type: 'consultation',
        title: 'Follow-up Consultation',
        details: 'Patient presented for routine follow-up. Discussed PSA results and monitoring protocol.',
        practitioner: 'Dr. Sarah Wilson',
        findings: 'PSA stable at 6.2 ng/mL. Patient reports good compliance with medications.',
        recommendations: 'Continue active monitoring. Next PSA in 3 months.',
        medications: ['Tamsulosin 0.4mg daily', 'Metformin 500mg BD']
      },
      {
        id: 2,
        date: '2023-12-10',
        type: 'procedure',
        title: 'PSA Blood Test',
        details: 'Routine PSA testing as part of active monitoring protocol.',
        practitioner: 'Lab Technician',
        findings: 'PSA: 6.2 ng/mL (stable from previous reading)',
        recommendations: 'Continue monitoring. No immediate concerns.',
        medications: []
      },
      {
        id: 3,
        date: '2023-09-20',
        type: 'consultation',
        title: 'Monitoring Review',
        details: 'Quarterly review of active monitoring protocol and patient progress.',
        practitioner: 'Dr. Michael Chen',
        findings: 'Patient progressing well on monitoring. No concerning symptoms.',
        recommendations: 'Continue current protocol. Schedule next PSA in 3 months.',
        medications: ['Lisinopril 10mg daily']
      },
      {
        id: 4,
        date: '2023-07-10',
        type: 'procedure',
        title: 'Prostate Biopsy',
        details: 'Repeat prostate biopsy as part of monitoring protocol.',
        practitioner: 'Dr. Michael Chen',
        findings: 'Gleason 6 (3+3), 1/12 cores positive. No significant change from previous biopsy.',
        recommendations: 'Continue active monitoring. No indication for treatment escalation.',
        medications: []
      }
    ],
    mdtNotes: [
      {
        id: 'MDT001',
        timestamp: '2024-01-20T10:00:00',
        date: '2024-01-20',
        time: '10:00',
        mdtDate: '2024-01-20',
        teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
        caseType: 'High-risk prostate cancer',
        priority: 'High',
        status: 'Review Complete',
        discussionNotes: 'Patient presents with high-risk prostate cancer (Gleason 4+4=8, T3a disease). MRI shows extracapsular extension. PSMA PET scan shows no distant metastases. Team consensus reached on treatment approach.',
        outcome: 'Proceed to Surgery',
        recommendations: 'Schedule robotic-assisted laparoscopic prostatectomy (RALP) within 4 weeks. Pre-operative assessment including cardiology clearance required. Patient counseled on risks and benefits.',
        followUpActions: [
          'Schedule pre-operative cardiology assessment',
          'Book surgery date for February 2024',
          'Provide patient information booklet',
          'Arrange pre-operative nursing consultation'
        ],
        documents: ['MDT_Summary_20240120.pdf', 'Treatment_Plan_20240120.pdf']
      },
      {
        id: 'MDT002',
        timestamp: '2023-12-15T14:30:00',
        date: '2023-12-15',
        time: '14:30',
        mdtDate: '2023-12-15',
        teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)'],
        caseType: 'Intermediate-risk prostate cancer',
        priority: 'Medium',
        status: 'Review Complete',
        discussionNotes: 'Initial MDT discussion for newly diagnosed intermediate-risk prostate cancer. Patient has Gleason 3+4=7, T2c disease. No evidence of extracapsular extension on MRI.',
        outcome: 'Active Monitoring',
        recommendations: 'Continue active monitoring with 6-monthly PSA and annual MRI. Patient to be reviewed in 6 months or if PSA rises above 10 ng/mL.',
        followUpActions: [
          'Schedule 6-month PSA test',
          'Book annual MRI for June 2024',
          'Provide monitoring information',
          'Arrange patient support group referral'
        ],
        documents: ['MDT_Summary_20231215.pdf']
      }
    ],
    clinicalNotes: [
      {
        id: 'CN001',
        timestamp: '2024-01-15T14:30:00',
        date: '2024-01-15',
        time: '14:30',
        author: 'Dr. Sarah Wilson',
        authorRole: 'Urologist',
        type: 'general',
        priority: 'normal',
        note: 'Patient presented for routine follow-up. PSA stable at 6.2 ng/mL. No new symptoms reported. Patient continues to comply well with active monitoring protocol. Discussed next steps and reassured patient about current management plan.',
        vitals: null,
        medicine: null
      },
      {
        id: 'CN002',
        timestamp: '2024-01-15T10:15:00',
        date: '2024-01-15',
        time: '10:15',
        author: 'Jennifer Lee',
        authorRole: 'Urology Nurse',
        type: 'general',
        priority: 'normal',
        note: 'Routine check completed. Patient arrived on time for appointment.',
        vitals: null,
        medicine: null
      },
      {
        id: 'CN003',
        timestamp: '2024-01-14T16:45:00',
        date: '2024-01-14',
        time: '16:45',
        author: 'Dr. Michael Chen',
        authorRole: 'Urologist',
        type: 'general',
        priority: 'normal',
        note: 'Reviewed latest PSA results and MRI findings. No significant changes from previous studies. Patient remains on active monitoring protocol. Next PSA scheduled for 3 months. Patient educated about signs and symptoms to watch for.',
        vitals: null,
        medicine: null
      },
      {
        id: 'CN004',
        timestamp: '2024-01-14T09:20:00',
        date: '2024-01-14',
        time: '09:20',
        author: 'David Park',
        authorRole: 'Urology Nurse',
        type: 'medicine',
        priority: 'normal',
        note: 'Morning medication administration and compliance check.',
        vitals: null,
        medicine: [{
          id: 1,
          medicineName: 'Tamsulosin 0.4mg',
          dosage: '0.4mg',
          frequency: 'Once daily',
          taken: true,
          sideEffects: 'None reported',
          compliance: 'excellent'
        }]
      },
      {
        id: 'CN004.5',
        timestamp: '2024-01-14T14:20:00',
        date: '2024-01-14',
        time: '14:20',
        author: 'David Park',
        authorRole: 'Urology Nurse',
        type: 'medicine',
        priority: 'normal',
        note: 'Afternoon medication check. Patient confirmed taking all prescribed medications.',
        vitals: null,
        medicine: [{
          id: 3,
          medicineName: 'Tamsulosin 0.4mg',
          dosage: '0.4mg',
          frequency: 'Once daily',
          taken: true,
          sideEffects: 'None reported',
          compliance: 'excellent'
        }, {
          id: 4,
          medicineName: 'Finasteride 5mg',
          dosage: '5mg',
          frequency: 'Once daily',
          taken: true,
          sideEffects: 'Mild dizziness',
          compliance: 'good'
        }]
      },
      {
        id: 'CN005',
        timestamp: '2024-01-13T11:30:00',
        date: '2024-01-13',
        time: '11:30',
        author: 'Dr. Sarah Wilson',
        authorRole: 'Urologist',
        type: 'general',
        priority: 'normal',
        note: 'Patient reported mild urinary frequency over the past week. No dysuria or hematuria. Physical examination unremarkable. Urinalysis ordered to rule out UTI. Patient advised to monitor symptoms and report any changes.',
        vitals: null,
        medicine: null
      },
      {
        id: 'CN006',
        timestamp: '2024-01-12T15:10:00',
        date: '2024-01-12',
        time: '15:10',
        author: 'Jennifer Lee',
        authorRole: 'Urology Nurse',
        type: 'vitals',
        priority: 'normal',
        note: 'Afternoon vital signs check. Patient attended support group session.',
        vitals: {
          bloodPressure: '118/75',
          heartRate: '68',
          temperature: '36.2°C'
        },
        medicine: null
      }
    ]
  };

  // Initialize discharge summaries and clinical notes state after mockPatient is defined
  const [dischargeSummaries, setDischargeSummaries] = useState(mockPatient.dischargeSummaries);
  const [clinicalNotes, setClinicalNotes] = useState(mockPatient.clinicalNotes);

  // Edit modal states
  const [isEditPersonalInfoModalOpen, setIsEditPersonalInfoModalOpen] = useState(false);
  const [isEditPSAModalOpen, setIsEditPSAModalOpen] = useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);
  const [isEditClinicalNoteModalOpen, setIsEditClinicalNoteModalOpen] = useState(false);
  const [isEditImagingModalOpen, setIsEditImagingModalOpen] = useState(false);
  const [isEditClinicalHistoryModalOpen, setIsEditClinicalHistoryModalOpen] = useState(false);
  const [isEditDischargeModalOpen, setIsEditDischargeModalOpen] = useState(false);

  // Edit form states
  const [editPersonalInfoForm, setEditPersonalInfoForm] = useState({});
  const [editPSAForm, setEditPSAForm] = useState({});
  const [editAppointmentForm, setEditAppointmentForm] = useState({});
  const [editClinicalNoteForm, setEditClinicalNoteForm] = useState({});
  const [editImagingForm, setEditImagingForm] = useState({});
  const [editClinicalHistoryForm, setEditClinicalHistoryForm] = useState({});
  const [editDischargeForm, setEditDischargeForm] = useState({});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const calculatePSAVelocity = (psaHistory) => {
    if (psaHistory.length < 2) return 0;
    const latest = psaHistory[psaHistory.length - 1];
    const previous = psaHistory[psaHistory.length - 2];
    const timeDiff = (new Date(latest.date) - new Date(previous.date)) / (1000 * 60 * 60 * 24 * 365);
    const velocity = (latest.value - previous.value) / timeDiff;
    return isNaN(velocity) ? 0 : velocity.toFixed(2);
  };

  // PSA Chart Configuration
  const getPSAChartData = (patient, filter) => {
    if (!patient || !patient.psaHistory) return { labels: [], psaValues: [] };
    
    const psaData = patient.psaHistory.map(item => ({
      value: item.value,
      date: item.date
    }));
    
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
      psaValues: filteredData.map(item => item.value)
    };
  };

  const getPSAChartConfig = (patient, filter) => {
    const chartData = getPSAChartData(patient, filter);
    
    return {
      lineChart: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'PSA Level',
            data: chartData.psaValues,
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
      },
      barChart: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'PSA Level',
            data: chartData.psaValues,
            backgroundColor: chartData.psaValues.map(value => 
              value > 10 ? 'rgba(239, 68, 68, 0.8)' : 
              value > 4 ? 'rgba(245, 158, 11, 0.8)' : 
              'rgba(34, 197, 94, 0.8)'
            ),
            borderColor: chartData.psaValues.map(value => 
              value > 10 ? 'rgb(239, 68, 68)' : 
              value > 4 ? 'rgb(245, 158, 11)' : 
              'rgb(34, 197, 94)'
            ),
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
          }
        ],
      }
    };
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
        min: mockPatient ? Math.min(...getPSAChartData(mockPatient, psaChartFilter).psaValues) - 0.5 : 0,
        max: mockPatient ? Math.max(...getPSAChartData(mockPatient, psaChartFilter).psaValues) + 0.5 : 20,
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
      case 'Active Monitoring': return 'bg-blue-100 text-blue-800';
      case 'Post-Surgery': return 'bg-green-100 text-green-800';
      case 'Awaiting Triage': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled for Surgery': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
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

  const getClinicalNotesTypeColor = (type) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'vitals': return 'bg-green-100 text-green-800';
      case 'medicine': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClinicalNotesTypeIcon = (type) => {
    switch (type) {
      case 'general': return FileText;
      case 'vitals': return Activity;
      case 'medicine': return Pill;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuthorRoleColor = (role) => {
    switch (role) {
      case 'Urologist': return 'bg-blue-100 text-blue-800';
      case 'Urology Nurse': return 'bg-green-100 text-green-800';
      case 'GP': return 'bg-purple-100 text-purple-800';
      case 'Specialist': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  const addClinicalHistoryMedication = () => {
    setClinicalHistoryForm(prev => ({
      ...prev,
      medications: [...prev.medications, '']
    }));
  };

  const removeClinicalHistoryMedication = (index) => {
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


  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setSelectedAppointment(null);
  };

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

  // Edit handler functions
  const handleEditPersonalInfo = () => {
    setEditPersonalInfoForm({
      name: mockPatient.name,
      dob: mockPatient.dob,
      medicare: mockPatient.medicare,
      phone: mockPatient.phone,
      address: mockPatient.address,
      emergencyContact: mockPatient.emergencyContact,
      emergencyPhone: mockPatient.emergencyPhone
    });
    setIsEditPersonalInfoModalOpen(true);
  };

  const handleEditPSA = (psaTest) => {
    setEditPSAForm({
      id: psaTest.id,
      date: psaTest.date,
      value: psaTest.value,
      type: psaTest.type
    });
    setIsEditPSAModalOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditAppointmentForm({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      doctor: appointment.doctor,
      status: appointment.status,
      notes: appointment.notes
    });
    setIsEditAppointmentModalOpen(true);
  };

  const handleEditClinicalNote = (note) => {
    setEditClinicalNoteForm({
      id: note.id,
      priority: note.priority,
      type: note.type,
      note: note.note,
      vitals: note.vitals || {},
      medicine: note.medicine || []
    });
    setIsEditClinicalNoteModalOpen(true);
  };

  const handleEditImaging = (item) => {
    setEditImagingForm({
      id: item.id,
      date: item.date,
      type: item.type,
      title: item.title,
      findings: item.findings || item.result || '',
      recommendations: item.recommendations || '',
      documents: item.document ? [{
        name: item.documentName || 'Document',
        file: item.document,
        type: 'application/pdf'
      }] : []
    });
    setIsEditImagingModalOpen(true);
  };

  const handleEditClinicalHistory = (entry) => {
    setEditClinicalHistoryForm({
      id: entry.id,
      date: entry.date,
      type: entry.type,
      title: entry.title,
      details: entry.details,
      practitioner: entry.practitioner,
      findings: entry.findings,
      recommendations: entry.recommendations,
      medications: entry.medications && entry.medications.length > 0 ? entry.medications : ['']
    });
    setIsEditClinicalHistoryModalOpen(true);
  };

  const handleEditDischarge = (summary) => {
    setEditDischargeForm({
      id: summary.id,
      dischargeDate: summary.dischargeDate,
      procedure: summary.procedure,
      diagnosis: summary.diagnosis,
      dischargeNotes: summary.summary,
      followUpInstructions: summary.followUpInstructions || '',
      medications: summary.medications || [],
      psaPreOp: summary.psaPreOp || '',
      psaPostOp: summary.psaPostOp || ''
    });
    setIsEditDischargeModalOpen(true);
  };

  const removeDischargeSummary = (summaryId) => {
    setDischargeSummaries(prev => prev.filter(summary => summary.id !== summaryId));
  };

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

  const handleClinicalNotesFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClinicalNotesForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMedicineChange = (medicineId, field, value) => {
    setClinicalNotesForm(prev => ({
      ...prev,
      medicines: prev.medicines.map(medicine =>
        medicine.id === medicineId
          ? { ...medicine, [field]: value }
          : medicine
      )
    }));
  };

  const addMedicine = () => {
    setClinicalNotesForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, {
        id: Date.now(),
        medicineName: '',
        dosage: '',
        frequency: '',
        taken: false,
        sideEffects: '',
        compliance: 'good'
      }]
    }));
  };

  const removeMedicine = (medicineId) => {
    setClinicalNotesForm(prev => ({
      ...prev,
      medicines: prev.medicines.filter(medicine => medicine.id !== medicineId)
    }));
  };


  const handleAddClinicalNote = (e) => {
    e.preventDefault();
    
    const newNote = {
      id: `CN${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      author: 'Current User', // In real app, get from auth context
      authorRole: 'Urology Nurse', // In real app, get from user role
      type: activeNoteTab,
      priority: clinicalNotesForm.priority,
      note: clinicalNotesForm.note,
      vitals: activeNoteTab === 'vitals' ? {
        bloodPressure: clinicalNotesForm.bloodPressure,
        heartRate: clinicalNotesForm.heartRate,
        temperature: clinicalNotesForm.temperature,
        weight: clinicalNotesForm.weight,
        height: clinicalNotesForm.height,
        oxygenSaturation: clinicalNotesForm.oxygenSaturation
      } : null,
      medicine: activeNoteTab === 'medicine' ? clinicalNotesForm.medicines : null
    };

    setClinicalNotes(prev => [newNote, ...prev]);
    setClinicalNotesForm({
      note: '',
      priority: 'normal',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      medicines: [{
        id: Date.now(),
        medicineName: '',
        dosage: '',
        frequency: '',
        taken: false,
        sideEffects: '',
        compliance: 'good'
      }]
    });
    setIsClinicalNotesModalOpen(false);
  };

  const closeClinicalNotesModal = () => {
    setIsClinicalNotesModalOpen(false);
    setActiveNoteTab('general');
    setClinicalNotesForm({
      note: '',
      priority: 'normal',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      medicines: [{
        id: Date.now(),
        medicineName: '',
        dosage: '',
        frequency: '',
        taken: false,
        sideEffects: '',
        compliance: 'good'
      }]
    });
  };


  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      setPsaChartFilter('6months');
    }
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User, count: 1, active: activeTab === 'overview' },
    { id: 'mdt-notes', name: 'MDT Notes', icon: Users, count: 2, active: activeTab === 'mdt-notes' },
    { id: 'discharge', name: 'Discharge Summaries', icon: FileText, count: 1, active: activeTab === 'discharge' }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95vw] h-[95vh] min-h-[450px] max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-gray-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {mockPatient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{mockPatient.name}</h1>
              <div className="flex items-center space-x-2 mt-0.5">
              <p className="text-sm text-gray-600">UPI: {mockPatient.id}</p>
                <span className="text-gray-300">•</span>
                <p className="text-sm text-gray-600">Age: {calculateAge(mockPatient.dob)} years</p>
                <span className="text-gray-300">•</span>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  {mockPatient.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Tab Navigation */}
        <div className="border-b border-gray-200 bg-white flex-shrink-0 shadow-sm">
          <div className="px-6">
            <div 
              className="flex items-center space-x-0 overflow-x-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex items-center space-x-2 px-5 py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap border-b-2 ${
                      tab.active
                        ? 'text-green-700 border-green-600 bg-green-50/30 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 transition-colors duration-200 ${
                      tab.active ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    <span className="font-semibold tracking-wide">{tab.name}</span>
                    <div className={`flex items-center justify-center min-w-[22px] h-5 px-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      tab.active
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300 group-hover:text-gray-700'
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
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 180px)', minHeight: '250px' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="h-full flex">
              {/* Left Component - Clinical Notes */}
              <div className="w-1/2 h-full flex flex-col border-r border-gray-200">
                {/* Add Note Section - Non-scrollable */}
                {userRole !== 'gp' && (
                  <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 text-base flex items-center mb-3">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      Clinical Notes
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                      <textarea
                        value={clinicalNotesForm.note}
                        onChange={(e) => setClinicalNotesForm({ ...clinicalNotesForm, note: e.target.value })}
                        placeholder="Add a clinical note..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows="2"
                      />
                      
                      <div className="flex items-center justify-between mt-2">
                        <select
                          value={clinicalNotesForm.priority}
                          onChange={(e) => setClinicalNotesForm({ ...clinicalNotesForm, priority: e.target.value })}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="normal">Normal Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        <button
                          onClick={() => {
                            if (clinicalNotesForm.note.trim()) {
                              const now = new Date();
                              const newNote = {
                                id: `CN${Date.now()}`,
                                timestamp: now.toISOString(),
                                date: now.toISOString().split('T')[0],
                                time: now.toTimeString().slice(0, 5),
                                author: userRole === 'urologist' ? 'Dr. Sarah Wilson' : 'Jennifer Lee',
                                authorRole: userRole === 'urologist' ? 'Urologist' : 'Urology Nurse',
                                type: 'general',
                                priority: clinicalNotesForm.priority,
                                note: clinicalNotesForm.note,
                                vitals: null,
                                medicine: null
                              };
                              
                              setClinicalNotes(prev => [newNote, ...prev]);
                              setSuccessMessage('Clinical note added successfully!');
                              setIsSuccessModalOpen(true);
                              
                              setClinicalNotesForm({ 
                                note: '', 
                                priority: 'normal',
                                medicines: [{
                                  id: Date.now(),
                                  medicineName: '',
                                  dosage: '',
                                  frequency: '',
                                  taken: false,
                                  sideEffects: '',
                                  compliance: 'good'
                                }]
                              });
                            }
                          }}
                          className="flex items-center px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!clinicalNotesForm.note.trim()}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                  <h4 className="font-medium text-gray-700 text-sm mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Notes Timeline
                  </h4>
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-green-200 to-gray-200"></div>
                    
                    <div className="space-y-4">
                      {clinicalNotes.map((note, index) => {
                        const isToday = note.date === new Date().toISOString().split('T')[0];
                        const isRecent = index < 2;
                      
                        return (
                          <div key={note.id} className="relative flex items-start space-x-4">
                            {/* Timeline Dot */}
                            <div className="relative flex-shrink-0">
                              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white ${
                                isRecent ? 'ring-2 ring-blue-300' : ''
                              } bg-blue-500`}>
                                <FileText className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          
                            {/* Note Card */}
                            <div className={`flex-1 bg-white border rounded-lg p-3 transition-all duration-200 ${
                              isRecent ? 'border-blue-200 shadow-sm' : 'border-gray-200'
                            }`}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                                      note.authorRole === 'Urologist' ? 'bg-blue-600' : 'bg-green-600'
                                    }`}>
                                      {note.author.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <span className="font-semibold text-gray-900 text-sm">{note.author}</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                                      note.authorRole === 'Urologist' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                      {note.authorRole}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{isToday ? 'Today' : formatDate(note.date)} at {note.time}</span>
                                    {isToday && (
                                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                        New
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                  note.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                  note.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)}
                                </span>
                              </div>
                            
                              <p className="text-sm text-gray-700 leading-relaxed">{note.note}</p>
                            </div>
                          </div>
                        );
                      })}
                      
                      {clinicalNotes.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No clinical notes yet</p>
                          {userRole !== 'gp' && (
                            <p className="text-xs mt-1">Add your first note above</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Component - PSA & Test Results */}
              <div className="w-1/2 h-full flex flex-col overflow-y-auto p-6 bg-gray-50" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                {/* PSA Details - Compact */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-base flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-green-600" />
                        PSA Monitoring
                      </h3>
                      <button
                        onClick={() => setIsPSAModalOpen(true)}
                        className="flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </button>
                    </div>

                    {/* Latest PSA Value - Compact */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <Heart className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-gray-600 uppercase">Latest PSA</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{mockPatient.lastPSA.value} <span className="text-xs font-normal text-gray-600">ng/mL</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Test Date</p>
                          <p className="text-xs font-medium text-gray-700">{formatDate(mockPatient.lastPSA.date)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Latest Test Results - Simple List */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-base flex items-center">
                        <Database className="h-4 w-4 mr-2 text-blue-600" />
                        Test Results
                      </h3>
                      <button
                        onClick={() => setIsTestResultsModalOpen(true)}
                        className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View All
                      </button>
                    </div>

                    {/* Simple Test List */}
                    <div className="space-y-2">
                      {/* Latest Imaging */}
                      {mockPatient.imaging.slice(0, 1).map((img) => (
                        <div key={img.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded border">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{img.type}</p>
                            <p className="text-xs text-gray-500">{formatDate(img.date)}</p>
                          </div>
                          <button
                            onClick={() => setIsTestResultsModalOpen(true)}
                            className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </button>
                        </div>
                      ))}

                      {/* Latest Procedure */}
                      {mockPatient.procedures.slice(0, 1).map((proc) => (
                        <div key={proc.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded border">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{proc.type}</p>
                            <p className="text-xs text-gray-500">{formatDate(proc.date)}</p>
                          </div>
                          <button
                            onClick={() => setIsTestResultsModalOpen(true)}
                            className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </button>
                        </div>
                      ))}

                      {/* Add more tests if needed - simple list format */}
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded border">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Blood Work</p>
                          <p className="text-xs text-gray-500">{formatDate(mockPatient.lastPSA.date)}</p>
                        </div>
                        <button
                          onClick={() => setIsTestResultsModalOpen(true)}
                          className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}



          {activeTab === 'mdt-notes' && (
            <div className="h-full overflow-y-auto p-6 space-y-8" style={{ maxHeight: 'calc(100vh - 350px)' }}>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">MDT Notes Timeline</h3>
                <p className="text-sm text-gray-600 mt-1">Multidisciplinary team discussions, decisions, and outcomes</p>
              </div>

              {/* MDT Notes Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-200 to-blue-200"></div>
                <div className="space-y-8">
                  {mockPatient.mdtNotes.map((mdtNote, index) => {
                    const getPriorityColor = (priority) => {
                      switch (priority) {
                        case 'High': return 'bg-red-100 text-red-800 border-red-200';
                        case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        case 'Low': return 'bg-green-100 text-green-800 border-green-200';
                        default: return 'bg-gray-100 text-gray-800 border-gray-200';
                      }
                    };

                    const getStatusColor = (status) => {
                      switch (status) {
                        case 'Review Complete': return 'bg-green-100 text-green-800';
                        case 'Under Review': return 'bg-yellow-100 text-yellow-800';
                        case 'Pending Review': return 'bg-blue-100 text-blue-800';
                        default: return 'bg-gray-100 text-gray-800';
                      }
                    };

                    const getOutcomeColor = (outcome) => {
                      switch (outcome) {
                        case 'Proceed to Surgery': return 'bg-red-100 text-red-800';
                        case 'Active Monitoring': return 'bg-green-100 text-green-800';
                        case 'Radiation Therapy': return 'bg-purple-100 text-purple-800';
                        case 'Systemic Therapy': return 'bg-orange-100 text-orange-800';
                        default: return 'bg-gray-100 text-gray-800';
                      }
                    };

                    return (
                      <div key={mdtNote.id} className="relative flex items-start space-x-4">
                        <div className="relative z-10 w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-gray-900 text-lg">MDT Discussion</h4>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(mdtNote.priority)}`}>
                                  {mdtNote.priority} Priority
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mdtNote.status)}`}>
                                  {mdtNote.status}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(mdtNote.mdtDate)} at {mdtNote.time}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="font-medium text-gray-700">{mdtNote.caseType}</span>
                              </div>
                            </div>
                          </div>

                          {/* Team Members */}
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Team Members</h5>
                            <div className="flex flex-wrap gap-2">
                              {mdtNote.teamMembers.map((member, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                                  {member}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Discussion Notes */}
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Discussion Notes</h5>
                            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                              {mdtNote.discussionNotes}
                            </p>
                          </div>

                          {/* Outcome */}
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">MDT Outcome</h5>
                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getOutcomeColor(mdtNote.outcome)}`}>
                              {mdtNote.outcome}
                            </span>
                          </div>

                          {/* Recommendations */}
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Recommendations</h5>
                            <p className="text-sm text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">
                              {mdtNote.recommendations}
                            </p>
                          </div>

                          {/* Follow-up Actions */}
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Follow-up Actions</h5>
                            <ul className="space-y-1">
                              {mdtNote.followUpActions.map((action, idx) => (
                                <li key={idx} className="flex items-center text-sm text-gray-700">
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Documents */}
                          {mdtNote.documents && mdtNote.documents.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">Documents</h5>
                              <div className="flex flex-wrap gap-2">
                                {mdtNote.documents.map((doc, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => console.log('Download:', doc)}
                                    className="flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    {doc}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MDT Notes Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Notes Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      {mockPatient.mdtNotes.length}
                    </p>
                    <p className="text-sm font-medium text-gray-700">Total MDT Reviews</p>
                    <p className="text-xs text-gray-500 mt-1">Team discussions</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">
                      {mockPatient.mdtNotes.filter(note => note.status === 'Review Complete').length}
                    </p>
                    <p className="text-sm font-medium text-gray-700">Completed Reviews</p>
                    <p className="text-xs text-gray-500 mt-1">Decisions made</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">
                      {mockPatient.mdtNotes.filter(note => note.outcome === 'Proceed to Surgery').length}
                    </p>
                    <p className="text-sm font-medium text-gray-700">Surgical Decisions</p>
                    <p className="text-xs text-gray-500 mt-1">Surgery recommended</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">
                      {mockPatient.mdtNotes.filter(note => note.outcome === 'Active Monitoring').length}
                    </p>
                    <p className="text-sm font-medium text-gray-700">Monitoring Cases</p>
                    <p className="text-xs text-gray-500 mt-1">Continued monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'discharge' && (
            <div className="h-full overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(100vh - 350px)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-base">Discharge Summaries</h3>
                {userRole !== 'gp' && (
                  <button
                    onClick={() => setIsDischargeModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Discharge Summary
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {dischargeSummaries.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {dischargeSummaries.map((summary, index) => (
                      <div key={summary.id} className="relative flex items-start space-x-6 pb-8">
                        <div className="relative flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-sm border border-gray-200">
                            <span className="text-xs font-semibold text-gray-700">{summary.id}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="p-6">
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
                                  {userRole !== 'gp' && (
                                    <button
                                      onClick={() => handleEditDischarge(summary)}
                                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                      title="Edit discharge summary"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                  )}
                                  {userRole !== 'gp' && (
                                    <button
                                      onClick={() => removeDischargeSummary(summary.id)}
                                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                      title="Remove discharge summary"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  {summary.readmissionRisk}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Clinical Summary
                              </h5>
                              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {summary.summary}
                              </p>
                            </div>

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

        {/* Decision Buttons - Only for Urologists */}
        {userRole === 'urologist' && (
          <div className="border-t border-gray-200 bg-white flex-shrink-0 py-6 px-4">
            <div className="flex items-center justify-center gap-6">
              <h3 className="text-lg font-semibold text-gray-800">Transfer to:</h3>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => {
                    setSelectedPathway('Active Monitoring');
                    setIsPathwayModalOpen(true);
                  }}
                  className="group flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center mb-1 sm:mb-2 md:mb-3 group-hover:bg-blue-700 transition-colors duration-300">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-blue-800 text-center leading-tight">Active<br />Monitoring</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedPathway('Surgery Pathway');
                    setIsPathwayModalOpen(true);
                  }}
                  className="group flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl hover:border-purple-400 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-600 rounded-full flex items-center justify-center mb-1 sm:mb-2 md:mb-3 group-hover:bg-purple-700 transition-colors duration-300">
                    <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-purple-800 text-center leading-tight">Surgery<br />Pathway</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedPathway('Medication');
                    setIsPathwayModalOpen(true);
                  }}
                  className="group flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl hover:border-orange-400 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-600 rounded-full flex items-center justify-center mb-1 sm:mb-2 md:mb-3 group-hover:bg-orange-700 transition-colors duration-300">
                    <Pill className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-orange-800 text-center leading-tight">Medication</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedPathway('Radiotherapy');
                    setIsPathwayModalOpen(true);
                  }}
                  className="group flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl hover:border-red-400 hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-600 rounded-full flex items-center justify-center mb-1 sm:mb-2 md:mb-3 group-hover:bg-red-700 transition-colors duration-300">
                    <Radiation className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-red-800 text-center leading-tight">Radiotherapy</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedPathway('Discharge');
                    setIsPathwayModalOpen(true);
                  }}
                  className="group flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl hover:border-green-400 hover:from-green-100 hover:to-green-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-600 rounded-full flex items-center justify-center mb-1 sm:mb-2 md:mb-3 group-hover:bg-green-700 transition-colors duration-300">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-green-800 text-center leading-tight">Discharge</span>
                </button>
              </div>
            </div>
          </div>
        )}

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
                    onClick={addClinicalHistoryMedication}
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
                          onClick={() => removeClinicalHistoryMedication(index)}
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

      {/* Add Clinical Note Modal */}
      {isClinicalNotesModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Clinical Note</h2>
              <button
                onClick={closeClinicalNotesModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveNoteTab('general')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeNoteTab === 'general'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>General Info</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveNoteTab('vitals')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeNoteTab === 'vitals'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Vital Signs</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveNoteTab('medicine')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeNoteTab === 'medicine'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Pill className="h-4 w-4" />
                    <span>Medicine Details</span>
                  </div>
                </button>
              </nav>
            </div>

            <form onSubmit={handleAddClinicalNote} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* General Info Tab */}
              {activeNoteTab === 'general' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">General Clinical Note</h3>
                    <p className="text-sm text-blue-700">Record general observations, assessments, and clinical findings.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={clinicalNotesForm.priority}
                      onChange={handleClinicalNotesFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinical Note *
                    </label>
                    <textarea
                      name="note"
                      value={clinicalNotesForm.note}
                      onChange={handleClinicalNotesFormChange}
                      required
                      rows={6}
                      placeholder="Enter detailed clinical note... Include relevant observations, assessments, interventions, and any important information for the care team."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Be specific and include relevant clinical details, patient responses, and any follow-up actions needed.
                    </p>
                  </div>
                </div>
              )}

              {/* Vitals Tab */}
              {activeNoteTab === 'vitals' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Vital Signs Recording</h3>
                    <p className="text-sm text-green-700">Record patient's vital signs and physical measurements.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={clinicalNotesForm.priority}
                      onChange={handleClinicalNotesFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Pressure
                      </label>
                      <input
                        type="text"
                        name="bloodPressure"
                        value={clinicalNotesForm.bloodPressure}
                        onChange={handleClinicalNotesFormChange}
                        placeholder="e.g., 120/80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        name="heartRate"
                        value={clinicalNotesForm.heartRate}
                        onChange={handleClinicalNotesFormChange}
                        placeholder="e.g., 72"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature
                      </label>
                      <input
                        type="text"
                        name="temperature"
                        value={clinicalNotesForm.temperature}
                        onChange={handleClinicalNotesFormChange}
                        placeholder="e.g., 36.5°C or 98.6°F"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="note"
                      value={clinicalNotesForm.note}
                      onChange={handleClinicalNotesFormChange}
                      rows={4}
                      placeholder="Any additional observations about the patient's condition, symptoms, or responses..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              )}

              {/* Medicine Tab */}
              {activeNoteTab === 'medicine' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Medication Administration</h3>
                    <p className="text-sm text-purple-700">Record medication details, administration, and patient compliance.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={clinicalNotesForm.priority}
                      onChange={handleClinicalNotesFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Medicines List */}
                  <div className="space-y-4">
                    {clinicalNotesForm.medicines.map((medicine, index) => (
                      <div key={medicine.id} className="bg-purple-25 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-purple-800">
                            Medicine #{index + 1}
                          </h4>
                          {clinicalNotesForm.medicines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedicine(medicine.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Medicine Name *
                            </label>
                            <input
                              type="text"
                              value={medicine.medicineName}
                              onChange={(e) => handleMedicineChange(medicine.id, 'medicineName', e.target.value)}
                              required
                              placeholder="e.g., Tamsulosin 0.4mg"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Dosage
                            </label>
                            <input
                              type="text"
                              value={medicine.dosage}
                              onChange={(e) => handleMedicineChange(medicine.id, 'dosage', e.target.value)}
                              placeholder="e.g., 0.4mg"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Frequency
                            </label>
                            <input
                              type="text"
                              value={medicine.frequency}
                              onChange={(e) => handleMedicineChange(medicine.id, 'frequency', e.target.value)}
                              placeholder="e.g., Once daily"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Compliance
                            </label>
                            <select
                              value={medicine.compliance}
                              onChange={(e) => handleMedicineChange(medicine.id, 'compliance', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="excellent">Excellent</option>
                              <option value="good">Good</option>
                              <option value="fair">Fair</option>
                              <option value="poor">Poor</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={medicine.taken}
                              onChange={(e) => handleMedicineChange(medicine.id, 'taken', e.target.checked)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">Medication Taken</span>
                          </label>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Side Effects
                          </label>
                          <textarea
                            value={medicine.sideEffects}
                            onChange={(e) => handleMedicineChange(medicine.id, 'sideEffects', e.target.value)}
                            rows={2}
                            placeholder="Record any side effects or adverse reactions..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add Medicine Button */}
                    <button
                      type="button"
                      onClick={addMedicine}
                      className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Medicine
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="note"
                      value={clinicalNotesForm.note}
                      onChange={handleClinicalNotesFormChange}
                      rows={4}
                      placeholder="Any additional observations about medication administration, patient response, or instructions given..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Preview Section */}
              {clinicalNotesForm.note && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Note Preview:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Category:</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getClinicalNotesTypeColor(activeNoteTab)}`}>
                        {activeNoteTab.charAt(0).toUpperCase() + activeNoteTab.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Priority:</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(clinicalNotesForm.priority)}`}>
                        {clinicalNotesForm.priority.charAt(0).toUpperCase() + clinicalNotesForm.priority.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Time:</span>
                      <span className="text-sm text-gray-900">{new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeClinicalNotesModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add {activeNoteTab === 'general' ? 'General Note' : activeNoteTab === 'vitals' ? 'Vital Signs' : 'Medication Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Personal Info Modal */}
      {isEditPersonalInfoModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Personal Information</h3>
              <button
                onClick={() => setIsEditPersonalInfoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editPersonalInfoForm.name || ''}
                  onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editPersonalInfoForm.dob || ''}
                  onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, dob: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicare Number</label>
                <input
                  type="text"
                  value={editPersonalInfoForm.medicare || ''}
                  onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, medicare: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPersonalInfoForm.phone || ''}
                  onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={editPersonalInfoForm.address || ''}
                  onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={editPersonalInfoForm.emergencyContact || ''}
                  onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, emergencyContact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  value={editPersonalInfoForm.emergencyPhone || ''}
                  onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, emergencyPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditPersonalInfoModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would typically save the changes to your backend
                  console.log('Saving personal info:', editPersonalInfoForm);
                  setIsEditPersonalInfoModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit PSA Modal */}
      {isEditPSAModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit PSA Test</h3>
              <button
                onClick={() => setIsEditPSAModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Date</label>
                <input
                  type="date"
                  value={editPSAForm.date || ''}
                  onChange={(e) => setEditPSAForm({...editPSAForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PSA Value (ng/mL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editPSAForm.value || ''}
                  onChange={(e) => setEditPSAForm({...editPSAForm, value: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                <select
                  value={editPSAForm.type || ''}
                  onChange={(e) => setEditPSAForm({...editPSAForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select test type</option>
                  <option value="baseline">Baseline</option>
                  <option value="routine">Routine</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditPSAModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Saving PSA test:', editPSAForm);
                  setIsEditPSAModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {isEditAppointmentModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
              <button
                onClick={() => setIsEditAppointmentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editAppointmentForm.date || ''}
                  onChange={(e) => setEditAppointmentForm({...editAppointmentForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={editAppointmentForm.time || ''}
                  onChange={(e) => setEditAppointmentForm({...editAppointmentForm, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={editAppointmentForm.type || ''}
                  onChange={(e) => setEditAppointmentForm({...editAppointmentForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Test">Test</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <input
                  type="text"
                  value={editAppointmentForm.doctor || ''}
                  onChange={(e) => setEditAppointmentForm({...editAppointmentForm, doctor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editAppointmentForm.status || ''}
                  onChange={(e) => setEditAppointmentForm({...editAppointmentForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editAppointmentForm.notes || ''}
                  onChange={(e) => setEditAppointmentForm({...editAppointmentForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditAppointmentModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Saving appointment:', editAppointmentForm);
                  setIsEditAppointmentModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Clinical Note Modal */}
      {isEditClinicalNoteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Edit Clinical Note</h3>
                    <p className="text-sm text-gray-600">Update clinical note details and information</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditClinicalNoteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editClinicalNoteForm.priority || ''}
                    onChange={(e) => setEditClinicalNoteForm({...editClinicalNoteForm, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editClinicalNoteForm.type || ''}
                    onChange={(e) => setEditClinicalNoteForm({...editClinicalNoteForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select type</option>
                    <option value="general">General Info</option>
                    <option value="vitals">Vital Signs</option>
                    <option value="medicine">Medicine Details</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Note</label>
                <textarea
                  value={editClinicalNoteForm.note || ''}
                  onChange={(e) => setEditClinicalNoteForm({...editClinicalNoteForm, note: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter clinical note details..."
                />
              </div>
              
              {/* Vitals Section */}
              {editClinicalNoteForm.type === 'vitals' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="h-3 w-3 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">Vital Signs</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Blood Pressure</label>
                      <input
                        type="text"
                        value={editClinicalNoteForm.vitals?.bloodPressure || ''}
                        onChange={(e) => setEditClinicalNoteForm({
                          ...editClinicalNoteForm,
                          vitals: {...editClinicalNoteForm.vitals, bloodPressure: e.target.value}
                        })}
                        placeholder="120/80"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Heart Rate</label>
                      <input
                        type="number"
                        value={editClinicalNoteForm.vitals?.heartRate || ''}
                        onChange={(e) => setEditClinicalNoteForm({
                          ...editClinicalNoteForm,
                          vitals: {...editClinicalNoteForm.vitals, heartRate: e.target.value}
                        })}
                        placeholder="72"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Temperature</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editClinicalNoteForm.vitals?.temperature || ''}
                        onChange={(e) => setEditClinicalNoteForm({
                          ...editClinicalNoteForm,
                          vitals: {...editClinicalNoteForm.vitals, temperature: e.target.value}
                        })}
                        placeholder="98.6"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Medicine Section */}
              {editClinicalNoteForm.type === 'medicine' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <Pill className="h-3 w-3 text-orange-600" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-700">Medicine Details</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newMedicine = [...(editClinicalNoteForm.medicine || []), {
                          name: '',
                          dosage: '',
                          frequency: '',
                          compliance: '',
                          taken: false,
                          sideEffects: ''
                        }];
                        setEditClinicalNoteForm({...editClinicalNoteForm, medicine: newMedicine});
                      }}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-orange-600 bg-orange-100 border border-orange-200 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Medicine
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {editClinicalNoteForm.medicine?.map((med, index) => (
                      <div key={index} className="bg-white border border-orange-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h5 className="text-sm font-medium text-gray-700">Medicine {index + 1}</h5>
                          <button
                            type="button"
                            onClick={() => {
                              const newMedicine = editClinicalNoteForm.medicine.filter((_, i) => i !== index);
                              setEditClinicalNoteForm({
                                ...editClinicalNoteForm,
                                medicine: newMedicine
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                            title="Remove medicine"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Medicine Name</label>
                            <input
                              type="text"
                              value={med.name || ''}
                              onChange={(e) => {
                                const newMedicine = [...editClinicalNoteForm.medicine];
                                newMedicine[index] = {...med, name: e.target.value};
                                setEditClinicalNoteForm({...editClinicalNoteForm, medicine: newMedicine});
                              }}
                              placeholder="Enter medicine name"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Dosage</label>
                            <input
                              type="text"
                              value={med.dosage || ''}
                              onChange={(e) => {
                                const newMedicine = [...editClinicalNoteForm.medicine];
                                newMedicine[index] = {...med, dosage: e.target.value};
                                setEditClinicalNoteForm({...editClinicalNoteForm, medicine: newMedicine});
                              }}
                              placeholder="e.g., 500mg"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                            <input
                              type="text"
                              value={med.frequency || ''}
                              onChange={(e) => {
                                const newMedicine = [...editClinicalNoteForm.medicine];
                                newMedicine[index] = {...med, frequency: e.target.value};
                                setEditClinicalNoteForm({...editClinicalNoteForm, medicine: newMedicine});
                              }}
                              placeholder="e.g., Twice daily"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Compliance</label>
                            <select
                              value={med.compliance || ''}
                              onChange={(e) => {
                                const newMedicine = [...editClinicalNoteForm.medicine];
                                newMedicine[index] = {...med, compliance: e.target.value};
                                setEditClinicalNoteForm({...editClinicalNoteForm, medicine: newMedicine});
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            >
                              <option value="">Select compliance</option>
                              <option value="Good">Good</option>
                              <option value="Fair">Fair</option>
                              <option value="Poor">Poor</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`taken-${index}`}
                            checked={med.taken || false}
                            onChange={(e) => {
                              const newMedicine = [...editClinicalNoteForm.medicine];
                              newMedicine[index] = {...med, taken: e.target.checked};
                              setEditClinicalNoteForm({...editClinicalNoteForm, medicine: newMedicine});
                            }}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`taken-${index}`} className="text-sm text-gray-700">
                            Medicine taken as prescribed
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Side Effects</label>
                          <input
                            type="text"
                            value={med.sideEffects || ''}
                            onChange={(e) => {
                              const newMedicine = [...editClinicalNoteForm.medicine];
                              newMedicine[index] = {...med, sideEffects: e.target.value};
                              setEditClinicalNoteForm({...editClinicalNoteForm, medicine: newMedicine});
                            }}
                            placeholder="Describe any side effects"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditClinicalNoteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Saving clinical note:', editClinicalNoteForm);
                    setIsEditClinicalNoteModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Imaging Modal */}
      {isEditImagingModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Edit Imaging/Procedure</h3>
                    <p className="text-sm text-gray-600">Update imaging study or procedure details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditImagingModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={editImagingForm.date || ''}
                    onChange={(e) => setEditImagingForm({...editImagingForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editImagingForm.type || ''}
                    onChange={(e) => setEditImagingForm({...editImagingForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select type</option>
                    <option value="MRI">MRI</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="Biopsy">Biopsy</option>
                    <option value="Surgery">Surgery</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="PET Scan">PET Scan</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editImagingForm.title || ''}
                  onChange={(e) => setEditImagingForm({...editImagingForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter imaging/procedure title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Findings</label>
                <textarea
                  value={editImagingForm.findings || ''}
                  onChange={(e) => setEditImagingForm({...editImagingForm, findings: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe the findings from the imaging study or procedure..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                <textarea
                  value={editImagingForm.recommendations || ''}
                  onChange={(e) => setEditImagingForm({...editImagingForm, recommendations: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter recommendations based on the findings..."
                />
              </div>
              
              {/* Document Management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Documents</label>
                <div className="space-y-3">
                  {/* Existing Documents */}
                  {editImagingForm.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">PDF Document</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            const newDocuments = editImagingForm.documents.filter((_, i) => i !== index);
                            setEditImagingForm({...editImagingForm, documents: newDocuments});
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                          title="Remove document"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Document */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Add Document</p>
                      <p className="text-xs text-gray-500 mb-3">Upload PDF, images, or other files</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const newDocuments = [...(editImagingForm.documents || []), {
                              name: file.name,
                              file: file,
                              type: file.type
                            }];
                            setEditImagingForm({...editImagingForm, documents: newDocuments});
                          }
                        }}
                        className="hidden"
                        id="document-upload"
                      />
                      <label
                        htmlFor="document-upload"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Choose File
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditImagingModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Saving imaging/procedure:', editImagingForm);
                    setIsEditImagingModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Clinical History Modal */}
      {isEditClinicalHistoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Clinical History</h3>
              <button
                onClick={() => setIsEditClinicalHistoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editClinicalHistoryForm.date || ''}
                  onChange={(e) => setEditClinicalHistoryForm({...editClinicalHistoryForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={editClinicalHistoryForm.type || ''}
                  onChange={(e) => setEditClinicalHistoryForm({...editClinicalHistoryForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="Diagnosis">Diagnosis</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editClinicalHistoryForm.title || ''}
                  onChange={(e) => setEditClinicalHistoryForm({...editClinicalHistoryForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <textarea
                  value={editClinicalHistoryForm.details || ''}
                  onChange={(e) => setEditClinicalHistoryForm({...editClinicalHistoryForm, details: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Practitioner</label>
                <input
                  type="text"
                  value={editClinicalHistoryForm.practitioner || ''}
                  onChange={(e) => setEditClinicalHistoryForm({...editClinicalHistoryForm, practitioner: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Findings</label>
                <textarea
                  value={editClinicalHistoryForm.findings || ''}
                  onChange={(e) => setEditClinicalHistoryForm({...editClinicalHistoryForm, findings: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommendations</label>
                <textarea
                  value={editClinicalHistoryForm.recommendations || ''}
                  onChange={(e) => setEditClinicalHistoryForm({...editClinicalHistoryForm, recommendations: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medications</label>
                <div className="space-y-3">
                  {editClinicalHistoryForm.medications?.map((medication, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Pill className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <input
                        type="text"
                        value={medication}
                        onChange={(e) => {
                          const newMedications = [...editClinicalHistoryForm.medications];
                          newMedications[index] = e.target.value;
                          setEditClinicalHistoryForm({...editClinicalHistoryForm, medications: newMedications});
                        }}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter medication name and dosage"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newMedications = editClinicalHistoryForm.medications.filter((_, i) => i !== index);
                          setEditClinicalHistoryForm({...editClinicalHistoryForm, medications: newMedications});
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                        title="Remove medication"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newMedications = [...(editClinicalHistoryForm.medications || []), ''];
                      setEditClinicalHistoryForm({...editClinicalHistoryForm, medications: newMedications});
                    }}
                    className="w-full py-2 px-3 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    + Add Medication
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditClinicalHistoryModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Saving clinical history:', editClinicalHistoryForm);
                  setIsEditClinicalHistoryModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Discharge Modal */}
      {isEditDischargeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Discharge Summary</h3>
              <button
                onClick={() => setIsEditDischargeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discharge Date</label>
                  <input
                    type="date"
                    value={editDischargeForm.dischargeDate || ''}
                    onChange={(e) => setEditDischargeForm({...editDischargeForm, dischargeDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
                  <input
                    type="text"
                    value={editDischargeForm.procedure || ''}
                    onChange={(e) => setEditDischargeForm({...editDischargeForm, procedure: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={editDischargeForm.diagnosis || ''}
                  onChange={(e) => setEditDischargeForm({...editDischargeForm, diagnosis: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discharge Notes</label>
                <textarea
                  value={editDischargeForm.dischargeNotes || ''}
                  onChange={(e) => setEditDischargeForm({...editDischargeForm, dischargeNotes: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Instructions</label>
                <textarea
                  value={editDischargeForm.followUpInstructions || ''}
                  onChange={(e) => setEditDischargeForm({...editDischargeForm, followUpInstructions: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pre-op PSA</label>
                  <input
                    type="text"
                    value={editDischargeForm.psaPreOp || ''}
                    onChange={(e) => setEditDischargeForm({...editDischargeForm, psaPreOp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post-op PSA</label>
                  <input
                    type="text"
                    value={editDischargeForm.psaPostOp || ''}
                    onChange={(e) => setEditDischargeForm({...editDischargeForm, psaPostOp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditDischargeModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Saving discharge summary:', editDischargeForm);
                  setIsEditDischargeModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pathway Transfer Confirmation Modal */}
      {isPathwayModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 px-6 pt-6 pb-5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
              
              {/* Warning Icon */}
              <div className="relative flex justify-center mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <AlertCircle className="h-7 w-7 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 bg-white rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-white text-center mb-1">
                Confirm Pathway Transfer
              </h3>
              <p className="text-orange-50 text-center text-xs">
                This action will change the patient's care pathway
              </p>
              
              <button
                onClick={() => {
                  setIsPathwayModalOpen(false);
                  setSelectedPathway('');
                  setTransferNote('');
                  setAppointmentBooking({
                    enabled: false,
                    appointmentDate: '',
                    appointmentTime: '',
                    appointmentType: 'Follow-up',
                    duration: 30,
                    notes: ''
                  });
                  setRecurringAppointments({
                    enabled: false,
                    interval: '1',
                    intervalType: 'months',
                    totalDuration: '12',
                    durationType: 'months',
                    notes: ''
                  });
                }}
                className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-900">Patient</p>
                    <p className="text-sm text-blue-700 font-semibold">{mockPatient.name} ({mockPatient.id})</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowRightCircle className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-900">New Pathway</p>
                    <p className="text-sm text-green-800 font-bold">{selectedPathway}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900">
                    <span className="font-semibold">Please confirm:</span> Transferring this patient will update their care pathway and may trigger notifications to the care team.
                  </p>
                </div>
              </div>

              {/* Conditional Content Based on Pathway */}
              {selectedPathway === 'Medication' && (
                <>
                  {/* Medication Details Section */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                            <Pill className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Medication Details</h4>
                            <p className="text-sm text-gray-600">Prescribe medications for patient</p>
                          </div>
                        </div>
                        <button
                          onClick={addMedication}
                          className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Medication
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {medicationDetails.medications.map((medication, index) => (
                          <div key={medication.id} className="bg-white border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-gray-900">Medication {index + 1}</h5>
                              {medicationDetails.medications.length > 1 && (
                                <button
                                  onClick={() => removeMedication(medication.id)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Medication Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={medication.name}
                                  onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                                  placeholder="Enter medication name..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Dosage <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={medication.dosage}
                                  onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                                  placeholder="e.g., 5mg, 10ml"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Frequency <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={medication.frequency}
                                  onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                                  placeholder="e.g., Once daily, Twice daily"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  value={medication.duration}
                                  onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                                  placeholder="e.g., 30 days, 3 months"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Special Instructions
                              </label>
                              <textarea
                                value={medication.instructions}
                                onChange={(e) => updateMedication(medication.id, 'instructions', e.target.value)}
                                placeholder="Any special instructions for taking this medication..."
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Follow-up Appointment for Medication */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Follow-up Appointment</h4>
                          <p className="text-sm text-gray-600">Schedule medication review appointment</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Appointment Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={medicationDetails.appointmentDate}
                            onChange={(e) => setMedicationDetails(prev => ({ ...prev, appointmentDate: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Appointment Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={medicationDetails.appointmentTime}
                            onChange={(e) => setMedicationDetails(prev => ({ ...prev, appointmentTime: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Appointment Notes
                        </label>
                        <textarea
                          value={medicationDetails.notes}
                          onChange={(e) => setMedicationDetails(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Add any notes for the follow-up appointment..."
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Discharge Pathway Content */}
              {selectedPathway === 'Discharge' && (
                <>
              {/* Discharge Details Section */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Discharge Details</h4>
                      <p className="text-sm text-gray-600">Final discharge information</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discharge Reason <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={transferDetails.reason}
                      onChange={(e) => setTransferDetails(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Enter reason for discharge..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinical Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={transferDetails.clinicalRationale}
                      onChange={(e) => setTransferDetails(prev => ({ ...prev, clinicalRationale: e.target.value }))}
                      placeholder="Provide detailed clinical summary and discharge instructions..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white shadow-sm resize-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Discharge Notes
                    </label>
                    <textarea
                      value={transferDetails.additionalNotes}
                      onChange={(e) => setTransferDetails(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      placeholder="Any additional notes, follow-up instructions, or special considerations for the patient..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white shadow-sm resize-none"
                    />
                  </div>
                </div>
              </div>
                </>
              )}

              {/* Default content for other pathways */}
              {selectedPathway !== 'Medication' && selectedPathway !== 'Discharge' && (
                <>
              {/* Transfer Details Section */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Transfer Details</h4>
                      <p className="text-sm text-gray-600">Required information for pathway transfer</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Transfer <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={transferDetails.reason}
                        onChange={(e) => setTransferDetails(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="Enter reason for transfer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transfer Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={transferDetails.priority}
                        onChange={(e) => setTransferDetails(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white shadow-sm"
                      >
                        <option value="normal">Normal Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinical Rationale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={transferDetails.clinicalRationale}
                      onChange={(e) => setTransferDetails(prev => ({ ...prev, clinicalRationale: e.target.value }))}
                      placeholder="Provide detailed clinical justification for this pathway transfer..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white shadow-sm resize-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={transferDetails.additionalNotes}
                      onChange={(e) => setTransferDetails(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      placeholder="Any additional information, patient concerns, or special considerations..."
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white shadow-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Booking Section - Not needed for Radiotherapy */}
              {selectedPathway !== 'Radiotherapy' && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Schedule Follow-up Appointment</h4>
                      <p className="text-sm text-gray-600">Required for Active Monitoring pathway</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={appointmentBooking.appointmentDate}
                        onChange={(e) => setAppointmentBooking(prev => ({ ...prev, appointmentDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={appointmentBooking.appointmentTime}
                        onChange={(e) => setAppointmentBooking(prev => ({ ...prev, appointmentTime: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={appointmentBooking.notes}
                      onChange={(e) => setAppointmentBooking(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any special instructions or notes for this appointment..."
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm resize-none"
                    />
                  </div>
                </div>
              </div>
              )}

              {/* Recurring Check-ups Section - Not needed for Radiotherapy */}
              {selectedPathway !== 'Radiotherapy' && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Set Up Regular Check-ups</h4>
                      <p className="text-sm text-gray-600">Automatically schedule follow-up appointments</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-up Frequency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={recurringAppointments.interval}
                      onChange={(e) => setRecurringAppointments(prev => ({ ...prev, interval: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white shadow-sm"
                      required
                    >
                      <option value="1">Monthly check-ups</option>
                      <option value="3">Every 3 months (Quarterly)</option>
                      <option value="6">Every 6 months (Bi-annual)</option>
                      <option value="12">Annual check-ups</option>
                    </select>
                  </div>
                  
                  <div className="bg-white border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {recurringAppointments.interval === '1' && 'Monthly Check-ups Scheduled'}
                          {recurringAppointments.interval === '3' && 'Quarterly Check-ups Scheduled'}
                          {recurringAppointments.interval === '6' && 'Bi-annual Check-ups Scheduled'}
                          {recurringAppointments.interval === '12' && 'Annual Check-ups Scheduled'}
                        </p>
                        <p className="text-xs text-gray-600">
                          The system will automatically create follow-up appointments based on your selected frequency. 
                          You'll receive notifications before each scheduled visit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
                </>
              )}
            </div>
            
            {/* Fixed Footer */}
            <div className="flex-shrink-0 p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setIsPathwayModalOpen(false);
                    setSelectedPathway('');
                    setTransferNote('');
                    setTransferDetails({
                      reason: '',
                      priority: 'normal',
                      clinicalRationale: '',
                      additionalNotes: ''
                    });
                    setAppointmentBooking({
                      appointmentDate: '',
                      appointmentTime: '',
                      notes: ''
                    });
                    setRecurringAppointments({
                      interval: '3'
                    });
                    setMedicationDetails({
                      medications: [{
                        id: Date.now(),
                        name: '',
                        dosage: '',
                        frequency: '',
                        duration: '',
                        instructions: ''
                      }],
                      appointmentDate: '',
                      appointmentTime: '',
                      notes: ''
                    });
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedPathway === 'Medication') {
                      // Validate medication fields
                      const hasValidMedications = medicationDetails.medications.every(med => 
                        med.name.trim() && med.dosage.trim() && med.frequency.trim()
                      );
                      if (!hasValidMedications) {
                        alert('Please fill in all required medication fields (name, dosage, frequency)');
                        return;
                      }
                      if (!medicationDetails.appointmentDate || !medicationDetails.appointmentTime) {
                        alert('Please schedule a follow-up appointment before confirming');
                        return;
                      }
                      // Show discharge summary modal for medication pathway
                      setIsPathwayModalOpen(false);
                      setIsDischargeSummaryModalOpen(true);
                    } else if (selectedPathway === 'Discharge') {
                      // Validation for discharge pathway
                      if (!transferDetails.reason || !transferDetails.clinicalRationale.trim()) {
                        alert('Please provide discharge reason and clinical summary before confirming');
                        return;
                      }
                      // Generate and show discharge summary
                      setIsPathwayModalOpen(false);
                      setIsDischargeSummaryModalOpen(true);
                    } else {
                      // Default validation for other pathways
                      if (!transferDetails.reason || !transferDetails.clinicalRationale.trim()) {
                        alert('Please provide reason for transfer and clinical rationale before confirming');
                        return;
                      }
                      // Appointment validation not needed for Radiotherapy
                      if (selectedPathway !== 'Radiotherapy' && (!appointmentBooking.appointmentDate || !appointmentBooking.appointmentTime)) {
                        alert('Please schedule a follow-up appointment before confirming');
                        return;
                      }
                      setSuccessMessage(`Patient successfully transferred to ${selectedPathway}`);
                      setIsPathwayModalOpen(false);
                      setIsSuccessModalOpen(true);
                    }
                    
                    // In real app, this would save to backend
                    console.log('Transferring patient to:', selectedPathway);
                    console.log('Transfer details:', transferDetails);
                    console.log('Medication details:', medicationDetails);
                    console.log('Appointment booking:', appointmentBooking);
                    console.log('Recurring appointments:', recurringAppointments);
                    
                    // Reset all states
                    setSelectedPathway('');
                    setTransferNote('');
                    setTransferDetails({
                      reason: '',
                      priority: 'normal',
                      clinicalRationale: '',
                      additionalNotes: ''
                    });
                    setMedicationDetails({
                      medications: [{
                        id: Date.now(),
                        name: '',
                        dosage: '',
                        frequency: '',
                        duration: '',
                        instructions: ''
                      }],
                      appointmentDate: '',
                      appointmentTime: '',
                      notes: ''
                    });
                    setAppointmentBooking({
                      appointmentDate: '',
                      appointmentTime: '',
                      notes: ''
                    });
                    setRecurringAppointments({
                      interval: '3'
                    });
                    setMedicationDetails({
                      medications: [{
                        id: Date.now(),
                        name: '',
                        dosage: '',
                        frequency: '',
                        duration: '',
                        instructions: ''
                      }],
                      appointmentDate: '',
                      appointmentTime: '',
                      notes: ''
                    });
                  }}
                  disabled={
                    selectedPathway === 'Medication' 
                      ? !medicationDetails.medications.every(med => med.name.trim() && med.dosage.trim() && med.frequency.trim()) || !medicationDetails.appointmentDate || !medicationDetails.appointmentTime
                      : selectedPathway === 'Discharge'
                        ? !transferDetails.reason || !transferDetails.clinicalRationale.trim()
                        : selectedPathway === 'Radiotherapy'
                          ? !transferDetails.reason || !transferDetails.clinicalRationale.trim()
                          : !transferDetails.reason || !transferDetails.clinicalRationale.trim() || !appointmentBooking.appointmentDate || !appointmentBooking.appointmentTime
                  }
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-green-700"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            {/* Header with decorative element */}
            <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-8 pt-12 pb-8">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              
              {/* Success Icon */}
              <div className="relative flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={2.5} />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-white rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-white text-center mb-2">
                Success!
              </h3>
              <p className="text-green-50 text-center text-sm">
                Your changes have been saved
              </p>
            </div>
            
            {/* Content */}
            <div className="px-8 py-6">
              <div className="flex items-start space-x-3 mb-6">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium mb-1">
                    {successMessage}
                  </p>
                  <p className="text-sm text-gray-500">
                    The information has been updated successfully and is now visible in the patient timeline.
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discharge Summary Confirmation Modal */}
      {isDischargeSummaryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 px-6 pt-6 pb-5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
              
              {/* Success Icon */}
              <div className="relative flex justify-center mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-7 w-7 text-green-600" strokeWidth={2.5} />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 bg-white rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-white text-center mb-1">
                Discharge Summary Generated
              </h3>
              <p className="text-green-50 text-center text-xs">
                Summary will be sent to GP
              </p>
              
              <button
                onClick={() => setIsDischargeSummaryModalOpen(false)}
                className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Discharge Summary Generated</h4>
                    <p className="text-sm text-green-800">
                      Complete discharge summary has been created and will be distributed to the GP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comprehensive Discharge Summary */}
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 text-center">DISCHARGE SUMMARY</h5>
                  
                  {/* Patient Information */}
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-2">Patient Information</h6>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {mockPatient.name}
                      </div>
                      <div>
                        <span className="font-medium">UPI:</span> {mockPatient.id}
                      </div>
                      <div>
                        <span className="font-medium">Age:</span> {calculateAge(mockPatient.dob)} years
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {mockPatient.phone}
                      </div>
                    </div>
                  </div>

                  {/* Discharge Details */}
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-2">Discharge Information</h6>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium">Discharge Date:</span> {new Date().toLocaleDateString('en-AU')}
                      </div>
                      <div>
                        <span className="font-medium">Discharge Reason:</span> {transferDetails.reason || 'Not specified'}
                      </div>
                      <div>
                        <span className="font-medium">Discharge Type:</span> {selectedPathway === 'Discharge' ? 'Final Discharge' : 'Pathway Transfer'}
                      </div>
                    </div>
                  </div>

                  {/* Clinical Summary */}
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-2">Clinical Summary</h6>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {transferDetails.clinicalRationale || 'No clinical summary provided.'}
                    </p>
                  </div>

                  {/* Treatment History */}
                  {selectedPathway === 'Medication' && medicationDetails.medications.length > 0 && (
                    <div className="mb-4 pb-3 border-b border-gray-200">
                      <h6 className="font-medium text-gray-900 mb-2">Prescribed Medications</h6>
                      <div className="space-y-2">
                        {medicationDetails.medications.map((med, index) => (
                          <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                            <div className="font-medium">{med.name}</div>
                            <div>Dosage: {med.dosage} | Frequency: {med.frequency}</div>
                            {med.duration && <div>Duration: {med.duration}</div>}
                            {med.instructions && <div>Instructions: {med.instructions}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Instructions */}
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-2">Follow-up Instructions</h6>
                    <div className="text-sm text-gray-700 space-y-1">
                      {selectedPathway === 'Medication' && medicationDetails.appointmentDate && (
                        <div>
                          <span className="font-medium">Follow-up Appointment:</span> {new Date(medicationDetails.appointmentDate).toLocaleDateString('en-AU')} at {medicationDetails.appointmentTime}
                        </div>
                      )}
                      {selectedPathway !== 'Medication' && selectedPathway !== 'Discharge' && appointmentBooking.appointmentDate && (
                        <div>
                          <span className="font-medium">Follow-up Appointment:</span> {new Date(appointmentBooking.appointmentDate).toLocaleDateString('en-AU')} at {appointmentBooking.appointmentTime}
                        </div>
                      )}
                      {selectedPathway === 'Discharge' && (
                        <>
                          <div>• Patient has been discharged from care</div>
                          <div>• No follow-up appointments required unless complications arise</div>
                          <div>• Patient should contact GP for any concerns</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {transferDetails.additionalNotes && (
                    <div className="mb-4 pb-3 border-b border-gray-200">
                      <h6 className="font-medium text-gray-900 mb-2">Additional Notes</h6>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {transferDetails.additionalNotes}
                      </p>
                    </div>
                  )}

                  {/* Signature */}
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Discharging Physician:</div>
                        <div>Dr. Sarah Wilson, Urologist</div>
                      </div>
                      <div>
                        <div className="font-medium">Date:</div>
                        <div>{new Date().toLocaleDateString('en-AU')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distribution Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-3">Summary Distribution</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Patient's GP</div>
                        <div className="text-xs text-blue-600">Dr. [GP Name]</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Medical Records</div>
                        <div className="text-xs text-blue-600">System Archive</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fixed Footer */}
            <div className="flex-shrink-0 p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsDischargeSummaryModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 text-sm"
                >
                  OK, Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PSA Monitoring Modal */}
      {isPSAModalOpen && mockPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      PSA Monitoring - {mockPatient.name}
                    </h3>
                    <p className="text-sm text-gray-600">PSA Level Trends and Analysis</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPSAModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Current PSA */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current PSA</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{mockPatient.lastPSA.value} ng/mL</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      mockPatient.lastPSA.value > 7 ? 'bg-red-50 text-red-700 border border-red-200' :
                      mockPatient.lastPSA.value > 3.5 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {mockPatient.lastPSA.value > 7 ? 'Elevated' : mockPatient.lastPSA.value > 3.5 ? 'Borderline' : 'Normal'}
                    </div>
                  </div>
                </div>

                {/* PSA Velocity */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PSA Velocity</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {calculatePSAVelocity(mockPatient.psaHistory)}
                    </p>
                    <p className="text-sm text-gray-600">ng/mL/year</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      parseFloat(calculatePSAVelocity(mockPatient.psaHistory)) > 0.75 ? 'bg-red-50 text-red-700 border border-red-200' :
                      parseFloat(calculatePSAVelocity(mockPatient.psaHistory)) > 0.35 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {parseFloat(calculatePSAVelocity(mockPatient.psaHistory)) > 0.75 ? 'High' : 
                       parseFloat(calculatePSAVelocity(mockPatient.psaHistory)) > 0.35 ? 'Moderate' : 'Low'}
                    </div>
                  </div>
                </div>

                {/* Risk Category */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Risk Category</span>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      Low
                    </div>
                    <p className="text-xs text-gray-600">Gleason: 3+3</p>
                  </div>
                </div>

                {/* Next Review */}
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Review</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {formatDate(mockPatient.nextAppointment)}
                    </p>
                    <p className="text-sm text-gray-600">3 months</p>
                    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Dr. Michael Chen
                    </div>
                  </div>
                </div>
              </div>

              {/* PSA Reference Ranges */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <h4 className="text-sm font-semibold text-gray-900">PSA Reference Ranges</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">Male PSA Reference Ranges (50-59 years)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Normal: 0-3.5 ng/mL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Borderline: 3.5-7.0 ng/mL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Elevated: &gt;7.0 ng/mL</span>
                  </div>
                </div>
              </div>

              {/* PSA Trend Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900">PSA Trend Analysis</h4>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">View:</span>
                      <div className="flex border border-gray-300 rounded">
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white">Line</button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">Bar</button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Period:</span>
                      <select
                        value={psaChartFilter}
                        onChange={(e) => setPsaChartFilter(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="3months">3 Months</option>
                        <option value="6months">6 Months</option>
                        <option value="1year">1 Year</option>
                        <option value="all">All</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Chart */}
                <div className="h-64">
                  <Line data={getPSAChartConfig(mockPatient, psaChartFilter).lineChart} options={chartOptions} />
                </div>
              </div>

              {/* PSA History Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <h4 className="text-lg font-semibold text-gray-900">PSA History</h4>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">PSA Value</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Change</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockPatient.psaHistory.map((psa, index) => {
                        const previousValue = index > 0 ? mockPatient.psaHistory[index - 1].value : null;
                        const change = previousValue ? (psa.value - previousValue).toFixed(1) : null;
                        const changePercent = previousValue ? ((psa.value - previousValue) / previousValue * 100).toFixed(1) : null;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-gray-900">
                                {formatDate(psa.date)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-gray-900">{psa.value} ng/mL</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                                psa.value > 7 ? 'bg-red-50 text-red-700 border border-red-200' :
                                psa.value > 3.5 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                'bg-green-50 text-green-700 border border-green-200'
                              }`}>
                                {psa.value > 7 ? 'Elevated' : psa.value > 3.5 ? 'Borderline' : 'Normal'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {change !== null ? (
                                <span className={`text-sm font-medium ${
                                  parseFloat(change) > 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {parseFloat(change) > 0 ? '+' : ''}{change} ng/mL ({changePercent}%)
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-600">
                                {index === 0 ? 'Initial baseline PSA measurement' :
                                 index === mockPatient.psaHistory.length - 1 ? 'Latest measurement, patient stable' :
                                 'Stable PSA, continue monitoring'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setIsPSAModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results Modal */}
      <TestResultsModal
        isOpen={isTestResultsModalOpen}
        onClose={() => setIsTestResultsModalOpen(false)}
        patientData={mockPatient}
      />


    </div>
  );
};

export default PatientDetailsModal;

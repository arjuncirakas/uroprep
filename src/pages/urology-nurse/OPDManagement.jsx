import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Users, 
  Search, 
  Eye,
  Calendar,
  X,
  ArrowRight,
  User,
  FileText,
  TrendingUp,
  Edit,
  Save,
  Check,
  Download,
  Plus,
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';

const OPDManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('New Patient');
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);
  const [hoveredPSA, setHoveredPSA] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showPSAHistoryModal, setShowPSAHistoryModal] = useState(false);
  const [psaChartType, setPsaChartType] = useState('line');
  const [isPSAModalOpen, setIsPSAModalOpen] = useState(false);
  const [selectedPatientForPSA, setSelectedPatientForPSA] = useState(null);
  const [psaForm, setPsaForm] = useState({
    date: '',
    value: '',
    notes: ''
  });

  // Mock OPD queue data
  const mockOPDQueue = [
    {
      id: 'OPD001',
      patientName: 'John Smith',
      upi: 'URP2024001',
      age: 65,
      gender: 'Male',
      phone: '+61 412 345 678',
      referralSource: 'GP',
      latestPSA: 8.5,
      appointmentDate: '2024-01-15',
      appointmentTime: '9:00 AM',
      dateOfEntry: '2024-01-10',
      status: 'Waiting for Scheduling',
      testResults: {
        mri: 'Available',
        biopsy: 'Available',
        trus: 'Available'
      },
      waitTime: '15 minutes',
      priority: 'High',
      reason: 'Elevated PSA with abnormal DRE',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Urgent review required',
      clinicalDetails: 'PSA rising from 4.2 to 8.5 over 6 months. DRE reveals firm, irregular prostate.',
      comorbidities: ['Hypertension', 'Type 2 Diabetes'],
      medications: ['Metformin', 'Lisinopril'],
      familyHistory: 'Father had prostate cancer at age 70',
      psaCriteria: 'PSA >10 ng/mL',
      suggestedPathway: 'MDT Review',
      clinicalNotes: 'Patient reports urinary frequency and urgency. DRE shows firm, irregular prostate with nodularity in the right lobe.',
      symptoms: 'Urinary frequency, urgency, nocturia, weak stream',
      allergies: 'Penicillin, Sulfa drugs',
      vitalSigns: {
        bloodPressure: '145/90',
        heartRate: '78',
        temperature: '36.8',
        weight: '85.2'
      },
      documents: [
        {
          title: 'PSA Test Results',
          fileName: 'PSA_Results_2024_01_08.pdf',
          uploadDate: '2024-01-08'
        },
        {
          title: 'MRI Prostate Report',
          fileName: 'MRI_Prostate_2024_01_10.pdf',
          uploadDate: '2024-01-10'
        },
        {
          title: 'Digital Rectal Examination',
          fileName: 'DRE_Report_2024_01_12.pdf',
          uploadDate: '2024-01-12'
        }
      ]
    },
    {
      id: 'OPD002',
      patientName: 'James Anderson',
      upi: 'URP2024005',
      age: 55,
      gender: 'Male',
      phone: '+61 456 789 012',
      referralSource: 'GP',
      latestPSA: 6.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '10:30 AM',
      status: 'Scheduled Doctor Appointment',
      testResults: {
        mri: 'Available',
        biopsy: 'Not Available',
        trus: 'Available'
      },
      waitTime: '0 minutes',
      priority: 'Urgent',
      reason: 'Suspicious MRI findings',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'MRI shows PIRADS 4 lesion'
    },
    {
      id: 'OPD003',
      patientName: 'Robert Brown',
      upi: 'URP2024007',
      age: 58,
      gender: 'Male',
      phone: '+61 423 456 789',
      referralSource: 'IPD',
      latestPSA: 5.2,
      appointmentDate: '2024-01-15',
      appointmentTime: '11:00 AM',
      status: 'Waiting for Secondary Appointment',
      testResults: {
        mri: 'Not Available',
        biopsy: 'Not Available',
        trus: 'Available'
      },
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Family history of prostate cancer',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Awaiting biopsy results'
    },
    {
      id: 'OPD004',
      patientName: 'David Wilson',
      upi: 'URP2024008',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      referralSource: 'GP',
      latestPSA: 4.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '2:00 PM',
      dateOfEntry: '2024-01-12',
      status: 'Waiting for Scheduling',
      testResults: {
        mri: 'Not Available',
        biopsy: 'Not Available',
        trus: 'Not Available'
      },
      waitTime: '5 minutes',
      priority: 'Normal',
      reason: 'Routine PSA monitoring',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Stable PSA levels'
    },
    {
      id: 'OPD005',
      patientName: 'Michael Thompson',
      upi: 'URP2024009',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      referralSource: 'GP',
      latestPSA: 7.2,
      appointmentDate: '2024-01-15',
      appointmentTime: '2:30 PM',
      dateOfEntry: '2024-01-11',
      status: 'Waiting for Scheduling',
      testResults: {
        mri: 'Available',
        biopsy: 'Not Available',
        trus: 'Not Available'
      },
      waitTime: '10 minutes',
      priority: 'High',
      reason: 'Rising PSA levels',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'PSA increased from 5.8 to 7.2'
    },
    {
      id: 'OPD006',
      patientName: 'William Davis',
      upi: 'URP2024010',
      age: 68,
      gender: 'Male',
      phone: '+61 456 789 123',
      referralSource: 'GP',
      latestPSA: 9.1,
      appointmentDate: '2024-01-15',
      appointmentTime: '3:00 PM',
      status: 'Waiting for Scheduling',
      testResults: {
        mri: 'Not Available',
        biopsy: 'Available',
        trus: 'Available'
      },
      waitTime: '25 minutes',
      priority: 'Urgent',
      reason: 'High PSA with urinary symptoms',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Patient reports urgency and frequency'
    },
    {
      id: 'OPD007',
      patientName: 'Christopher Lee',
      upi: 'URP2024011',
      age: 59,
      gender: 'Male',
      phone: '+61 467 890 234',
      referralSource: 'IPD',
      latestPSA: 4.2,
      appointmentDate: '2024-01-15',
      appointmentTime: '3:30 PM',
      status: 'Scheduled for Procedure',
      testResults: {
        mri: 'Available',
        biopsy: 'Available',
        trus: 'Not Available'
      },
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Post-surgery follow-up',
      assignedUrologist: 'Dr. James Brown',
      notes: 'RALP performed 6 weeks ago'
    },
    {
      id: 'OPD008',
      patientName: 'Richard Taylor',
      upi: 'URP2024012',
      age: 73,
      gender: 'Male',
      phone: '+61 478 901 345',
      referralSource: 'GP',
      latestPSA: 6.5,
      appointmentDate: '2024-01-15',
      appointmentTime: '4:00 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '35 minutes',
      priority: 'High',
      reason: 'Abnormal DRE findings',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'GP noted firm nodule on DRE'
    },
    {
      id: 'OPD009',
      patientName: 'Thomas White',
      upi: 'URP2024013',
      age: 61,
      gender: 'Male',
      phone: '+61 489 012 456',
      referralSource: 'GP',
      latestPSA: 5.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '4:30 PM',
      status: 'Waiting for Secondary Appointment',
      testResults: {
        mri: 'Available',
        biopsy: 'Not Available',
        trus: 'Available'
      },
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Active surveillance monitoring',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Biopsy scheduled for next week'
    },
    {
      id: 'OPD010',
      patientName: 'Mark Johnson',
      upi: 'URP2024014',
      age: 56,
      gender: 'Male',
      phone: '+61 490 123 567',
      referralSource: 'GP',
      latestPSA: 3.9,
      appointmentDate: '2024-01-15',
      appointmentTime: '5:00 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
      waitTime: '45 minutes',
      priority: 'Normal',
      reason: 'Annual PSA check',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Routine annual follow-up'
    },
    {
      id: 'OPD011',
      patientName: 'Steven Miller',
      upi: 'URP2024015',
      age: 64,
      gender: 'Male',
      phone: '+61 401 234 678',
      referralSource: 'IPD',
      latestPSA: 7.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '5:30 PM',
      status: 'Completed',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Post-biopsy consultation',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Biopsy results: Gleason 7 (3+4)'
    },
    {
      id: 'OPD012',
      patientName: 'Kevin Garcia',
      upi: 'URP2024016',
      age: 52,
      gender: 'Male',
      phone: '+61 412 345 789',
      referralSource: 'GP',
      latestPSA: 4.6,
      appointmentDate: '2024-01-15',
      appointmentTime: '6:00 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
      waitTime: '55 minutes',
      priority: 'Medium',
      reason: 'Family history screening',
      assignedUrologist: 'Dr. James Brown',
      notes: 'Father had prostate cancer at 65'
    },
    {
      id: 'OPD013',
      patientName: 'Daniel Martinez',
      upi: 'URP2024017',
      age: 69,
      gender: 'Male',
      phone: '+61 423 456 890',
      referralSource: 'GP',
      latestPSA: 8.9,
      appointmentDate: '2024-01-15',
      appointmentTime: '6:30 PM',
      status: 'Scheduled Doctor Appointment',
      testResults: {
        mri: 'Available',
        biopsy: 'Available',
        trus: 'Not Available'
      },
      waitTime: '0 minutes',
      priority: 'Urgent',
      reason: 'Rapidly rising PSA',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'PSA increased from 6.2 to 8.9 in 3 months'
    },
    {
      id: 'OPD014',
      patientName: 'Paul Rodriguez',
      upi: 'URP2024018',
      age: 57,
      gender: 'Male',
      phone: '+61 434 567 901',
      referralSource: 'IPD',
      latestPSA: 5.1,
      appointmentDate: '2024-01-15',
      appointmentTime: '7:00 PM',
      status: 'Scheduled for Procedure',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Scheduled for RALP next month'
    },
    {
      id: 'OPD015',
      patientName: 'Andrew Lewis',
      upi: 'URP2024019',
      age: 63,
      gender: 'Male',
      phone: '+61 445 678 012',
      referralSource: 'GP',
      latestPSA: 6.3,
      appointmentDate: '2024-01-15',
      appointmentTime: '7:30 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '65 minutes',
      priority: 'High',
      reason: 'Urinary retention episodes',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Patient reports 2 episodes of retention'
    },
    // Today's patients
    {
      id: 'OPD016',
      patientName: 'Robert Johnson',
      upi: 'URP2024020',
      age: 67,
      gender: 'Male',
      phone: '+61 456 789 123',
      referralSource: 'GP',
      latestPSA: 7.4,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '9:30 AM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '20 minutes',
      priority: 'High',
      reason: 'Elevated PSA with family history',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Father and brother had prostate cancer'
    },
    {
      id: 'OPD017',
      patientName: 'David Anderson',
      upi: 'URP2024021',
      age: 54,
      gender: 'Male',
      phone: '+61 467 890 234',
      referralSource: 'GP',
      latestPSA: 5.9,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      status: 'In Consultation',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Routine PSA monitoring',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Annual follow-up appointment'
    },
    {
      id: 'OPD018',
      patientName: 'Michael Brown',
      upi: 'URP2024022',
      age: 71,
      gender: 'Male',
      phone: '+61 478 901 345',
      referralSource: 'IPD',
      latestPSA: 8.2,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '11:15 AM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
      waitTime: '35 minutes',
      priority: 'Urgent',
      reason: 'High PSA with urinary symptoms',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Patient reports nocturia and urgency'
    },
    {
      id: 'OPD019',
      patientName: 'James Wilson',
      upi: 'URP2024023',
      age: 59,
      gender: 'Male',
      phone: '+61 489 012 456',
      referralSource: 'GP',
      latestPSA: 4.3,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '2:00 PM',
      status: 'Awaiting Results',
      testResults: {
        mri: 'Available',
        biopsy: 'Not Available',
        trus: 'Available'
      },
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Post-biopsy follow-up',
      assignedUrologist: 'Dr. James Brown',
      notes: 'Biopsy performed 2 weeks ago'
    },
    {
      id: 'OPD020',
      patientName: 'William Taylor',
      upi: 'URP2024024',
      age: 66,
      gender: 'Male',
      phone: '+61 490 123 567',
      referralSource: 'GP',
      latestPSA: 6.7,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '3:30 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '50 minutes',
      priority: 'High',
      reason: 'Rising PSA trend',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'PSA increased from 4.8 to 6.7 over 6 months'
    },
    // Tomorrow's patients
    {
      id: 'OPD021',
      patientName: 'Christopher Davis',
      upi: 'URP2024025',
      age: 62,
      gender: 'Male',
      phone: '+61 401 234 678',
      referralSource: 'GP',
      latestPSA: 5.5,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '9:00 AM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'Normal',
      reason: 'Annual PSA screening',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Routine annual check-up'
    },
    {
      id: 'OPD022',
      patientName: 'Richard Miller',
      upi: 'URP2024026',
      age: 68,
      gender: 'Male',
      phone: '+61 412 345 789',
      referralSource: 'IPD',
      latestPSA: 7.9,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '10:30 AM',
      status: 'Awaiting Results',
      testResults: {
        mri: 'Not Available',
        biopsy: 'Available',
        trus: 'Available'
      },
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Awaiting pathology results from biopsy'
    },
    {
      id: 'OPD023',
      patientName: 'Edward Thompson',
      upi: 'URP2024027',
      age: 61,
      gender: 'Male',
      phone: '+61 423 456 890',
      referralSource: 'GP',
      latestPSA: 6.1,
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '2:00 PM',
      status: 'Awaiting Results',
      testResults: {
        mri: 'Available',
        biopsy: 'Available',
        trus: 'Not Available'
      },
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Follow-up consultation',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Awaiting MRI results and lab reports'
    },
    {
      id: 'OPD024',
      patientName: 'George Wilson',
      upi: 'URP2024028',
      age: 55,
      gender: 'Male',
      phone: '+61 434 567 901',
      referralSource: 'GP',
      latestPSA: 5.3,
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '11:00 AM',
      status: 'Scheduled',
      testStatus: 'Tests Ordered',
      waitTime: '0 minutes',
      priority: 'Normal',
      reason: 'Annual PSA monitoring',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Routine annual check-up scheduled'
    },
    {
      id: 'OPD025',
      patientName: 'Frank Davis',
      upi: 'URP2024029',
      age: 67,
      gender: 'Male',
      phone: '+61 445 678 012',
      referralSource: 'IPD',
      latestPSA: 8.3,
      appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '3:30 PM',
      status: 'Scheduled',
      testStatus: 'In Progress',
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'Scheduled for prostatectomy consultation'
    }
  ];



  const filteredOPDQueue = mockOPDQueue.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedUrologist.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter based on active tab
    const statusMatch = 
      (activeFilter === 'New Patient' && patient.status === 'Waiting for Scheduling') ||
      (activeFilter === 'Appointment for Investigation' && patient.status === 'Scheduled for Procedure') ||
      (activeFilter === 'Appointment for Urologist' && (patient.status === 'Scheduled Doctor Appointment' || patient.status === 'Awaiting Results' || patient.status === 'Waiting for Secondary Appointment'));
    
    return searchMatch && statusMatch;
  });

  const handleBookAppointment = (patient) => {
    setSelectedPatientForAppointment(patient);
    setIsBookAppointmentModalOpen(true);
  };

  const handleAppointmentBooked = (appointmentData) => {
    console.log('Appointment booked:', appointmentData);
    // Here you would typically update the patient's status in your state management
    // For now, we'll just close the modal and show a success message
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
    alert('Appointment booked successfully!');
  };

  const handleCloseModal = () => {
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting for Scheduling': return 'bg-red-100 text-red-800';
      case 'Scheduled Doctor Appointment': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled for Procedure': return 'bg-blue-100 text-blue-800';
      case 'Awaiting Results': return 'bg-purple-100 text-purple-800';
      case 'Waiting for Secondary Appointment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    setIsEditing(false);
    
    // Populate clinical data with existing patient data
    setClinicalData({
      currentPSA: patient.latestPSA?.toString() || '',
      psaDate: patient.dateOfEntry || new Date().toISOString().split('T')[0],
      clinicalNotes: patient.clinicalNotes || '',
      symptoms: patient.symptoms || '',
      familyHistory: patient.familyHistory || '',
      medications: patient.medications?.join(', ') || '',
      allergies: patient.allergies || '',
      vitalSigns: {
        bloodPressure: patient.vitalSigns?.bloodPressure || '',
        heartRate: patient.vitalSigns?.heartRate || '',
        temperature: patient.vitalSigns?.temperature || '',
        weight: patient.vitalSigns?.weight || ''
      }
    });
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
    setIsEditing(false);
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
    setIsEditingDocuments(false);
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // Here you would typically save the changes to your backend
    console.log('Saving patient data:', {
      ...selectedPatient,
      clinicalData
    });
    
    // Update the selected patient with new data
    setSelectedPatient({
      ...selectedPatient,
      latestPSA: parseFloat(clinicalData.currentPSA) || selectedPatient.latestPSA,
      clinicalNotes: clinicalData.clinicalNotes,
      symptoms: clinicalData.symptoms,
      familyHistory: clinicalData.familyHistory,
      medications: clinicalData.medications.split(',').map(m => m.trim()).filter(m => m),
      allergies: clinicalData.allergies,
      vitalSigns: clinicalData.vitalSigns
    });
    
    setIsEditing(false);
    alert('Patient data updated successfully!');
  };

  // PSA Entry handlers
  const handlePSAEntry = (patientId) => {
    const patient = mockOPDQueue.find(p => p.id === patientId);
    setSelectedPatientForPSA(patient);
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
      notes: ''
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
      notes: ''
    });
  };

  // PSA reference values based on age and gender
  const getPSABaselineInfo = (gender, age) => {
    if (gender === 'Male') {
      if (age >= 70) {
        return {
          normal: '0-6.5 ng/mL',
          borderline: '6.5-15.0 ng/mL', 
          elevated: '>15.0 ng/mL',
          description: 'Male PSA Reference Ranges (70+ years):'
        };
      } else if (age >= 60) {
        return {
          normal: '0-4.5 ng/mL',
          borderline: '4.5-10.0 ng/mL', 
          elevated: '>10.0 ng/mL',
          description: 'Male PSA Reference Ranges (60-69 years):'
        };
      } else if (age >= 50) {
        return {
          normal: '0-3.5 ng/mL',
          borderline: '3.5-7.0 ng/mL', 
          elevated: '>7.0 ng/mL',
          description: 'Male PSA Reference Ranges (50-59 years):'
        };
      } else {
        return {
          normal: '0-2.5 ng/mL',
          borderline: '2.5-4.0 ng/mL', 
          elevated: '>4.0 ng/mL',
          description: 'Male PSA Reference Ranges (<50 years):'
        };
      }
    } else if (gender === 'Female') {
      if (age >= 70) {
        return {
          normal: '0-1.2 ng/mL',
          borderline: '1.2-2.0 ng/mL', 
          elevated: '>2.0 ng/mL',
          description: 'Female PSA Reference Ranges (70+ years):'
        };
      } else if (age >= 60) {
        return {
          normal: '0-0.8 ng/mL',
          borderline: '0.8-1.5 ng/mL', 
          elevated: '>1.5 ng/mL',
          description: 'Female PSA Reference Ranges (60-69 years):'
        };
      } else if (age >= 50) {
        return {
          normal: '0-0.6 ng/mL',
          borderline: '0.6-1.0 ng/mL', 
          elevated: '>1.0 ng/mL',
          description: 'Female PSA Reference Ranges (50-59 years):'
        };
      } else {
        return {
          normal: '0-0.5 ng/mL',
          borderline: '0.5-0.8 ng/mL', 
          elevated: '>0.8 ng/mL',
          description: 'Female PSA Reference Ranges (<50 years):'
        };
      }
    }
    return null;
  };

  // Handle PSA hover for tooltip positioning
  const handlePSAHover = (event, patient) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredPSA(patient);
  };

  const handlePSALeave = () => {
    setHoveredPSA(null);
  };

  // PSA Chart Helper Functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

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




  return (
    <div className="space-y-6">
      {/* Page Header with Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">OPD Management</h1>
              <p className="text-gray-600 mt-1">Track patients in OPD queue and manage consultation flow</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            {['New Patient', 'Appointment for Investigation', 'Appointment for Urologist'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{filter}</span>
                  <span className={`py-0.5 px-2 rounded-full text-xs font-semibold transition-colors ${
                    activeFilter === filter
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {mockOPDQueue.filter(patient => {
                       switch (filter) {
                         case 'New Patient': return patient.status === 'Waiting for Scheduling';
                         case 'Appointment for Investigation': return patient.status === 'Scheduled for Procedure';
                         case 'Appointment for Urologist': return patient.status === 'Scheduled Doctor Appointment' || patient.status === 'Awaiting Results' || patient.status === 'Waiting for Secondary Appointment';
                         default: return false;
                       }
                     }).length}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

      </div>

      {/* OPD Queue Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-sm text-gray-600 mt-1">Patients waiting for urologist consultation</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, UPI, or urologist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
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

        <div className="overflow-x-auto">
          {filteredOPDQueue.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date of Entry</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA Level</th>
                  {(activeFilter === 'New Patient' || activeFilter === 'Appointment for Urologist') && (
                    <>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">MRI</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Biopsy</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">TRUS</th>
                    </>
                  )}
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOPDQueue.map((patient, index) => (
                  <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {patient.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">UPI: {patient.upi}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.dateOfEntry || '2024-01-10'}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            patient.latestPSA > 10 ? 'bg-red-500' : 
                            patient.latestPSA > 4 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}></div>
                          <span 
                            className={`text-sm font-semibold cursor-help ${
                              patient.latestPSA > 10 ? 'text-red-600' : 
                              patient.latestPSA > 4 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}
                            onMouseEnter={(e) => handlePSAHover(e, patient)}
                            onMouseLeave={handlePSALeave}
                          >
                            {patient.latestPSA} ng/mL
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {patient.latestPSA > 10 ? 'High Risk' : 
                           patient.latestPSA > 4 ? 'Elevated' : 
                           'Normal Range'}
                        </p>
                      </div>
                    </td>
                    {(activeFilter === 'New Patient' || activeFilter === 'Appointment for Urologist') && (
                      <>
                      <td className="py-5 px-6 text-center">
                            {patient.testResults?.mri === 'Available' ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" title="MRI Results Available" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" title="MRI Results Not Available" />
                            )}
                      </td>
                        <td className="py-5 px-6 text-center">
                            {patient.testResults?.biopsy === 'Available' ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" title="Biopsy Results Available" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" title="Biopsy Results Not Available" />
                            )}
                        </td>
                        <td className="py-5 px-6 text-center">
                            {patient.testResults?.trus === 'Available' ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" title="TRUS Results Available" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" title="TRUS Results Not Available" />
                            )}
                        </td>
                      </>
                    )}
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewPatient(patient)}
                          className="inline-flex items-center justify-center px-3 py-3 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 h-10"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => handlePSAEntry(patient.id)}
                          className="inline-flex items-center justify-center px-3 py-3 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 h-10"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span>Add PSA</span>
                        </button>
                        {patient.status === 'Waiting for Scheduling' && (
                          <>
                            <button 
                              onClick={() => handleBookAppointment(patient)}
                              className="inline-flex items-center justify-center px-3 py-3 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 h-10"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Book Investigation</span>
                            </button>
                            <button 
                              onClick={() => handleBookAppointment(patient)}
                              className="inline-flex items-center justify-center px-3 py-3 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 h-10"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Book Urologist</span>
                            </button>
                          </>
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
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No patients in OPD queue
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients in the OPD queue.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveFilter('New Patient')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Show New Patients
                </button>
                <button
                  onClick={() => navigate('/urology-nurse/appointments')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModalWithPatient
        isOpen={isBookAppointmentModalOpen}
        onClose={handleCloseModal}
        onAppointmentBooked={handleAppointmentBooked}
        selectedPatientData={selectedPatientForAppointment}
      />

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative top-4 mx-auto p-0 shadow-lg rounded-md bg-white max-w-7xl w-full min-w-[1200px] mb-4 h-[90vh] flex flex-col">
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
                          {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold text-gray-900">{selectedPatient.patientName}</h1>
                        <p className="text-xs text-gray-600">UPI: {selectedPatient.upi}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md ${getStatusColor(selectedPatient.status)}`}>
                            {selectedPatient.status.replace('_', ' ')}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-green-100 text-green-800">
                            Age: {selectedPatient.age} years
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                            {selectedPatient.gender}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - PSA Data */}
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">{selectedPatient.latestPSA}</div>
                        <div className="text-xs text-blue-700">ng/mL</div>
                        <div className="text-xs text-blue-600 mt-1">Latest PSA</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-purple-900">{selectedPatient.dateOfEntry || '2024-01-10'}</div>
                        <div className="text-xs text-purple-700">Test Date</div>
                      </div>
                      <button
                        onClick={() => setShowPSAHistoryModal(true)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        View PSA History
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content - Two Column Layout */}
              <div className="bg-white flex flex-col flex-1 min-h-0">
                <div className="p-4 flex-1 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    
                    {/* LEFT COLUMN */}
                    <div className="space-y-3">
                      {/* Patient Assessment */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3">Patient Assessment</h2>
                        <div className="grid grid-cols-1 gap-3">
                          {/* Symptoms */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Symptoms</label>
                            {isEditing ? (
                              <textarea
                                value={clinicalData.symptoms}
                                onChange={(e) => setClinicalData({...clinicalData, symptoms: e.target.value})}
                                rows={2}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="Describe symptoms..."
                              />
                            ) : (
                              <div className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 min-h-[2rem]">
                                {clinicalData.symptoms || 'No symptoms recorded'}
                              </div>
                            )}
                          </div>

                          {/* Allergies */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Allergies</label>
                            {isEditing ? (
                              <textarea
                                value={clinicalData.allergies}
                                onChange={(e) => setClinicalData({...clinicalData, allergies: e.target.value})}
                                rows={2}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="List allergies..."
                              />
                            ) : (
                              <div className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 min-h-[2rem]">
                                {clinicalData.allergies || 'No allergies recorded'}
                              </div>
                            )}
                          </div>

                          {/* Nurse Notes */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Clinical Notes</label>
                            {isEditing ? (
                              <textarea
                                value={clinicalData.clinicalNotes}
                                onChange={(e) => setClinicalData({...clinicalData, clinicalNotes: e.target.value})}
                                rows={3}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="Enter clinical notes..."
                              />
                            ) : (
                              <div className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 min-h-[3rem]">
                                {clinicalData.clinicalNotes || 'No clinical notes available'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Vital Signs */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3">Vital Signs</h2>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Blood Pressure */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Blood Pressure</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={clinicalData.vitalSigns.bloodPressure}
                                onChange={(e) => setClinicalData({
                                  ...clinicalData, 
                                  vitalSigns: {...clinicalData.vitalSigns, bloodPressure: e.target.value}
                                })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="120/80"
                              />
                            ) : (
                              <div className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                                {clinicalData.vitalSigns.bloodPressure || 'Not recorded'}
                              </div>
                            )}
                          </div>

                          {/* Heart Rate */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Heart Rate</label>
                            {isEditing ? (
                              <input
                                type="number"
                                value={clinicalData.vitalSigns.heartRate}
                                onChange={(e) => setClinicalData({
                                  ...clinicalData, 
                                  vitalSigns: {...clinicalData.vitalSigns, heartRate: e.target.value}
                                })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="72"
                              />
                            ) : (
                              <div className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                                {clinicalData.vitalSigns.heartRate || 'Not recorded'}
                              </div>
                            )}
                          </div>

                          {/* Temperature */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Temperature</label>
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                value={clinicalData.vitalSigns.temperature}
                                onChange={(e) => setClinicalData({
                                  ...clinicalData, 
                                  vitalSigns: {...clinicalData.vitalSigns, temperature: e.target.value}
                                })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="36.5"
                              />
                            ) : (
                              <div className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                                {clinicalData.vitalSigns.temperature || 'Not recorded'}
                              </div>
                            )}
                          </div>

                          {/* Weight */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Weight</label>
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                value={clinicalData.vitalSigns.weight}
                                onChange={(e) => setClinicalData({
                                  ...clinicalData, 
                                  vitalSigns: {...clinicalData.vitalSigns, weight: e.target.value}
                                })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent text-sm"
                                placeholder="70.5"
                              />
                            ) : (
                              <div className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                                {clinicalData.vitalSigns.weight || 'Not recorded'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-3">
                      {/* Test Results */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3">Test Results</h2>
                        <div className="space-y-3">
                          {/* MRI Results */}
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <h3 className="text-xs font-semibold text-gray-900">MRI Results</h3>
                              {testResults.mriDocument && (
                                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {testResults.mriDocument ? (
                              <div className="flex items-center justify-between px-2 py-1 border border-green-300 rounded bg-green-50">
                                <div className="flex items-center">
                                  <FileText className="h-3 w-3 text-green-600 mr-1" />
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
                                <div className="flex items-center justify-between px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center">
                                    <Upload className="h-3 w-3 text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-600">Choose file...</span>
                                  </div>
                                  <span className="text-xs text-gray-500">Browse</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Biopsy Results */}
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <h3 className="text-xs font-semibold text-gray-900">Biopsy Results</h3>
                              {testResults.biopsyDocument && (
                                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {testResults.biopsyDocument ? (
                              <div className="flex items-center justify-between px-2 py-1 border border-green-300 rounded bg-green-50">
                                <div className="flex items-center">
                                  <FileText className="h-3 w-3 text-green-600 mr-1" />
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
                                <div className="flex items-center justify-between px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center">
                                    <Upload className="h-3 w-3 text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-600">Choose file...</span>
                                  </div>
                                  <span className="text-xs text-gray-500">Browse</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* TRUS Results */}
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <h3 className="text-xs font-semibold text-gray-900">TRUS Results</h3>
                              {testResults.trusDocument && (
                                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {testResults.trusDocument ? (
                              <div className="flex items-center justify-between px-2 py-1 border border-green-300 rounded bg-green-50">
                                <div className="flex items-center">
                                  <FileText className="h-3 w-3 text-green-600 mr-1" />
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
                                <div className="flex items-center justify-between px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center">
                                    <Upload className="h-3 w-3 text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-600">Choose file...</span>
                                  </div>
                                  <span className="text-xs text-gray-500">Browse</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Test Results */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-sm font-semibold text-gray-900">Additional Tests</h2>
                          <button
                            onClick={addAdditionalTest}
                            className="flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 hover:border-purple-300 transition-colors"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </button>
                        </div>

                        {additionalTests.length === 0 ? (
                          <div className="text-center py-4">
                            <div className="mx-auto w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                              <FileText className="h-4 w-4 text-purple-400" />
                            </div>
                            <p className="text-xs text-gray-500 mb-2">No additional tests</p>
                            <button
                              onClick={addAdditionalTest}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 hover:border-purple-300 transition-colors"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Test
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {additionalTests.map((test, index) => (
                              <div key={test.id} className="border border-gray-200 rounded p-2 bg-gray-50">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="text-xs font-medium text-gray-700">Test {index + 1}</h3>
                                  <button
                                    onClick={() => removeAdditionalTest(test.id)}
                                    className="flex items-center px-1 py-0.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 hover:border-red-300 transition-colors"
                                  >
                                    <X className="h-2 w-2 mr-0.5" />
                                    Remove
                                  </button>
                                </div>
                                
                                <div className="space-y-1">
                                  <div>
                                    <input
                                      type="text"
                                      value={test.title}
                                      onChange={(e) => updateAdditionalTest(test.id, 'title', e.target.value)}
                                      className="w-full px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-xs"
                                      placeholder="Test title"
                                    />
                                  </div>
                                  
                                  <div>
                                    <input
                                      type="text"
                                      value={test.result}
                                      onChange={(e) => updateAdditionalTest(test.id, 'result', e.target.value)}
                                      className="w-full px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-xs"
                                      placeholder="Result"
                                    />
                                  </div>
                                  
                                  <div className="relative">
                                    <input
                                      type="file"
                                      onChange={(e) => handleAdditionalTestDocumentUpload(test.id, e)}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                                    />
                                    <div className="flex items-center justify-between px-1 py-0.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors">
                                      <div className="flex items-center">
                                        <Upload className="h-2 w-2 text-gray-400 mr-1" />
                                        <span className="text-xs text-gray-600">
                                          {test.fileName || 'Choose file...'}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">Browse</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Save/Cancel Buttons - Only show when editing */}
                  {isEditing && (
                    <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors border border-gray-300 text-sm"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded shadow-sm hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                              </div>
                            </div>
                          
                        </div>
                                      </div>
                            </div>
                          )}

      {/* PSA Tooltip Portal - Rendered outside table overflow */}
      {hoveredPSA && createPortal(
        <div 
          className="fixed px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            minWidth: '250px'
          }}
        >
          <div className="text-center">
            <div className="font-semibold mb-2 text-white">{getPSABaselineInfo(hoveredPSA.gender, hoveredPSA.age)?.description}</div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Normal:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender, hoveredPSA.age)?.normal}</span>
                          </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Borderline:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender, hoveredPSA.age)?.borderline}</span>
                        </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Elevated:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender, hoveredPSA.age)?.elevated}</span>
                      </div>
                    </div>
            <div className="mt-3 pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400">
                Patient: {hoveredPSA.patientName} ({hoveredPSA.age} years, {hoveredPSA.gender})
                </div>
              <div className="text-xs text-gray-400">
                Current PSA: {hoveredPSA.latestPSA} ng/mL
              </div>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"
            style={{ marginTop: '-1px' }}
          ></div>
        </div>,
        document.body
      )}

      {/* PSA History Modal */}
      {showPSAHistoryModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[150] flex items-center justify-center">
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">PSA History</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      PSA trend analysis for {selectedPatient.patientName}
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
                            {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{selectedPatient.patientName}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">Age: {selectedPatient.age} years</span>
                          <span className="text-sm text-gray-600">Latest PSA: {selectedPatient.latestPSA} ng/mL</span>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                            {selectedPatient.psaCriteria || 'PSA 4-10 ng/mL'}
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
                                {selectedPatient.latestPSA} ng/mL
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

      {/* PSA Entry Modal */}
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

              {/* PSA Reference Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">PSA Reference Ranges</h3>
                <div className="text-xs text-blue-800 space-y-1">
                  <p><strong>Normal:</strong> &lt; 4.0 ng/mL</p>
                  <p><strong>Borderline:</strong> 4.0 - 10.0 ng/mL</p>
                  <p><strong>Elevated:</strong> 10.0 - 20.0 ng/mL</p>
                  <p><strong>High Risk:</strong> &gt; 20.0 ng/mL</p>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  <em>Note: Ranges may vary based on age and individual factors.</em>
                </p>
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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                >
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

export default OPDManagement;


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
  XCircle,
  Database,
  Activity,
  Heart,
  UserPlus,
  Target,
  BarChart3,
  Clock
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';
import AddPatientModal from '../../components/modals/AddPatientModal';
import NursePatientDetailsModal from '../../components/modals/NursePatientDetailsModal';

const OPDManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('New Patient');
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);
  const [isNursePatientDetailsModalOpen, setIsNursePatientDetailsModalOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  const [hoveredPSA, setHoveredPSA] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [isBookInvestigationModalOpen, setIsBookInvestigationModalOpen] = useState(false);
  const [isBookUrologistModalOpen, setIsBookUrologistModalOpen] = useState(false);
  const [selectedPatientForInvestigation, setSelectedPatientForInvestigation] = useState(null);
  const [selectedPatientForUrologist, setSelectedPatientForUrologist] = useState(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState('');
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: '',
    description: '',
    type: '' // 'investigation' or 'urologist'
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Available doctors
  const doctors = [
    { id: 'dr_smith', name: 'Dr. John Smith', specialization: 'Urologist', experience: '15 years' },
    { id: 'dr_johnson', name: 'Dr. Sarah Johnson', specialization: 'Urologist', experience: '12 years' },
    { id: 'dr_wilson', name: 'Dr. Michael Wilson', specialization: 'Urologist', experience: '18 years' },
    { id: 'dr_brown', name: 'Dr. Emily Brown', specialization: 'Urologist', experience: '10 years' },
    { id: 'dr_davis', name: 'Dr. Robert Davis', specialization: 'Urologist', experience: '20 years' }
  ];

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

  // Mock No Show patients data
  const mockNoShowPatients = [
    {
      id: 'NS001',
      patientName: 'Robert Smith',
      upi: 'URP2024030',
      age: 68,
      gender: 'Male',
      phone: '+61 456 789 012',
      latestPSA: 9.2,
      psaHistory: [
        { value: 7.5, date: '2025-03-16', velocity: null },
        { value: 8.1, date: '2025-06-16', velocity: 0.20 },
        { value: 9.2, date: '2025-10-16', velocity: 0.37 }
      ],
      appointmentDate: '2025-10-16',
      appointmentTime: '10:00 AM',
      assignedUrologist: 'Dr. Sarah Wilson',
      reason: 'No Show - Investigation Appointment',
      notes: 'Patient did not arrive for scheduled MRI'
    },
    {
      id: 'NS002',
      patientName: 'Michael Johnson',
      upi: 'URP2024031',
      age: 55,
      gender: 'Male',
      phone: '+61 423 456 789',
      latestPSA: 6.5,
      psaHistory: [
        { value: 5.1, date: '2025-04-17', velocity: null },
        { value: 5.8, date: '2025-07-17', velocity: 0.23 },
        { value: 6.5, date: '2025-10-17', velocity: 0.23 }
      ],
      appointmentDate: '2025-10-17',
      appointmentTime: '2:30 PM',
      assignedUrologist: 'Dr. Michael Chen',
      reason: 'No Show - Urologist Consultation',
      notes: 'Missed follow-up appointment'
    },
    {
      id: 'NS003',
      patientName: 'David Brown',
      upi: 'URP2024032',
      age: 62,
      gender: 'Male',
      phone: '+61 434 567 890',
      appointmentDate: '2025-10-18',
      appointmentTime: '11:15 AM',
      assignedUrologist: 'Dr. Emma Wilson',
      reason: 'No Show - Investigation Appointment',
      notes: 'Biopsy appointment missed'
    }
  ];

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
      referringGP: 'Dr. Sarah Johnson',
      latestPSA: 8.5,
      psaHistory: [
        { value: 4.2, date: '2025-04-15', velocity: null },
        { value: 6.1, date: '2025-07-15', velocity: 0.63 },
        { value: 8.5, date: '2025-10-15', velocity: 0.80 }
      ],
      appointmentDate: '2025-10-15',
      appointmentTime: '9:00 AM',
      dateOfEntry: '2025-10-03',
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
      referringGP: 'Dr. Michael Brown',
      latestPSA: 6.8,
      psaHistory: [
        { value: 5.2, date: '2025-03-16', velocity: null },
        { value: 6.1, date: '2025-06-16', velocity: 0.30 },
        { value: 6.8, date: '2025-10-16', velocity: 0.23 }
      ],
      appointmentDate: '2025-10-16',
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
      appointmentDate: '2025-10-17',
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
      referringGP: 'Dr. Emily Davis',
      latestPSA: 4.8,
      appointmentDate: '2025-10-18',
      appointmentTime: '2:00 PM',
      dateOfEntry: '2025-10-07',
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
      referringGP: 'Dr. Robert Wilson',
      latestPSA: 7.2,
      appointmentDate: '2025-10-19',
      appointmentTime: '2:30 PM',
      dateOfEntry: '2025-10-05',
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
      appointmentDate: '2025-10-20',
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
      psaHistory: [
        { value: 3.8, date: '2025-02-21', velocity: null },
        { value: 4.0, date: '2025-05-21', velocity: 0.07 },
        { value: 4.2, date: '2025-10-21', velocity: 0.08 }
      ],
      appointmentDate: '2025-10-21',
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
      appointmentDate: '2025-10-22',
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
      appointmentDate: '2025-10-23',
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
      appointmentDate: '2025-10-24',
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
      appointmentDate: '2025-10-25',
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
      appointmentDate: '2025-10-26',
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
      appointmentDate: '2025-10-27',
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
      appointmentDate: '2025-10-28',
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
      appointmentDate: '2025-10-29',
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
      appointmentDate: '2025-10-30',
      appointmentTime: '9:30 AM',
      dateOfEntry: '2025-10-12',
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
      appointmentDate: '2025-10-31',
      appointmentTime: '10:00 AM',
      dateOfEntry: '2025-10-09',
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
      appointmentDate: '2025-11-01',
      appointmentTime: '11:15 AM',
      dateOfEntry: '2025-10-14',
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
      appointmentDate: '2025-11-02',
      appointmentTime: '2:00 PM',
      dateOfEntry: '2025-10-01',
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
      appointmentDate: '2025-11-03',
      appointmentTime: '3:30 PM',
      dateOfEntry: '2025-10-11',
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
      appointmentDate: '2025-11-04',
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
      appointmentDate: '2025-11-05',
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
      appointmentDate: '2025-11-06',
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
      appointmentDate: '2025-11-07',
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
      appointmentDate: '2025-11-08',
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

  // Filter no-show patients based on active tab
  const filteredNoShowPatients = mockNoShowPatients.filter(patient => {
    if (activeFilter === 'Appointment for Investigation') {
      return patient.reason.includes('Investigation');
    } else if (activeFilter === 'Appointment for Urologist') {
      return patient.reason.includes('Urologist');
    }
    return false; // Don't show no-show patients for "New Patient" tab
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
    setSelectedPatientForDetails(patient);
    setIsNursePatientDetailsModalOpen(true);
  };

  const handleCloseNursePatientDetailsModal = () => {
    setIsNursePatientDetailsModalOpen(false);
    setSelectedPatientForDetails(null);
  };

  // Reschedule Modal handlers
  const handleReschedule = (patient) => {
    // Determine which modal to open based on the reason
    if (patient.reason.includes('Investigation')) {
      setSelectedPatientForInvestigation(patient);
      setIsBookInvestigationModalOpen(true);
    } else if (patient.reason.includes('Urologist')) {
      setSelectedPatientForUrologist(patient);
      setIsBookUrologistModalOpen(true);
    }
  };



  // Add Patient Modal handlers
  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const handlePatientAdded = (newPatient) => {
    console.log('New patient added:', newPatient);
    // Here you could update your local state or dispatch to Redux store
    // For now, we'll just log it
    alert(`Patient ${newPatient.patientName} has been successfully added to the OPD queue!`);
  };

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false);
  };

  // Book Investigation Modal handlers
  const handleBookInvestigation = (patient) => {
    setSelectedPatientForInvestigation(patient);
    setIsBookInvestigationModalOpen(true);
  };

  const handleCloseBookInvestigationModal = () => {
    setIsBookInvestigationModalOpen(false);
    setSelectedPatientForInvestigation(null);
    setSelectedAppointmentDate('');
    setSelectedAppointmentTime('');
    setSelectedDoctor('');
    setAppointmentNotes('');
  };

  const handleConfirmInvestigationBooking = () => {
    if (!selectedAppointmentDate || !selectedAppointmentTime || !selectedDoctor) {
      alert('Please select date, time, and doctor');
      return;
    }
    const doctorName = doctors.find(d => d.id === selectedDoctor)?.name;
    const formattedDate = new Date(selectedAppointmentDate).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    console.log('Investigation booked for patient:', selectedPatientForInvestigation?.id, 'on', selectedAppointmentDate, 'at', selectedAppointmentTime, 'with', doctorName);
    
    // Show success modal
    const isReschedule = selectedPatientForInvestigation?.reason?.includes('No Show');
    setSuccessMessage({
      title: isReschedule ? 'Investigation Appointment Rescheduled!' : 'Investigation Appointment Booked!',
      description: `Investigation appointment for ${selectedPatientForInvestigation?.patientName} has been successfully ${isReschedule ? 'rescheduled' : 'scheduled'} with ${doctorName} on ${formattedDate} at ${selectedAppointmentTime}.`,
      type: 'investigation',
      patientName: selectedPatientForInvestigation?.patientName,
      doctorName: doctorName,
      date: formattedDate,
      time: selectedAppointmentTime
    });
    
    handleCloseBookInvestigationModal();
    setShowSuccessModal(true);
  };

  // Book Urologist Modal handlers
  const handleBookUrologist = (patient) => {
    setSelectedPatientForUrologist(patient);
    setIsBookUrologistModalOpen(true);
  };

  const handleCloseBookUrologistModal = () => {
    setIsBookUrologistModalOpen(false);
    setSelectedPatientForUrologist(null);
    setSelectedAppointmentDate('');
    setSelectedAppointmentTime('');
    setSelectedDoctor('');
    setAppointmentNotes('');
  };

  const handleConfirmUrologistBooking = () => {
    if (!selectedAppointmentDate || !selectedAppointmentTime || !selectedDoctor) {
      alert('Please select date, time, and doctor');
      return;
    }
    const doctorName = doctors.find(d => d.id === selectedDoctor)?.name;
    const formattedDate = new Date(selectedAppointmentDate).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    console.log('Urologist appointment booked for patient:', selectedPatientForUrologist?.id, 'on', selectedAppointmentDate, 'at', selectedAppointmentTime, 'with', doctorName);
    
    // Show success modal
    const isReschedule = selectedPatientForUrologist?.reason?.includes('No Show');
    setSuccessMessage({
      title: isReschedule ? 'Urologist Consultation Rescheduled!' : 'Urologist Consultation Booked!',
      description: `Urologist consultation for ${selectedPatientForUrologist?.patientName} has been successfully ${isReschedule ? 'rescheduled' : 'scheduled'} with ${doctorName} on ${formattedDate} at ${selectedAppointmentTime}.`,
      type: 'urologist',
      patientName: selectedPatientForUrologist?.patientName,
      doctorName: doctorName,
      date: formattedDate,
      time: selectedAppointmentTime
    });
    
    handleCloseBookUrologistModal();
    setShowSuccessModal(true);
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
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddPatient}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </button>
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

      {/* Main Content Area */}
      <div className={`${activeFilter !== 'New Patient' ? 'flex gap-6' : ''}`}>
      {/* OPD Queue Table */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${activeFilter !== 'New Patient' ? 'flex-[60%]' : 'w-full'}`}>
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
                  {activeFilter === 'New Patient' && (
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date of Entry</th>
                  )}
                  {activeFilter !== 'New Patient' && (
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date of Appointment</th>
                  )}
                  {activeFilter !== 'New Patient' && (
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Urologist</th>
                  )}
                  {activeFilter === 'Appointment for Investigation' && (
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
                          <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            patient.latestPSA > 10 ? 'bg-red-500' : 
                            patient.latestPSA > 4 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}></div>
                          <span 
                              className={`text-xs font-semibold cursor-help ${
                              patient.latestPSA > 10 ? 'text-red-600' : 
                              patient.latestPSA > 4 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}
                            onMouseEnter={(e) => handlePSAHover(e, patient)}
                            onMouseLeave={handlePSALeave}
                          >
                              PSA: {patient.latestPSA} ng/mL
                          </span>
                        </div>
                        </div>
                      </div>
                    </td>
                    {activeFilter === 'New Patient' && (
                      <td className="py-5 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{patient.dateOfEntry || '2025-10-08'}</p>
                        </div>
                      </td>
                    )}
                    {activeFilter !== 'New Patient' && (
                      <td className="py-5 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{patient.appointmentDate || 'Not Scheduled'}</p>
                          {patient.appointmentTime && (
                            <p className="text-sm text-gray-500">{patient.appointmentTime}</p>
                          )}
                        </div>
                      </td>
                    )}
                    {activeFilter !== 'New Patient' && (
                      <td className="py-5 px-6">
                        <div>
                          <p className="text-sm text-gray-900">{patient.assignedUrologist || 'Not Assigned'}</p>
                        </div>
                      </td>
                    )}
                    {activeFilter === 'Appointment for Investigation' && (
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
                          <span>View/Edit</span>
                        </button>
                        {patient.status === 'Waiting for Scheduling' && (
                          <>
                            <button 
                              onClick={() => handleBookInvestigation(patient)}
                              className="inline-flex items-center justify-center px-3 py-3 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 h-10"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Book Investigation</span>
                            </button>
                            <button 
                              onClick={() => handleBookUrologist(patient)}
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

        {/* No Show Patients Table - Only for Appointment tabs */}
        {activeFilter !== 'New Patient' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-[40%]">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 px-6 py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <X className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900">No Show Patients</h3>
                  <p className="text-sm text-red-600">
                    {activeFilter === 'Appointment for Investigation' 
                      ? 'Investigation patients to be followed up'
                      : 'Urologist patients to be followed up'
                    }
                  </p>
                  </div>
                </div>
            </div>

            {filteredNoShowPatients.length > 0 ? (
              <table className="w-full table-fixed">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-red-700 text-xs uppercase tracking-wider w-2/5">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-red-700 text-xs uppercase tracking-wider w-2/5">Missed Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-red-700 text-xs uppercase tracking-wider w-1/5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-100">
                    {filteredNoShowPatients.map((patient, index) => (
                      <tr key={patient.id} className={`hover:bg-red-25 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-red-25'}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-xs">
                                {patient.patientName.split(' ').map(n => n[0]).join('')}
                              </span>
                      </div>
                          <div>
                              <p className="font-semibold text-gray-900 text-sm">{patient.patientName}</p>
                              <p className="text-xs text-gray-500">UPI: {patient.upi}</p>
                              <p className="text-xs text-gray-400">Age: {patient.age} • {patient.gender}</p>
                          </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{patient.appointmentDate}</p>
                            <p className="text-xs text-gray-500">{patient.appointmentTime}</p>
                            <p className="text-xs text-red-600 font-medium">{patient.reason}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleViewPatient(patient)}
                              className="inline-flex items-center justify-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              <span>View/Edit</span>
                            </button>
                            <button
                              onClick={() => handleReschedule(patient)}
                              className="inline-flex items-center justify-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-orange-600 to-orange-800 border border-orange-600 rounded-lg shadow-sm hover:from-orange-700 hover:to-orange-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Reschedule</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-red-500" />
                            </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No No-Show Patients
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {activeFilter === 'Appointment for Investigation' 
                      ? 'All investigation patients are attending their appointments'
                      : 'All urologist patients are attending their appointments'
                    }
                  </p>
                            </div>
              )}
                </div>
              )}
                          </div>
                          
      {/* Book Appointment Modal */}
      <BookAppointmentModalWithPatient
        isOpen={isBookAppointmentModalOpen}
        onClose={handleCloseModal}
        onAppointmentBooked={handleAppointmentBooked}
        selectedPatientData={selectedPatientForAppointment}
      />

      {/* Nurse Patient Details Modal */}
      <NursePatientDetailsModal
        isOpen={isNursePatientDetailsModalOpen}
        onClose={handleCloseNursePatientDetailsModal}
        patientId={selectedPatientForDetails?.id}
        patientData={selectedPatientForDetails}
        userRole="urology-nurse"
        source="opdManagement"
      />

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






      {/* Book Investigation Modal */}
      {isBookInvestigationModalOpen && selectedPatientForInvestigation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-3xl">
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedPatientForInvestigation.reason?.includes('No Show') ? 'Reschedule Investigation' : 'Book Investigation'}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {selectedPatientForInvestigation.patientName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseBookInvestigationModal}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="px-6 py-5 flex-1 overflow-y-auto">
                <div className="space-y-5">
                  {/* Patient Info Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {selectedPatientForInvestigation.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedPatientForInvestigation.patientName}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-600">UPI: {selectedPatientForInvestigation.upi}</span>
                          <span className="text-xs text-gray-600">Age: {selectedPatientForInvestigation.age}</span>
                          {selectedPatientForInvestigation.reason?.includes('No Show') ? (
                            <span className="text-xs text-red-600 font-medium">{selectedPatientForInvestigation.reason}</span>
                          ) : (
                          <span className="text-xs text-blue-600 font-medium">PSA: {selectedPatientForInvestigation.latestPSA} ng/mL</span>
                          )}
                        </div>
                        {selectedPatientForInvestigation.reason?.includes('No Show') && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">Missed: {selectedPatientForInvestigation.appointmentDate} at {selectedPatientForInvestigation.appointmentTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Doctor, Date and Notes Selection */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Select Doctor *</label>
                        <select
                          value={selectedDoctor}
                          onChange={(e) => setSelectedDoctor(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all"
                        >
                          <option value="">Choose a doctor...</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization} ({doctor.experience})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Select Date *</label>
                        <input
                          type="date"
                          value={selectedAppointmentDate}
                          onChange={(e) => setSelectedAppointmentDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Notes</label>
                        <textarea
                          value={appointmentNotes}
                          onChange={(e) => setAppointmentNotes(e.target.value)}
                          rows={3}
                          placeholder="Add any notes or special instructions for this investigation..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm resize-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Select Time</label>
                      <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-inner">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedAppointmentTime(time)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 font-medium shadow-sm ${
                              selectedAppointmentTime === time
                                ? 'bg-blue-500 text-white border-blue-500 shadow-md transform scale-105'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Click on a time slot to select</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={handleConfirmInvestigationBooking}
                    disabled={!selectedAppointmentDate || !selectedAppointmentTime || !selectedDoctor}
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {selectedPatientForInvestigation.reason?.includes('No Show') ? 'Reschedule Investigation' : 'Book Investigation'}
                  </button>
                  <button
                    onClick={handleCloseBookInvestigationModal}
                    className="flex-1 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Urologist Modal */}
      {isBookUrologistModalOpen && selectedPatientForUrologist && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-3xl">
            <div className="bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedPatientForUrologist.reason?.includes('No Show') ? 'Reschedule Urologist Consultation' : 'Book Urologist Consultation'}
                      </h3>
                      <p className="text-green-100 text-sm">
                        {selectedPatientForUrologist.patientName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseBookUrologistModal}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="px-6 py-5 flex-1 overflow-y-auto">
                <div className="space-y-5">
                  {/* Patient Info Card */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {selectedPatientForUrologist.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedPatientForUrologist.patientName}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-600">UPI: {selectedPatientForUrologist.upi}</span>
                          <span className="text-xs text-gray-600">Age: {selectedPatientForUrologist.age}</span>
                          {selectedPatientForUrologist.reason?.includes('No Show') ? (
                            <span className="text-xs text-red-600 font-medium">{selectedPatientForUrologist.reason}</span>
                          ) : (
                          <span className="text-xs text-green-600 font-medium">PSA: {selectedPatientForUrologist.latestPSA} ng/mL</span>
                          )}
                        </div>
                        {selectedPatientForUrologist.reason?.includes('No Show') && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">Missed: {selectedPatientForUrologist.appointmentDate} at {selectedPatientForUrologist.appointmentTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Doctor, Date and Notes Selection */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Select Urologist *</label>
                        <select
                          value={selectedDoctor}
                          onChange={(e) => setSelectedDoctor(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all"
                        >
                          <option value="">Choose a urologist...</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization} ({doctor.experience})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Select Date *</label>
                        <input
                          type="date"
                          value={selectedAppointmentDate}
                          onChange={(e) => setSelectedAppointmentDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Notes</label>
                        <textarea
                          value={appointmentNotes}
                          onChange={(e) => setAppointmentNotes(e.target.value)}
                          rows={3}
                          placeholder="Add clinical notes, symptoms, or specific concerns for the urologist..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm resize-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Select Time</label>
                      <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-inner">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedAppointmentTime(time)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 font-medium shadow-sm ${
                              selectedAppointmentTime === time
                                ? 'bg-green-500 text-white border-green-500 shadow-md transform scale-105'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50 hover:shadow-md'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Click on a time slot to select</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={handleConfirmUrologistBooking}
                    disabled={!selectedAppointmentDate || !selectedAppointmentTime || !selectedDoctor}
                    className="flex-1 bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {selectedPatientForUrologist.reason?.includes('No Show') ? 'Reschedule Urologist' : 'Book Urologist'}
                  </button>
                  <button
                    onClick={handleCloseBookUrologistModal}
                    className="flex-1 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={handleCloseAddPatientModal}
        onPatientAdded={handlePatientAdded}
      />


      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-300">
              {/* Success Icon */}
              <div className={`px-6 py-8 text-center ${
                successMessage.type === 'investigation' 
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100' 
                  : successMessage.type === 'reschedule'
                  ? 'bg-gradient-to-br from-orange-50 to-orange-100'
                  : 'bg-gradient-to-br from-green-50 to-green-100'
              }`}>
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg ${
                  successMessage.type === 'investigation'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                    : successMessage.type === 'reschedule'
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                }`}>
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  successMessage.type === 'investigation' ? 'text-blue-900' : 
                  successMessage.type === 'reschedule' ? 'text-orange-900' : 'text-green-900'
                }`}>
                  {successMessage.title}
                </h3>
                <p className={`text-sm ${
                  successMessage.type === 'investigation' ? 'text-blue-700' : 
                  successMessage.type === 'reschedule' ? 'text-orange-700' : 'text-green-700'
                }`}>
                  Appointment successfully scheduled
                </p>
              </div>

              {/* Details */}
              <div className="px-6 py-6">
                <div className="space-y-4">
                  {/* Patient Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        successMessage.type === 'investigation'
                          ? 'bg-blue-100'
                          : successMessage.type === 'reschedule'
                          ? 'bg-orange-100'
                          : 'bg-green-100'
                      }`}>
                        <User className={`h-5 w-5 ${
                          successMessage.type === 'investigation' ? 'text-blue-600' : 
                          successMessage.type === 'reschedule' ? 'text-orange-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Patient</p>
                        <p className="text-sm font-semibold text-gray-900">{successMessage.patientName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        successMessage.type === 'investigation'
                          ? 'bg-blue-100'
                          : successMessage.type === 'reschedule'
                          ? 'bg-orange-100'
                          : 'bg-green-100'
                      }`}>
                        <User className={`h-5 w-5 ${
                          successMessage.type === 'investigation' ? 'text-blue-600' : 
                          successMessage.type === 'reschedule' ? 'text-orange-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Doctor</p>
                        <p className="text-sm font-semibold text-gray-900">{successMessage.doctorName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          successMessage.type === 'investigation'
                            ? 'bg-blue-100'
                            : successMessage.type === 'reschedule'
                            ? 'bg-orange-100'
                            : 'bg-green-100'
                        }`}>
                          <Calendar className={`h-5 w-5 ${
                            successMessage.type === 'investigation' ? 'text-blue-600' : 
                            successMessage.type === 'reschedule' ? 'text-orange-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Date</p>
                          <p className="text-sm font-semibold text-gray-900">{successMessage.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          successMessage.type === 'investigation'
                            ? 'bg-blue-100'
                            : successMessage.type === 'reschedule'
                            ? 'bg-orange-100'
                            : 'bg-green-100'
                        }`}>
                          <svg className={`h-5 w-5 ${
                            successMessage.type === 'investigation' ? 'text-blue-600' : 
                            successMessage.type === 'reschedule' ? 'text-orange-600' : 'text-green-600'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Time</p>
                          <p className="text-sm font-semibold text-gray-900">{successMessage.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className={`w-full font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl ${
                    successMessage.type === 'investigation'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                      : successMessage.type === 'reschedule'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500'
                      : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OPDManagement;


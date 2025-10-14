import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Heart, 
  Search, 
  Eye,
  Calendar,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Activity,
  ArrowRight,
  Plus,
  UserCheck,
  ClipboardList,
  Shield,
  TrendingUp,
  Download,
  Clock,
  AlertCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  MessageSquare,
  Edit,
  CheckCircle
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';
import NursePatientDetailsModal from '../../components/modals/NursePatientDetailsModal';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';

const PostOpFollowUp = () => {
  const navigate = useNavigate();
  const { openPatientDetails } = usePatientDetails();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Recovery');
  const [selectedDoctor, setSelectedDoctor] = useState('All Doctors');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedPatientForSchedule, setSelectedPatientForSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    type: 'followup',
    doctor: '',
    notes: ''
  });
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);
  const [isNursePatientDetailsModalOpen, setIsNursePatientDetailsModalOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  
  // Calendar view states
  const [activeFilter, setActiveFilter] = useState('Post-Op Patients');
  const [calendarViewMode, setCalendarViewMode] = useState('calendar'); // week, calendar, daily
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  
  
  // Drag and drop states
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [rescheduleData, setRescheduleData] = useState(null);

  // PSA tooltip states
  const [hoveredPSA, setHoveredPSA] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Edit and notes states
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Local appointments state for drag and drop updates
  const [localAppointments, setLocalAppointments] = useState([]);

  // Initialize local appointments state
  useEffect(() => {
    const allAppointments = [];
    mockPostOpPatients.forEach(patient => {
      if (patient.appointmentScheduled) {
        allAppointments.push({
          ...patient,
          id: `${patient.id}-${patient.scheduledDate}-${patient.scheduledTime}`,
          date: patient.scheduledDate,
          time: patient.scheduledTime,
          title: 'Follow-up',
          interval: 3, // Default interval for post-op patients
          status: 'Scheduled',
          assignedDoctor: patient.assignedDoctor
        });
      }
    });
    setLocalAppointments(allAppointments);
  }, []);

  // Available doctors list
  const availableDoctors = [
    'Dr. Michael Chen',
    'Dr. Sarah Wilson',
    'Dr. Emma Wilson',
    'Dr. James Brown',
    'Dr. Lisa Davis'
  ];

  // Mock post-op follow-up data
  const mockPostOpPatients = [
    {
      id: 'POSTOP001',
      patientName: 'Robert Davis',
      upi: 'URP2024004',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      surgeryDate: '2024-01-20',
      surgeryType: 'RALP',
      surgeon: 'Dr. Sarah Wilson',
      status: 'Recovery',
      followUpStatus: 'In Progress',
      dischargeStatus: 'Pending',
      lastPSA: 0.02,
      lastPSADate: '2024-01-10',
      nextFollowUp: '2024-02-20',
      appointmentScheduled: true,
      scheduledDate: '2025-10-15',
      scheduledTime: '10:00',
      assignedDoctor: 'Dr. Sarah Wilson',
      histopathology: {
        gleasonScore: '3+4',
        marginStatus: 'Negative',
        stage: 'pT2c',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'Mild ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-25',
        continence: 'Good',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'Low Risk',
      notes: 'Excellent recovery, PSA undetectable',
      dischargeReady: false,
      psaHistory: [
        { date: '2023-12-15', value: 6.8, notes: 'Pre-surgical PSA level' },
        { date: '2024-01-10', value: 0.02, notes: 'Post-operative PSA, excellent response' },
        { date: '2024-01-25', value: 0.02, notes: 'Follow-up PSA, stable' },
        { date: '2024-04-15', value: 0.01, notes: '3-month follow-up, PSA undetectable' },
        { date: '2024-07-15', value: 0.02, notes: '6-month follow-up, minimal PSA' },
        { date: '2024-10-15', value: 0.01, notes: '9-month follow-up, excellent control' }
      ],
      dischargeSummaries: [
        {
          id: 'DS001',
          date: '2024-01-25',
          procedure: 'RALP (Robotic Assisted Laparoscopic Prostatectomy)',
          diagnosis: 'Prostate Cancer, Gleason Score 3+4, pT2c',
          dischargeNotes: 'Patient recovered well from surgery. Catheter removed on day 5 post-op. No significant complications. Patient demonstrates good understanding of post-operative care instructions.',
          followUpInstructions: 'Follow-up in 3 months for PSA check. Continue pelvic floor exercises. Monitor for urinary incontinence. Report any fever, bleeding, or severe pain immediately.',
          psaPreOp: '6.8',
          psaPostOp: '0.02',
          createdBy: 'Jennifer Lee',
          createdAt: '2024-01-25T10:30:00Z'
        }
      ]
    },
    {
      id: 'POSTOP002',
      patientName: 'David Wilson',
      upi: 'URP2024003',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      email: 'david.wilson@email.com',
      surgeryDate: '2024-01-15',
      surgeryType: 'RALP',
      surgeon: 'Dr. Michael Chen',
      status: 'Follow-up',
      followUpStatus: 'Complete',
      dischargeStatus: 'Ready',
      lastPSA: 0.05,
      lastPSADate: '2024-01-12',
      nextFollowUp: '2024-04-15',
      appointmentScheduled: true,
      scheduledDate: '2025-10-20',
      scheduledTime: '14:30',
      assignedDoctor: 'Dr. Michael Chen',
      histopathology: {
        gleasonScore: '3+3',
        marginStatus: 'Negative',
        stage: 'pT2a',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'None',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-20',
        continence: 'Excellent',
        painLevel: 'None',
        mobility: 'Excellent'
      },
      riskAssessment: 'Low Risk',
      notes: 'Ready for discharge to GP care',
      dischargeReady: true,
      psaHistory: [
        { date: '2023-11-20', value: 5.2, notes: 'Pre-operative baseline' },
        { date: '2024-01-12', value: 0.05, notes: 'Post-surgery PSA, good response' },
        { date: '2024-01-25', value: 0.05, notes: 'Stable post-operative level' }
      ],
      dischargeSummaries: [
        {
          id: 'DS002',
          date: '2024-01-20',
          procedure: 'RALP (Robotic Assisted Laparoscopic Prostatectomy)',
          diagnosis: 'Prostate Cancer, Gleason Score 3+3, pT2a',
          dischargeNotes: 'Excellent post-operative recovery. Patient is continent and mobile. All vital signs stable. Ready for discharge to GP care.',
          followUpInstructions: 'GP to monitor PSA levels every 3 months for first year. Continue regular physical activity. Maintain healthy diet. Contact urology if PSA rises above 0.2 ng/mL.',
          psaPreOp: '5.2',
          psaPostOp: '0.05',
          createdBy: 'Sarah Thompson',
          createdAt: '2024-01-20T14:15:00Z'
        }
      ]
    },
    {
      id: 'POSTOP003',
      patientName: 'James Anderson',
      upi: 'URP2024005',
      age: 55,
      gender: 'Male',
      phone: '+61 456 789 012',
      email: 'james.anderson@email.com',
      surgeryDate: '2024-01-10',
      surgeryType: 'RALP',
      surgeon: 'Dr. Sarah Wilson',
      status: 'High Risk',
      followUpStatus: 'In Progress',
      dischargeStatus: 'MDT Review',
      lastPSA: 0.3,
      lastPSADate: '2024-01-14',
      nextFollowUp: '2024-02-10',
      appointmentScheduled: true,
      scheduledDate: '2025-10-25',
      scheduledTime: '11:30',
      assignedDoctor: 'Dr. Sarah Wilson',
      histopathology: {
        gleasonScore: '4+3',
        marginStatus: 'Positive',
        stage: 'pT3a',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'Mild incontinence',
        sexual: 'Moderate ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-18',
        continence: 'Improving',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'High Risk',
      notes: 'Positive margins, possible biochemical recurrence',
      dischargeReady: false,
      psaHistory: [
        { date: '2023-12-05', value: 8.1, notes: 'High pre-surgical PSA' },
        { date: '2024-01-14', value: 0.3, notes: 'Post-surgery PSA, moderate response' },
        { date: '2024-01-28', value: 0.3, notes: 'Consistent post-operative level' }
      ]
    },
    {
      id: 'POSTOP004',
      patientName: 'Michael Thompson',
      upi: 'URP2024009',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'michael.thompson@email.com',
      surgeryDate: '2024-01-05',
      surgeryType: 'RALP',
      surgeon: 'Dr. Michael Chen',
      status: 'Recovery',
      followUpStatus: 'In Progress',
      dischargeStatus: 'Pending',
      lastPSA: 0.08,
      lastPSADate: '2024-01-08',
      nextFollowUp: '2024-02-05',
      appointmentScheduled: true,
      scheduledDate: '2025-11-05',
      scheduledTime: '09:15',
      assignedDoctor: 'Dr. Michael Chen',
      histopathology: {
        gleasonScore: '3+4',
        marginStatus: 'Negative',
        stage: 'pT2b',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'Mild ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-12',
        continence: 'Good',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'Intermediate Risk',
      notes: 'Good recovery, monitoring PSA levels',
      dischargeReady: false,
      psaHistory: [
        { date: '2023-12-10', value: 7.2, notes: 'Pre-surgical PSA level' },
        { date: '2024-01-08', value: 0.08, notes: 'Post-operative PSA, good response' },
        { date: '2024-01-22', value: 0.08, notes: 'Stable post-surgical level' }
      ]
    },
    {
      id: 'POSTOP005',
      patientName: 'Christopher Lee',
      upi: 'URP2024012',
      age: 59,
      gender: 'Male',
      phone: '+61 416 789 012',
      email: 'christopher.lee@email.com',
      surgeryDate: '2024-01-28',
      surgeryType: 'RALP',
      surgeon: 'Dr. Emma Wilson',
      status: 'Recovery',
      followUpStatus: 'In Progress',
      dischargeStatus: 'Pending',
      lastPSA: 0.12,
      lastPSADate: '2024-02-01',
      nextFollowUp: '2024-02-28',
      appointmentScheduled: true,
      scheduledDate: '2025-11-12',
      scheduledTime: '11:00',
      assignedDoctor: 'Dr. Emma Wilson',
      histopathology: {
        gleasonScore: '4+3',
        marginStatus: 'Negative',
        stage: 'pT2c',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'Mild incontinence',
        sexual: 'Moderate ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-02-02',
        continence: 'Improving',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'High Risk',
      notes: 'Recovery progressing well, continence improving',
      dischargeReady: false
    },
    {
      id: 'POSTOP006',
      patientName: 'Mark Johnson',
      upi: 'URP2024013',
      age: 67,
      gender: 'Male',
      phone: '+61 427 890 123',
      email: 'mark.johnson@email.com',
      surgeryDate: '2024-01-22',
      surgeryType: 'RALP',
      surgeon: 'Dr. James Brown',
      status: 'Follow-up',
      followUpStatus: 'Complete',
      dischargeStatus: 'Ready',
      lastPSA: 0.03,
      lastPSADate: '2024-01-25',
      nextFollowUp: '2024-04-22',
      appointmentScheduled: true,
      scheduledDate: '2025-11-18',
      scheduledTime: '09:30',
      assignedDoctor: 'Dr. James Brown',
      histopathology: {
        gleasonScore: '3+3',
        marginStatus: 'Negative',
        stage: 'pT2a',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'None',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-25',
        continence: 'Excellent',
        painLevel: 'None',
        mobility: 'Excellent'
      },
      riskAssessment: 'Low Risk',
      notes: 'Excellent recovery, ready for discharge to GP care',
      dischargeReady: true
    },
    {
      id: 'POSTOP007',
      patientName: 'Steven Garcia',
      upi: 'URP2024014',
      age: 54,
      gender: 'Male',
      phone: '+61 438 901 234',
      email: 'steven.garcia@email.com',
      surgeryDate: '2024-01-18',
      surgeryType: 'RALP',
      surgeon: 'Dr. Lisa Davis',
      status: 'High Risk',
      followUpStatus: 'In Progress',
      dischargeStatus: 'MDT Review',
      lastPSA: 0.4,
      lastPSADate: '2024-01-20',
      nextFollowUp: '2024-02-18',
      appointmentScheduled: true,
      scheduledDate: '2025-11-22',
      scheduledTime: '14:45',
      assignedDoctor: 'Dr. Lisa Davis',
      histopathology: {
        gleasonScore: '4+4',
        marginStatus: 'Positive',
        stage: 'pT3b',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'Moderate incontinence',
        sexual: 'Severe ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-21',
        continence: 'Poor',
        painLevel: 'Moderate',
        mobility: 'Fair'
      },
      riskAssessment: 'High Risk',
      notes: 'Positive margins, elevated PSA, requires MDT review',
      dischargeReady: false
    },
    {
      id: 'POSTOP008',
      patientName: 'Anthony Martinez',
      upi: 'URP2024015',
      age: 61,
      gender: 'Male',
      phone: '+61 449 012 345',
      email: 'anthony.martinez@email.com',
      surgeryDate: '2024-01-30',
      surgeryType: 'RALP',
      surgeon: 'Dr. Michael Chen',
      status: 'Recovery',
      followUpStatus: 'In Progress',
      dischargeStatus: 'Pending',
      lastPSA: 0.15,
      lastPSADate: '2024-02-02',
      nextFollowUp: '2024-02-28',
      appointmentScheduled: true,
      scheduledDate: '2025-11-28',
      scheduledTime: '14:00',
      assignedDoctor: 'Dr. Michael Chen',
      histopathology: {
        gleasonScore: '3+4',
        marginStatus: 'Negative',
        stage: 'pT2b',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'Mild ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-02-03',
        continence: 'Good',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'Intermediate Risk',
      notes: 'Good recovery, PSA levels within expected range',
      dischargeReady: false
    }
  ];

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showScheduleModal || showRescheduleModal || isBookAppointmentModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showScheduleModal, showRescheduleModal, isBookAppointmentModalOpen]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low Risk': return 'bg-green-100 text-green-800';
      case 'Intermediate Risk': return 'bg-yellow-100 text-yellow-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarginColor = (margin) => {
    switch (margin) {
      case 'Negative': return 'bg-green-100 text-green-800';
      case 'Positive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const filteredPatients = mockPostOpPatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.surgeon.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter based on active tab
    const statusMatch = 
      (statusFilter === 'Recovery' && patient.status === 'Recovery') ||
      (statusFilter === 'Follow-up' && patient.status === 'Follow-up') ||
      (statusFilter === 'High Risk' && patient.status === 'High Risk');
    
    const doctorMatch = selectedDoctor === 'All Doctors' || 
      patient.surgeon === selectedDoctor;
    
    return searchMatch && statusMatch && doctorMatch;
  });



  const handleScheduleFollowUp = (patientId) => {
    const patient = mockPostOpPatients.find(p => p.id === patientId);
    setSelectedPatientForSchedule(patient);
    setShowScheduleModal(true);
  };

  const handleReschedule = (patientId) => {
    const patient = mockPostOpPatients.find(p => p.id === patientId);
    setSelectedPatientForSchedule(patient);
    
    // Pre-populate form with existing appointment details
    if (patient.appointmentScheduled) {
      setScheduleForm({
        date: patient.scheduledDate || '',
        time: patient.scheduledTime || '',
        type: 'followup',
        doctor: patient.assignedDoctor || '',
        notes: ''
      });
    }
    
    setShowRescheduleModal(true);
  };

  const handleScheduleFormChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    console.log('Scheduling follow-up for patient:', selectedPatientForSchedule?.id, scheduleForm);
    
    // Reset form and close modal
    setScheduleForm({
      date: '',
      time: '',
      type: 'followup',
      doctor: '',
      notes: ''
    });
    setSelectedPatientForSchedule(null);
    setShowScheduleModal(false);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would update the existing appointment
    console.log('Rescheduling follow-up for patient:', selectedPatientForSchedule?.id, scheduleForm);
    
    // Reset form and close modal
    setScheduleForm({
      date: '',
      time: '',
      type: 'followup',
      doctor: '',
      notes: ''
    });
    setSelectedPatientForSchedule(null);
    setShowRescheduleModal(false);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedPatientForSchedule(null);
    setScheduleForm({
      date: '',
      time: '',
      type: 'followup',
      doctor: '',
      notes: ''
    });
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedPatientForSchedule(null);
    setScheduleForm({
      date: '',
      time: '',
      type: 'followup',
      doctor: '',
      notes: ''
    });
  };

  const handleViewPatientDetails = (patientId) => {
    const patient = mockPostOpPatients.find(p => p.id === patientId);
    setSelectedPatientForDetails(patient);
    setIsNursePatientDetailsModalOpen(true);
  };

  const handleCloseNursePatientDetailsModal = () => {
    setIsNursePatientDetailsModalOpen(false);
    setSelectedPatientForDetails(null);
  };

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

  const handleCloseAppointmentModal = () => {
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
  };




  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockPostOpPatients.filter(patient => 
      patient.appointmentScheduled && patient.scheduledDate === dateStr
    );
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-AU');
  };

  // Get all appointments for calendar view from local state
  const getAllAppointments = () => {
    return localAppointments;
  };

  // Calendar helper functions
  function getWeekDates(date) {
    const week = [];
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  }

  const getSurveillanceIntervalColor = (interval) => {
    switch (interval) {
      case 3: return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 6: return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 9: return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 12: return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  // Calendar view rendering functions
  const renderWeekView = () => {
    const weekDates = getWeekDates(new Date(selectedDate));
    const allAppointments = getAllAppointments();
    
    const getAppointmentsForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return allAppointments.filter(apt => apt.date === dateStr);
    };

    return (
      <div className="p-6">
        {/* Week Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 7);
                setSelectedDate(newDate.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {weekDates[0].toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} - {weekDates[6].toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </h3>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 7);
                setSelectedDate(newDate.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
          
          {/* Week Days */}
          {weekDates.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const dayAppointments = getAppointmentsForDate(day);
            const isDragOver = dragOverDate && dragOverDate.toDateString() === day.toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[200px] max-h-[400px] p-2 border border-gray-200 rounded-lg transition-all duration-200 flex flex-col ${
                  isToday ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white'
                } ${
                  isDragOver ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className={`text-sm font-medium mb-2 flex-shrink-0 ${
                  isToday ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {dayAppointments.map(appointment => {
                    const colors = getSurveillanceIntervalColor(appointment.interval);
                    return (
                      <div
                        key={appointment.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, appointment)}
                        onDragEnd={handleDragEnd}
                        className={`text-xs p-1 rounded cursor-move transition-all duration-200 flex-shrink-0 ${
                          appointment.interval === 3 ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                          appointment.interval === 6 ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          appointment.interval === 9 ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        } hover:shadow-md hover:scale-105`}
                        onClick={() => handleViewAppointment(appointment)}
                        title="Drag to reschedule"
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>{appointment.time}</span>
                          <span className="text-xs opacity-60">⋮⋮</span>
                        </div>
                        <div className="truncate">{appointment.patientName}</div>
                      </div>
                    );
                  })}
                  {dayAppointments.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-2">
                      No appointments
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendarView = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const calendarDays = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      calendarDays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const allAppointments = getAllAppointments();
    const getAppointmentsForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return allAppointments.filter(apt => apt.date === dateStr);
    };
    
    const navigateMonth = (direction) => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      setCurrentMonth(newMonth);
    };
    
    return (
      <div className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const dayAppointments = getAppointmentsForDate(day);
            const isDragOver = dragOverDate && dragOverDate.toDateString() === day.toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[120px] max-h-[200px] p-2 border border-gray-200 rounded-lg transition-all duration-200 flex flex-col ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'ring-2 ring-green-500' : ''} ${
                  isDragOver ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className={`text-sm font-medium mb-2 flex-shrink-0 ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'text-green-600' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {dayAppointments.map(appointment => {
                    const colors = getSurveillanceIntervalColor(appointment.interval);
                    return (
                      <div
                        key={appointment.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, appointment)}
                        onDragEnd={handleDragEnd}
                        className={`text-xs p-1 rounded cursor-move transition-all duration-200 flex-shrink-0 ${
                          appointment.interval === 3 ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                          appointment.interval === 6 ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          appointment.interval === 9 ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        } hover:shadow-md hover:scale-105`}
                        onClick={() => handleViewAppointment(appointment)}
                        title="Drag to reschedule"
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>{appointment.time}</span>
                          <span className="text-xs opacity-60">⋮⋮</span>
                        </div>
                        <div className="truncate">{appointment.patientName}</div>
                      </div>
                    );
                  })}
                  {dayAppointments.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-2">
                      No appointments
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDailyView = () => {
    const selectedDateObj = new Date(selectedDate);
    const allAppointments = getAllAppointments();
    const dayAppointments = allAppointments.filter(apt => apt.date === selectedDate);
    
    // Sort appointments by time
    const sortedAppointments = dayAppointments.sort((a, b) => {
      const timeA = a.time.replace(/[^\d]/g, '');
      const timeB = b.time.replace(/[^\d]/g, '');
      return timeA.localeCompare(timeB);
    });

    const navigateDay = (direction) => {
      const newDate = new Date(selectedDateObj);
      newDate.setDate(newDate.getDate() + direction);
      setSelectedDate(newDate.toISOString().split('T')[0]);
    };
    
    return (
      <div className="p-6">
        {/* Daily Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDay(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedDateObj.toLocaleDateString('en-AU', { 
                weekday: 'long',
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => navigateDay(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {sortedAppointments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {sortedAppointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  onClick={() => handleViewAppointment(appointment)}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Time */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-200">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-900">{appointment.time}</div>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 truncate">
                            {appointment.patientName}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {appointment.upi}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              appointment.interval === 3 ? 'bg-blue-500' :
                              appointment.interval === 6 ? 'bg-green-500' :
                              appointment.interval === 9 ? 'bg-yellow-500' :
                              'bg-purple-500'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-700">{appointment.title}</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {appointment.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Stethoscope className="h-4 w-4" />
                            <span>{appointment.assignedDoctor}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.interval} months</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {appointment.interval}M
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No appointments scheduled
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                There are no follow-up appointments scheduled for {selectedDateObj.toLocaleDateString('en-AU', { 
                  weekday: 'long',
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Drag and drop functions
  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedAppointment(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e, date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverDate(null);
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    setDragOverDate(null);
    
    if (draggedAppointment && targetDate) {
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const originalDateStr = draggedAppointment.date;
      
      // Don't allow dropping on the same date
      if (targetDateStr === originalDateStr) {
        return;
      }
      
      // Show confirmation modal
      setRescheduleData({
        appointment: draggedAppointment,
        originalDate: originalDateStr,
        newDate: targetDateStr,
        newDateFormatted: targetDate.toLocaleDateString('en-AU')
      });
      setShowRescheduleModal(true);
    }
  };

  const confirmReschedule = () => {
    if (rescheduleData) {
      console.log('Before reschedule:', localAppointments.filter(apt => apt.patientName === rescheduleData.appointment.patientName));
      
      // Update the appointment date in the local state - only the specific dragged appointment
      const updatedAppointments = localAppointments.map(apt => {
        // Match by multiple criteria to ensure we're updating the right appointment
        if (apt.id === rescheduleData.appointment.id && 
            apt.patientName === rescheduleData.appointment.patientName &&
            apt.date === rescheduleData.originalDate &&
            apt.time === rescheduleData.appointment.time) {
          console.log(`Updating appointment: ${apt.patientName} at ${apt.time} from ${apt.date} to ${rescheduleData.newDate}`);
          return { ...apt, date: rescheduleData.newDate };
        }
        return apt;
      });
      
      setLocalAppointments(updatedAppointments);
      
      console.log('After reschedule:', updatedAppointments.filter(apt => apt.patientName === rescheduleData.appointment.patientName));
      
      // Close modal and reset states
      setShowRescheduleModal(false);
      setRescheduleData(null);
      setDraggedAppointment(null);
    }
  };

  const cancelReschedule = () => {
    setShowRescheduleModal(false);
    setRescheduleData(null);
    setDraggedAppointment(null);
  };

  // Modal handlers
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment) => {
    setEditFormData({
      id: appointment.id,
      date: appointment.scheduledDate,
      time: appointment.scheduledTime,
      type: 'followup',
      doctor: appointment.assignedDoctor,
      notes: ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Edit appointment:', editFormData);
    setShowEditModal(false);
    setEditFormData({});
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData({});
  };

  const handleNotesClick = (appointment) => {
    setEditFormData({
      id: appointment.id,
      notes: appointment.notes || ''
    });
    setShowNotesModal(true);
  };

  const handleNotesSubmit = (e) => {
    e.preventDefault();
    console.log('Update notes:', editFormData);
    setShowNotesModal(false);
    setEditFormData({});
  };

  const closeNotesModal = () => {
    setShowNotesModal(false);
    setEditFormData({});
  };

  return (
    <div className="space-y-6">
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
      
      {/* Header with Simple Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Post-Op Follow-Up</h2>
            <p className="text-sm text-gray-600 mt-1">Manage recovery and discharge planning</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            {['Post-Op Patients', 'Calendar'].map((filter) => (
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
                    {filter === 'Post-Op Patients' ? mockPostOpPatients.length : getAllAppointments().length}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      {activeFilter === 'Post-Op Patients' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Search Bar and Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, UPI, or surgeon..."
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
            
            {/* Doctor Filter */}
            <div className="relative">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400 bg-white min-w-[180px] appearance-none cursor-pointer"
              >
                <option value="All Doctors">All Doctors</option>
                {availableDoctors.map(doctor => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredPatients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surgery Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Latest PSA</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">View</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {patient.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {patient.status === 'High Risk' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                          )}
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
                        <p className="font-medium text-gray-900">{patient.surgeryType}</p>
                        <p className="text-sm text-gray-500">{patient.surgeryDate}</p>
                        <p className="text-xs text-gray-400">Surgeon: {patient.surgeon}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          patient.lastPSA > 10 ? 'bg-red-500' : 
                          patient.lastPSA > 4 ? 'bg-amber-500' : 
                          'bg-green-500'
                        }`}></div>
                        <div>
                          <span 
                            className={`text-sm font-semibold cursor-help ${
                              patient.lastPSA > 10 ? 'text-red-600' : 
                              patient.lastPSA > 4 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}
                            onMouseEnter={(e) => handlePSAHover(e, patient)}
                            onMouseLeave={handlePSALeave}
                          >
                            {patient.lastPSA} ng/mL
                          </span>
                          <p className="text-xs text-gray-400">Next: {patient.nextFollowUp}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <button 
                        onClick={() => handleViewPatientDetails(patient.id)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span>View</span>
                      </button>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleBookAppointment(patient)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Edit Appointment</span>
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
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No post-op patients
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients match your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDoctor('All Doctors');
                    setActiveFilter('Recovery');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/urology-nurse/surgical-pathway')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Post-Op Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Calendar view with internal filtering */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Follow-up Calendar
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  View scheduled follow-up appointments by interval
                </p>
              </div>

              {/* Calendar Controls */}
              <div className="flex items-center space-x-4">
                {/* View Mode Tabs */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCalendarViewMode('daily')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      calendarViewMode === 'daily' 
                        ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                    title="Daily View"
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setCalendarViewMode('week')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      calendarViewMode === 'week' 
                        ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                    title="Week View"
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setCalendarViewMode('calendar')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      calendarViewMode === 'calendar' 
                        ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                    title="Month View"
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>
            
            {calendarViewMode === 'daily' ? renderDailyView() : calendarViewMode === 'week' ? renderWeekView() : renderCalendarView()}
          </div>
        </div>
      )}

      {/* Schedule Follow-up Modal */}
      {showScheduleModal && selectedPatientForSchedule && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Schedule Follow-up</h2>
                <p className="text-sm text-gray-600 mt-1">Patient: {selectedPatientForSchedule.patientName}</p>
              </div>
              <button
                onClick={closeScheduleModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={scheduleForm.date}
                  onChange={handleScheduleFormChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={scheduleForm.time}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Type *
                </label>
                <select
                  name="type"
                  value={scheduleForm.type}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="followup">Post-Op Follow-up</option>
                  <option value="psa_check">PSA Check</option>
                  <option value="continence_review">Continence Review</option>
                  <option value="sexual_function">Sexual Function Review</option>
                  <option value="discharge_planning">Discharge Planning</option>
                  <option value="mdt_review">MDT Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Doctor *
                </label>
                <select
                  name="doctor"
                  value={scheduleForm.doctor}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a doctor...</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={scheduleForm.notes}
                  onChange={handleScheduleFormChange}
                  rows={3}
                  placeholder="Additional notes for the follow-up..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Follow-up Modal */}
      {showRescheduleModal && selectedPatientForSchedule && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Reschedule Follow-up</h2>
                <p className="text-sm text-gray-600 mt-1">Patient: {selectedPatientForSchedule.patientName}</p>
              </div>
              <button
                onClick={closeRescheduleModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Follow-up Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={scheduleForm.date}
                  onChange={handleScheduleFormChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Follow-up Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={scheduleForm.time}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Doctor *
                </label>
                <select
                  name="doctor"
                  value={scheduleForm.doctor}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a doctor...</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Reschedule
                </label>
                <textarea
                  name="notes"
                  value={scheduleForm.notes}
                  onChange={handleScheduleFormChange}
                  rows={3}
                  placeholder="Please provide reason for rescheduling..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Book Appointment Modal */}
      <BookAppointmentModalWithPatient
        isOpen={isBookAppointmentModalOpen}
        onClose={handleCloseAppointmentModal}
        onAppointmentBooked={handleAppointmentBooked}
        selectedPatientData={selectedPatientForAppointment}
      />


      {/* Reschedule Confirmation Modal */}
      {showRescheduleModal && rescheduleData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
                  <p className="text-sm text-gray-600">Confirm the appointment rescheduling</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {rescheduleData.appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{rescheduleData.appointment.patientName}</h4>
                      <p className="text-sm text-gray-600">UPI: {rescheduleData.appointment.upi}</p>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Appointment Type:</span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {rescheduleData.appointment.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Current Date:</span>
                    <span className="text-sm text-gray-900">{rescheduleData.originalDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">New Date:</span>
                    <span className="text-sm font-semibold text-blue-600">{rescheduleData.newDateFormatted}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">Time:</span>
                    <span className="text-sm text-gray-900">{rescheduleData.appointment.time}</span>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Rescheduling this appointment will update the patient's follow-up schedule. 
                        Please ensure the new date and time are appropriate for the patient's care plan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={cancelReschedule}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReschedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm Reschedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                    <p className="text-sm text-gray-600">Follow-up appointment information</p>
                  </div>
                </div>
                <button
                  onClick={closeAppointmentModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedAppointment.patientName}</div>
                    <div><span className="font-medium">UPI:</span> {selectedAppointment.upi}</div>
                    <div><span className="font-medium">Age:</span> {selectedAppointment.age}</div>
                    <div><span className="font-medium">Gender:</span> {selectedAppointment.gender}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Appointment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Date:</span> {formatDate(selectedAppointment.scheduledDate)}</div>
                    <div><span className="font-medium">Time:</span> {selectedAppointment.scheduledTime}</div>
                    <div><span className="font-medium">Type:</span> Follow-up</div>
                    <div><span className="font-medium">Doctor:</span> {selectedAppointment.assignedDoctor}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Surgery Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Surgery:</span> {selectedAppointment.surgeryType}</div>
                    <div><span className="font-medium">Date:</span> {selectedAppointment.surgeryDate}</div>
                    <div><span className="font-medium">Surgeon:</span> {selectedAppointment.surgeon}</div>
                    <div><span className="font-medium">Latest PSA:</span> {selectedAppointment.lastPSA} ng/mL</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeAppointmentModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditAppointment(selectedAppointment)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2 inline" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Nurse Patient Details Modal */}
      <NursePatientDetailsModal
        isOpen={isNursePatientDetailsModalOpen}
        onClose={handleCloseNursePatientDetailsModal}
        patientId={selectedPatientForDetails?.id}
        patientData={selectedPatientForDetails}
        userRole="urology-nurse"
        source="postOpFollowUp"
        context="postOpFollowUp"
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
                Current PSA: {hoveredPSA.lastPSA} ng/mL
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
    </div>
  );
};

export default PostOpFollowUp;

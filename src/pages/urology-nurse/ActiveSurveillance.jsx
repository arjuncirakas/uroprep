import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Activity, 
  Search, 
  Eye,
  Calendar,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  MessageSquare,
  Edit,
  GripVertical,
  CheckCircle,
  TrendingUp,
  Heart,
  BarChart3
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';
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

const ActiveSurveillance = () => {
  const navigate = useNavigate();
  const { openPatientDetails } = usePatientDetails();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Patients in Monitoring');
  const [calendarViewMode, setCalendarViewMode] = useState('calendar'); // week, calendar
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarFilter, setCalendarFilter] = useState('All Intervals'); // All Intervals, 3 Month, 6 Month, 9 Month, 12 Month
  const [isPSAModalOpen, setIsPSAModalOpen] = useState(false);
  const [selectedPatientForPSA, setSelectedPatientForPSA] = useState(null);
  const [psaForm, setPsaForm] = useState({
    date: '',
    value: '',
    notes: ''
  });
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Drag and drop states
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  
  // Edit and notes states
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  
  // Local appointments state for drag and drop updates
  const [localAppointments, setLocalAppointments] = useState([]);
  
  // PSA tooltip states
  const [hoveredPSA, setHoveredPSA] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // PSA monitoring modal states
  const [showPSAMonitoringModal, setShowPSAMonitoringModal] = useState(false);
  const [selectedPatientForPSAMonitoring, setSelectedPatientForPSAMonitoring] = useState(null);
  const [psaChartFilter, setPsaChartFilter] = useState('6months');
  const [psaChartType, setPsaChartType] = useState('line');

  // Initialize local appointments state
  useEffect(() => {
    const allAppointments = [];
    mockSurveillancePatients.forEach(patient => {
      patient.autoScheduledAppointments.forEach((appointment, index) => {
        allAppointments.push({
          ...appointment,
          id: `${patient.id}-${appointment.date}-${appointment.time}-${index}`, // Make ID unique
          patientId: patient.id,
          patientName: patient.patientName,
          upi: patient.upi,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          lastPSA: patient.lastPSA,
          psaVelocity: patient.psaVelocity,
          riskCategory: patient.riskCategory,
          gleasonScore: patient.gleasonScore,
          lastMRI: patient.lastMRI,
          lastBiopsy: patient.lastBiopsy,
          assignedDoctor: appointment.assignedDoctor || 'Dr. Michael Chen'
        });
      });
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

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (isPSAModalOpen || isBookAppointmentModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPSAModalOpen, isBookAppointmentModalOpen]);

  // Mock active surveillance data with automatic scheduling
  const mockSurveillancePatients = [
    {
      id: 'SURV001',
      patientName: 'Michael Brown',
      upi: 'URP2024002',
      age: 58,
      gender: 'Male',
      phone: '+61 423 456 789',
      email: 'michael.brown@email.com',
      status: 'Active',
      lastPSA: 5.2,
      lastPSADate: '2024-01-05',
      psaVelocity: 0.3,
      surveillanceInterval: 3, // months
      nextReview: '2024-04-05',
      appointmentScheduled: true,
      scheduledDate: '2024-04-05',
      scheduledTime: '10:30',
      assignedDoctor: 'Dr. Michael Chen',
      lastMRI: '2023-10-15',
      lastBiopsy: '2023-08-20',
      gleasonScore: '3+3',
      riskCategory: 'Low',
      notes: 'Stable PSA, continue surveillance',
      autoScheduledAppointments: [
        { date: '2025-10-15', interval: 3, status: 'Scheduled', time: '10:30', title: '3M PSA Review' },
        { date: '2025-10-15', interval: 3, status: 'Scheduled', time: '14:00', title: '3M PSA Review' },
        { date: '2025-10-20', interval: 3, status: 'Scheduled', time: '09:00', title: '3M PSA Review' },
        { date: '2025-10-20', interval: 3, status: 'Scheduled', time: '15:30', title: '3M PSA Review' },
        { date: '2025-11-10', interval: 3, status: 'Scheduled', time: '10:30', title: '3M PSA Review' },
        { date: '2025-11-10', interval: 3, status: 'Scheduled', time: '16:00', title: '3M PSA Review' },
        { date: '2025-12-15', interval: 3, status: 'Future', time: '10:30', title: '3M PSA Review' },
        { date: '2025-12-15', interval: 3, status: 'Future', time: '13:15', title: '3M PSA Review' },
        { date: '2025-12-20', interval: 3, status: 'Future', time: '10:30', title: '3M PSA Review' }
      ],
      psaHistory: [
        { date: '2023-01-15', value: 4.8, notes: 'Initial baseline PSA measurement' },
        { date: '2023-04-15', value: 4.9, notes: 'Stable PSA, continue monitoring' },
        { date: '2023-07-15', value: 5.0, notes: 'Slight increase, within normal range' },
        { date: '2023-10-15', value: 5.1, notes: 'PSA trending upward, monitor closely' },
        { date: '2024-01-05', value: 5.2, notes: 'Latest measurement, patient stable' }
      ],
      monthlyPSA: {
        '3Month': 5.0,
        '6Month': 4.9,
        '9Month': 5.1,
        '12Month': 4.8
      }
    },
    {
      id: 'SURV002',
      patientName: 'William Thompson',
      upi: 'URP2024006',
      age: 68,
      gender: 'Male',
      phone: '+61 467 890 123',
      email: 'william.thompson@email.com',
      status: 'Active',
      lastPSA: 4.5,
      lastPSADate: '2024-01-09',
      psaVelocity: 0.8,
      surveillanceInterval: 6, // months
      nextReview: '2024-07-09',
      appointmentScheduled: true,
      scheduledDate: '2024-07-09',
      scheduledTime: '14:15',
      assignedDoctor: 'Dr. Sarah Wilson',
      lastMRI: '2023-11-20',
      lastBiopsy: '2023-09-10',
      gleasonScore: '3+4',
      riskCategory: 'High',
      notes: 'PSA velocity concern, review protocol',
      autoScheduledAppointments: [
        { date: '2025-10-15', interval: 6, status: 'Scheduled', time: '11:00', title: '6M PSA Review' },
        { date: '2025-10-15', interval: 6, status: 'Scheduled', time: '16:30', title: '6M PSA Review' },
        { date: '2025-10-18', interval: 6, status: 'Scheduled', time: '14:15', title: '6M PSA Review' },
        { date: '2025-10-25', interval: 6, status: 'Scheduled', time: '10:30', title: '6M PSA Review' },
        { date: '2025-10-25', interval: 6, status: 'Scheduled', time: '15:00', title: '6M PSA Review' },
        { date: '2025-11-05', interval: 6, status: 'Scheduled', time: '11:30', title: '6M PSA Review' },
        { date: '2025-11-10', interval: 6, status: 'Scheduled', time: '09:30', title: '6M PSA Review' },
        { date: '2025-12-10', interval: 6, status: 'Future', time: '14:15', title: '6M PSA Review' },
        { date: '2025-12-15', interval: 6, status: 'Future', time: '14:15', title: '6M PSA Review' },
        { date: '2025-12-20', interval: 6, status: 'Future', time: '11:45', title: '6M PSA Review' }
      ],
      psaHistory: [
        { date: '2023-01-09', value: 3.8, notes: 'Baseline measurement' },
        { date: '2023-04-09', value: 4.0, notes: 'Normal progression' },
        { date: '2023-07-09', value: 4.2, notes: 'PSA velocity concern noted' },
        { date: '2023-10-09', value: 4.3, notes: 'Continue monitoring' },
        { date: '2024-01-09', value: 4.5, notes: 'Recent measurement, stable' }
      ],
      monthlyPSA: {
        '3Month': 4.3,
        '6Month': 4.2,
        '9Month': 4.0,
        '12Month': 3.8
      }
    },
    {
      id: 'SURV003',
      patientName: 'David Wilson',
      upi: 'URP2024003',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      email: 'david.wilson@email.com',
      status: 'Escalated',
      lastPSA: 4.8,
      lastPSADate: '2024-01-03',
      psaVelocity: 1.2,
      surveillanceInterval: 9, // months
      nextReview: '2024-10-03',
      appointmentScheduled: true,
      scheduledDate: '2024-10-03',
      scheduledTime: '09:30',
      assignedDoctor: 'Dr. James Brown',
      lastMRI: '2023-12-15',
      lastBiopsy: '2023-10-05',
      gleasonScore: '3+4',
      riskCategory: 'High',
      notes: 'PSA velocity >0.75 ng/mL/year - MDT review required',
      autoScheduledAppointments: [
        { date: '2025-10-12', interval: 9, status: 'Scheduled', time: '09:30', title: '9M PSA Review' },
        { date: '2025-10-12', interval: 9, status: 'Scheduled', time: '13:45', title: '9M PSA Review' },
        { date: '2025-10-15', interval: 9, status: 'Scheduled', time: '08:30', title: '9M PSA Review' },
        { date: '2025-10-15', interval: 9, status: 'Scheduled', time: '17:00', title: '9M PSA Review' },
        { date: '2025-10-28', interval: 9, status: 'Scheduled', time: '02:00', title: '9M PSA Review' },
        { date: '2025-11-08', interval: 9, status: 'Scheduled', time: '08:00', title: '9M PSA Review' },
        { date: '2025-11-10', interval: 9, status: 'Scheduled', time: '12:30', title: '9M PSA Review' },
        { date: '2025-12-12', interval: 9, status: 'Future', time: '09:30', title: '9M PSA Review' },
        { date: '2025-12-15', interval: 9, status: 'Future', time: '15:45', title: '9M PSA Review' },
        { date: '2025-12-18', interval: 9, status: 'Future', time: '09:30', title: '9M PSA Review' }
      ],
      psaHistory: [
        { date: '2023-01-03', value: 3.2 },
        { date: '2023-04-03', value: 3.6 },
        { date: '2023-07-03', value: 4.0 },
        { date: '2023-10-03', value: 4.4 },
        { date: '2024-01-03', value: 4.8 }
      ],
      monthlyPSA: {
        '3Month': 4.4,
        '6Month': 4.0,
        '9Month': 3.6,
        '12Month': 3.2
      }
    },
    {
      id: 'SURV004',
      patientName: 'Robert Davis',
      upi: 'URP2024010',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      status: 'Active',
      lastPSA: 3.8,
      lastPSADate: '2023-12-20',
      psaVelocity: 0.2,
      surveillanceInterval: 12, // months
      nextReview: '2024-12-20',
      appointmentScheduled: true,
      scheduledDate: '2024-12-20',
      scheduledTime: '11:00',
      assignedDoctor: 'Dr. Lisa Davis',
      lastMRI: '2023-09-10',
      lastBiopsy: '2023-07-15',
      gleasonScore: '3+3',
      riskCategory: 'Low',
      notes: 'Excellent compliance, stable parameters',
      autoScheduledAppointments: [
        { date: '2024-12-20', interval: 12, status: 'Scheduled', time: '11:00', title: '12M PSA Review' },
        { date: '2025-12-20', interval: 24, status: 'Future', time: '11:00', title: '24M PSA Review' },
        { date: '2026-12-20', interval: 36, status: 'Future', time: '11:00', title: '36M PSA Review' }
      ],
      psaHistory: [
        { date: '2023-03-20', value: 3.6 },
        { date: '2023-06-20', value: 3.7 },
        { date: '2023-09-20', value: 3.8 },
        { date: '2023-12-20', value: 3.8 }
      ],
      monthlyPSA: {
        '3Month': 3.8,
        '6Month': 3.7,
        '9Month': 3.6,
        '12Month': 'Not Tested'
      }
    },
    {
      id: 'SURV005',
      patientName: 'Christopher Lee',
      upi: 'URP2024011',
      age: 52,
      gender: 'Male',
      phone: '+61 456 789 012',
      email: 'christopher.lee@email.com',
      status: 'Active',
      lastPSA: 4.1,
      lastPSADate: '2024-01-15',
      psaVelocity: 0.2,
      surveillanceInterval: 3, // months
      nextReview: '2024-04-15',
      appointmentScheduled: true,
      scheduledDate: '2024-04-15',
      scheduledTime: '08:30',
      assignedDoctor: 'Dr. Michael Chen',
      lastMRI: '2023-11-20',
      lastBiopsy: '2023-09-15',
      gleasonScore: '3+3',
      riskCategory: 'Low',
      notes: 'New to surveillance, good compliance',
      autoScheduledAppointments: [
        { date: '2025-10-10', interval: 3, status: 'Scheduled', time: '08:30', title: '3M PSA Review' },
        { date: '2025-10-10', interval: 3, status: 'Scheduled', time: '12:00', title: '3M PSA Review' },
        { date: '2025-10-15', interval: 3, status: 'Scheduled', time: '07:45', title: '3M PSA Review' },
        { date: '2025-10-22', interval: 3, status: 'Scheduled', time: '09:00', title: '3M PSA Review' },
        { date: '2025-10-22', interval: 3, status: 'Scheduled', time: '14:30', title: '3M PSA Review' },
        { date: '2025-11-15', interval: 3, status: 'Scheduled', time: '08:30', title: '3M PSA Review' },
        { date: '2025-11-15', interval: 3, status: 'Scheduled', time: '11:15', title: '3M PSA Review' },
        { date: '2025-12-22', interval: 3, status: 'Future', time: '08:30', title: '3M PSA Review' },
        { date: '2025-12-25', interval: 3, status: 'Future', time: '08:30', title: '3M PSA Review' }
      ],
      psaHistory: [
        { date: '2023-07-15', value: 3.8 },
        { date: '2023-10-15', value: 3.9 },
        { date: '2024-01-15', value: 4.1 }
      ],
      monthlyPSA: {
        '3Month': 3.9,
        '6Month': 3.8,
        '9Month': 'Not Tested',
        '12Month': 'Not Tested'
      }
    },
    {
      id: 'SURV006',
      patientName: 'Mark Taylor',
      upi: 'URP2024012',
      age: 60,
      gender: 'Male',
      phone: '+61 567 890 123',
      email: 'mark.taylor@email.com',
      status: 'Active',
      lastPSA: 5.8,
      lastPSADate: '2024-01-20',
      psaVelocity: 0.6,
      surveillanceInterval: 6, // months
      nextReview: '2024-07-20',
      appointmentScheduled: true,
      scheduledDate: '2024-07-20',
      scheduledTime: '14:45',
      assignedDoctor: 'Dr. Sarah Wilson',
      lastMRI: '2023-12-10',
      lastBiopsy: '2023-10-05',
      gleasonScore: '3+4',
      riskCategory: 'High',
      notes: 'Moderate risk, monitoring closely',
      autoScheduledAppointments: [
        { date: '2025-10-14', interval: 6, status: 'Scheduled', time: '14:45', title: '6M PSA Review' },
        { date: '2025-10-14', interval: 6, status: 'Scheduled', time: '09:15', title: '6M PSA Review' },
        { date: '2025-10-15', interval: 6, status: 'Scheduled', time: '13:30', title: '6M PSA Review' },
        { date: '2025-10-30', interval: 6, status: 'Scheduled', time: '10:00', title: '6M PSA Review' },
        { date: '2025-10-30', interval: 6, status: 'Scheduled', time: '15:15', title: '6M PSA Review' },
        { date: '2025-11-12', interval: 6, status: 'Scheduled', time: '11:30', title: '6M PSA Review' },
        { date: '2025-11-12', interval: 6, status: 'Scheduled', time: '08:45', title: '6M PSA Review' },
        { date: '2025-12-18', interval: 6, status: 'Future', time: '14:45', title: '6M PSA Review' },
        { date: '2025-12-25', interval: 6, status: 'Future', time: '14:45', title: '6M PSA Review' }
      ],
      psaHistory: [
        { date: '2023-01-20', value: 5.0 },
        { date: '2023-07-20', value: 5.4 },
        { date: '2024-01-20', value: 5.8 }
      ],
      monthlyPSA: {
        '3Month': 5.8,
        '6Month': 5.4,
        '9Month': 'Not Tested',
        '12Month': 5.0
      }
    },
    {
      id: 'SURV007',
      patientName: 'Steven White',
      upi: 'URP2024013',
      age: 67,
      gender: 'Male',
      phone: '+61 678 901 234',
      email: 'steven.white@email.com',
      status: 'Active',
      lastPSA: 6.2,
      lastPSADate: '2024-01-25',
      psaVelocity: 1.0,
      surveillanceInterval: 9, // months
      nextReview: '2024-10-25',
      appointmentScheduled: true,
      scheduledDate: '2024-10-25',
      scheduledTime: '10:15',
      assignedDoctor: 'Dr. James Brown',
      lastMRI: '2023-11-30',
      lastBiopsy: '2023-08-20',
      gleasonScore: '3+4',
      riskCategory: 'High',
      notes: 'High risk, frequent monitoring required',
      autoScheduledAppointments: [
        { date: '2025-10-16', interval: 12, status: 'Scheduled', time: '10:15', title: '12M PSA Review' },
        { date: '2025-10-16', interval: 12, status: 'Scheduled', time: '16:00', title: '12M PSA Review' },
        { date: '2025-10-15', interval: 12, status: 'Scheduled', time: '12:15', title: '12M PSA Review' },
        { date: '2025-10-24', interval: 12, status: 'Scheduled', time: '02:00', title: '12M PSA Review' },
        { date: '2025-10-24', interval: 12, status: 'Scheduled', time: '14:30', title: '12M PSA Review' },
        { date: '2025-11-18', interval: 12, status: 'Scheduled', time: '09:30', title: '12M PSA Review' },
        { date: '2025-11-18', interval: 12, status: 'Scheduled', time: '17:30', title: '12M PSA Review' },
        { date: '2025-12-25', interval: 12, status: 'Future', time: '10:15', title: '12M PSA Review' },
        { date: '2025-12-30', interval: 12, status: 'Future', time: '10:15', title: '12M PSA Review' }
      ],
      psaHistory: [
        { date: '2023-04-25', value: 4.8 },
        { date: '2023-07-25', value: 5.2 },
        { date: '2023-10-25', value: 5.6 },
        { date: '2024-01-25', value: 6.2 }
      ],
      monthlyPSA: {
        '3Month': 5.6,
        '6Month': 5.2,
        '9Month': 4.8,
        '12Month': 'Not Tested'
      }
    },
    {
      id: 'SURV008',
      patientName: 'Kevin Martinez',
      upi: 'URP2024014',
      age: 59,
      gender: 'Male',
      phone: '+61 789 012 345',
      email: 'kevin.martinez@email.com',
      status: 'Active',
      lastPSA: 3.2,
      lastPSADate: '2023-12-30',
      psaVelocity: 0.1,
      surveillanceInterval: 12, // months
      nextReview: '2024-12-30',
      appointmentScheduled: true,
      scheduledDate: '2024-12-30',
      scheduledTime: '09:45',
      assignedDoctor: 'Dr. Lisa Davis',
      lastMRI: '2023-08-15',
      lastBiopsy: '2023-06-10',
      gleasonScore: '3+3',
      riskCategory: 'Low',
      notes: 'Very stable, excellent compliance',
      autoScheduledAppointments: [
        { date: '2024-12-30', interval: 12, status: 'Scheduled', time: '09:45', title: '12M PSA Review' },
        { date: '2025-12-30', interval: 24, status: 'Future', time: '09:45', title: '24M PSA Review' },
        { date: '2026-12-30', interval: 36, status: 'Future', time: '09:45', title: '36M PSA Review' }
      ],
      psaHistory: [
        { date: '2022-12-30', value: 3.0 },
        { date: '2023-06-30', value: 3.1 },
        { date: '2023-12-30', value: 3.2 }
      ],
      monthlyPSA: {
        '3Month': 3.2,
        '6Month': 3.1,
        '9Month': 'Not Tested',
        '12Month': 3.0
      }
    }
  ];


  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-red-100 text-red-800';
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

  // PSA Monitoring Modal handlers
  const handlePSAMonitoring = (patient) => {
    setSelectedPatientForPSAMonitoring(patient);
    setShowPSAMonitoringModal(true);
  };

  const closePSAMonitoringModal = () => {
    setShowPSAMonitoringModal(false);
    setSelectedPatientForPSAMonitoring(null);
  };

  // PSA Chart Configuration
  const getPSAChartData = (patient, filter) => {
    const psaData = patient.psaHistory || [];
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
      types: filteredData.map(item => item.type || 'routine')
    };
  };

  const getPSAChartConfig = (patient, type = 'line') => {
    const chartData = getPSAChartData(patient, psaChartFilter);
    
    if (type === 'bar') {
      return {
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
      };
    }

    return {
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
        min: selectedPatientForPSAMonitoring ? Math.min(...getPSAChartData(selectedPatientForPSAMonitoring, psaChartFilter).psaValues) - 0.5 : 0,
        max: selectedPatientForPSAMonitoring ? Math.max(...getPSAChartData(selectedPatientForPSAMonitoring, psaChartFilter).psaValues) + 0.5 : 10,
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };


  const filteredPatients = mockSurveillancePatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchMatch;
  });

  // Get all appointments for calendar view from local state
  const getAllAppointments = () => {
    return localAppointments;
  };

  // Get filtered appointments for calendar view based on calendar filter
  const getFilteredAppointments = () => {
    const allAppointments = getAllAppointments();
    
    if (calendarFilter === 'All Intervals') {
      return allAppointments;
    }
    
    // Filter by surveillance interval
    let targetInterval;
    switch (calendarFilter) {
      case '3 Month': targetInterval = 3; break;
      case '6 Month': targetInterval = 6; break;
      case '9 Month': targetInterval = 9; break;
      case '12 Month': targetInterval = 12; break;
      default: return allAppointments;
    }
    
    return allAppointments.filter(appointment => appointment.interval === targetInterval);
  };


  const handlePSAEntry = (patientId) => {
    const patient = mockSurveillancePatients.find(p => p.id === patientId);
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




  const handleViewPatientDetails = (patientId) => {
    openPatientDetails(patientId);
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

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentDetailsModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  // Drag and drop handlers
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

  // Notes and edit handlers
  const handleAddNotes = (appointment) => {
    setSelectedAppointment(appointment);
    setShowNotesModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setEditFormData({
      time: appointment.time,
      status: appointment.status,
      assignedDoctor: appointment.assignedDoctor
    });
    setShowEditModal(true);
  };

  const handleSaveNotes = () => {
    // Update notes in the appointment
    if (selectedAppointment && editFormData.notes) {
      // Find and update the appointment notes
      mockSurveillancePatients.forEach(patient => {
        patient.autoScheduledAppointments.forEach(apt => {
          if (apt.id === selectedAppointment.id) {
            apt.notes = editFormData.notes;
          }
        });
      });
    }
    setShowNotesModal(false);
    setEditFormData({});
  };

  const handleSaveEdit = () => {
    // Update appointment details
    if (selectedAppointment) {
      mockSurveillancePatients.forEach(patient => {
        patient.autoScheduledAppointments.forEach(apt => {
          if (apt.id === selectedAppointment.id) {
            apt.time = editFormData.time;
            apt.status = editFormData.status;
            apt.assignedDoctor = editFormData.assignedDoctor;
          }
        });
      });
    }
    setShowEditModal(false);
    setEditFormData({});
  };

  // Calendar view rendering functions
  const renderWeekView = () => {
    const weekDates = getWeekDates(new Date(selectedDate));
    const filteredAppointments = getFilteredAppointments();
    
    const getAppointmentsForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return filteredAppointments.filter(apt => apt.date === dateStr);
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

        {/* Color Legend */}
        <div className="mb-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">3 Month Follow-up</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">6 Month Follow-up</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">9 Month Follow-up</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">12 Month Follow-up</span>
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
                        onClick={() => handleAppointmentSelect(appointment)}
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
    
    const filteredAppointments = getFilteredAppointments();
    const getAppointmentsForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return filteredAppointments.filter(apt => apt.date === dateStr);
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
        
        {/* Color Legend */}
        <div className="mb-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">3 Month Follow-up</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">6 Month Follow-up</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">9 Month Follow-up</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">12 Month Follow-up</span>
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
                        onClick={() => handleAppointmentSelect(appointment)}
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
            <h2 className="text-xl font-semibold text-gray-900">Active Follow-up Patients</h2>
            <p className="text-sm text-gray-600 mt-1">Monitor PSA trends and compliance with automatic scheduling</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            {['Patients in Monitoring', 'Calendar'].map((filter) => (
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
                    {filter === 'Patients in Monitoring' ? mockSurveillancePatients.length : getAllAppointments().length}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      {activeFilter === 'Patients in Monitoring' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or UPI..."
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
          {filteredPatients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
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
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900">{patient.patientName}</p>
                            {patient.appointmentScheduled && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Calendar className="h-3 w-3 mr-1" />
                                Scheduled
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">UPI: {patient.upi}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.gender}</p>
                          {patient.appointmentScheduled && (
                            <p className="text-xs text-blue-600 mt-1">
                              Next: {patient.scheduledDate} at {patient.scheduledTime} with {patient.assignedDoctor}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          patient.lastPSA > 10 ? 'bg-red-500' : 
                          patient.lastPSA > 4 ? 'bg-amber-500' : 
                          'bg-green-500'
                        }`}></div>
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
                          onClick={() => handlePSAMonitoring(patient)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                        >
                          <BarChart3 className="h-3 w-3 mr-1" />
                          <span>PSA Monitoring</span>
                        </button>
                        
                        <button 
                          onClick={() => handlePSAEntry(patient.id)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span>Add PSA</span>
                        </button>
                        
                          <button 
                            onClick={() => handleBookAppointment(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Update Review</span>
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
                <Activity className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No active surveillance patients
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients match your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('All Status');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/urology-nurse/triage')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient to Follow-up
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
            
            {calendarViewMode === 'week' ? renderWeekView() : renderCalendarView()}
          </div>
        </div>
      )}


      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-200 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                    <p className="text-sm text-gray-600">{selectedAppointment.patientName} - {selectedAppointment.upi}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddNotes(selectedAppointment)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    title="Add Notes"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditAppointment(selectedAppointment)}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                    title="Edit Appointment"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleCloseAppointmentDetailsModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Patient Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                        <p className="text-sm text-gray-900">{selectedAppointment.patientName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UPI</label>
                        <p className="text-sm text-gray-900">{selectedAppointment.upi}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age & Gender</label>
                        <p className="text-sm text-gray-900">{selectedAppointment.age} years • {selectedAppointment.gender}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {selectedAppointment.phone}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {selectedAppointment.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      Appointment Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <p className="text-sm text-gray-900">{selectedAppointment.title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <p className="text-sm text-gray-900 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(selectedAppointment.date)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          <p className="text-sm text-gray-900 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {selectedAppointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getSurveillanceIntervalColor(selectedAppointment.interval).bg} ${getSurveillanceIntervalColor(selectedAppointment.interval).text}`}>
                            {selectedAppointment.interval} Month Follow-up
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                            selectedAppointment.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {selectedAppointment.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Doctor</label>
                        <p className="text-sm text-gray-900 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {selectedAppointment.assignedDoctor}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-purple-600" />
                      Clinical Information
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last PSA</label>
                          <p className="text-sm text-gray-900">{selectedAppointment.lastPSA} ng/mL</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PSA Velocity</label>
                          <p className="text-sm text-gray-900">{selectedAppointment.psaVelocity} ng/mL/year</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Risk Category</label>
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(selectedAppointment.riskCategory)}`}>
                            {selectedAppointment.riskCategory}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gleason Score</label>
                          <p className="text-sm text-gray-900">{selectedAppointment.gleasonScore}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last MRI</label>
                          <p className="text-sm text-gray-900">{selectedAppointment.lastMRI ? formatDate(selectedAppointment.lastMRI) : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Biopsy</label>
                          <p className="text-sm text-gray-900">{selectedAppointment.lastBiopsy ? formatDate(selectedAppointment.lastBiopsy) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-600" />
                      Notes
                    </h4>
                    <div>
                      <p className="text-sm text-gray-900">{selectedAppointment.notes || 'No notes available'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={handleCloseAppointmentDetailsModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleViewPatientDetails(selectedAppointment.patientId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  View Full Patient Details
                </button>
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
                  name="notes"
                  value={psaForm.notes}
                  onChange={handlePSAFormChange}
                  rows={3}
                  placeholder="Add any clinical notes or observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
              </div>


              {/* PSA Status Preview */}
              {psaForm.value && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">PSA Status Preview:</h4>
                  <div className="flex items-center space-x-2">
                    {parseFloat(psaForm.value) <= 6.0 ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800">Normal (≤6.0 ng/mL)</span>
                      </>
                    ) : parseFloat(psaForm.value) <= 6.5 ? (
                      <>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-800">Elevated (6.1-6.5 ng/mL)</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-red-800">High (&gt;6.5 ng/mL)</span>
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

      {/* Notes Modal */}
      {showNotesModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Notes</h3>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <p className="text-sm text-gray-900">{selectedAppointment.patientName}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editFormData.notes || ''}
                  onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter appointment notes..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.patientName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={editFormData.time || ''}
                    onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editFormData.status || ''}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Future">Future</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Doctor</label>
                  <select
                    value={editFormData.assignedDoctor || ''}
                    onChange={(e) => setEditFormData({...editFormData, assignedDoctor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {availableDoctors.map(doctor => (
                      <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
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

      {/* PSA Monitoring Modal */}
      {showPSAMonitoringModal && selectedPatientForPSAMonitoring && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-6xl w-full max-h-[90vh] flex flex-col border border-gray-200 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-50 to-gray-50 border-b border-gray-200 px-6 py-4 flex-shrink-0 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      PSA Monitoring - {selectedPatientForPSAMonitoring.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">PSA Level Trends and Analysis</p>
                  </div>
                </div>
                <button
                  onClick={closePSAMonitoringModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current PSA</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{selectedPatientForPSAMonitoring.lastPSA}</p>
                    <p className="text-sm text-gray-600">ng/mL</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      selectedPatientForPSAMonitoring.lastPSA > 10 ? 'bg-red-50 text-red-700 border border-red-200' :
                      selectedPatientForPSAMonitoring.lastPSA > 4 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {selectedPatientForPSAMonitoring.lastPSA > 10 ? 'High Risk' :
                       selectedPatientForPSAMonitoring.lastPSA > 4 ? 'Borderline' : 'Normal'}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PSA Velocity</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{selectedPatientForPSAMonitoring.psaVelocity}</p>
                    <p className="text-sm text-gray-600">ng/mL/year</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      selectedPatientForPSAMonitoring.psaVelocity > 0.75 ? 'bg-red-50 text-red-700 border border-red-200' :
                      selectedPatientForPSAMonitoring.psaVelocity > 0.35 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {selectedPatientForPSAMonitoring.psaVelocity > 0.75 ? 'High' :
                       selectedPatientForPSAMonitoring.psaVelocity > 0.35 ? 'Moderate' : 'Low'}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Risk Category</span>
                  </div>
                  <div className="space-y-1">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(selectedPatientForPSAMonitoring.riskCategory)}`}>
                      {selectedPatientForPSAMonitoring.riskCategory}
                    </span>
                    <p className="text-xs text-gray-600">Gleason: {selectedPatientForPSAMonitoring.gleasonScore}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Review</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">{selectedPatientForPSAMonitoring.nextReview}</p>
                    <p className="text-sm text-gray-600">{selectedPatientForPSAMonitoring.surveillanceInterval} months</p>
                    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedPatientForPSAMonitoring.assignedDoctor}
                    </div>
                  </div>
                </div>
              </div>

              {/* PSA Reference Ranges */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                  PSA Reference Ranges
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="font-semibold mb-2 text-blue-900">
                    {getPSABaselineInfo(selectedPatientForPSAMonitoring.gender, selectedPatientForPSAMonitoring.age)?.description}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-800">Normal:</span>
                      <span className="text-blue-700">{getPSABaselineInfo(selectedPatientForPSAMonitoring.gender, selectedPatientForPSAMonitoring.age)?.normal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-800">Borderline:</span>
                      <span className="text-blue-700">{getPSABaselineInfo(selectedPatientForPSAMonitoring.gender, selectedPatientForPSAMonitoring.age)?.borderline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-800">Elevated:</span>
                      <span className="text-blue-700">{getPSABaselineInfo(selectedPatientForPSAMonitoring.gender, selectedPatientForPSAMonitoring.age)?.elevated}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Controls */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    PSA Trend Analysis
                  </h4>
                  <div className="flex items-center space-x-4">
                    {/* Chart Type Toggle */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">View:</span>
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setPsaChartType('line')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            psaChartType === 'line' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Line
                        </button>
                        <button
                          onClick={() => setPsaChartType('bar')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            psaChartType === 'bar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Bar
                        </button>
                      </div>
                    </div>

                    {/* Time Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Period:</span>
                      <select
                        value={psaChartFilter}
                        onChange={(e) => setPsaChartFilter(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="3months">3 Months</option>
                        <option value="6months">6 Months</option>
                        <option value="1year">1 Year</option>
                        <option value="all">All Time</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-80">
                  {psaChartType === 'line' ? (
                    <Line data={getPSAChartConfig(selectedPatientForPSAMonitoring, 'line')} options={chartOptions} />
                  ) : (
                    <Bar data={getPSAChartConfig(selectedPatientForPSAMonitoring, 'bar')} options={chartOptions} />
                  )}
                </div>
              </div>

              {/* PSA History Table */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  PSA History
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA Value</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Change</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedPatientForPSAMonitoring.psaHistory?.map((psa, index) => {
                        const previousPSA = index > 0 ? selectedPatientForPSAMonitoring.psaHistory[index - 1].value : null;
                        const change = previousPSA ? (psa.value - previousPSA).toFixed(1) : null;
                        const changePercent = previousPSA ? (((psa.value - previousPSA) / previousPSA) * 100).toFixed(1) : null;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {new Date(psa.date).toLocaleDateString('en-AU')}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  psa.value > 10 ? 'bg-red-500' : 
                                  psa.value > 4 ? 'bg-amber-500' : 
                                  'bg-green-500'
                                }`}></div>
                                <span className={`text-sm font-semibold ${
                                  psa.value > 10 ? 'text-red-600' : 
                                  psa.value > 4 ? 'text-amber-600' : 
                                  'text-green-600'
                                }`}>
                                  {psa.value} ng/mL
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                psa.value > 10 ? 'bg-red-100 text-red-800' :
                                psa.value > 4 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {psa.value > 10 ? 'High Risk' :
                                 psa.value > 4 ? 'Borderline' : 'Normal'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {change !== null ? (
                                <div className={`flex items-center space-x-1 ${
                                  parseFloat(change) > 0 ? 'text-red-600' : 
                                  parseFloat(change) < 0 ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                  <span>{parseFloat(change) > 0 ? '+' : ''}{change} ng/mL</span>
                                  <span className="text-xs">({changePercent}%)</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {psa.notes || <span className="text-gray-400 italic">No notes</span>}
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
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-end">
                <button
                  onClick={closePSAMonitoringModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSurveillance;

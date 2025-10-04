import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddPatientModal from '../../components/modals/AddPatientModal';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';
import { 
  Users,
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database,
  Activity,
  Stethoscope,
  Heart,
  TrendingUp,
  FileText,
  Search,
  Eye,
  UserPlus,
  ClipboardList,
  ArrowRight,
  Shield,
  Target,
  User,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  Phone,
  Mail,
  MapPin,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Trash2,
  X
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UrologistDashboard = () => {
  const navigate = useNavigate();
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  const { alerts } = useSelector(state => state.alerts);
  const { openPatientDetails } = usePatientDetails();
  
  // State for chart filters
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  
  // Chart filter state
  const [chartFilter, setChartFilter] = useState('month');
  const [chartType, setChartType] = useState('line'); // line or bar
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [localAppointments, setLocalAppointments] = useState([]);
  
  // Add Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  
  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  
  // Drag and drop states
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);



  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateForStorage = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to handle patient review - navigate to patient details page
  const handlePatientReview = (patient, type) => {
    // Store patient data in localStorage to pass to the details page
    localStorage.setItem('selectedPatient', JSON.stringify({ ...patient, type }));
    
    // Set the last visited page in sessionStorage so the back button returns to dashboard
    sessionStorage.setItem('lastVisitedPage', 'dashboard');
    
    // Open patient details modal
    openPatientDetails(patient.id);
  };

  // Add Patient Modal handlers
  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const handlePatientAdded = (newPatient) => {
    console.log('New patient added:', newPatient);
    // Here you could update your local state or dispatch to Redux store
  };

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false);
  };

  // Helper functions for appointment types and status
  const getTypeColor = (type) => {
    switch (type) {
      case 'Follow-up': return 'bg-blue-100 text-blue-800';
      case 'OPD': return 'bg-purple-100 text-purple-800';
      case 'Surgery': return 'bg-red-100 text-red-800';
      case 'Surveillance': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Modal handlers
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setEditFormData(appointment);
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setIsEditing(false);
  };

  const handleEditAppointment = () => {
    setIsEditing(true);
  };

  const handleSaveAppointment = () => {
    // Update the appointment in local state
    const updatedAppointments = localAppointments.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...apt, ...editFormData }
        : apt
    );
    
    setLocalAppointments(updatedAppointments);
    setSelectedAppointment({ ...selectedAppointment, ...editFormData });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditFormData(selectedAppointment);
    setIsEditing(false);
  };

  const handleDeleteAppointment = () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updatedAppointments = localAppointments.filter(apt => apt.id !== selectedAppointment.id);
      setLocalAppointments(updatedAppointments);
      setIsModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      const targetDateStr = formatDateForStorage(targetDate);
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

  // Reschedule confirmation
  const confirmReschedule = () => {
    if (rescheduleData) {
      // Update the appointment date in the local state
      const updatedAppointments = localAppointments.map(apt => 
        apt.id === rescheduleData.appointment.id 
          ? { ...apt, date: rescheduleData.newDate }
          : apt
      );
      
      setLocalAppointments(updatedAppointments);
      
      console.log(`Rescheduled appointment ${rescheduleData.appointment.id} from ${rescheduleData.originalDate} to ${rescheduleData.newDate}`);
      
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

  // Calculate real-time KPIs
  const calculateKPIs = () => {
    const totalReferrals = referrals.length;
    const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
    const avgWaitTime = referrals.reduce((acc, r) => {
      const waitTime = new Date() - new Date(r.referralDate);
      return acc + (waitTime / (1000 * 60 * 60 * 24)); // days
    }, 0) / totalReferrals;
    
    const db1Patients = db1.patients.length;
    const db2Patients = db2.patients.length;
    const db3Patients = db3.patients.length;
    const db4Patients = db4.patients.length;
    
    const totalPatients = db1Patients + db2Patients + db3Patients + db4Patients;
    const surveillanceCompliance = db2Patients > 0 ? 
      (db2.patients.filter(p => p.lastAppointment && new Date(p.lastAppointment) > new Date(Date.now() - 30*24*60*60*1000)).length / db2Patients * 100).toFixed(1) : 100;
    
    return {
      avgWaitTime: avgWaitTime.toFixed(1),
      surveillanceCompliance,
      totalPatients,
      activeAlerts: alerts.filter(a => a.status === 'active').length
    };
  };

  const kpis = calculateKPIs();

  // Generate dates for next 5 days
  const getNextDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const nextDays = getNextDays();

  // Mock appointments data for urologist
  const mockAppointments = [
    // Today
    {
      id: 'UAPT001',
      patientName: 'John Smith',
      upi: 'URP2024001',
      title: 'OPD Consultation',
      description: 'Initial consultation for elevated PSA',
      date: nextDays[0],
      time: '9:00 AM',
      type: 'OPD',
      status: 'Confirmed',
      priority: 'High',
      age: 65,
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      duration: 30,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 1',
      notes: 'Patient has family history of prostate cancer'
    },
    {
      id: 'UAPT002',
      patientName: 'Mary Johnson',
      upi: 'URP2024002',
      title: 'PSA Review',
      description: '3-month PSA follow-up and consultation',
      date: nextDays[0],
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Normal',
      age: 58,
      phone: '+61 423 456 789',
      email: 'mary.johnson@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      duration: 20,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 1',
      notes: 'Previous PSA: 4.2 ng/mL'
    },
    {
      id: 'UAPT003',
      patientName: 'Robert Brown',
      upi: 'URP2024003',
      title: 'Surgery Consultation',
      description: 'Pre-operative assessment and planning',
      date: nextDays[0],
      time: '2:00 PM',
      type: 'Surgery',
      status: 'Confirmed',
      priority: 'High',
      age: 72,
      phone: '+61 434 567 890',
      email: 'robert.brown@email.com',
      address: '789 Pine Street, Brisbane QLD 4000',
      duration: 45,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 2',
      notes: 'Scheduled for radical prostatectomy next week'
    },
    // Tomorrow
    {
      id: 'UAPT004',
      patientName: 'David Wilson',
      upi: 'URP2024004',
      title: 'MDT Discussion',
      description: 'Multidisciplinary team case review',
      date: nextDays[1],
      time: '9:00 AM',
      type: 'Follow-up',
      status: 'Scheduled',
      priority: 'High',
      age: 69,
      phone: '+61 445 678 901',
      email: 'david.wilson@email.com',
      address: '321 Elm Street, Perth WA 6000',
      duration: 60,
      doctor: 'Dr. Sarah Wilson',
      room: 'Conference Room',
      notes: 'Complex case requiring MDT input'
    },
    {
      id: 'UAPT005',
      patientName: 'Sarah Davis',
      upi: 'URP2024005',
      title: 'Active Surveillance',
      description: '6-month surveillance appointment',
      date: nextDays[1],
      time: '11:00 AM',
      type: 'Surveillance',
      status: 'Confirmed',
      priority: 'Normal',
      age: 61,
      phone: '+61 456 789 012',
      email: 'sarah.davis@email.com',
      address: '654 Maple Drive, Adelaide SA 5000',
      duration: 25,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 1',
      notes: 'PSA stable, continue surveillance'
    },
    {
      id: 'UAPT006',
      patientName: 'James Miller',
      upi: 'URP2024006',
      title: 'Post-Op Review',
      description: 'Post-operative follow-up consultation',
      date: nextDays[1],
      time: '1:30 PM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Medium',
      age: 67,
      phone: '+61 467 890 123',
      email: 'james.miller@email.com',
      address: '987 Cedar Lane, Hobart TAS 7000',
      duration: 30,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 2',
      notes: '3 months post-surgery, check recovery'
    },
    // Day 3
    {
      id: 'UAPT007',
      patientName: 'Michael Thompson',
      upi: 'URP2024007',
      title: 'Pre-Op Assessment',
      description: 'Pre-operative evaluation and clearance',
      date: nextDays[2],
      time: '9:30 AM',
      type: 'Surgery',
      status: 'Confirmed',
      priority: 'High',
      age: 74,
      phone: '+61 478 901 234',
      email: 'michael.thompson@email.com',
      address: '147 Birch Street, Darwin NT 0800',
      duration: 40,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 1',
      notes: 'Final pre-op assessment before surgery'
    },
    {
      id: 'UAPT008',
      patientName: 'Jennifer Garcia',
      upi: 'URP2024008',
      title: 'OPD New Patient',
      description: 'New patient consultation and assessment',
      date: nextDays[2],
      time: '11:15 AM',
      type: 'OPD',
      status: 'Pending',
      priority: 'Medium',
      age: 55,
      phone: '+61 489 012 345',
      email: 'jennifer.garcia@email.com',
      address: '258 Spruce Avenue, Canberra ACT 2600',
      duration: 45,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 2',
      notes: 'Referred by GP for elevated PSA'
    },
    // Day 4
    {
      id: 'UAPT009',
      patientName: 'Christopher Lee',
      upi: 'URP2024009',
      title: 'Surveillance Review',
      description: 'Annual surveillance appointment',
      date: nextDays[3],
      time: '10:00 AM',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal',
      age: 63,
      phone: '+61 490 123 456',
      email: 'christopher.lee@email.com',
      address: '369 Willow Road, Melbourne VIC 3000',
      duration: 30,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 1',
      notes: 'Annual review, PSA monitoring'
    },
    {
      id: 'UAPT010',
      patientName: 'Amanda White',
      upi: 'URP2024010',
      title: 'Follow-Up Consultation',
      description: '6-month follow-up after treatment',
      date: nextDays[3],
      time: '2:00 PM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Normal',
      age: 59,
      phone: '+61 401 234 567',
      email: 'amanda.white@email.com',
      address: '741 Poplar Street, Sydney NSW 2000',
      duration: 25,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 2',
      notes: 'Post-treatment follow-up, check progress'
    },
    // Day 5
    {
      id: 'UAPT011',
      patientName: 'Daniel Martinez',
      upi: 'URP2024011',
      title: 'Surgical Planning',
      description: 'Surgical planning and consent discussion',
      date: nextDays[4],
      time: '9:15 AM',
      type: 'Surgery',
      status: 'Confirmed',
      priority: 'High',
      age: 71,
      phone: '+61 412 345 678',
      email: 'daniel.martinez@email.com',
      address: '852 Ash Lane, Brisbane QLD 4000',
      duration: 50,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 1',
      notes: 'Surgical planning session, obtain consent'
    },
    {
      id: 'UAPT012',
      patientName: 'Nicole Brown',
      upi: 'URP2024012',
      title: 'PSA Monitoring',
      description: 'Regular PSA monitoring appointment',
      date: nextDays[4],
      time: '11:30 AM',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal',
      age: 56,
      phone: '+61 423 456 789',
      email: 'nicole.brown@email.com',
      address: '963 Hickory Drive, Perth WA 6000',
      duration: 20,
      doctor: 'Dr. Sarah Wilson',
      room: 'Room 2',
      notes: 'Regular PSA check, continue monitoring'
    }
  ];

  // Initialize local appointments
  React.useEffect(() => {
    setLocalAppointments(mockAppointments);
  }, []);

  // Calendar helper functions
  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return localAppointments.filter(apt => apt.date === dateString);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    const selectedDateObj = new Date(selectedDate);
    return date.toDateString() === selectedDateObj.toDateString();
  };

  // Generate calendar days
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

  // Mock data for urologist panels
  const mockOPDPatients = [
    { id: 'URP001', name: 'John Smith', psa: 25.4, priority: 'High', waitTime: 5 },
    { id: 'URP002', name: 'Mary Johnson', psa: 18.7, priority: 'High', waitTime: 3 },
    { id: 'URP003', name: 'Robert Brown', psa: 12.3, priority: 'Medium', waitTime: 1 },
    { id: 'URP004', name: 'David Wilson', psa: 8.5, priority: 'Medium', waitTime: 0 },
    { id: 'URP005', name: 'Sarah Davis', psa: 15.2, priority: 'High', waitTime: 7 }
  ];

  const mockSurveillancePatients = [
    { id: 'SURV001', name: 'Jennifer Wilson', psa: 8.7, riskLevel: 'Low', psaAlert: false },
    { id: 'SURV002', name: 'Christopher Lee', psa: 6.8, riskLevel: 'Medium', psaAlert: true },
    { id: 'SURV003', name: 'Thomas Brown', psa: 18.3, riskLevel: 'High', psaAlert: true }
  ];

  const mockMDTCases = [
    { id: 'MDT001', name: 'Michael Miller', psa: 15.2, priority: 'High', waitTime: 7 },
    { id: 'MDT002', name: 'Jennifer Wilson', psa: 8.7, priority: 'Medium', waitTime: 5 },
    { id: 'MDT003', name: 'William Anderson', psa: 22.5, priority: 'High', waitTime: 10 },
    { id: 'MDT004', name: 'Christopher Lee', psa: 6.8, priority: 'Medium', waitTime: 3 },
    { id: 'MDT005', name: 'Thomas Brown', psa: 18.3, priority: 'High', waitTime: 0 }
  ];

  const mockSurgicalPatients = [
    { id: 'SURG001', name: 'Michael Miller', surgeryDate: '2024-02-15', status: 'Awaiting Surgery', priority: 'High' },
    { id: 'SURG002', name: 'Jennifer Wilson', surgeryDate: '2024-02-20', status: 'Surgery Scheduled', priority: 'Medium' },
    { id: 'SURG003', name: 'William Anderson', surgeryDate: '2024-02-25', status: 'Pre-op Assessment', priority: 'High' }
  ];

  const mockPostOpPatients = [
    { id: 'POSTOP001', name: 'William Anderson', surgeryDate: '2024-01-30', followUpDate: '2024-03-30', status: 'Post-Op Follow-Up' },
    { id: 'POSTOP002', name: 'Robert Johnson', surgeryDate: '2024-01-25', followUpDate: '2024-03-25', status: 'Histopathology Pending' },
    { id: 'POSTOP003', name: 'David Chen', surgeryDate: '2024-01-20', followUpDate: '2024-03-20', status: 'Complications Review' }
  ];

  // Patient distribution data for charts - using mock data from panels
  const mockPatientDistribution = {
    opdQueue: mockOPDPatients.length,
    activeSurveillance: mockSurveillancePatients.length,
    surgeryScheduled: mockSurgicalPatients.length,
    postOp: mockPostOpPatients.length,
    mdtCases: mockMDTCases.length
  };

  // Patient Distribution Chart Data (Pie Chart)
  const patientDistributionData = {
    labels: ['OPD Queue', 'Active Surveillance', 'Surgery Scheduled', 'Post-Op', 'MDT Cases'],
    datasets: [
      {
        data: [
          mockPatientDistribution.opdQueue,
          mockPatientDistribution.activeSurveillance,
          mockPatientDistribution.surgeryScheduled,
          mockPatientDistribution.postOp,
          mockPatientDistribution.mdtCases
        ],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',   // Purple for OPD Queue
          'rgba(34, 197, 94, 0.8)',    // Green for Active Surveillance
          'rgba(245, 158, 11, 0.8)',   // Orange for Surgery Scheduled
          'rgba(251, 191, 36, 0.8)',   // Yellow for Post-Op
          'rgba(99, 102, 241, 0.8)'    // Indigo for MDT Cases
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(99, 102, 241, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const patientDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  // PSA Trend Chart Data
  const getPSATrendData = (filter) => {
    switch (filter) {
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [4.2, 4.8, 3.9, 5.1, 4.6, 4.3, 4.7]
        };
      case 'month':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [4.3, 4.7, 4.1, 4.9]
        };
      case 'quarter':
        return {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          data: [4.4, 4.6, 4.2]
        };
      default:
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [4.3, 4.7, 4.1, 4.9]
        };
    }
  };

  const psaTrendData = getPSATrendData(chartFilter);

  const psaTrendChartData = {
    labels: psaTrendData.labels,
    datasets: [
      {
        label: 'Average PSA (ng/mL)',
        data: psaTrendData.data,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const psaTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `Average PSA: ${context.parsed.y} ng/mL`;
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
        min: 0,
        max: 10,
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
            return value + ' ng/mL';
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    }
  };

  // Bar Chart Options (same data as line chart)
  const psaBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `Average PSA: ${context.parsed.y} ng/mL`;
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
        min: 0,
        max: 10,
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
            return value + ' ng/mL';
          }
        }
      },
    },
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  // Bar Chart Data (same as line chart)
  const psaBarChartData = {
    labels: psaTrendData.labels,
    datasets: [
      {
        label: 'Average PSA (ng/mL)',
        data: psaTrendData.data,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        hoverBorderColor: 'rgba(34, 197, 94, 1)',
        hoverBorderWidth: 2,
      }
    ]
  };

  // Workflow cards for main command center - showing data from urologist panels
  const workflowCards = [
    {
      name: 'OPD Queue',
      description: 'Patients awaiting initial consultation',
      value: mockOPDPatients.length,
      icon: Database,
      color: 'purple',
      route: '/urologist/opd-consultations',
      urgent: mockOPDPatients.filter(p => p.priority === 'High').length > 0,
      details: `${mockOPDPatients.filter(p => p.priority === 'High').length} High Priority`
    },
    {
      name: 'Active Surveillance',
      description: 'Patients on PSA monitoring protocol',
      value: mockSurveillancePatients.length,
      icon: Activity,
      color: 'green',
      route: '/urologist/active-surveillance',
      urgent: mockSurveillancePatients.filter(p => p.psaAlert).length > 0,
      details: `${mockSurveillancePatients.filter(p => p.psaAlert).length} With PSA Alerts`
    },
    {
      name: 'MDT Cases',
      description: 'Multidisciplinary team discussions pending',
      value: mockMDTCases.length,
      icon: Users,
      color: 'indigo',
      route: '/urologist/mdt-cases',
      urgent: mockMDTCases.filter(c => c.priority === 'High').length > 0,
      details: `${mockMDTCases.filter(c => c.priority === 'High').length} High Priority`
    },
    {
      name: 'Surgical Pathway',
      description: 'Patients awaiting or scheduled for surgery',
      value: mockSurgicalPatients.length,
      icon: Stethoscope,
      color: 'orange',
      route: '/urologist/surgical-pathway',
      urgent: mockSurgicalPatients.filter(p => p.priority === 'High').length > 0,
      details: `${mockSurgicalPatients.filter(p => p.status === 'Awaiting Surgery').length} Awaiting Surgery`
    },
    {
      name: 'Post-Op Follow-Up',
      description: 'Post-operative patients requiring review',
      value: mockPostOpPatients.length,
      icon: Heart,
      color: 'yellow',
      route: '/urologist/postop-followup',
      urgent: mockPostOpPatients.filter(p => p.status === 'Complications Review').length > 0,
      details: `${mockPostOpPatients.filter(p => p.status === 'Complications Review').length} With Complications`
    },
    {
      name: 'Patient Management',
      description: 'View all patients across all pathways',
      value: mockOPDPatients.length + mockSurveillancePatients.length + mockSurgicalPatients.length + mockPostOpPatients.length,
      icon: User,
      color: 'blue',
      route: '/urologist/patient-management',
      urgent: false,
      details: 'Total Active Patients'
    }
  ];


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
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Urologist Clinical Dashboard</h1>
        <p className="text-gray-600 mt-1">Main Command Center - One page to see everything</p>
          </div>
      
      {/* Quick Action Buttons */}
      <div className="flex items-center justify-end mb-6">
        <button 
          onClick={handleAddPatient}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          <span className="font-medium">Add New Patient</span>
        </button>
      </div>

      {/* Workflow Cards - Main Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {workflowCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.name} 
              onClick={() => navigate(card.route)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group relative overflow-hidden cursor-pointer"
            >
              <div className="relative z-10 p-4">
                {/* Icon, count, and title on same line - compact layout */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    card.color === 'red' ? 'bg-red-500' :
                    card.color === 'blue' ? 'bg-blue-500' :
                    card.color === 'purple' ? 'bg-purple-500' :
                    card.color === 'green' ? 'bg-green-500' :
                    card.color === 'orange' ? 'bg-orange-500' :
                    card.color === 'yellow' ? 'bg-yellow-500' :
                    card.color === 'indigo' ? 'bg-indigo-500' :
                    'bg-gray-500'
                  }`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{card.name}</p>
                  </div>
                </div>
                
                {/* Description - smaller text */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
                </div>
                
                {/* View Details link - smaller and more compact */}
                <div className="flex items-center justify-center text-green-600 group-hover:text-green-700 text-xs font-medium transition-colors duration-200">
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Patient Distribution</h2>
                <p className="text-sm text-gray-600 mt-1">Patients by current pathway status</p>
            </div>
            <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-purple-600">
                  {mockPatientDistribution.opdQueue + mockPatientDistribution.activeSurveillance + mockPatientDistribution.surgeryScheduled + mockPatientDistribution.postOp + mockPatientDistribution.mdtCases} Total
                </span>
            </div>
          </div>
        </div>

          <div className="p-6">
            <div className="h-64 w-full">
              {patientDistributionData.datasets[0].data.some(value => value > 0) ? (
                <Pie data={patientDistributionData} options={patientDistributionOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Database className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No patient data available</p>
                        </div>
                        </div>
              )}
                      </div>
                      </div>
        </div>
        
        {/* PSA Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">PSA Trend Analysis</h2>
                <p className="text-sm text-gray-600 mt-1">Average PSA levels over time</p>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                    chartType === 'line' 
                      ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Line
                </button>
                <button 
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                    chartType === 'bar' 
                      ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Bar
                </button>
                <button 
                  onClick={() => setChartFilter('week')}
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                    chartFilter === 'week' 
                      ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setChartFilter('month')}
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                    chartFilter === 'month' 
                      ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setChartFilter('quarter')}
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                    chartFilter === 'quarter' 
                      ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Quarter
                </button>
            </div>
          </div>
        </div>

          <div className="p-6">
            <div className="h-64 w-full">
              {psaTrendChartData.datasets[0].data.length > 0 ? (
                chartType === 'line' ? (
                  <Line data={psaTrendChartData} options={psaTrendOptions} />
                ) : (
                  <Bar data={psaBarChartData} options={psaBarOptions} />
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No PSA trend data available</p>
                        </div>
                        </div>
              )}
                      </div>
                      </div>
                    </div>
        </div>
        

      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })} Calendar
              </h2>
              <p className="text-sm text-gray-600 mt-1">View and manage your appointments</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-xl">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {localAppointments.filter(apt => apt.date === selectedDate).length} Appointments Today
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar */}
        <div className="px-6 py-6">
          <div className="w-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {currentMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                </h3>
                <p className="text-sm text-gray-600">Select a date to view appointments</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    setCurrentMonth(today);
                    setSelectedDate(formatDateForStorage(today));
                  }}
                  className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="w-full">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                  const isTodayDate = isToday(day);
                  const dayAppointments = getAppointmentsForDate(day);
                  const isSelectedDay = isSelected(day);

                  const isDragOver = dragOverDate && dragOverDate.toDateString() === day.toDateString();

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedDate(formatDateForStorage(day));
                      }}
                      onDragOver={(e) => handleDragOver(e, day)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, day)}
                      className={`min-h-[150px] p-2 border border-gray-200 rounded-lg transition-all duration-200 flex flex-col cursor-pointer ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isTodayDate ? 'ring-2 ring-green-500' : ''} ${
                        isSelectedDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      } ${
                        isDragOver ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 flex-shrink-0 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      } ${isTodayDate ? 'text-green-600' : ''} ${isSelectedDay ? 'text-blue-600' : ''}`}>
                        {day.getDate()}
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {dayAppointments.map(appointment => (
                          <div
                            key={appointment.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, appointment)}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(appointment);
                            }}
                            className={`text-xs p-1 rounded cursor-move transition-all duration-200 flex-shrink-0 ${
                              appointment.type === 'OPD' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                              appointment.type === 'Surgery' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                              appointment.type === 'Follow-up' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                              appointment.type === 'Surveillance' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                              'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            } hover:shadow-md hover:scale-105`}
                            title="Drag to reschedule or click to view details"
                          >
                            <div className="font-medium flex items-center justify-between">
                              <span>{appointment.time}</span>
                              <span className="text-xs opacity-60">⋮⋮</span>
                            </div>
                            <div className="truncate">{appointment.patientName}</div>
                          </div>
                        ))}
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

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Selected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
                    <span className="text-gray-600">OPD</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-100 rounded-full"></div>
                    <span className="text-gray-600">Surgery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                    <span className="text-gray-600">Follow-up</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-100 rounded-full"></div>
                    <span className="text-gray-600">Surveillance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-base">
                        {selectedAppointment.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
                    <p className="text-sm text-gray-600">{selectedAppointment.patientName} - {selectedAppointment.upi}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={handleEditAppointment}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAppointment}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </button>
                    </>
                  )}
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-8 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Patient Information */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center mr-3">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      Patient Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.patientName || ''}
                            onChange={(e) => handleInputChange('patientName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.patientName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UPI</label>
                        <p className="text-sm text-gray-900">{selectedAppointment.upi}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editFormData.age || ''}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.age} years</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editFormData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            {selectedAppointment.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editFormData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            {selectedAppointment.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        {isEditing ? (
                          <textarea
                            value={editFormData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                            {selectedAppointment.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center mr-3">
                        <CalendarIcon className="h-3 w-3 text-white" />
                      </div>
                      Appointment Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.title}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        {isEditing ? (
                          <textarea
                            value={editFormData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editFormData.date || ''}
                              onChange={(e) => handleInputChange('date', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                            />
                          ) : (
                            <p className="text-sm text-gray-900 flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                              {new Date(selectedAppointment.date).toLocaleDateString('en-AU')}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          {isEditing ? (
                            <input
                              type="time"
                              value={editFormData.time || ''}
                              onChange={(e) => handleInputChange('time', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                            />
                          ) : (
                            <p className="text-sm text-gray-900 flex items-center">
                              <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                              {selectedAppointment.time}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          {isEditing ? (
                            <select
                              value={editFormData.type || ''}
                              onChange={(e) => handleInputChange('type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                            >
                              <option value="OPD">OPD</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Surgery">Surgery</option>
                              <option value="Surveillance">Surveillance</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${getTypeColor(selectedAppointment.type)}`}>
                              {selectedAppointment.type}
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          {isEditing ? (
                            <select
                              value={editFormData.status || ''}
                              onChange={(e) => handleInputChange('status', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Pending">Pending</option>
                              <option value="Scheduled">Scheduled</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(selectedAppointment.status)}`}>
                              {selectedAppointment.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editFormData.duration || ''}
                              onChange={(e) => handleInputChange('duration', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{selectedAppointment.duration} minutes</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          {isEditing ? (
                            <select
                              value={editFormData.priority || ''}
                              onChange={(e) => handleInputChange('priority', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                            >
                              <option value="Normal">Normal</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${getPriorityColor(selectedAppointment.priority)}`}>
                              {selectedAppointment.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.doctor || ''}
                            onChange={(e) => handleInputChange('doctor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 flex items-center">
                            <Stethoscope className="h-4 w-4 mr-2 text-gray-500" />
                            {selectedAppointment.doctor}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.room || ''}
                            onChange={(e) => handleInputChange('room', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.room}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center mr-3">
                        <FileText className="h-3 w-3 text-white" />
                      </div>
                      Notes
                    </h4>
                    <div>
                      {isEditing ? (
                        <textarea
                          value={editFormData.notes || ''}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white transition-colors"
                          placeholder="Add appointment notes..."
                        />
                      ) : (
                        <p className="text-sm text-gray-900 leading-relaxed">{selectedAppointment.notes || 'No notes available'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDeleteAppointment}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Appointment
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
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
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(rescheduleData.appointment.type)}`}>
                      {rescheduleData.appointment.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Current Date:</span>
                    <span className="text-sm text-gray-900">{new Date(rescheduleData.originalDate).toLocaleDateString('en-AU')}</span>
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
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Rescheduling this appointment will update the patient's schedule. 
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

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={handleCloseAddPatientModal}
        onPatientAdded={handlePatientAdded}
        isUrologist={true}
      />

    </div>
  );
};

export default UrologistDashboard;

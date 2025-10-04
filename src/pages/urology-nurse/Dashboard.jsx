import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddPatientModal from '../../components/modals/AddPatientModal';
import BookAppointmentModal from '../../components/modals/BookAppointmentModal';
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
  Bell,
  TrendingUp,
  FileText,
  Search,
  Eye,
  X,
  UserPlus,
  ClipboardList,
  ArrowRight,
  Zap,
  Shield,
  Target,
  Info,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Trash2
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

const UrologyNurseDashboard = () => {
  const navigate = useNavigate();
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  const { alerts } = useSelector(state => state.alerts);

  // State for calendar
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Chart filter state
  const [chartFilter, setChartFilter] = useState('month');
  const [chartType, setChartType] = useState('line'); // line or bar

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
  const [localAppointments, setLocalAppointments] = useState([]);
  
  // Add Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  
  // Book Appointment Modal state
  const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);

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

  // Initialize local appointments state
  React.useEffect(() => {
    setLocalAppointments(mockAppointments);
  }, []);

  // Mock appointments data with next 5 days
  const mockAppointments = [
    // Today (2024-01-15)
    {
      id: 'APT001',
      patientName: 'John Doe',
      upi: 'URP2024001',
      title: 'PSA Follow-up',
      description: '3-month PSA review and consultation',
      date: nextDays[0],
      time: '9:00 AM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Normal'
    },
    {
      id: 'APT002',
      patientName: 'Mary Smith',
      upi: 'URP2024002',
      title: 'OPD Assessment',
      description: 'Initial assessment and triage',
      date: nextDays[0],
      time: '10:30 AM',
      type: 'OPD',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: 'APT003',
      patientName: 'Robert Brown',
      upi: 'URP2024003',
      title: 'Pre-op Consultation',
      description: 'Pre-operative assessment and planning',
      date: nextDays[0],
      time: '2:00 PM',
      type: 'Surgery',
      status: 'Confirmed',
      priority: 'Normal'
    },
    {
      id: 'APT004',
      patientName: 'Emily Johnson',
      upi: 'URP2024004',
      title: 'PSA Review',
      description: '6-month PSA monitoring',
      date: nextDays[0],
      time: '3:30 PM',
      type: 'Surveillance',
      status: 'Confirmed',
      priority: 'Medium'
    },

    // Tomorrow (2024-01-16)
    {
      id: 'APT005',
      patientName: 'David Wilson',
      upi: 'URP2024005',
      title: 'PSA Review',
      description: '6-month PSA monitoring',
      date: nextDays[1],
      time: '9:00 AM',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal'
    },
    {
      id: 'APT006',
      patientName: 'Sarah Davis',
      upi: 'URP2024006',
      title: 'Surveillance Check',
      description: 'Active surveillance monitoring',
      date: nextDays[1],
      time: '11:00 AM',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal'
    },
    {
      id: 'APT007',
      patientName: 'James Miller',
      upi: 'URP2024007',
      title: 'OPD Assessment',
      description: 'New patient consultation',
      date: nextDays[1],
      time: '1:30 PM',
      type: 'OPD',
      status: 'Confirmed',
      priority: 'High'
    },
    {
      id: 'APT008',
      patientName: 'Lisa Anderson',
      upi: 'URP2024008',
      title: 'Follow-up Consultation',
      description: 'Post-treatment follow-up',
      date: nextDays[1],
      time: '3:00 PM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Medium'
    },

    // Day 3 (2024-01-17)
    {
      id: 'APT009',
      patientName: 'Michael Thompson',
      upi: 'URP2024009',
      title: 'Post-op Follow-up',
      description: 'Post-operative assessment',
      date: nextDays[2],
      time: '9:30 AM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Normal'
    },
    {
      id: 'APT010',
      patientName: 'Jennifer Garcia',
      upi: 'URP2024010',
      title: 'Pre-op Assessment',
      description: 'Pre-operative evaluation',
      date: nextDays[2],
      time: '11:15 AM',
      type: 'Surgery',
      status: 'Confirmed',
      priority: 'High'
    },
    {
      id: 'APT011',
      patientName: 'Christopher Lee',
      upi: 'URP2024011',
      title: 'PSA Monitoring',
      description: 'Regular PSA level check',
      date: nextDays[2],
      time: '2:00 PM',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal'
    },

    // Day 4 (2024-01-18)
    {
      id: 'APT012',
      patientName: 'Amanda White',
      upi: 'URP2024012',
      title: 'OPD Consultation',
      description: 'General urology consultation',
      date: nextDays[3],
      time: '10:00 AM',
      type: 'OPD',
      status: 'Confirmed',
      priority: 'Medium'
    },
    {
      id: 'APT013',
      patientName: 'Daniel Martinez',
      upi: 'URP2024013',
      title: 'Surgical Follow-up',
      description: 'Post-surgical recovery assessment',
      date: nextDays[3],
      time: '1:00 PM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Normal'
    },
    {
      id: 'APT014',
      patientName: 'Rachel Taylor',
      upi: 'URP2024014',
      title: 'Active Surveillance',
      description: 'Routine surveillance appointment',
      date: nextDays[3],
      time: '3:45 PM',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal'
    },

    // Day 5 (2024-01-19)
    {
      id: 'APT015',
      patientName: 'Kevin Wilson',
      upi: 'URP2024015',
      title: 'Pre-op Planning',
      description: 'Pre-operative planning session',
      date: nextDays[4],
      time: '9:15 AM',
      type: 'Surgery',
      status: 'Confirmed',
      priority: 'High'
    },
    {
      id: 'APT016',
      patientName: 'Nicole Brown',
      upi: 'URP2024016',
      title: 'PSA Follow-up',
      description: '3-month PSA review',
      date: nextDays[4],
      time: '11:30 AM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Medium'
    },
    {
      id: 'APT017',
      patientName: 'Thomas Davis',
      upi: 'URP2024017',
      title: 'OPD Assessment',
      description: 'Initial patient assessment',
      date: nextDays[4],
      time: '2:30 PM',
      type: 'OPD',
      status: 'Scheduled',
      priority: 'Normal'
    }
  ];

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

  const formatDate = (date) => {
    // Handle both Date objects and date strings
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'long' 
    });
  };


  // Generate calendar days (same as Appointments.jsx)
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

  // Helper functions

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
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  // Mock patient distribution data for charts
  const mockPatientDistribution = {
    opdQueue: 15,
    activeSurveillance: 28,
    surgeryScheduled: 8,
    postOp: 12,
    discharged: 35
  };

  // Patient Distribution Chart Data (Pie Chart)
  const patientDistributionData = {
    labels: ['OPD Queue', 'Active Surveillance', 'Surgery Scheduled', 'Post-Op', 'Discharged'],
    datasets: [
      {
        data: [
          mockPatientDistribution.opdQueue,
          mockPatientDistribution.activeSurveillance,
          mockPatientDistribution.surgeryScheduled,
          mockPatientDistribution.postOp,
          mockPatientDistribution.discharged
        ],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)', // Purple for OPD Queue
          'rgba(34, 197, 94, 0.8)',  // Green for Active Surveillance
          'rgba(239, 68, 68, 0.8)',  // Red for Surgery Scheduled
          'rgba(245, 158, 11, 0.8)', // Orange for Post-Op
          'rgba(59, 130, 246, 0.8)'  // Blue for Discharged
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)'
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

  // Patient Additions Chart Data
  const getPatientAdditionsData = (filter) => {
    switch (filter) {
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [3, 5, 2, 7, 4, 1, 2],
          details: [
            { date: 'Mon', patients: 3, names: ['John Smith', 'Mike Brown', 'David Wilson'] },
            { date: 'Tue', patients: 5, names: ['Robert Davis', 'James Anderson', 'William Thompson', 'Michael Chen', 'Sarah Johnson'] },
            { date: 'Wed', patients: 2, names: ['Christopher Lee', 'Richard Taylor'] },
            { date: 'Thu', patients: 7, names: ['Thomas White', 'Mark Johnson', 'Steven Miller', 'Kevin Garcia', 'Daniel Martinez', 'Paul Rodriguez', 'Andrew Lewis'] },
            { date: 'Fri', patients: 4, names: ['Robert Johnson', 'David Anderson', 'Michael Brown', 'James Wilson'] },
            { date: 'Sat', patients: 1, names: ['William Taylor'] },
            { date: 'Sun', patients: 2, names: ['Christopher Davis', 'Richard Miller'] }
          ]
        };
      case 'month':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [12, 18, 15, 22],
          details: [
            { period: 'Week 1', patients: 12, description: '12 patients added this week' },
            { period: 'Week 2', patients: 18, description: '18 patients added this week' },
            { period: 'Week 3', patients: 15, description: '15 patients added this week' },
            { period: 'Week 4', patients: 22, description: '22 patients added this week' }
          ]
        };
      case 'quarter':
        return {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          data: [67, 89, 76],
          details: [
            { period: 'Month 1', patients: 67, description: '67 patients added this month' },
            { period: 'Month 2', patients: 89, description: '89 patients added this month' },
            { period: 'Month 3', patients: 76, description: '76 patients added this month' }
          ]
        };
      default:
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [12, 18, 15, 22],
          details: [
            { period: 'Week 1', patients: 12, description: '12 patients added this week' },
            { period: 'Week 2', patients: 18, description: '18 patients added this week' },
            { period: 'Week 3', patients: 15, description: '15 patients added this week' },
            { period: 'Week 4', patients: 22, description: '22 patients added this week' }
          ]
        };
    }
  };

  const patientAdditionsData = getPatientAdditionsData(chartFilter);

  // Debug: Log chart data
  console.log('Patient Distribution Data:', patientDistributionData);
  console.log('Patient Additions Data:', patientAdditionsData);

  const patientAdditionsChartData = {
    labels: patientAdditionsData.labels,
    datasets: [
      {
        label: 'Patients Added',
        data: patientAdditionsData.data,
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

  const patientAdditionsOptions = {
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
            const dataIndex = context.dataIndex;
            const details = patientAdditionsData.details[dataIndex];
            if (details && details.names) {
              return [
                `Patients Added: ${context.parsed.y}`,
                `Names: ${details.names.join(', ')}`
              ];
            } else {
              return `Patients Added: ${context.parsed.y}`;
            }
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
        beginAtZero: true,
        min: 0,
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
            return value + ' patients';
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
  const patientAdditionsBarOptions = {
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
            const dataIndex = context.dataIndex;
            const details = patientAdditionsData.details[dataIndex];
            if (details && details.names) {
              return [
                `Patients Added: ${context.parsed.y}`,
                `Names: ${details.names.join(', ')}`
              ];
            } else {
              return `Patients Added: ${context.parsed.y}`;
            }
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
        beginAtZero: true,
        min: 0,
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
            return value + ' patients';
          }
        }
      },
    },
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  // Bar Chart Data (same as line chart)
  const patientAdditionsBarChartData = {
    labels: patientAdditionsData.labels,
    datasets: [
      {
        label: 'Patients Added',
        data: patientAdditionsData.data,
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

  // Workflow cards for main command center
  const workflowCards = [
    {
      name: 'New Referrals',
      description: 'Pending triage from GP/IPD',
      value: referrals.filter(r => r.status === 'pending').length,
      icon: UserPlus,
      color: 'red',
      route: '/urology-nurse/triage',
      urgent: referrals.filter(r => r.status === 'pending').length > 0
    },
    {
      name: "Today's Appointments",
      description: 'OPD visits, investigations, surgeries',
      value: mockAppointments.filter(a => a.date === selectedDate).length,
      icon: Calendar,
      color: 'blue',
      route: '/urology-nurse/appointments',
      urgent: false
    },
    {
      name: 'OPD Queue',
      description: 'Patients waiting to see urologist',
      value: db1.patients.length,
      icon: Database,
      color: 'purple',
      route: '/urology-nurse/opd-management',
      urgent: db1.patients.length > 10
    },
    {
      name: 'Active Surveillance',
      description: 'Patients due for PSA/MRI',
      value: db2.patients.length,
      icon: Activity,
      color: 'green',
      route: '/urology-nurse/active-surveillance',
      urgent: false
    },
    {
      name: 'Surgical Pathway',
      description: 'Upcoming surgeries + pre-op status',
      value: db3.patients.length,
      icon: Stethoscope,
      color: 'orange',
      route: '/urology-nurse/surgical-pathway',
      urgent: false
    },
    {
      name: 'Post-Op Follow-Up',
      description: 'Patients due for review',
      value: db4.patients.length,
      icon: Heart,
      color: 'yellow',
      route: '/urology-nurse/postop-followup',
      urgent: false
    },
    {
      name: 'Awaiting Discharge',
      description: 'Ready to be sent back to GP',
      value: referrals.filter(r => r.status === 'ready_for_discharge').length,
      icon: ClipboardList,
      color: 'indigo',
      route: '/urology-nurse/patients',
      urgent: false
    }
  ];

  // Enhanced dummy data for clinical alerts
  const enhancedClinicalAlerts = [
    {
      id: 1,
      type: 'PSA_CRITICAL',
      patient: 'Robert Davis',
      message: 'PSA >100 ng/mL - URGENT notification required',
      priority: 'critical',
      timestamp: '2024-01-15T10:30:00',
      actionRequired: 'Immediate urologist notification'
    },
    {
      id: 2,
      type: 'PROGRESSION_ALERT',
      patient: 'James Wilson',
      message: 'PSA velocity 1.2 ng/mL/year exceeds threshold',
      priority: 'high',
      timestamp: '2024-01-15T09:15:00',
      actionRequired: 'MDT review required'
    },
    {
      id: 3,
      type: 'OVERDUE_FOLLOWUP',
      patient: 'Thomas Anderson',
      message: 'Overdue PSA review - 45 days past due',
      priority: 'medium',
      timestamp: '2024-01-15T08:45:00',
      actionRequired: 'Schedule follow-up appointment'
    },
    {
      id: 4,
      type: 'SURGICAL_READY',
      patient: 'Michael Thompson',
      message: 'Pre-operative checklist 100% complete',
      priority: 'low',
      timestamp: '2024-01-15T07:30:00',
      actionRequired: 'Schedule surgery date'
    },
    {
      id: 5,
      type: 'BIOCHEMICAL_RECURRENCE',
      patient: 'David Chen',
      message: 'PSA 0.3 ng/mL - possible biochemical recurrence',
      priority: 'high',
      timestamp: '2024-01-15T06:15:00',
      actionRequired: 'MDT discussion and imaging'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'referral', message: 'New referral received from Dr. Smith', time: '2 minutes ago', priority: 'normal' },
    { id: 2, type: 'appointment', message: 'Appointment scheduled for John Doe', time: '15 minutes ago', priority: 'normal' },
    { id: 3, type: 'alert', message: 'PSA progression alert for Patient #1234', time: '1 hour ago', priority: 'high' },
    { id: 4, type: 'completion', message: 'OPD assessment completed for Patient #1235', time: '2 hours ago', priority: 'normal' },
    { id: 5, type: 'reminder', message: 'Follow-up reminder sent to Patient #1236', time: '3 hours ago', priority: 'normal' }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Complete OPD assessment for Patient #1237', due: 'Today 2:00 PM', priority: 'high' },
    { id: 2, task: 'Schedule PSA follow-up for Patient #1238', due: 'Tomorrow 9:00 AM', priority: 'medium' },
    { id: 3, task: 'Update surveillance protocol for Patient #1239', due: 'Tomorrow 11:00 AM', priority: 'medium' },
    { id: 4, task: 'Send discharge summary to GP', due: 'Day after tomorrow', priority: 'low' }
  ];

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

  // Add Patient Modal handlers
  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const handlePatientAdded = (newPatient) => {
    console.log('New patient added:', newPatient);
    // Here you could update your local state or dispatch to Redux store
    // For now, we'll just log it
  };

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false);
  };

  // Book Appointment Modal handlers
  const handleBookAppointment = () => {
    setShowBookAppointmentModal(true);
  };

  const handleAppointmentBooked = (appointmentData) => {
    console.log('Appointment booked:', appointmentData);
    // Here you could update your local state or dispatch to Redux store
    // For now, we'll just log it
  };

  const handleCloseBookAppointmentModal = () => {
    setShowBookAppointmentModal(false);
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
      {/* Page Header */}
      <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Urology Clinical Nurse Dashboard</h1>
        <p className="text-gray-600 mt-1">Main Command Center - One page to see everything</p>
          </div>
      
      {/* Quick Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Empty div to maintain layout */}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleAddPatient}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span className="font-medium">Add Patient</span>
          </button>
          <button 
            onClick={handleBookAppointment}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">Schedule Appointment</span>
          </button>
        </div>
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
                  {mockPatientDistribution.opdQueue + mockPatientDistribution.activeSurveillance + mockPatientDistribution.surgeryScheduled + mockPatientDistribution.postOp + mockPatientDistribution.discharged} Total
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

        {/* Patient Additions Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Patient Inflow</h2>
                <p className="text-sm text-gray-600 mt-1">Number of patients added by me</p>
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
              {patientAdditionsChartData.datasets[0].data.length > 0 ? (
                chartType === 'line' ? (
                  <Line data={patientAdditionsChartData} options={patientAdditionsOptions} />
                ) : (
                  <Bar data={patientAdditionsBarChartData} options={patientAdditionsBarOptions} />
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No patient additions data available</p>
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
              <p className="text-sm text-gray-600 mt-1">View and manage all appointments</p>
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
                    setCurrentMonth(new Date());
                    setSelectedDate(new Date().toISOString().split('T')[0]);
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
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayAppointments = getAppointmentsForDate(day);
                  const isSelectedDay = isSelected(day);

                  const isDragOver = dragOverDate && dragOverDate.toDateString() === day.toDateString();

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedDate(day.toISOString().split('T')[0]);
                      }}
                      onDragOver={(e) => handleDragOver(e, day)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, day)}
                      className={`min-h-[150px] p-2 border border-gray-200 rounded-lg transition-all duration-200 flex flex-col cursor-pointer ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isToday ? 'ring-2 ring-green-500' : ''} ${
                        isSelectedDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      } ${
                        isDragOver ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 flex-shrink-0 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      } ${isToday ? 'text-green-600' : ''} ${isSelectedDay ? 'text-blue-600' : ''}`}>
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
      />

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={showBookAppointmentModal}
        onClose={handleCloseBookAppointmentModal}
        onAppointmentBooked={handleAppointmentBooked}
      />

    </div>
  );
};

export default UrologyNurseDashboard;

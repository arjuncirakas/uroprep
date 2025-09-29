import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight
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

  // State for appointments table
  const [activeFilter, setActiveFilter] = useState('Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Chart filter state
  const [chartFilter, setChartFilter] = useState('month');
  const [chartType, setChartType] = useState('line'); // line or bar

  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const dateString = date.toISOString().split('T')[0];
    return mockAppointments.filter(apt => apt.date === dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
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
    return date.toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Filter appointments based on selected date
  const filteredAppointments = mockAppointments.filter(appointment => {
    // Date filter
    const dateMatch = appointment.date === selectedDate;
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return dateMatch && searchMatch;
  });

  const days = getDaysInMonth(currentDate);

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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };


  return (
    <div className="space-y-6">
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
            onClick={() => navigate('/urology-nurse/add-patient')}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span className="font-medium">Add Patient</span>
          </button>
          <button 
            onClick={() => navigate('/urology-nurse/appointments')}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Workflow Cards - Main Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflowCards.map((card) => {
          const Icon = card.icon;
              return (
            <div 
              key={card.name} 
              onClick={() => navigate(card.route)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group relative overflow-hidden cursor-pointer"
            >
              {/* Professional gradient overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-3 transition-opacity duration-300 ${
                card.color === 'red' ? 'bg-gradient-to-r from-red-50 to-transparent' :
                card.color === 'blue' ? 'bg-gradient-to-r from-blue-50 to-transparent' :
                card.color === 'purple' ? 'bg-gradient-to-r from-purple-50 to-transparent' :
                card.color === 'green' ? 'bg-gradient-to-r from-green-50 to-transparent' :
                card.color === 'orange' ? 'bg-gradient-to-r from-orange-50 to-transparent' :
                card.color === 'yellow' ? 'bg-gradient-to-r from-yellow-50 to-transparent' :
                card.color === 'indigo' ? 'bg-gradient-to-r from-indigo-50 to-transparent' :
                'bg-gradient-to-r from-gray-50 to-transparent'
              }`}></div>
              
              <div className="relative z-10 p-5">
                {/* Icon, count, and title on same line */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 ${
                    card.color === 'red' ? 'bg-red-500' :
                    card.color === 'blue' ? 'bg-blue-500' :
                    card.color === 'purple' ? 'bg-purple-500' :
                    card.color === 'green' ? 'bg-green-500' :
                    card.color === 'orange' ? 'bg-orange-500' :
                    card.color === 'yellow' ? 'bg-yellow-500' :
                    card.color === 'indigo' ? 'bg-indigo-500' :
                    'bg-gray-500'
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-base font-semibold text-gray-900">{card.name}</p>
                  </div>
                  {card.urgent && (
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {/* Description centered */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
                
                {/* View Details link centered */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 group-hover:text-green-700 text-sm font-medium transition-colors duration-200 mx-auto">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
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
                <h2 className="text-xl font-semibold text-gray-900">Patient Additions Trend</h2>
                <p className="text-sm text-gray-600 mt-1">Number of patients added by nurse over time</p>
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
            
      {/* Today's Schedule Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {new Date(selectedDate).toLocaleDateString('en-AU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} Schedule
              </h2>
              <p className="text-sm text-gray-600 mt-1">Upcoming appointments and tasks for selected date</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                  showCalendar 
                    ? 'bg-gradient-to-r from-green-800 to-black text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
                title={showCalendar ? "Hide calendar" : "Show calendar"}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                </span>
              </button>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-xl">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {filteredAppointments.length} Appointments
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar Modal */}
        {showCalendar && (
          <div className="border-b border-gray-200 bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-6">
            <div className="max-w-lg mx-auto">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {formatDate(currentDate)}
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
                      setCurrentDate(new Date());
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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={day} className="text-center">
                      <div className={`w-8 h-8 mx-auto flex items-center justify-center text-xs font-bold rounded-lg ${
                        index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600'
                      }`}>
                        {day}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={index} className="h-10"></div>;
                    }

                    const appointments = getAppointmentsForDate(day);
                    const isCurrentDay = isToday(day);
                    const isSelectedDay = isSelected(day);
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => {
                          setSelectedDate(day.toISOString().split('T')[0]);
                          setShowCalendar(false);
                        }}
                        className={`relative h-10 w-10 mx-auto cursor-pointer rounded-xl transition-all duration-200 hover:scale-105 ${
                          isCurrentDay 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
                            : isSelectedDay 
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' 
                              : isWeekend
                                ? 'bg-red-50 hover:bg-red-100 text-red-600'
                                : 'bg-gray-50 hover:bg-white text-gray-700 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="text-sm font-semibold">{day.getDate()}</span>
                          {appointments.length > 0 && (
                            <div className="absolute -top-1 -right-1">
                              <div className={`w-2 h-2 rounded-full ${
                                isCurrentDay || isSelectedDay ? 'bg-yellow-300' : 'bg-green-500'
                              }`}></div>
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
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Today</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Has Appointments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="grid gap-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No appointments scheduled for this date</p>
              </div>
            ) : (
              filteredAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                  appointment.priority === 'High' ? 'border-red-200 bg-red-50/30' :
                  appointment.priority === 'Medium' ? 'border-yellow-200 bg-yellow-50/30' :
                  'border-green-200 bg-green-50/30'
                }`}>
                  {/* Header section with time and priority */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        appointment.priority === 'High' ? 'bg-red-500' :
                        appointment.priority === 'Medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{appointment.time}</div>
                        <div className="text-xs text-gray-500 font-mono">{appointment.upi}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      appointment.priority === 'High' ? 'bg-red-100 text-red-800' :
                      appointment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {appointment.priority}
                    </span>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{appointment.patientName}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(appointment.type)}`}>
                            {appointment.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-2">{appointment.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{appointment.description}</p>
                      </div>
                      
                      {/* View Details button */}
                      <div className="ml-6 flex-shrink-0">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        >
                          <Info className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle gradient overlay */}
                  <div className={`absolute inset-0 pointer-events-none opacity-5 ${
                    appointment.priority === 'High' ? 'bg-gradient-to-r from-red-500 to-transparent' :
                    appointment.priority === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-transparent' :
                    'bg-gradient-to-r from-green-500 to-transparent'
                  }`}></div>
                </div>
              ))
            )}
          </div>
          
          {filteredAppointments.length > 5 && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/urology-nurse/appointments')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Appointments ({filteredAppointments.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
              <button
                onClick={closeModal}
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
                        <span className="ml-2 font-medium text-gray-900">{selectedAppointment.patientName}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">UPI:</span>
                        <span className="ml-2 font-mono text-gray-900">{selectedAppointment.upi}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Appointment Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedAppointment.type)}`}>
                          {selectedAppointment.type}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Priority:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedAppointment.priority === 'High' ? 'bg-red-100 text-red-800' :
                          selectedAppointment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedAppointment.priority}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAppointment.status)}`}>
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
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Description</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedAppointment.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    navigate('/urology-nurse/appointments');
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View in Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UrologyNurseDashboard;

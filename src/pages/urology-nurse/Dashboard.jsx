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
  Info
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
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  
  // Chart filter state
  const [chartFilter, setChartFilter] = useState('month');
  const [chartType, setChartType] = useState('line'); // line or bar

  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock appointments data
  const mockAppointments = [
    {
      id: 'APT001',
      patientName: 'John Doe',
      upi: 'URP2024001',
      title: 'PSA Follow-up',
      description: '3-month PSA review and consultation',
      date: '2024-01-15',
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
      date: '2024-01-15',
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
      date: '2024-01-15',
      time: '2:00 PM',
      type: 'Surgery',
      status: 'Confirmed',
      priority: 'Normal'
    },
    {
      id: 'APT004',
      patientName: 'David Wilson',
      upi: 'URP2024004',
      title: 'PSA Review',
      description: '6-month PSA monitoring',
      date: '2024-01-16',
      time: '9:00 AM',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal'
    },
    {
      id: 'APT005',
      patientName: 'Sarah Davis',
      upi: 'URP2024005',
      title: 'Surveillance Check',
      description: 'Active surveillance monitoring',
      date: '2024-01-16',
      time: '11:00 AM',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal'
    },
    {
      id: 'APT006',
      patientName: 'Michael Thompson',
      upi: 'URP2024006',
      title: 'Post-op Follow-up',
      description: 'Post-operative assessment',
      date: '2024-01-17',
      time: '2:30 PM',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Normal'
    }
  ];

  // Filter appointments based on active filter and search term
  const filteredAppointments = mockAppointments.filter(appointment => {
    // Status filter
    const filterMatch = 
      (activeFilter === 'Today' && appointment.date === selectedDate) ||
      (activeFilter === 'Follow-ups' && (appointment.type === 'Follow-up' || appointment.type === 'Surveillance') && appointment.date === selectedDate) ||
      (activeFilter === 'OPD' && appointment.type === 'OPD' && appointment.date === selectedDate) ||
      (activeFilter === 'Surgery' && appointment.type === 'Surgery' && appointment.date === selectedDate);
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return filterMatch && searchMatch;
  });

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

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

  // Debug: Log chart data
  console.log('Patient Distribution Data:', patientDistributionData);
  console.log('PSA Trend Data:', psaTrendData);

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
      name: 'Discharges Pending',
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
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
        <button 
          onClick={() => navigate('/urology-nurse/appointments')}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Calendar className="h-4 w-4 mr-2" />
          <span className="font-medium">Schedule Appointment</span>
        </button>
      </div>

      {/* Workflow Cards - Main Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {workflowCards.map((card) => {
          const Icon = card.icon;
              return (
            <div 
              key={card.name} 
              onClick={() => navigate(card.route)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:scale-102 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  card.color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-700' :
                  card.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                  card.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                  card.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                  card.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                  card.color === 'yellow' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' :
                  card.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' :
                  'bg-gradient-to-br from-gray-500 to-gray-700'
                }`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                {card.urgent && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.name}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                <p className="text-xs text-gray-500 mb-3">{card.description}</p>
                <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
            
      {/* Today's Schedule Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
              <p className="text-sm text-gray-600 mt-1">Upcoming appointments and tasks for today</p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {mockAppointments.filter(a => a.date === selectedDate).length} Appointments
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4">
            {mockAppointments.filter(a => a.date === selectedDate).slice(0, 5).map((appointment) => (
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
            ))}
          </div>
          
          {mockAppointments.filter(a => a.date === selectedDate).length > 5 && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/urology-nurse/appointments')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Appointments ({mockAppointments.filter(a => a.date === selectedDate).length})
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

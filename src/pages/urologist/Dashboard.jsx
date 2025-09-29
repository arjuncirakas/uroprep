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
  TrendingUp,
  FileText,
  Search,
  Eye,
  UserPlus,
  ClipboardList,
  ArrowRight,
  Shield,
  Target,
  User
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
  
  // State for chart filters
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  
  // Chart filter state
  const [chartFilter, setChartFilter] = useState('month');
  const [chartType, setChartType] = useState('line'); // line or bar



  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  // Function to handle patient review - navigate to patient details page
  const handlePatientReview = (patient, type) => {
    // Store patient data in localStorage to pass to the details page
    localStorage.setItem('selectedPatient', JSON.stringify({ ...patient, type }));
    
    // Set the last visited page in sessionStorage so the back button returns to dashboard
    sessionStorage.setItem('lastVisitedPage', 'dashboard');
    
    // Navigate to the patient details page
    navigate(`/urologist/patient-details/${patient.id}`);
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
      name: 'OPD Queue (DB1)',
      description: 'Patients awaiting initial consultation',
      value: mockOPDPatients.length,
      icon: Database,
      color: 'purple',
      route: '/urologist/opd-consultations',
      urgent: mockOPDPatients.filter(p => p.priority === 'High').length > 0,
      details: `${mockOPDPatients.filter(p => p.priority === 'High').length} High Priority`
    },
    {
      name: 'Active Surveillance (DB2)',
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
      name: 'Surgical Pathway (DB3)',
      description: 'Patients awaiting or scheduled for surgery',
      value: mockSurgicalPatients.length,
      icon: Stethoscope,
      color: 'orange',
      route: '/urologist/surgical-pathway',
      urgent: mockSurgicalPatients.filter(p => p.priority === 'High').length > 0,
      details: `${mockSurgicalPatients.filter(p => p.status === 'Awaiting Surgery').length} Awaiting Surgery`
    },
    {
      name: 'Post-Op Follow-Up (DB4)',
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
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Urologist Clinical Dashboard</h1>
        <p className="text-gray-600 mt-1">Main Command Center - One page to see everything</p>
          </div>
      
      {/* Quick Action Buttons */}
      <div className="flex items-center justify-end mb-6">
        <button 
          onClick={() => navigate('/urologist/patient-management')}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          <span className="font-medium">Add New Patient</span>
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
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.name}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                <p className="text-xs text-gray-500 mb-2">{card.description}</p>
                <p className="text-xs font-medium text-blue-600 mb-3">{card.details}</p>
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
        

      {/* Priority Cases Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Priority Cases</h2>
              <p className="text-sm text-gray-500">High priority cases requiring attention</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {mockOPDPatients.filter(p => p.priority === 'High').length + 
                 mockMDTCases.filter(c => c.priority === 'High').length + 
                 mockSurgicalPatients.filter(p => p.priority === 'High').length} High Priority
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {/* High Priority OPD Cases */}
            {mockOPDPatients.filter(p => p.priority === 'High').slice(0, 3).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-red-700">H</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                      <span className="px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded">
                        OPD
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      PSA: {patient.psa} ng/mL • Wait: {patient.waitTime} days
                    </div>
                  </div>
                </div>
                      <button 
                onClick={() => handlePatientReview(patient, 'OPD')}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                  Review
                      </button>
                    </div>
            ))}

            {/* High Priority MDT Cases */}
            {mockMDTCases.filter(c => c.priority === 'High').slice(0, 2).map((case_) => (
              <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-orange-700">H</span>
      </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{case_.name}</span>
                      <span className="px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded">
                        MDT
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      PSA: {case_.psa} ng/mL • Wait: {case_.waitTime} days
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handlePatientReview(case_, 'MDT')}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}

            {/* High Priority Surgical Cases */}
            {mockSurgicalPatients.filter(p => p.priority === 'High').slice(0, 2).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-yellow-700">H</span>
            </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                      <span className="px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-100 rounded">
                        Surgery
                        </span>
                      </div>
                    <div className="text-xs text-gray-600">
                      Date: {patient.surgeryDate} • Status: {patient.status}
                    </div>
                  </div>
                      </div>
                <button 
                  onClick={() => handlePatientReview(patient, 'Surgery')}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Review
                </button>
                      </div>
              ))}
                  </div>
                  
              <div className="mt-4 text-center">
                  <button
              onClick={() => navigate('/urologist/patient-management')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
              View All Priority Cases
                  </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default UrologistDashboard;

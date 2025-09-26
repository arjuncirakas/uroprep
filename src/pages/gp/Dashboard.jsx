import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar,
  TrendingUp,
  Shield,
  Activity,
  Bell,
  Target,
  Zap,
  Search,
  Grid3X3,
  Share,
  Filter,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Plus,
  Send,
  RotateCcw,
  Download
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
import { Bar } from 'react-chartjs-2';

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

const GPDashboard = () => {
  // Chart filter state
  const [chartFilter, setChartFilter] = useState('year');
  
  // Discharge notifications state
  const [dischargeNotifications, setDischargeNotifications] = useState([
    { id: 1, name: 'David Wilson', summary: 'RALP completed successfully', followUp: '3-month PSA', date: '2024-01-14', acknowledged: false, details: 'Robotic-assisted laparoscopic prostatectomy completed without complications. Patient stable post-operatively. No immediate concerns noted.' },
    { id: 2, name: 'Sarah Davis', summary: 'Active surveillance continued', followUp: '6-month PSA', date: '2024-01-13', acknowledged: false, details: 'PSA levels remain stable at 3.2 ng/mL. No significant changes in imaging. Continue current surveillance protocol with 6-month PSA monitoring.' },
  ]);
  
  // Modal states
  const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  // Mock data - replace with actual data from Redux store
  const stats = {
    totalReferrals: 45,
    awaitingTriage: 8,
    inActiveSurveillance: 12,
    scheduledForSurgery: 5,
    discharged: 20,
    urgentReferrals: 3,
    cpcCompliant: 38,
    clinicalOverride: 7,
    averageWaitTime: 12,
    followUpCompliance: 94
  };

  // Chart data based on filter
  const getChartData = (filter) => {
    switch (filter) {
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          newReferrals: [3, 5, 2, 7, 4, 1, 2],
          completedCases: [2, 3, 4, 5, 3, 1, 1]
        };
      case 'month':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          newReferrals: [12, 15, 18, 14],
          completedCases: [8, 12, 15, 11]
        };
      case 'year':
      default:
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          newReferrals: [35, 42, 38, 45, 52, 48, 55, 49, 43, 47, 41, 38],
          completedCases: [28, 35, 32, 38, 42, 40, 45, 41, 36, 39, 35, 32]
        };
    }
  };

  const chartData = getChartData(chartFilter);

  const chartConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'New Referrals',
        data: chartData.newReferrals,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        hoverBorderColor: 'rgb(34, 197, 94)',
        hoverBorderWidth: 2,
      },
      {
        label: 'Completed Cases',
        data: chartData.completedCases,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(0, 0, 0, 1)',
        hoverBorderColor: 'rgb(0, 0, 0)',
        hoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll use custom legend
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return `${context[0].label}`;
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
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
            return value;
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    // Bar chart specific options
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  const recentReferrals = [
    { id: 1, name: 'John Smith', psa: 15.2, date: '2024-01-10', status: 'Awaiting Triage', days: 5, priority: 'High', cpcCompliant: true },
    { id: 2, name: 'Mary Johnson', psa: 8.7, date: '2024-01-08', status: 'In Active Surveillance', days: 7, priority: 'Medium', cpcCompliant: true },
    { id: 3, name: 'Robert Brown', psa: 22.1, date: '2024-01-12', status: 'Scheduled for Surgery', days: 3, priority: 'High', cpcCompliant: true },
    { id: 4, name: 'David Wilson', psa: 3.2, date: '2024-01-15', status: 'Awaiting Triage', days: 2, priority: 'Routine', cpcCompliant: false },
  ];

  const urgentAlerts = [
    { id: 1, type: 'PSA_CRITICAL', message: 'PSA >100 ng/mL - Immediate urologist notification', count: 1, color: 'red' },
    { id: 2, type: 'AGE_WARNING', message: 'Age outside standard range - Clinical override required', count: 2, color: 'yellow' },
    { id: 3, type: 'CPC_OVERRIDE', message: 'CPC criteria not met - Justification pending', count: 4, color: 'orange' }
  ];

  const clinicalKPIs = [
    { title: 'Average Wait Time', value: `${stats.averageWaitTime} days`, target: '<14 days', status: 'good', icon: Clock },
    { title: 'CPC Compliance', value: `${Math.round((stats.cpcCompliant / stats.totalReferrals) * 100)}%`, target: '>80%', status: 'good', icon: Shield },
    { title: 'Follow-up Compliance', value: `${stats.followUpCompliance}%`, target: '>95%', status: 'warning', icon: CheckCircle },
    { title: 'Urgent Referrals', value: stats.urgentReferrals, target: '<5%', status: 'good', icon: Zap }
  ];

  // Function to handle acknowledge button click
  const handleAcknowledgeClick = (notification) => {
    setSelectedNotification(notification);
    setShowAcknowledgeModal(true);
  };

  // Function to confirm acknowledge
  const handleConfirmAcknowledge = () => {
    if (selectedNotification) {
      setDischargeNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === selectedNotification.id 
            ? { ...notification, acknowledged: true }
            : notification
        )
      );
      
      console.log(`Acknowledged discharge summary for notification ID: ${selectedNotification.id}`);
    }
    setShowAcknowledgeModal(false);
    setSelectedNotification(null);
  };

  // Function to handle view details
  const handleViewDetails = (notification) => {
    setSelectedDetails(notification);
    setShowDetailsModal(true);
  };

  // Filter notifications
  const unacknowledgedNotifications = dischargeNotifications.filter(n => !n.acknowledged);
  const acknowledgedNotifications = dischargeNotifications.filter(n => n.acknowledged);

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend, trendValue }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Awaiting Triage': return 'bg-yellow-100 text-yellow-800';
      case 'In Active Surveillance': return 'bg-blue-100 text-blue-800';
      case 'Scheduled for Surgery': return 'bg-red-100 text-red-800';
      case 'Discharged': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Routine': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKPIStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      {/* Quick Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Link 
            to="/gp/referral-status"
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium">My Referrals</span>
          </Link>
          <Link 
            to="/gp/patient-search"
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2 text-purple-600" />
            <span className="font-medium">Patient Search</span>
          </Link>
        </div>
        <Link 
          to="/gp/new-referral"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <FileText className="h-4 w-4 mr-2" />
          <span className="font-medium">New Referral</span>
        </Link>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Referrals"
          value={stats.totalReferrals}
          icon={Users}
          color="bg-gradient-to-br from-green-800 to-black"
          subtitle="Total referrals"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Awaiting Triage"
          value={stats.awaitingTriage}
          icon={Clock}
          color="bg-gradient-to-br from-yellow-500 to-orange-500"
          subtitle="Pending review"
          trend="up"
          trendValue="8%"
        />
        <StatCard
          title="Active Surveillance"
          value={stats.inActiveSurveillance}
          icon={CheckCircle}
          color="bg-gradient-to-br from-blue-500 to-blue-700"
          subtitle="Monitoring"
          trend="down"
          trendValue="5%"
        />
        <StatCard
          title="Scheduled Surgery"
          value={stats.scheduledForSurgery}
          icon={AlertCircle}
          color="bg-gradient-to-br from-red-500 to-red-700"
          subtitle="Surgery planned"
          trend="up"
          trendValue="15%"
        />
      </div>

      {/* Referral Breakdown Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Referral Breakdown</h2>
          <div className="flex items-center space-x-2">
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
              onClick={() => setChartFilter('year')}
              className={`px-3 py-1 text-sm border rounded-lg transition-colors cursor-pointer ${
                chartFilter === 'year' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white border-transparent' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        {/* Chart Area */}
        <div className="h-64 w-full">
          <Bar data={chartConfig} options={chartOptions} />
        </div>
        
        {/* Chart Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">New Referrals</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-black rounded"></div>
            <span className="text-sm text-gray-600">Completed Cases</span>
          </div>
        </div>
      </div>





      {/* Recent Referrals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Referrals</h2>
              <p className="text-sm text-gray-600 mt-1">Track your latest patient referrals and their status</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <Link 
                to="/gp/referral-status" 
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm"
              >
                <span>View All</span>
                <Activity className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Referral ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Due Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentReferrals.map((referral, index) => (
                <tr key={referral.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {referral.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {referral.priority === 'High' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{referral.name}</p>
                        <p className="text-sm text-gray-500">Patient ID: {referral.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <Link 
                      to={`/gp/referral-status/${referral.id}`} 
                      className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm font-medium rounded-full hover:from-green-200 hover:to-green-300 transition-all duration-200 border border-green-300"
                    >
                      #{referral.id.toString().padStart(4, '0')}
                    </Link>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(new Date(referral.date).getTime() + (referral.days * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-2">
                      {referral.status === 'Awaiting Triage' && <Clock className="h-4 w-4 text-amber-500" />}
                      {referral.status === 'In Active Surveillance' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      {referral.status === 'Scheduled for Surgery' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        referral.psa > 10 ? 'bg-red-500' : 
                        referral.psa > 4 ? 'bg-amber-500' : 
                        'bg-green-500'
                      }`}></div>
                      <span className={`text-sm font-semibold ${
                        referral.psa > 10 ? 'text-red-600' : 
                        referral.psa > 4 ? 'text-amber-600' : 
                        'text-green-600'
                      }`}>
                        {referral.psa} ng/mL
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-white px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span>Showing {recentReferrals.length} of {stats.totalReferrals} referrals</span>
          </div>
        </div>
      </div>

      {/* Discharge Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Discharge Summaries</h2>
              <p className="text-sm text-gray-600 mt-1">Patient outcomes and follow-up instructions</p>
            </div>
            <Link 
              to="/gp/discharge-summaries" 
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm"
            >
              <span>View All</span>
              <Activity className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Unacknowledged Notifications */}
          {unacknowledgedNotifications.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Acknowledgment</h3>
              {unacknowledgedNotifications.map((notification) => (
                <div key={notification.id} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all duration-300 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-12 w-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                          <span className="text-white font-semibold text-sm">
                            {notification.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="h-2 w-2 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{notification.name}</p>
                        <p className="text-sm text-gray-700 font-medium">{notification.summary}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Follow-up:</span> {notification.followUp}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-600">{notification.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(notification)}
                          className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleAcknowledgeClick(notification)}
                          className="px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Acknowledged Notifications */}
          {acknowledgedNotifications.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acknowledged</h3>
              {acknowledgedNotifications.map((notification) => (
                <div key={notification.id} className="group bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 hover:border-green-300 transition-all duration-300 relative overflow-hidden">
                  {/* Success indicator overlay */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-green-500"></div>
                  <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="h-2 w-2 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {notification.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="h-2 w-2 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-900">{notification.name}</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledged
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{notification.summary}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Follow-up:</span> {notification.followUp}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-600">{notification.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(notification)}
                          className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </button>
                        <button 
                          disabled
                          className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg cursor-not-allowed border border-green-200 flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Completed</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No notifications message */}
          {dischargeNotifications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No discharge summaries available</p>
            </div>
          )}
        </div>
      </div>

      {/* Acknowledge Confirmation Modal */}
      {showAcknowledgeModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Acknowledgment</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to acknowledge the discharge summary for <strong>{selectedNotification.name}</strong>? 
              This confirms that you have reviewed the patient's treatment outcome and will take responsibility for their follow-up care.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAcknowledgeModal(false);
                  setSelectedNotification(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAcknowledge}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-800 to-black rounded-lg hover:opacity-90 transition-opacity"
              >
                Confirm Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">
                    {selectedDetails.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Discharge Summary Details</h3>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDetails(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Patient Information</h4>
                <p className="text-gray-700"><strong>Name:</strong> {selectedDetails.name}</p>
                <p className="text-gray-700"><strong>Discharge Date:</strong> {selectedDetails.date}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Treatment Summary</h4>
                <p className="text-gray-700">{selectedDetails.summary}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Follow-up Instructions</h4>
                <p className="text-gray-700">{selectedDetails.followUp}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Additional Details</h4>
                <p className="text-gray-700">{selectedDetails.details}</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDetails(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-800 to-black rounded-lg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
  );
};

export default GPDashboard;

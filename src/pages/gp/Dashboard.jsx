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
  ArrowRight,
  Plus,
  Send,
  RotateCcw,
  Download
} from 'lucide-react';
import NewReferralModal from '../../components/modals/NewReferralModal';
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
  
  // Modal states
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);

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
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center space-x-3">
          <Link 
            to="/gp/referral-status"
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium">My Referrals</span>
          </Link>
          <button 
            onClick={() => setShowNewReferralModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span className="font-medium">New Referral</span>
          </button>
        </div>
      </div>

      {/* Summary Cards - Exact match to nurse dashboard style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group relative overflow-hidden cursor-pointer">
          <div className="relative z-10 p-4">
            {/* Icon, count, and title on same line - compact layout */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">Referrals</p>
              </div>
            </div>
            
            {/* Description - smaller text */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 leading-relaxed">Total referrals</p>
            </div>
            
            {/* View Details link - smaller and more compact */}
            <div className="flex items-center justify-center text-green-600 group-hover:text-green-700 text-xs font-medium transition-colors duration-200">
              <span>View Details</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group relative overflow-hidden cursor-pointer">
          <div className="relative z-10 p-4">
            {/* Icon, count, and title on same line - compact layout */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <p className="text-2xl font-bold text-gray-900">{stats.awaitingTriage}</p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">Awaiting Triage</p>
              </div>
            </div>
            
            {/* Description - smaller text */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 leading-relaxed">Pending review</p>
            </div>
            
            {/* View Details link - smaller and more compact */}
            <div className="flex items-center justify-center text-green-600 group-hover:text-green-700 text-xs font-medium transition-colors duration-200">
              <span>View Details</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group relative overflow-hidden cursor-pointer">
          <div className="relative z-10 p-4">
            {/* Icon, count, and title on same line - compact layout */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <p className="text-2xl font-bold text-gray-900">{stats.inActiveSurveillance}</p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">Active Surveillance</p>
              </div>
            </div>
            
            {/* Description - smaller text */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 leading-relaxed">Monitoring</p>
            </div>
            
            {/* View Details link - smaller and more compact */}
            <div className="flex items-center justify-center text-green-600 group-hover:text-green-700 text-xs font-medium transition-colors duration-200">
              <span>View Details</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group relative overflow-hidden cursor-pointer">
          <div className="relative z-10 p-4">
            {/* Icon, count, and title on same line - compact layout */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-red-500">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledForSurgery}</p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">Scheduled Surgery</p>
              </div>
            </div>
            
            {/* Description - smaller text */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 leading-relaxed">Surgery planned</p>
            </div>
            
            {/* View Details link - smaller and more compact */}
            <div className="flex items-center justify-center text-green-600 group-hover:text-green-700 text-xs font-medium transition-colors duration-200">
              <span>View Details</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>
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
        
      </div>



      {/* New Referral Modal */}
      <NewReferralModal 
        isOpen={showNewReferralModal}
        onClose={() => setShowNewReferralModal(false)}
      />

      </div>
  );
};

export default GPDashboard;

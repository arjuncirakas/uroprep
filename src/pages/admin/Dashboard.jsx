import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Calendar, 
  Clock,
  TrendingUp,
  Activity,
  Eye,
  Plus,
  Download,
  Filter,
  Search
} from 'lucide-react';

const AdminDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual data from Redux store
  const stats = {
    totalPatients: 1247,
    urgentCases: 23,
    thisWeekSurgeries: 8,
    overdueFollowups: 12,
    newReferrals: 45,
    completedSurgeries: 156,
    activeUsers: 28,
    systemUptime: '99.9%'
  };

  const urgentCases = [
    { id: 1, name: 'John Smith', psa: 25.4, daysSince: 2, priority: 'High' },
    { id: 2, name: 'Mary Johnson', psa: 18.7, daysSince: 1, priority: 'High' },
    { id: 3, name: 'Robert Brown', psa: 22.1, daysSince: 3, priority: 'High' },
  ];

  const thisWeekSurgeries = [
    { id: 1, name: 'David Wilson', type: 'RALP', date: '2024-01-15', time: '09:00', theatre: 'Theatre 1', surgeon: 'Dr. Smith', status: 'Scheduled' },
    { id: 2, name: 'Sarah Davis', type: 'Open', date: '2024-01-16', time: '14:00', theatre: 'Theatre 2', surgeon: 'Dr. Johnson', status: 'Scheduled' },
    { id: 3, name: 'Michael Miller', type: 'RALP', date: '2024-01-17', time: '10:30', theatre: 'Theatre 1', surgeon: 'Dr. Brown', status: 'Pre-op' },
  ];

  const recentActivities = [
    { id: 1, type: 'referral', user: 'Dr. Wilson', action: 'submitted new referral', patient: 'John Doe', time: '2 hours ago' },
    { id: 2, type: 'surgery', user: 'Dr. Smith', action: 'completed surgery', patient: 'Jane Smith', time: '4 hours ago' },
    { id: 3, type: 'user', user: 'Admin', action: 'added new user', patient: 'Nurse Johnson', time: '6 hours ago' },
    { id: 4, type: 'appointment', user: 'Nurse Davis', action: 'scheduled appointment', patient: 'Bob Wilson', time: '8 hours ago' },
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected', time: '1 hour ago' },
    { id: 2, type: 'info', message: 'Database backup completed successfully', time: '3 hours ago' },
    { id: 3, type: 'error', message: 'Failed login attempts from unknown IP', time: '5 hours ago' },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case 'referral': return '📋';
      case 'surgery': return '🏥';
      case 'user': return '👤';
      case 'appointment': return '📅';
      default: return '📄';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and key metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Active Patients"
          value={stats.totalPatients}
          icon={Users}
          color="bg-blue-500"
          subtitle="Across all databases"
        />
        <StatCard
          title="Urgent Cases"
          value={stats.urgentCases}
          icon={AlertTriangle}
          color="bg-red-500"
          subtitle="Requiring attention"
        />
        <StatCard
          title="This Week's Surgeries"
          value={stats.thisWeekSurgeries}
          icon={Calendar}
          color="bg-green-500"
          subtitle="Scheduled procedures"
        />
        <StatCard
          title="Overdue Follow-ups"
          value={stats.overdueFollowups}
          icon={Clock}
          color="bg-yellow-500"
          subtitle="Need scheduling"
        />
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="New Referrals"
          value={stats.newReferrals}
          icon={Plus}
          color="bg-purple-500"
          subtitle="This week"
        />
        <StatCard
          title="Completed Surgeries"
          value={stats.completedSurgeries}
          icon={TrendingUp}
          color="bg-indigo-500"
          subtitle="This month"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          color="bg-pink-500"
          subtitle="Currently online"
        />
        <StatCard
          title="System Uptime"
          value={stats.systemUptime}
          icon={Download}
          color="bg-teal-500"
          subtitle="Last 30 days"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <span className="font-medium">View All Urgent Cases</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-5 w-5 text-blue-500 mr-3" />
            <span className="font-medium">Today's Schedule</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
            <span className="font-medium">Generate Reports</span>
          </button>
        </div>
      </div>

      {/* Urgent Cases */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Urgent Cases Requiring Attention</h2>
        <div className="space-y-3">
          {urgentCases.map((case_) => (
            <div key={case_.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {case_.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{case_.name}</p>
                  <p className="text-sm text-gray-600">PSA: {case_.psa} | {case_.daysSince} days since referral</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                {case_.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* This Week's Surgeries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">This Week's Surgeries</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {thisWeekSurgeries.map((surgery) => (
            <div key={surgery.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {surgery.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{surgery.name}</p>
                  <p className="text-sm text-gray-600">{surgery.type} | {surgery.theatre} | {surgery.surgeon}</p>
                  <p className="text-sm text-gray-500">{surgery.date} at {surgery.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  surgery.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {surgery.status}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities and System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                    {activity.patient && <span className="font-medium"> for {activity.patient}</span>}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs opacity-75">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">Patient Satisfaction</div>
            <div className="text-xs text-gray-500 mt-1">↑ 2.3% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">4.2 days</div>
            <div className="text-sm text-gray-600">Avg. Referral Response</div>
            <div className="text-xs text-gray-500 mt-1">↓ 0.8 days from last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">92%</div>
            <div className="text-sm text-gray-600">Surgery Success Rate</div>
            <div className="text-xs text-gray-500 mt-1">↑ 1.2% from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

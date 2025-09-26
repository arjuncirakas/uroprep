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
  Download,
  Eye,
  X
} from 'lucide-react';

const UrologyNurseDashboard = () => {
  const navigate = useNavigate();
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  const { alerts } = useSelector(state => state.alerts);

  // State for appointments table
  const [activeFilter, setActiveFilter] = useState('Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');

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

  const stats = [
    {
      name: 'Pending Referrals',
      value: referrals.filter(r => r.status === 'pending').length,
      icon: Users,
      color: 'blue',
      change: '+5',
      changeType: 'increase',
      kpi: true
    },
    {
      name: 'OPD Queue',
      value: db1.patients.length,
      icon: Database,
      color: 'purple',
      change: '+2',
      changeType: 'increase'
    },
    {
      name: 'Active Surveillance',
      value: db2.patients.length,
      icon: Activity,
      color: 'green',
      change: '+1',
      changeType: 'increase'
    },
    {
      name: 'Surgical Cases',
      value: db3.patients.length,
      icon: Stethoscope,
      color: 'red',
      change: '0',
      changeType: 'neutral'
    },
    {
      name: 'Post-Op Follow-up',
      value: db4.patients.length,
      icon: Heart,
      color: 'yellow',
      change: '+3',
      changeType: 'increase'
    },
    {
      name: 'Active Alerts',
      value: alerts.filter(a => a.status === 'active').length,
      icon: AlertTriangle,
      color: 'orange',
      change: '-1',
      changeType: 'decrease'
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


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Urology Clinical Nurse Dashboard</h1>
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
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="font-medium">Schedule Appointment</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from yesterday</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                  stat.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                  stat.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                  stat.color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-700' :
                  stat.color === 'yellow' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' :
                  'bg-gradient-to-br from-orange-500 to-orange-700'
                }`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>



      {/* Appointments Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Appointments Management</h2>
              <p className="text-sm text-gray-600 mt-1">Schedule and manage patient appointments</p>
            </div>
            <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            {['Today', 'Follow-ups', 'OPD', 'Surgery'].map((filter) => (
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
                    {mockAppointments.filter(appointment => {
                       switch (filter) {
                         case 'Today': return appointment.date === selectedDate;
                         case 'Follow-ups': return (appointment.type === 'Follow-up' || appointment.type === 'Surveillance') && appointment.date === selectedDate;
                         case 'OPD': return appointment.type === 'OPD' && appointment.date === selectedDate;
                         case 'Surgery': return appointment.type === 'Surgery' && appointment.date === selectedDate;
                         default: return true;
                       }
                     }).length}
                  </span>
              </div>
            </button>
            ))}
          </nav>
                </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, UPI, or appointment type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <div className="flex items-center space-x-3">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                <span className="font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredAppointments.length > 0 ? (
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[150px]">Appointment</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date & Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {appointment.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {appointment.priority === 'High' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                </div>
                <div>
                          <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">UPI: {appointment.upi}</p>
                </div>
              </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="font-medium text-gray-900">{appointment.title}</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</p>
                          <p className="text-sm text-gray-500">{appointment.time}</p>
            </div>
                </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate(`/urology-nurse/patient-details/${appointment.upi}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/urology-nurse/reschedule/${appointment.id}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Reschedule</span>
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
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No appointments found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {activeFilter === 'Today' 
                  ? `No appointments scheduled for ${formatDate(selectedDate)}.`
                  : `No ${activeFilter.toLowerCase()} appointments scheduled for ${formatDate(selectedDate)}.`
                }
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Go to Today
                </button>
                <button
                  onClick={() => setActiveFilter('Today')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  View All Today
                </button>
              </div>
            </div>
          )}
            </div>
            
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>Showing {filteredAppointments.length} of {mockAppointments.length} appointments</span>
                </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-transparent rounded-lg">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrologyNurseDashboard;

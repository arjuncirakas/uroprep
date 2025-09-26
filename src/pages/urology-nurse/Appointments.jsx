import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  Plus,
  Search,
  Filter,
  Bell,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Heart,
  Activity,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  Edit,
  MapPin,
  X,
  Download
} from 'lucide-react';

const Appointments = () => {
  const navigate = useNavigate();
  const { appointments } = useSelector(state => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('week'); // week, month, day
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('Today');
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date();
  const currentWeek = getWeekDates(today);

  // Enhanced dummy data
  const enhancedUpcomingAppointments = [
    { 
      id: 'APT001', 
      patientName: 'John Smith', 
      upi: 'URP2024001',
      title: 'PSA Follow-up',
      description: '3-month PSA review and consultation',
      time: '9:00 AM', 
      type: 'Follow-up', 
      status: 'Confirmed', 
      phone: '0412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      age: 65,
      priority: 'High',
      notes: 'New referral from GP. Patient has elevated PSA levels and requires immediate assessment.',
      duration: 60,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 101'
    },
    { 
      id: 'APT002', 
      patientName: 'Michael Brown', 
      upi: 'URP2024002',
      title: 'OPD Assessment',
      description: 'Initial assessment and triage',
      time: '10:30 AM', 
      type: 'OPD', 
      status: 'Pending', 
      phone: '0412 345 679',
      email: 'michael.brown@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      age: 58,
      priority: 'Normal',
      notes: 'PSA monitoring. Patient responding well to treatment.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 102'
    },
    { 
      id: 'APT003', 
      patientName: 'David Wilson', 
      upi: 'URP2024003',
      title: 'Pre-op Consultation',
      description: 'Pre-operative assessment and planning',
      time: '2:00 PM', 
      type: 'Surgery', 
      status: 'Confirmed', 
      phone: '0412 345 680',
      email: 'david.wilson@email.com',
      address: '789 Pine Road, Brisbane QLD 4000',
      age: 71,
      priority: 'High',
      notes: 'RALP scheduled next week. Pre-operative assessment required.',
      duration: 45,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 103'
    },
    { 
      id: 'APT004', 
      patientName: 'Robert Davis', 
      upi: 'URP2024004',
      title: 'PSA Review',
      description: '6-month PSA monitoring',
      time: '3:30 PM', 
      type: 'Surveillance', 
      status: 'Confirmed', 
      phone: '0412 345 681',
      email: 'robert.davis@email.com',
      address: '321 Elm Street, Perth WA 6000',
      age: 62,
      priority: 'Normal',
      notes: 'Post-surgery follow-up. Excellent recovery progress.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 101'
    },
    { 
      id: 'APT005', 
      patientName: 'James Anderson', 
      upi: 'URP2024005',
      title: 'Surveillance Check',
      description: 'Active surveillance monitoring',
      time: '4:00 PM', 
      type: 'Surveillance', 
      status: 'Scheduled', 
      phone: '0412 345 682',
      email: 'james.anderson@email.com',
      address: '654 Maple Drive, Adelaide SA 5000',
      age: 55,
      priority: 'Normal',
      notes: 'Active surveillance patient. Regular monitoring required.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 102'
    },
    { 
      id: 'APT006', 
      patientName: 'William Thompson', 
      upi: 'URP2024006',
      title: 'Post-op Follow-up',
      description: 'Post-operative assessment',
      time: '4:30 PM', 
      type: 'Follow-up', 
      status: 'Pending', 
      phone: '0412 345 683',
      email: 'william.thompson@email.com',
      address: '987 Cedar Lane, Hobart TAS 7000',
      age: 68,
      priority: 'High',
      notes: 'Urgent review required. Patient experiencing complications.',
      duration: 45,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 103'
    }
  ];


  const appointmentStats = {
    total: enhancedUpcomingAppointments.length,
    confirmed: enhancedUpcomingAppointments.filter(a => a.status === 'Confirmed').length,
    pending: enhancedUpcomingAppointments.filter(a => a.status === 'Pending').length,
    highPriority: enhancedUpcomingAppointments.filter(a => a.priority === 'High').length
  };

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

  const getTypeColor = (type) => {
    switch (type) {
      case 'Follow-up': return 'bg-blue-100 text-blue-800';
      case 'OPD': return 'bg-purple-100 text-purple-800';
      case 'Surgery': return 'bg-red-100 text-red-800';
      case 'Surveillance': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'First Consultation': return User;
      case 'Follow-up': return Stethoscope;
      case 'Pre-op Assessment': return Heart;
      case 'PSA Review': return Activity;
      case 'Surveillance': return TrendingUp;
      case 'Consultation': return User;
      default: return Calendar;
    }
  };

  // Filter appointments based on active filter and search term
  const filteredAppointments = enhancedUpcomingAppointments.filter(appointment => {
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

  const handleAppointmentSelect = (appointment) => {
    navigate(`/urology-nurse/appointment-details/${appointment.id}`);
  };


  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900">{appointmentStats.total}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">+2</span>
              <span className="text-sm text-gray-500 ml-1">from yesterday</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
            <Calendar className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Confirmed</p>
            <p className="text-3xl font-bold text-gray-900">{appointmentStats.confirmed}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">+1</span>
              <span className="text-sm text-gray-500 ml-1">from yesterday</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-700">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{appointmentStats.pending}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-yellow-600">+1</span>
              <span className="text-sm text-gray-500 ml-1">from yesterday</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">High Priority</p>
            <p className="text-3xl font-bold text-gray-900">{appointmentStats.highPriority}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-red-600">+1</span>
              <span className="text-sm text-gray-500 ml-1">from yesterday</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-700">
            <Zap className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFiltersAndControls = () => (
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
                  {enhancedUpcomingAppointments.filter(appointment => {
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
            <button
              onClick={() => setShowNewAppointment(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentsList = () => (
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
                      onClick={() => handleAppointmentSelect(appointment)}
                      className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      <span>View Details</span>
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
  );


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-1">Manage patient appointments and scheduling</p>
      </div>

      {renderStatsCards()}
      {renderFiltersAndControls()}
      
      {/* Appointments Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {renderAppointmentsList()}
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>Showing {filteredAppointments.length} of {enhancedUpcomingAppointments.length} appointments</span>
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

export default Appointments;
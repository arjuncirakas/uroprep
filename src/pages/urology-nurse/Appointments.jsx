import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
  X
} from 'lucide-react';

const Appointments = () => {
  const { appointments } = useSelector(state => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week, month, day
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date();
  const currentWeek = getWeekDates(today);

  // Enhanced dummy data
  const enhancedUpcomingAppointments = [
    { 
      id: 1, 
      patient: 'John Smith', 
      time: '09:00', 
      type: 'First Consultation', 
      status: 'confirmed', 
      phone: '0412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      age: 65,
      priority: 'high',
      notes: 'New referral from GP. Patient has elevated PSA levels and requires immediate assessment.',
      duration: 60,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 101'
    },
    { 
      id: 2, 
      patient: 'Michael Brown', 
      time: '10:30', 
      type: 'Follow-up', 
      status: 'confirmed', 
      phone: '0412 345 679',
      email: 'michael.brown@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      age: 58,
      priority: 'medium',
      notes: 'PSA monitoring. Patient responding well to treatment.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 102'
    },
    { 
      id: 3, 
      patient: 'David Wilson', 
      time: '14:00', 
      type: 'Pre-op Assessment', 
      status: 'pending', 
      phone: '0412 345 680',
      email: 'david.wilson@email.com',
      address: '789 Pine Road, Brisbane QLD 4000',
      age: 71,
      priority: 'high',
      notes: 'RALP scheduled next week. Pre-operative assessment required.',
      duration: 45,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 103'
    },
    { 
      id: 4, 
      patient: 'Robert Davis', 
      time: '15:30', 
      type: 'PSA Review', 
      status: 'confirmed', 
      phone: '0412 345 681',
      email: 'robert.davis@email.com',
      address: '321 Elm Street, Perth WA 6000',
      age: 62,
      priority: 'low',
      notes: 'Post-surgery follow-up. Excellent recovery progress.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 101'
    },
    { 
      id: 5, 
      patient: 'James Anderson', 
      time: '16:00', 
      type: 'Surveillance', 
      status: 'confirmed', 
      phone: '0412 345 682',
      email: 'james.anderson@email.com',
      address: '654 Maple Drive, Adelaide SA 5000',
      age: 55,
      priority: 'medium',
      notes: 'Active surveillance patient. Regular monitoring required.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 102'
    },
    { 
      id: 6, 
      patient: 'William Thompson', 
      time: '16:30', 
      type: 'Consultation', 
      status: 'pending', 
      phone: '0412 345 683',
      email: 'william.thompson@email.com',
      address: '987 Cedar Lane, Hobart TAS 7000',
      age: 68,
      priority: 'high',
      notes: 'Urgent review required. Patient experiencing complications.',
      duration: 45,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 103'
    }
  ];


  const appointmentStats = {
    total: enhancedUpcomingAppointments.length,
    confirmed: enhancedUpcomingAppointments.filter(a => a.status === 'confirmed').length,
    pending: enhancedUpcomingAppointments.filter(a => a.status === 'pending').length,
    highPriority: enhancedUpcomingAppointments.filter(a => a.priority === 'high').length
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
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  // Filter appointments based on search and filter criteria
  const filteredAppointments = enhancedUpcomingAppointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || appointment.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  const renderAppointmentDetails = (appointment) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {appointment.patient}
              </h3>
              <p className="text-sm text-gray-600">Appointment ID: {appointment.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(appointment.priority)}`}>
              {appointment.priority} priority
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Time</p>
                <p className="text-lg font-bold text-blue-600">{appointment.time}</p>
              </div>
        </div>
      </div>
      
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-700 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            <div>
                <p className="text-sm font-medium text-green-900">Duration</p>
                <p className="text-lg font-bold text-green-600">{appointment.duration} min</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg mr-3">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Type</p>
                <p className="text-lg font-bold text-purple-600">{appointment.type}</p>
          </div>
        </div>
      </div>
      
          <div className="bg-gradient-to-r from-orange-50 to-gray-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
          <div>
                <p className="text-sm font-medium text-orange-900">Doctor</p>
                <p className="text-lg font-bold text-orange-600">{appointment.doctor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Phone className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-semibold text-gray-700">Contact Information</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {appointment.phone}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {appointment.email}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Address:</span> {appointment.address}</p>
      </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-semibold text-gray-700">Appointment Details</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {appointment.date}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Room:</span> {appointment.room}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Age:</span> {appointment.age} years</p>
          </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
          <span className="text-sm font-semibold text-gray-700">Appointment Notes:</span>
          <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
        </div>
      </div>
    </div>
  );

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                placeholder="Search appointments..."
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
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Filter:</span>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Appointments</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
      </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewAppointment(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-xl hover:opacity-90 transition-opacity font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppointmentsList = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and monitor patient appointments</p>
          </div>
        </div>
    </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredAppointments.length > 0 ? (
          <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Appointment Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appointment, index) => {
                  const TypeIcon = getTypeIcon(appointment.type);
                  return (
                    <tr key={appointment.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <TypeIcon className="h-5 w-5 text-white" />
      </div>
                            {appointment.priority === 'high' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                  </div>
                  <div>
                            <p className="font-semibold text-gray-900">{appointment.patient}</p>
                          <p className="text-sm text-gray-500">ID: {appointment.id}</p>
                            <p className="text-sm text-gray-500">Age: {appointment.age}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{appointment.type}</p>
                        <p className="text-sm text-gray-500">Time: {appointment.time}</p>
                        <p className="text-sm text-gray-500">Duration: {appointment.duration} min</p>
                        <p className="text-sm text-gray-500">Room: {appointment.room}</p>
                </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(appointment.priority)}`}>
                        {appointment.priority}
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
                          <button 
                          onClick={() => {
                            console.log('Call patient:', appointment.id);
                          }}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                          <Phone className="h-3 w-3 mr-1" />
                          <span>Call</span>
                  </button>
                </div>
                      </td>
                    </tr>
                  );
                })}
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
              {searchTerm ? `No appointments match your search criteria.` : `No appointments scheduled for today.`}
              </p>
            {searchTerm && (
                <button
                onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                <X className="h-4 w-4 mr-2" />
                Clear Search
                </button>
            )}
          </div>
        )}
      </div>
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
      
      {renderAppointmentsList()}

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedAppointment.patient}
                    </h3>
                    <p className="text-sm text-gray-600">Appointment ID: {selectedAppointment.id}</p>
                  </div>
                </div>
                <button
                  onClick={closeAppointmentModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
        </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {renderAppointmentDetails(selectedAppointment)}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      console.log('Call patient:', selectedAppointment.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Patient
              </button>
                  <button
                    onClick={() => {
                      console.log('Send reminder to:', selectedAppointment.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Send Reminder
              </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closeAppointmentModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
              </button>
                  <button
                    onClick={() => {
                      console.log('Complete appointment:', selectedAppointment.id);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Complete Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
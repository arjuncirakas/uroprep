import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Edit
} from 'lucide-react';

const CalendarView = () => {
  const navigate = useNavigate();
  const { getBackPath } = useNavigation();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock appointments data
  const mockAppointments = [
    {
      id: 'APT001',
      patientName: 'John Doe',
      time: '09:00',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Normal',
      date: '2024-01-15'
    },
    {
      id: 'APT002',
      patientName: 'Mary Smith',
      time: '10:30',
      type: 'OPD',
      status: 'Pending',
      priority: 'High',
      date: '2024-01-15'
    },
    {
      id: 'APT003',
      patientName: 'Robert Brown',
      time: '14:00',
      type: 'Surgery',
      status: 'Confirmed',
      priority: 'Normal',
      date: '2024-01-15'
    },
    {
      id: 'APT004',
      patientName: 'David Wilson',
      time: '09:00',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal',
      date: '2024-01-16'
    },
    {
      id: 'APT005',
      patientName: 'Sarah Davis',
      time: '11:00',
      type: 'Surveillance',
      status: 'Scheduled',
      priority: 'Normal',
      date: '2024-01-16'
    },
    {
      id: 'APT006',
      patientName: 'Michael Thompson',
      time: '14:30',
      type: 'Follow-up',
      status: 'Confirmed',
      priority: 'Normal',
      date: '2024-01-17'
    }
  ];

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

  const getTypeColor = (type) => {
    switch (type) {
      case 'Follow-up': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'OPD': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Surgery': return 'bg-red-100 text-red-800 border-red-200';
      case 'Surveillance': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appointments
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/urology-nurse/book-appointment')}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
        <p className="text-gray-600 mt-1">View appointments in calendar format</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {formatDate(currentDate)}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-24"></div>;
                }

                const appointments = getAppointmentsForDate(day);
                const isCurrentDay = isToday(day);
                const isSelectedDay = isSelected(day);

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isCurrentDay ? 'bg-blue-50 border-blue-300' : ''
                    } ${isSelectedDay ? 'bg-green-50 border-green-300' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentDay ? 'text-blue-600' : 
                      isSelectedDay ? 'text-green-600' : 
                      'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {appointments.slice(0, 2).map(appointment => (
                        <div
                          key={appointment.id}
                          className={`text-xs px-1 py-0.5 rounded border ${getTypeColor(appointment.type)} truncate`}
                        >
                          {appointment.time} {appointment.patientName.split(' ')[0]}
                        </div>
                      ))}
                      {appointments.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{appointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Appointments */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate ? selectedDate.toLocaleDateString('en-AU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a date'}
            </h3>

            {selectedDateAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No appointments scheduled</p>
                <button
                  onClick={() => navigate('/urology-nurse/book-appointment')}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateAppointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/urology-nurse/appointment-details/${appointment.id}`)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/urology-nurse/edit-appointment/${appointment.id}`)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

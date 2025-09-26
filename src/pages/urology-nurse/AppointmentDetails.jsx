import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  ArrowLeft,
  Edit,
  Bell,
  CheckCircle,
  FileText,
  Download,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
  X
} from 'lucide-react';

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { getBackPath } = useNavigation();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [rescheduleResult, setRescheduleResult] = useState({ type: '', message: '' });
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    duration: '',
    room: '',
    doctor: '',
    notes: '',
    status: '',
    priority: ''
  });

  // Mock appointment data - in real app, this would be fetched based on appointmentId
  const appointment = {
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
    room: 'Room 101',
    // Additional patient details
    dateOfBirth: '1959-03-15',
    gender: 'Male',
    medicareNumber: '1234567890',
    emergencyContact: 'Jane Smith (0412 345 679)',
    allergies: 'Penicillin',
    currentMedications: 'Metformin 500mg daily',
    medicalHistory: 'Type 2 Diabetes, Hypertension',
    lastPSA: '4.2 ng/mL',
    lastPSADate: '2024-01-01',
    nextAppointment: '2024-04-15',
    referralSource: 'Dr. Michael Brown - GP',
    referralDate: '2024-01-10'
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

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleRescheduleClick = () => {
    setRescheduleData({
      newDate: appointment.date,
      newTime: appointment.time,
      reason: ''
    });
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = () => {
    // In a real app, this would make an API call to reschedule the appointment
    console.log('Rescheduling appointment:', {
      appointmentId: appointment.id,
      newDate: rescheduleData.newDate,
      newTime: rescheduleData.newTime,
      reason: rescheduleData.reason
    });
    
    // Simulate API call - in real app, handle success/error responses
    try {
      // Simulate success (90% chance) or error (10% chance)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setRescheduleResult({
          type: 'success',
          message: 'Appointment rescheduled successfully! The patient will be notified of the new appointment time.'
        });
      } else {
        setRescheduleResult({
          type: 'error',
          message: 'Failed to reschedule appointment. Please try again or contact support if the issue persists.'
        });
      }
      
      setShowRescheduleModal(false);
      setShowResultModal(true);
    } catch (error) {
      setRescheduleResult({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
      setShowRescheduleModal(false);
      setShowResultModal(true);
    }
  };

  const handleRescheduleCancel = () => {
    setShowRescheduleModal(false);
    setRescheduleData({
      newDate: '',
      newTime: '',
      reason: ''
    });
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    setRescheduleResult({ type: '', message: '' });
  };

  const handleBackClick = () => {
    const backPath = getBackPath();
    navigate(backPath);
  };

  const handleEditClick = () => {
    setEditData({
      title: appointment.title,
      description: appointment.description,
      duration: appointment.duration,
      room: appointment.room,
      doctor: appointment.doctor,
      notes: appointment.notes,
      status: appointment.status,
      priority: appointment.priority
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    // In a real app, this would make an API call to update the appointment
    console.log('Updating appointment:', {
      appointmentId: appointment.id,
      ...editData
    });
    
    // Simulate API call
    try {
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setRescheduleResult({
          type: 'success',
          message: 'Appointment updated successfully! All changes have been saved.'
        });
      } else {
        setRescheduleResult({
          type: 'error',
          message: 'Failed to update appointment. Please try again or contact support if the issue persists.'
        });
      }
      
      setShowEditModal(false);
      setShowResultModal(true);
    } catch (error) {
      setRescheduleResult({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
      setShowEditModal(false);
      setShowResultModal(true);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditData({
      title: '',
      description: '',
      duration: '',
      room: '',
      doctor: '',
      notes: '',
      status: '',
      priority: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-6">
          <button
                onClick={handleBackClick}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {getBackPath().includes('/appointments') ? 'Appointments' : 'Dashboard'}
          </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Appointment Details</h1>
                <p className="text-sm text-gray-500 mt-1 font-medium">ID: {appointment.id}</p>
              </div>
        </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleEditClick}
                className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button 
                onClick={handleRescheduleClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-800 to-black hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* Patient Header */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{appointment.patientName}</h2>
                    <p className="text-sm text-gray-500 mb-3">UPI: {appointment.upi}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-1" />
                        <span>{appointment.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                    {appointment.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Appointment Information</h3>
            </div>
            <div className="px-6 py-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.duration} minutes</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Room</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.room}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Doctor</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.doctor}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{appointment.description}</dd>
              </div>
              {appointment.notes && (
                <div className="mt-6">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.notes}</dd>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            </div>
            <div className="px-6 py-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.email}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.address}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.emergencyContact}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Patient Demographics</h3>
            </div>
            <div className="px-6 py-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Age</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.age} years</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(appointment.dateOfBirth)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.gender}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
            </div>
            <div className="px-6 py-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Medicare Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.medicareNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.allergies}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Medications</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.currentMedications}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Medical History</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.medicalHistory}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Urology Information */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Urology Information</h3>
            </div>
            <div className="px-6 py-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last PSA Level</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.lastPSA} ng/mL</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last PSA Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(appointment.lastPSADate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Next Appointment</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(appointment.nextAppointment)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Referral Source</dt>
                  <dd className="mt-1 text-sm text-gray-900">{appointment.referralSource}</dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
                <button
                  onClick={handleRescheduleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient
                  </label>
                  <p className="text-sm text-gray-900">{appointment.patientName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Appointment
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(appointment.date)} at {appointment.time}
                  </p>
                </div>

                <div>
                  <label htmlFor="newDate" className="block text-sm font-medium text-gray-700 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    id="newDate"
                    value={rescheduleData.newDate}
                    onChange={(e) => setRescheduleData({...rescheduleData, newDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label htmlFor="newTime" className="block text-sm font-medium text-gray-700 mb-2">
                    New Time
                  </label>
                  <select
                    id="newTime"
                    value={rescheduleData.newTime}
                    onChange={(e) => setRescheduleData({...rescheduleData, newTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="9:30 AM">9:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rescheduling
                  </label>
                  <textarea
                    id="reason"
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                    rows={3}
                    placeholder="Enter reason for rescheduling..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={handleRescheduleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  disabled={!rescheduleData.newDate || !rescheduleData.newTime}
                  className="px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
                <button
                  onClick={handleEditCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <div className="space-y-6">
                {/* Patient Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient
                  </label>
                  <p className="text-sm text-gray-900">{appointment.patientName} (UPI: {appointment.upi})</p>
                </div>

                {/* Appointment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      id="editTitle"
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="editDuration" className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      id="editDuration"
                      value={editData.duration}
                      onChange={(e) => setEditData({...editData, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="45 minutes">45 minutes</option>
                      <option value="60 minutes">60 minutes</option>
                      <option value="90 minutes">90 minutes</option>
                      <option value="120 minutes">120 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="editRoom" className="block text-sm font-medium text-gray-700 mb-2">
                      Room
                    </label>
                    <input
                      type="text"
                      id="editRoom"
                      value={editData.room}
                      onChange={(e) => setEditData({...editData, room: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="editDoctor" className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor
                    </label>
                    <select
                      id="editDoctor"
                      value={editData.doctor}
                      onChange={(e) => setEditData({...editData, doctor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                      <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                      <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                      <option value="Dr. David Thompson">Dr. David Thompson</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="editStatus"
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="editPriority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="editPriority"
                      value={editData.priority}
                      onChange={(e) => setEditData({...editData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="editDescription"
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="editNotes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="editNotes"
                    value={editData.notes}
                    onChange={(e) => setEditData({...editData, notes: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={handleEditCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {rescheduleResult.type === 'success' ? 'Success' : 'Error'}
                </h3>
                <button
                  onClick={handleResultModalClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  rescheduleResult.type === 'success' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {rescheduleResult.type === 'success' ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  )}
                </div>

                {/* Message */}
                <p className="text-gray-700 text-sm leading-relaxed">
                  {rescheduleResult.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center">
                <button
                  onClick={handleResultModalClose}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    rescheduleResult.type === 'success'
                      ? 'bg-gradient-to-r from-green-800 to-black text-white hover:opacity-90'
                      : 'bg-gradient-to-r from-red-800 to-black text-white hover:opacity-90'
                  }`}
                >
                  {rescheduleResult.type === 'success' ? 'Continue' : 'Try Again'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;
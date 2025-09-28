import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Save, AlertCircle } from 'lucide-react';
import { useAppointmentValidation } from '../../hooks/useFormValidation';

const RescheduleAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const appointments = useSelector(state => state.appointments.appointments);
  const [appointment, setAppointment] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    time: '',
    reason: '',
    notes: '',
    originalDate: '',
    originalTime: ''
  });

  const { errors, isValid, validateField, validateAll } = useAppointmentValidation(newSchedule);

  useEffect(() => {
    // Load appointment data from Redux or mock data
    const appointmentData = appointments.find(apt => apt.id === id) || {
      id: id,
      patientId: 'PAT001',
      patientName: 'John Smith',
      patientPhone: '+61 478 901 234',
      patientEmail: 'john.smith@email.com',
      date: '2024-02-15',
      time: '10:00',
      type: 'OPD Consultation',
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 101',
      status: 'scheduled',
      notes: 'Initial consultation for elevated PSA'
    };
    
    setAppointment(appointmentData);
    setNewSchedule(prev => ({
      ...prev,
      originalDate: appointmentData.date,
      originalTime: appointmentData.time,
      date: appointmentData.date,
      time: appointmentData.time
    }));
  }, [id, appointments]);

  const handleInputChange = (field, value) => {
    setNewSchedule(prev => ({ ...prev, [field]: value }));
    validateField(field);
  };

  const handleReschedule = () => {
    if (!isValid) {
      validateAll();
      return;
    }

    // Dispatch action to update appointment
    dispatch({
      type: 'appointments/updateAppointment',
      payload: {
        id: appointment.id,
        date: newSchedule.date,
        time: newSchedule.time,
        status: 'rescheduled',
        rescheduleReason: newSchedule.reason,
        rescheduleNotes: newSchedule.notes,
        originalDate: newSchedule.originalDate,
        originalTime: newSchedule.originalTime,
        rescheduledBy: 'current_user',
        rescheduledAt: new Date().toISOString()
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addAppointmentNotification',
      payload: {
        appointmentId: appointment.id,
        type: 'rescheduled',
        message: `Appointment for ${appointment.patientName} has been rescheduled from ${newSchedule.originalDate} ${newSchedule.originalTime} to ${newSchedule.date} ${newSchedule.time}. Reason: ${newSchedule.reason}`
      }
    });

    // Navigate back to appointments
    navigate('/urology-nurse/appointments');
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30'
  ];

  if (!appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/urology-nurse/appointments')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Appointments
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Reschedule Appointment</h1>
          <p className="text-gray-600 mt-2">Update the appointment details for the patient</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Patient Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                  <p className="text-gray-900 font-medium">{appointment.patientName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                  <p className="text-gray-900">{appointment.patientId}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {appointment.patientPhone}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {appointment.patientEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Appointment Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Current Appointment
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <p className="text-gray-900">{appointment.time}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{appointment.type}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doctor</label>
                  <p className="text-gray-900">{appointment.doctor}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Room</label>
                  <p className="text-gray-900">{appointment.room}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reschedule Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                New Appointment Details
              </h2>

              <div className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date *
                  </label>
                  <input
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    onBlur={() => validateField('date')}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Time *
                  </label>
                  <select
                    value={newSchedule.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    onBlur={() => validateField('time')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                  )}
                </div>

                {/* Reason for Rescheduling */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rescheduling *
                  </label>
                  <select
                    value={newSchedule.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    onBlur={() => validateField('reason')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.reason ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select reason</option>
                    <option value="patient_request">Patient Request</option>
                    <option value="doctor_unavailable">Doctor Unavailable</option>
                    <option value="emergency">Emergency</option>
                    <option value="room_unavailable">Room Unavailable</option>
                    <option value="equipment_issue">Equipment Issue</option>
                    <option value="weather">Weather</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={newSchedule.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Enter any additional notes about the rescheduling..."
                  />
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Rescheduling this appointment will notify the patient via SMS and email. 
                        Please ensure the new time is suitable for the patient.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate('/urology-nurse/appointments')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={!isValid}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Reschedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;
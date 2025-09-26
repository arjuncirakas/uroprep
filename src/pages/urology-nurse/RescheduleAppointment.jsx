import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const RescheduleAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBackPath } = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [reason, setReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock appointment data
  const mockAppointment = {
    id: id,
    patientName: 'John Smith',
    upi: 'URP2024001',
    currentDate: '2024-01-15',
    currentTime: '9:00 AM',
    currentLocation: 'Urology Clinic - Room 1',
    type: 'PSA Follow-up',
    status: 'Scheduled'
  };

  // Mock available time slots
  const availableTimeSlots = [
    { time: '8:00 AM', available: true },
    { time: '8:30 AM', available: true },
    { time: '9:00 AM', available: false },
    { time: '9:30 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '1:00 PM', available: true },
    { time: '1:30 PM', available: true },
    { time: '2:00 PM', available: false },
    { time: '2:30 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '3:30 PM', available: true },
    { time: '4:00 PM', available: true }
  ];

  // Mock available locations
  const availableLocations = [
    'Urology Clinic - Room 1',
    'Urology Clinic - Room 2',
    'Urology Clinic - Room 3',
    'Day Surgery Unit',
    'Consultation Room A',
    'Consultation Room B'
  ];

  // Mock available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends for this example
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('en-AU', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          available: Math.random() > 0.3 // Random availability for demo
        });
      }
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const handleReschedule = () => {
    if (selectedDate && selectedTime && selectedLocation && reason) {
      setShowConfirmation(true);
    }
  };

  const confirmReschedule = () => {
    // In real app, this would make an API call
    console.log('Rescheduling appointment:', {
      appointmentId: id,
      newDate: selectedDate,
      newTime: selectedTime,
      newLocation: selectedLocation,
      reason: reason
    });
    
    // Navigate back to previous page
    navigate(getBackPath());
  };

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
            Back
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      {/* Appointment Details Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Reschedule Appointment</h1>
          <p className="text-sm text-gray-600 mt-1">Update the appointment details for this patient</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Appointment Details */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                Current Appointment
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-600">Patient</p>
                    <p className="text-gray-900">{mockAppointment.patientName}</p>
                    <p className="text-gray-500">UPI: {mockAppointment.upi}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-600">Date & Time</p>
                    <p className="text-gray-900">{formatDate(mockAppointment.currentDate)} at {mockAppointment.currentTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-600">Location</p>
                    <p className="text-gray-900">{mockAppointment.currentLocation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-600">Type</p>
                    <p className="text-gray-900">{mockAppointment.type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* New Appointment Details */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                New Appointment
              </h3>
              <div className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Choose a date...</option>
                    {availableDates.map((date) => (
                      <option key={date.date} value={date.date} disabled={!date.available}>
                        {date.display} {!date.available ? '(Unavailable)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-2 text-sm rounded-lg border transition-colors ${
                            selectedTime === slot.time
                              ? 'bg-green-100 border-green-500 text-green-800'
                              : slot.available
                              ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Selection */}
                {selectedTime && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Choose a location...</option>
                      {availableLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Reason for Rescheduling */}
                {selectedLocation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Rescheduling
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Please provide a reason for rescheduling this appointment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(getBackPath())}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedTime || !selectedLocation || !reason}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Reschedule Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Reschedule</h3>
                <p className="text-sm text-gray-600">Please review the changes before confirming</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Patient:</span>
                <span className="text-gray-900">{mockAppointment.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">New Date:</span>
                <span className="text-gray-900">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">New Time:</span>
                <span className="text-gray-900">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">New Location:</span>
                <span className="text-gray-900">{selectedLocation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Reason:</span>
                <span className="text-gray-900">{reason}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescheduleAppointment;

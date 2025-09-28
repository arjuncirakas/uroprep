import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Heart,
  Activity,
  TrendingUp,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBackPath } = useNavigation();
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    phone: '',
    email: '',
    appointmentType: '',
    priority: 'medium',
    date: '',
    time: '',
    duration: 30,
    location: 'clinic',
    notes: '',
    referringDoctor: '',
    reason: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock appointment data for editing
  const mockAppointment = id ? {
    id: id,
    patientName: 'John Smith',
    patientId: 'PAT001',
    phone: '0412 345 678',
    email: 'john.smith@email.com',
    appointmentType: 'follow_up',
    priority: 'medium',
    date: '2024-01-20',
    time: '10:00',
    duration: 30,
    location: 'clinic',
    notes: 'Routine follow-up visit',
    referringDoctor: 'Dr. Sarah Johnson',
    reason: 'PSA monitoring'
  } : null;

  const appointmentTypes = [
    { value: 'first_consultation', label: 'First Consultation', icon: User, duration: 60, description: 'Initial patient assessment' },
    { value: 'follow_up', label: 'Follow-up', icon: Stethoscope, duration: 30, description: 'Routine follow-up visit' },
    { value: 'pre_op_assessment', label: 'Pre-op Assessment', icon: Heart, duration: 45, description: 'Pre-surgical evaluation' },
    { value: 'psa_review', label: 'PSA Review', icon: Activity, duration: 30, description: 'PSA monitoring appointment' },
    { value: 'surveillance', label: 'Surveillance', icon: TrendingUp, duration: 30, description: 'Active surveillance monitoring' },
    { value: 'consultation', label: 'Consultation', icon: User, duration: 45, description: 'General consultation' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const locations = [
    { value: 'clinic', label: 'Main Clinic' },
    { value: 'hospital', label: 'Hospital OPD' },
    { value: 'telehealth', label: 'Telehealth' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAppointmentTypeChange = (type) => {
    const selectedType = appointmentTypes.find(t => t.value === type);
    setFormData(prev => ({
      ...prev,
      appointmentType: type,
      duration: selectedType ? selectedType.duration : 30
    }));
  };

  const handleSubmit = () => {
    if (!formData.patientName || !formData.appointmentType || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    // Here you would typically save to backend
    console.log('Booking appointment:', formData);
    
    // Navigate back to appointments page
    navigate('/urology-nurse/appointments');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
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
            Back to Appointments
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

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Appointment' : 'Book New Appointment'}
        </h1>
        <p className="text-gray-600 mt-1">
          {id ? 'Modify existing appointment details' : 'Schedule a new patient appointment'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {id ? 'Current Appointment' : 'Patient Information'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {id ? 'Review current appointment details' : 'Enter patient details for new appointment'}
              </p>
            </div>
            
            {id && mockAppointment ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {mockAppointment.patientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{mockAppointment.patientName}</h4>
                    <p className="text-sm text-gray-500">ID: {mockAppointment.patientId}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{mockAppointment.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{mockAppointment.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">Referred by: {mockAppointment.referringDoctor}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Current Appointment</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(mockAppointment.date).toLocaleDateString('en-AU')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Time:</span>
                      <span className="text-gray-900">{mockAppointment.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Type:</span>
                      <span className="text-gray-900">{appointmentTypes.find(t => t.value === mockAppointment.appointmentType)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Location:</span>
                      <span className="text-gray-900">{locations.find(l => l.value === mockAppointment.location)?.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    placeholder="Enter patient name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={formData.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                    placeholder="Enter patient ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referring Doctor
                  </label>
                  <input
                    type="text"
                    value={formData.referringDoctor}
                    onChange={(e) => handleInputChange('referringDoctor', e.target.value)}
                    placeholder="Enter referring doctor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Appointment Type */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {id ? 'New Appointment Details' : 'Appointment Type'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Select the type of appointment to schedule</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointmentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.appointmentType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleAppointmentTypeChange(type.value)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-6 w-6 mt-1 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                        <div>
                          <h4 className="font-semibold text-gray-900">{type.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          <p className="text-sm text-gray-500 mt-1">{type.duration} minutes</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">Scheduling</h3>
                <p className="text-sm text-gray-600 mt-1">Select date, time, and location for the appointment</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    min="15"
                    max="120"
                    step="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {locations.map((location) => (
                      <option key={location.value} value={location.value}>{location.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">Additional Information</h3>
                <p className="text-sm text-gray-600 mt-1">Additional notes and appointment details</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Appointment
                  </label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="Brief reason for appointment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    placeholder="Additional notes or special requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(getBackPath())}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save className="h-4 w-4 mr-2" />
                {id ? 'Update Appointment' : 'Book Appointment'}
              </button>
            </div>
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
                <h3 className="text-lg font-semibold text-gray-900">
                  {id ? 'Confirm Update' : 'Confirm Booking'}
                </h3>
                <p className="text-sm text-gray-600">
                  {id ? 'Please review the updated appointment details' : 'Please review the appointment details'}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Patient:</span>
                <span className="text-gray-900">{formData.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Type:</span>
                <span className="text-gray-900">
                  {appointmentTypes.find(t => t.value === formData.appointmentType)?.label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-900">{formatDate(formData.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Time:</span>
                <span className="text-gray-900">{formData.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Duration:</span>
                <span className="text-gray-900">{formData.duration} minutes</span>
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
                onClick={confirmBooking}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {id ? 'Confirm Update' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
